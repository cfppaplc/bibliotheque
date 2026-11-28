-- Magasin de raccords (25 nov.) : l'élève envoie son panier (code à 3 chiffres + groupe, jamais de nom),
-- l'enseignant l'approuve dans Métier+ (avis Web de Métier+ sur son cellulaire, envoyé par la fonction Supabase « panier-avis »), le magasinier le voit et le remet.
-- À coller une fois dans Supabase → SQL Editor → Run.
create extension if not exists pg_net;
create extension if not exists pgcrypto with schema extensions;

create table if not exists public.panier_prof (
  ens      text primary key,
  jeton_h  text not null,            -- empreinte du jeton d'approbation (gardé sur les appareils de l'enseignant)
  sujet    text,                     -- (inutilisé)
  abonnements jsonb not null default '[]',   -- appareils de l'enseignant qui reçoivent les avis (Web Push)
  t        timestamptz not null default now()
);
create table if not exists public.panier (
  id       uuid primary key default gen_random_uuid(),
  t        timestamptz not null default now(),
  ens      text not null,
  groupe   text not null,
  code     text not null,
  items    jsonb not null,
  note     text,
  etat     text not null default 'attente',   -- attente | approuve | refuse | remis
  t_app    timestamptz,
  t_remis  timestamptz,
  motif    text,
  avise    boolean not null default false
);
create table if not exists public.panier_vapid (id int primary key default 1 check (id = 1), cles jsonb not null);   -- clés des avis, lues seulement par la fonction
alter table public.panier_vapid enable row level security;
revoke all on public.panier_vapid from anon, authenticated;
alter table public.panier_prof add column if not exists abonnements jsonb not null default '[]';
alter table public.panier add column if not exists avise boolean not null default false;
create index if not exists panier_ens_t on public.panier (ens, t);
alter table public.panier_prof enable row level security;
alter table public.panier enable row level security;
revoke all on public.panier_prof from anon, authenticated;
revoke all on public.panier from anon, authenticated;

create or replace function public.panier_h(p text) returns text language sql immutable set search_path = public, extensions as $$
  select encode(extensions.digest(coalesce(p, ''), 'sha256'), 'hex');
$$;

-- enseignant : premier réglage = son jeton est retenu; ensuite il faut le même jeton pour changer le sujet
create or replace function public.panier_prof_regler(p_ens text, p_jeton text, p_sujet text)
returns boolean language plpgsql security definer set search_path = public, extensions as $$
declare h text := public.panier_h(p_jeton);
begin
  if p_ens !~ '^[a-z0-9._-]{3,60}$' or length(p_jeton) < 24 or (p_sujet is not null and p_sujet !~ '^[A-Za-z0-9_-]{16,64}$') then return false; end if;
  insert into public.panier_prof (ens, jeton_h, sujet) values (p_ens, h, p_sujet) on conflict (ens) do nothing;
  update public.panier_prof set sujet = p_sujet, t = now() where ens = p_ens and jeton_h = h;
  return found;
end; $$;

create or replace function public.panier_prof_ok(p_ens text, p_jeton text) returns boolean language sql stable security definer set search_path = public, extensions as $$
  select exists (select 1 from public.panier_prof where ens = p_ens and jeton_h = public.panier_h(p_jeton));
$$;

-- élève : envoie son panier; la base avertit l'enseignant (ntfy) sans jamais montrer son sujet
create or replace function public.panier_envoyer(p_ens text, p_groupe text, p_code text, p_items jsonb, p_note text default null)
returns jsonb language plpgsql security definer set search_path = public, extensions as $$
declare r public.panier; n int := jsonb_array_length(coalesce(p_items, '[]'::jsonb));
begin
  if p_ens !~ '^[a-z0-9._-]{3,60}$' or p_code !~ '^[0-9]{3}$' or length(coalesce(p_groupe, '')) not between 1 and 60 or n < 1 or n > 80 or length(coalesce(p_note, '')) > 300 then
    return jsonb_build_object('ok', false, 'err', 'panier refusé'); end if;
  if (select count(*) from public.panier where ens = p_ens and code = p_code and etat = 'attente') >= 3 then
    return jsonb_build_object('ok', false, 'err', 'trop de paniers en attente'); end if;
  if (select count(*) from public.panier where t > now() - interval '1 hour') >= 300 then
    return jsonb_build_object('ok', false, 'err', 'magasin trop occupé'); end if;
  insert into public.panier (ens, groupe, code, items, note) values (p_ens, p_groupe, p_code, p_items, nullif(trim(p_note), '')) returning * into r;
  delete from public.panier where t < now() - interval '60 days';
  if exists (select 1 from public.panier_prof where ens = p_ens and jsonb_array_length(abonnements) > 0) then   -- avis Web Push par la fonction « panier-avis »
    perform net.http_post(url := 'https://nhxhfiaznuifcbobjuuv.supabase.co/functions/v1/panier-avis', headers := '{"Content-Type":"application/json"}'::jsonb, body := jsonb_build_object('id', r.id));
  end if;
  return jsonb_build_object('ok', true, 'id', r.id);
end; $$;

-- enseignant : cet appareil reçoit les avis (au plus 6 appareils; le même appareil n'est pas ajouté deux fois)
create or replace function public.panier_prof_abonner(p_ens text, p_jeton text, p_abonnement jsonb, p_oui boolean default true)
returns boolean language plpgsql security definer set search_path = public, extensions as $$
declare a jsonb;
begin
  if not public.panier_prof_ok(p_ens, p_jeton) or coalesce(p_abonnement->>'endpoint', '') !~ '^https://' then return false; end if;
  select coalesce(jsonb_agg(x), '[]'::jsonb) into a from (select x from public.panier_prof, jsonb_array_elements(abonnements) x where ens = p_ens and x->>'endpoint' <> p_abonnement->>'endpoint') y;
  if p_oui then a := (case when jsonb_array_length(a) >= 6 then a - 0 else a end) || jsonb_build_array(p_abonnement); end if;
  update public.panier_prof set abonnements = a where ens = p_ens; return true;
end; $$;

-- élève : où en est mon panier
create or replace function public.panier_etat(p_id uuid)
returns jsonb language sql stable security definer set search_path = public as $$
  select jsonb_build_object('etat', etat, 'motif', motif, 't_app', t_app, 't_remis', t_remis) from public.panier where id = p_id;
$$;

-- enseignant : ses paniers (7 jours) et la décision
create or replace function public.panier_prof_lire(p_ens text, p_jeton text)
returns setof public.panier language sql stable security definer set search_path = public, extensions as $$
  select p.* from public.panier p where p.ens = p_ens and public.panier_prof_ok(p_ens, p_jeton) and p.t > now() - interval '7 days' order by p.t desc limit 200;
$$;
create or replace function public.panier_decider(p_ens text, p_jeton text, p_id uuid, p_ok boolean, p_motif text default null)
returns boolean language plpgsql security definer set search_path = public, extensions as $$
begin
  if not public.panier_prof_ok(p_ens, p_jeton) then return false; end if;
  update public.panier set etat = case when p_ok then 'approuve' else 'refuse' end, t_app = now(), motif = left(nullif(trim(p_motif), ''), 200)
    where id = p_id and ens = p_ens and etat = 'attente';
  return found;
end; $$;

-- magasinier : paniers approuvés (à préparer) et remis aujourd'hui; aucun nom, seulement code et groupe
create or replace function public.panier_magasin()
returns table(id uuid, t timestamptz, ens text, groupe text, code text, items jsonb, note text, etat text, t_app timestamptz, t_remis timestamptz)
language sql stable security definer set search_path = public as $$
  select p.id, p.t, p.ens, p.groupe, p.code, p.items, p.note, p.etat, p.t_app, p.t_remis from public.panier p
  where (p.etat = 'approuve' and p.t > now() - interval '7 days') or (p.etat = 'remis' and p.t_remis > now() - interval '16 hours')
  order by p.t_app asc limit 200;
$$;
create or replace function public.panier_remettre(p_id uuid, p_remis boolean default true)
returns boolean language plpgsql security definer set search_path = public as $$
begin
  update public.panier set etat = case when p_remis then 'remis' else 'approuve' end, t_remis = case when p_remis then now() else null end
    where id = p_id and etat in ('approuve', 'remis');
  return found;
end; $$;

revoke all on function public.panier_prof_abonner(text, text, jsonb, boolean), public.panier_prof_regler(text, text, text), public.panier_prof_ok(text, text), public.panier_envoyer(text, text, text, jsonb, text),
  public.panier_etat(uuid), public.panier_prof_lire(text, text), public.panier_decider(text, text, uuid, boolean, text), public.panier_magasin(), public.panier_remettre(uuid, boolean) from public;
grant execute on function public.panier_prof_abonner(text, text, jsonb, boolean), public.panier_prof_regler(text, text, text), public.panier_envoyer(text, text, text, jsonb, text), public.panier_etat(uuid),
  public.panier_prof_lire(text, text), public.panier_decider(text, text, uuid, boolean, text), public.panier_magasin(), public.panier_remettre(uuid, boolean) to anon, authenticated;

-- dossier de l'élève (Gestion d'atelier) : tous ses paniers des 60 derniers jours, pour son enseignant
create or replace function public.panier_eleve(p_ens text, p_jeton text, p_code text)
returns setof public.panier language sql stable security definer set search_path = public, extensions as $$
  select p.* from public.panier p where p.ens = p_ens and p.code = p_code and public.panier_prof_ok(p_ens, p_jeton) order by p.t desc limit 100;
$$;
revoke all on function public.panier_eleve(text, text, text) from public;
grant execute on function public.panier_eleve(text, text, text) to anon, authenticated;

-- 25 nov. (Jeremy : « il devrait voir le nom de l'élève qui a commandé ») : prénom de l'élève (un seul mot, jamais de nom de famille)
alter table public.panier add column if not exists prenom text;
drop function if exists public.panier_envoyer(text, text, text, jsonb, text);
create or replace function public.panier_envoyer(p_ens text, p_groupe text, p_code text, p_items jsonb, p_note text default null, p_prenom text default null)
returns jsonb language plpgsql security definer set search_path = public, extensions as $$
declare r public.panier; n int := jsonb_array_length(coalesce(p_items, '[]'::jsonb)); pr text := left(split_part(trim(coalesce(p_prenom, '')), ' ', 1), 20);
begin
  if p_ens !~ '^[a-z0-9._-]{3,60}$' or p_code !~ '^[0-9]{3}$' or length(coalesce(p_groupe, '')) not between 1 and 60 or n < 1 or n > 80 or length(coalesce(p_note, '')) > 300 then
    return jsonb_build_object('ok', false, 'err', 'panier refusé'); end if;
  if (select count(*) from public.panier where ens = p_ens and code = p_code and etat = 'attente') >= 3 then
    return jsonb_build_object('ok', false, 'err', 'trop de paniers en attente'); end if;
  if (select count(*) from public.panier where t > now() - interval '1 hour') >= 300 then
    return jsonb_build_object('ok', false, 'err', 'magasin trop occupé'); end if;
  insert into public.panier (ens, groupe, code, items, note, prenom) values (p_ens, p_groupe, p_code, p_items, nullif(trim(p_note), ''), nullif(pr, '')) returning * into r;
  delete from public.panier where t < now() - interval '60 days';
  if exists (select 1 from public.panier_prof where ens = p_ens and jsonb_array_length(abonnements) > 0) then
    perform net.http_post(url := 'https://nhxhfiaznuifcbobjuuv.supabase.co/functions/v1/panier-avis', headers := '{"Content-Type":"application/json"}'::jsonb, body := jsonb_build_object('id', r.id));
  end if;
  return jsonb_build_object('ok', true, 'id', r.id);
end; $$;
drop function if exists public.panier_magasin();
create or replace function public.panier_magasin()
returns table(id uuid, t timestamptz, ens text, groupe text, code text, prenom text, items jsonb, note text, etat text, t_app timestamptz, t_remis timestamptz)
language sql stable security definer set search_path = public as $$
  select p.id, p.t, p.ens, p.groupe, p.code, p.prenom, p.items, p.note, p.etat, p.t_app, p.t_remis from public.panier p
  where (p.etat = 'approuve' and p.t > now() - interval '7 days') or (p.etat = 'remis' and p.t_remis > now() - interval '16 hours')
  order by p.t_app asc limit 200;
$$;
revoke all on function public.panier_envoyer(text, text, text, jsonb, text, text), public.panier_magasin() from public;
grant execute on function public.panier_envoyer(text, text, text, jsonb, text, text), public.panier_magasin() to anon, authenticated;

-- 25 nov. (Jeremy : « comment l'élève va savoir si c'est approuvé ? ») : avis à l'élève quand son enseignant décide
alter table public.panier add column if not exists abo jsonb;
alter table public.panier add column if not exists avise_eleve boolean not null default false;
create or replace function public.panier_abonner_eleve(p_id uuid, p_abonnement jsonb)
returns boolean language plpgsql security definer set search_path = public as $$
begin
  if coalesce(p_abonnement->>'endpoint', '') !~ '^https://' then return false; end if;
  update public.panier set abo = p_abonnement where id = p_id and etat = 'attente'; return found;
end; $$;
create or replace function public.panier_decider(p_ens text, p_jeton text, p_id uuid, p_ok boolean, p_motif text default null)
returns boolean language plpgsql security definer set search_path = public, extensions as $$
declare a jsonb;
begin
  if not public.panier_prof_ok(p_ens, p_jeton) then return false; end if;
  update public.panier set etat = case when p_ok then 'approuve' else 'refuse' end, t_app = now(), motif = left(nullif(trim(p_motif), ''), 200)
    where id = p_id and ens = p_ens and etat = 'attente' returning abo into a;
  if not found then return false; end if;
  if a is not null then
    perform net.http_post(url := 'https://nhxhfiaznuifcbobjuuv.supabase.co/functions/v1/panier-avis', headers := '{"Content-Type":"application/json"}'::jsonb, body := jsonb_build_object('id', p_id, 'eleve', true));
  end if;
  return true;
end; $$;
revoke all on function public.panier_abonner_eleve(uuid, jsonb) from public;
grant execute on function public.panier_abonner_eleve(uuid, jsonb) to anon, authenticated;

-- 25 nov. (Jeremy : « le magasinier pourrait mettre un commentaire rapide sur les élèves qui ne respectent pas le règlement ») :
-- un clic sur une règle au comptoir avertit l'enseignant de l'élève (gardé 30 jours).
create table if not exists public.magasin_avis (
  id uuid primary key default gen_random_uuid(), t timestamptz not null default now(),
  panier uuid, ens text not null, groupe text, code text, prenom text, regle smallint not null check (regle between 1 and 6)
);
alter table public.magasin_avis enable row level security;
create or replace function public.panier_signaler(p_id uuid, p_regle int)
returns jsonb language plpgsql security definer set search_path = public, extensions as $$
declare p public.panier; a uuid;
begin
  if p_regle not between 1 and 6 then return jsonb_build_object('ok', false); end if;
  select * into p from public.panier where id = p_id and etat in ('approuve', 'remis') and t > now() - interval '7 days';
  if not found then return jsonb_build_object('ok', false, 'err', 'commande introuvable'); end if;
  if exists (select 1 from public.magasin_avis where panier = p_id and regle = p_regle) then return jsonb_build_object('ok', true, 'deja', true); end if;
  if (select count(*) from public.magasin_avis where t > now() - interval '1 hour') >= 100 then return jsonb_build_object('ok', false, 'err', 'trop d''avis'); end if;
  insert into public.magasin_avis (panier, ens, groupe, code, prenom, regle) values (p.id, p.ens, p.groupe, p.code, p.prenom, p_regle) returning id into a;
  delete from public.magasin_avis where t < now() - interval '30 days';
  if exists (select 1 from public.panier_prof where ens = p.ens and jsonb_array_length(abonnements) > 0) then
    perform net.http_post(url := 'https://nhxhfiaznuifcbobjuuv.supabase.co/functions/v1/panier-avis', headers := '{"Content-Type":"application/json"}'::jsonb, body := jsonb_build_object('avis', a));
  end if;
  return jsonb_build_object('ok', true);
end; $$;
create or replace function public.panier_signalements(p_ids uuid[])
returns table(panier uuid, regle smallint) language sql stable security definer set search_path = public as $$
  select a.panier, a.regle from public.magasin_avis a where a.panier = any(p_ids) and a.t > now() - interval '7 days';
$$;
create or replace function public.panier_prof_avis(p_ens text, p_jeton text)
returns table(id uuid, t timestamptz, groupe text, code text, prenom text, regle smallint)
language plpgsql stable security definer set search_path = public as $$
begin
  if not public.panier_prof_ok(p_ens, p_jeton) then return; end if;
  return query select a.id, a.t, a.groupe, a.code, a.prenom, a.regle from public.magasin_avis a where a.ens = p_ens and a.t > now() - interval '30 days' order by a.t desc limit 100;
end; $$;
revoke all on function public.panier_signaler(uuid, int), public.panier_signalements(uuid[]), public.panier_prof_avis(text, text) from public;
grant execute on function public.panier_signaler(uuid, int), public.panier_signalements(uuid[]), public.panier_prof_avis(text, text) to anon, authenticated;
-- 25 nov. (Jeremy : « la note du magasinier doit paraître dans le dossier de l'élève »)
create or replace function public.panier_eleve_avis(p_ens text, p_jeton text, p_code text)
returns table(t timestamptz, regle smallint) language sql stable security definer set search_path = public as $$
  select a.t, a.regle from public.magasin_avis a where a.ens = p_ens and a.code = p_code and public.panier_prof_ok(p_ens, p_jeton) order by a.t desc limit 50;
$$;
revoke all on function public.panier_eleve_avis(text, text, text) from public;
grant execute on function public.panier_eleve_avis(text, text, text) to anon, authenticated;

-- 25 nov. (Jeremy : « quand on crée les groupes, on pourrait dire qui enseigne ») : les enseignants du groupe (propriétaire + collègues du partage)
-- reçoivent tous l'avis du panier et peuvent tous l'approuver; même chose pour les avis du magasinier.
alter table public.panier add column if not exists profs text[] not null default '{}';
alter table public.magasin_avis add column if not exists profs text[] not null default '{}';
drop function if exists public.panier_envoyer(text, text, text, jsonb, text, text);
create or replace function public.panier_envoyer(p_ens text, p_groupe text, p_code text, p_items jsonb, p_note text default null, p_prenom text default null, p_profs text[] default null)
returns jsonb language plpgsql security definer set search_path = public, extensions as $$
declare r public.panier; n int := jsonb_array_length(coalesce(p_items, '[]'::jsonb)); pr text := left(split_part(trim(coalesce(p_prenom, '')), ' ', 1), 20);
  pf text[] := array(select distinct x from unnest(coalesce(p_profs, '{}')) x where x ~ '^[a-z0-9._-]{3,60}$' and x <> p_ens limit 8);
begin
  if p_ens !~ '^[a-z0-9._-]{3,60}$' or p_code !~ '^[0-9]{3}$' or length(coalesce(p_groupe, '')) not between 1 and 60 or n < 1 or n > 80 or length(coalesce(p_note, '')) > 300 then
    return jsonb_build_object('ok', false, 'err', 'panier refusé'); end if;
  if (select count(*) from public.panier where ens = p_ens and code = p_code and etat = 'attente') >= 3 then
    return jsonb_build_object('ok', false, 'err', 'trop de paniers en attente'); end if;
  if (select count(*) from public.panier where t > now() - interval '1 hour') >= 300 then
    return jsonb_build_object('ok', false, 'err', 'magasin trop occupé'); end if;
  insert into public.panier (ens, groupe, code, items, note, prenom, profs) values (p_ens, p_groupe, p_code, p_items, nullif(trim(p_note), ''), nullif(pr, ''), pf) returning * into r;
  delete from public.panier where t < now() - interval '60 days';
  if exists (select 1 from public.panier_prof where (ens = p_ens or ens = any(pf)) and jsonb_array_length(abonnements) > 0) then
    perform net.http_post(url := 'https://nhxhfiaznuifcbobjuuv.supabase.co/functions/v1/panier-avis', headers := '{"Content-Type":"application/json"}'::jsonb, body := jsonb_build_object('id', r.id));
  end if;
  return jsonb_build_object('ok', true, 'id', r.id);
end; $$;
create or replace function public.panier_prof_lire(p_ens text, p_jeton text)
returns setof public.panier language sql stable security definer set search_path = public, extensions as $$
  select p.* from public.panier p where (p.ens = p_ens or p_ens = any(p.profs)) and public.panier_prof_ok(p_ens, p_jeton) and p.t > now() - interval '7 days' order by p.t desc limit 200;
$$;
create or replace function public.panier_decider(p_ens text, p_jeton text, p_id uuid, p_ok boolean, p_motif text default null)
returns boolean language plpgsql security definer set search_path = public, extensions as $$
declare a jsonb;
begin
  if not public.panier_prof_ok(p_ens, p_jeton) then return false; end if;
  update public.panier set etat = case when p_ok then 'approuve' else 'refuse' end, t_app = now(), motif = left(nullif(trim(p_motif), ''), 200)
    where id = p_id and (ens = p_ens or p_ens = any(profs)) and etat = 'attente' returning abo into a;
  if not found then return false; end if;
  if a is not null then
    perform net.http_post(url := 'https://nhxhfiaznuifcbobjuuv.supabase.co/functions/v1/panier-avis', headers := '{"Content-Type":"application/json"}'::jsonb, body := jsonb_build_object('id', p_id, 'eleve', true));
  end if;
  return true;
end; $$;
create or replace function public.panier_eleve(p_ens text, p_jeton text, p_code text)
returns setof public.panier language sql stable security definer set search_path = public, extensions as $$
  select p.* from public.panier p where (p.ens = p_ens or p_ens = any(p.profs)) and p.code = p_code and public.panier_prof_ok(p_ens, p_jeton) order by p.t desc limit 100;
$$;
create or replace function public.panier_signaler(p_id uuid, p_regle int)
returns jsonb language plpgsql security definer set search_path = public, extensions as $$
declare p public.panier; a uuid;
begin
  if p_regle not between 1 and 6 then return jsonb_build_object('ok', false); end if;
  select * into p from public.panier where id = p_id and etat in ('approuve', 'remis') and t > now() - interval '7 days';
  if not found then return jsonb_build_object('ok', false, 'err', 'commande introuvable'); end if;
  if exists (select 1 from public.magasin_avis where panier = p_id and regle = p_regle) then return jsonb_build_object('ok', true, 'deja', true); end if;
  if (select count(*) from public.magasin_avis where t > now() - interval '1 hour') >= 100 then return jsonb_build_object('ok', false, 'err', 'trop d''avis'); end if;
  insert into public.magasin_avis (panier, ens, groupe, code, prenom, regle, profs) values (p.id, p.ens, p.groupe, p.code, p.prenom, p_regle, p.profs) returning id into a;
  delete from public.magasin_avis where t < now() - interval '30 days';
  if exists (select 1 from public.panier_prof where (ens = p.ens or ens = any(p.profs)) and jsonb_array_length(abonnements) > 0) then
    perform net.http_post(url := 'https://nhxhfiaznuifcbobjuuv.supabase.co/functions/v1/panier-avis', headers := '{"Content-Type":"application/json"}'::jsonb, body := jsonb_build_object('avis', a));
  end if;
  return jsonb_build_object('ok', true);
end; $$;
create or replace function public.panier_prof_avis(p_ens text, p_jeton text)
returns table(id uuid, t timestamptz, groupe text, code text, prenom text, regle smallint)
language plpgsql stable security definer set search_path = public as $$
begin
  if not public.panier_prof_ok(p_ens, p_jeton) then return; end if;
  return query select a.id, a.t, a.groupe, a.code, a.prenom, a.regle from public.magasin_avis a where (a.ens = p_ens or p_ens = any(a.profs)) and a.t > now() - interval '30 days' order by a.t desc limit 100;
end; $$;
create or replace function public.panier_eleve_avis(p_ens text, p_jeton text, p_code text)
returns table(t timestamptz, regle smallint) language sql stable security definer set search_path = public as $$
  select a.t, a.regle from public.magasin_avis a where (a.ens = p_ens or p_ens = any(a.profs)) and a.code = p_code and public.panier_prof_ok(p_ens, p_jeton) order by a.t desc limit 50;
$$;
revoke all on function public.panier_envoyer(text, text, text, jsonb, text, text, text[]) from public;
grant execute on function public.panier_envoyer(text, text, text, jsonb, text, text, text[]) to anon, authenticated;

-- 25 nov. (Jeremy : « des codes à 5 chiffres ») : le code de l'élève passe à 5 chiffres
create or replace function public.panier_envoyer(p_ens text, p_groupe text, p_code text, p_items jsonb, p_note text default null, p_prenom text default null, p_profs text[] default null)
returns jsonb language plpgsql security definer set search_path = public, extensions as $$
declare r public.panier; n int := jsonb_array_length(coalesce(p_items, '[]'::jsonb)); pr text := left(split_part(trim(coalesce(p_prenom, '')), ' ', 1), 20);
  pf text[] := array(select distinct x from unnest(coalesce(p_profs, '{}')) x where x ~ '^[a-z0-9._-]{3,60}$' and x <> p_ens limit 8);
begin
  if p_ens !~ '^[a-z0-9._-]{3,60}$' or p_code !~ '^[0-9]{5}$' or length(coalesce(p_groupe, '')) not between 1 and 60 or n < 1 or n > 80 or length(coalesce(p_note, '')) > 300 then
    return jsonb_build_object('ok', false, 'err', 'panier refusé'); end if;
  if (select count(*) from public.panier where ens = p_ens and code = p_code and etat = 'attente') >= 3 then
    return jsonb_build_object('ok', false, 'err', 'trop de paniers en attente'); end if;
  if (select count(*) from public.panier where t > now() - interval '1 hour') >= 300 then
    return jsonb_build_object('ok', false, 'err', 'magasin trop occupé'); end if;
  insert into public.panier (ens, groupe, code, items, note, prenom, profs) values (p_ens, p_groupe, p_code, p_items, nullif(trim(p_note), ''), nullif(pr, ''), pf) returning * into r;
  delete from public.panier where t < now() - interval '60 days';
  if exists (select 1 from public.panier_prof where (ens = p_ens or ens = any(pf)) and jsonb_array_length(abonnements) > 0) then
    perform net.http_post(url := 'https://nhxhfiaznuifcbobjuuv.supabase.co/functions/v1/panier-avis', headers := '{"Content-Type":"application/json"}'::jsonb, body := jsonb_build_object('id', r.id));
  end if;
  return jsonb_build_object('ok', true, 'id', r.id);
end; $$;

-- 25 nov. (Jeremy : « les commandes traitées restent la période et tombent en archive; statistiques des raccords sortis »)
-- Commandes gardées 1 an (archives par période). Raccords sortis : table anonyme (aucun code ni prénom), gardée pour les statistiques.
create table if not exists public.magasin_sorties (
  id bigserial primary key, panier uuid not null, jour date not null default current_date, ens text, groupe text, n text, nom text, r text, q int not null default 1
);
create index if not exists magasin_sorties_jour on public.magasin_sorties (jour);
alter table public.magasin_sorties enable row level security;
create or replace function public.panier_sorties_maj() returns trigger language plpgsql security definer set search_path = public as $$
begin
  if new.etat = 'remis' and old.etat is distinct from 'remis' then
    insert into public.magasin_sorties (panier, jour, ens, groupe, n, nom, r, q)
      select new.id, (coalesce(new.t_remis, now()) at time zone 'America/Toronto')::date, new.ens, new.groupe, i->>'n', i->>'nom', i->>'r', greatest(1, coalesce((i->>'q')::int, 1))
      from jsonb_array_elements(coalesce(new.items, '[]'::jsonb)) i;
  elsif old.etat = 'remis' and new.etat is distinct from 'remis' then
    delete from public.magasin_sorties where panier = new.id;   -- « Annuler » au comptoir
  end if;
  return new;
end; $$;
drop trigger if exists panier_sorties on public.panier;
create trigger panier_sorties after update of etat on public.panier for each row execute function public.panier_sorties_maj();
insert into public.magasin_sorties (panier, jour, ens, groupe, n, nom, r, q)
  select p.id, (coalesce(p.t_remis, p.t) at time zone 'America/Toronto')::date, p.ens, p.groupe, i->>'n', i->>'nom', i->>'r', greatest(1, coalesce((i->>'q')::int, 1))
  from public.panier p, jsonb_array_elements(coalesce(p.items, '[]'::jsonb)) i
  where p.etat = 'remis' and not exists (select 1 from public.magasin_sorties s where s.panier = p.id);

create or replace function public.panier_stats(p_depuis date, p_jusqua date default null, p_groupe text default null)
returns table(n text, nom text, q bigint, fois bigint) language sql stable security definer set search_path = public as $$
  select s.n, max(s.nom), sum(s.q)::bigint, count(distinct s.panier)::bigint from public.magasin_sorties s
  where s.jour >= p_depuis and s.jour <= coalesce(p_jusqua, current_date) and (p_groupe is null or s.groupe = p_groupe)
  group by s.n order by 3 desc, 2 limit 500;
$$;
create or replace function public.panier_stats_groupes()
returns table(groupe text, commandes bigint) language sql stable security definer set search_path = public as $$
  select s.groupe, count(distinct s.panier)::bigint from public.magasin_sorties s where s.jour > current_date - 400 group by 1 order by 1;
$$;
create or replace function public.panier_prof_archives(p_ens text, p_jeton text, p_depuis date, p_jusqua date default null)
returns setof public.panier language sql stable security definer set search_path = public, extensions as $$
  select p.* from public.panier p where (p.ens = p_ens or p_ens = any(p.profs)) and public.panier_prof_ok(p_ens, p_jeton)
    and p.etat <> 'attente' and (p.t at time zone 'America/Toronto')::date between p_depuis and coalesce(p_jusqua, current_date) order by p.t desc limit 500;
$$;
-- rétention : 1 an (au lieu de 60 jours)
create or replace function public.panier_envoyer(p_ens text, p_groupe text, p_code text, p_items jsonb, p_note text default null, p_prenom text default null, p_profs text[] default null)
returns jsonb language plpgsql security definer set search_path = public, extensions as $$
declare r public.panier; n int := jsonb_array_length(coalesce(p_items, '[]'::jsonb)); pr text := left(split_part(trim(coalesce(p_prenom, '')), ' ', 1), 20);
  pf text[] := array(select distinct x from unnest(coalesce(p_profs, '{}')) x where x ~ '^[a-z0-9._-]{3,60}$' and x <> p_ens limit 8);
begin
  if p_ens !~ '^[a-z0-9._-]{3,60}$' or p_code !~ '^[0-9]{5}$' or length(coalesce(p_groupe, '')) not between 1 and 60 or n < 1 or n > 80 or length(coalesce(p_note, '')) > 300 then
    return jsonb_build_object('ok', false, 'err', 'panier refusé'); end if;
  if (select count(*) from public.panier where ens = p_ens and code = p_code and etat = 'attente') >= 3 then
    return jsonb_build_object('ok', false, 'err', 'trop de paniers en attente'); end if;
  if (select count(*) from public.panier where t > now() - interval '1 hour') >= 300 then
    return jsonb_build_object('ok', false, 'err', 'magasin trop occupé'); end if;
  insert into public.panier (ens, groupe, code, items, note, prenom, profs) values (p_ens, p_groupe, p_code, p_items, nullif(trim(p_note), ''), nullif(pr, ''), pf) returning * into r;
  delete from public.panier where t < now() - interval '365 days';
  if exists (select 1 from public.panier_prof where (ens = p_ens or ens = any(pf)) and jsonb_array_length(abonnements) > 0) then
    perform net.http_post(url := 'https://nhxhfiaznuifcbobjuuv.supabase.co/functions/v1/panier-avis', headers := '{"Content-Type":"application/json"}'::jsonb, body := jsonb_build_object('id', r.id));
  end if;
  return jsonb_build_object('ok', true, 'id', r.id);
end; $$;
revoke all on function public.panier_stats(date, date, text), public.panier_stats_groupes(), public.panier_prof_archives(text, text, date, date) from public;
grant execute on function public.panier_stats(date, date, text), public.panier_stats_groupes(), public.panier_prof_archives(text, text, date, date) to anon, authenticated;

-- 25 nov. (Jeremy : « ils vont utiliser un iPad ») : l'iPad du comptoir reçoit un avis quand une commande est approuvée
create table if not exists public.magasin_abo (endpoint text primary key, abo jsonb not null, t timestamptz not null default now());
alter table public.magasin_abo enable row level security;
create or replace function public.magasin_abonner(p_abonnement jsonb, p_oui boolean default true)
returns boolean language plpgsql security definer set search_path = public as $$
declare e text := p_abonnement->>'endpoint';
begin
  if coalesce(e, '') !~ '^https://' or length(e) > 1000 then return false; end if;
  if not p_oui then delete from public.magasin_abo where endpoint = e; return true; end if;
  if (select count(*) from public.magasin_abo) >= 20 and not exists (select 1 from public.magasin_abo where endpoint = e) then return false; end if;
  insert into public.magasin_abo (endpoint, abo) values (e, p_abonnement) on conflict (endpoint) do update set abo = excluded.abo, t = now();
  return true;
end; $$;
create or replace function public.panier_decider(p_ens text, p_jeton text, p_id uuid, p_ok boolean, p_motif text default null)
returns boolean language plpgsql security definer set search_path = public, extensions as $$
declare a jsonb;
begin
  if not public.panier_prof_ok(p_ens, p_jeton) then return false; end if;
  update public.panier set etat = case when p_ok then 'approuve' else 'refuse' end, t_app = now(), motif = left(nullif(trim(p_motif), ''), 200)
    where id = p_id and (ens = p_ens or p_ens = any(profs)) and etat = 'attente' returning abo into a;
  if not found then return false; end if;
  if a is not null then
    perform net.http_post(url := 'https://nhxhfiaznuifcbobjuuv.supabase.co/functions/v1/panier-avis', headers := '{"Content-Type":"application/json"}'::jsonb, body := jsonb_build_object('id', p_id, 'eleve', true));
  end if;
  if p_ok and exists (select 1 from public.magasin_abo) then
    perform net.http_post(url := 'https://nhxhfiaznuifcbobjuuv.supabase.co/functions/v1/panier-avis', headers := '{"Content-Type":"application/json"}'::jsonb, body := jsonb_build_object('id', p_id, 'comptoir', true));
  end if;
  return true;
end; $$;
revoke all on function public.magasin_abonner(jsonb, boolean) from public;
grant execute on function public.magasin_abonner(jsonb, boolean) to anon, authenticated;

-- 25 nov. (Jeremy : « cliquer sur Vu : la note disparaît de notre page mais reste en archive dans le dossier de l'élève ») — avis gardés 1 an
alter table public.magasin_avis add column if not exists vu text[] not null default '{}';
create or replace function public.panier_avis_vu(p_ens text, p_jeton text, p_id uuid)
returns boolean language plpgsql security definer set search_path = public as $$
begin
  if not public.panier_prof_ok(p_ens, p_jeton) then return false; end if;
  update public.magasin_avis set vu = array_append(vu, p_ens) where id = p_id and (ens = p_ens or p_ens = any(profs)) and not (p_ens = any(vu));
  return true;
end; $$;
create or replace function public.panier_prof_avis(p_ens text, p_jeton text)
returns table(id uuid, t timestamptz, groupe text, code text, prenom text, regle smallint)
language plpgsql stable security definer set search_path = public as $$
begin
  if not public.panier_prof_ok(p_ens, p_jeton) then return; end if;
  return query select a.id, a.t, a.groupe, a.code, a.prenom, a.regle from public.magasin_avis a
    where (a.ens = p_ens or p_ens = any(a.profs)) and not (p_ens = any(a.vu)) and a.t > now() - interval '365 days' order by a.t desc limit 100;
end; $$;
create or replace function public.panier_signaler(p_id uuid, p_regle int)
returns jsonb language plpgsql security definer set search_path = public, extensions as $$
declare p public.panier; a uuid;
begin
  if p_regle not between 1 and 6 then return jsonb_build_object('ok', false); end if;
  select * into p from public.panier where id = p_id and etat in ('approuve', 'remis') and t > now() - interval '7 days';
  if not found then return jsonb_build_object('ok', false, 'err', 'commande introuvable'); end if;
  if exists (select 1 from public.magasin_avis where panier = p_id and regle = p_regle) then return jsonb_build_object('ok', true, 'deja', true); end if;
  if (select count(*) from public.magasin_avis where t > now() - interval '1 hour') >= 100 then return jsonb_build_object('ok', false, 'err', 'trop d''avis'); end if;
  insert into public.magasin_avis (panier, ens, groupe, code, prenom, regle, profs) values (p.id, p.ens, p.groupe, p.code, p.prenom, p_regle, p.profs) returning id into a;
  delete from public.magasin_avis where t < now() - interval '365 days';
  if exists (select 1 from public.panier_prof where (ens = p.ens or ens = any(p.profs)) and jsonb_array_length(abonnements) > 0) then
    perform net.http_post(url := 'https://nhxhfiaznuifcbobjuuv.supabase.co/functions/v1/panier-avis', headers := '{"Content-Type":"application/json"}'::jsonb, body := jsonb_build_object('avis', a));
  end if;
  return jsonb_build_object('ok', true);
end; $$;
revoke all on function public.panier_avis_vu(text, text, uuid) from public;
grant execute on function public.panier_avis_vu(text, text, uuid) to anon, authenticated;
-- suite : outils/magasin-modifier.sql (modifier / annuler par l'élève, 25 nov.)

-- 27 nov. (Jeremy : « sans sa carte, le magasinier doit voir le prénom », qui vient du dossier de l'élève) :
-- en approuvant, la page de l'enseignant envoie le prénom tiré de SON dossier; il remplace celui de la commande.
drop function if exists public.panier_decider(text, text, uuid, boolean, text);
create or replace function public.panier_decider(p_ens text, p_jeton text, p_id uuid, p_ok boolean, p_motif text default null, p_prenom text default null)
returns boolean language plpgsql security definer set search_path = public, extensions as $$
declare a jsonb; pr text := nullif(left(split_part(trim(coalesce(p_prenom, '')), ' ', 1), 20), '');
begin
  if not public.panier_prof_ok(p_ens, p_jeton) then return false; end if;
  update public.panier set etat = case when p_ok then 'approuve' else 'refuse' end, t_app = now(), motif = left(nullif(trim(p_motif), ''), 200), prenom = coalesce(pr, prenom)
    where id = p_id and (ens = p_ens or p_ens = any(profs)) and etat = 'attente' returning abo into a;
  if not found then return false; end if;
  if a is not null then
    perform net.http_post(url := 'https://nhxhfiaznuifcbobjuuv.supabase.co/functions/v1/panier-avis', headers := '{"Content-Type":"application/json"}'::jsonb, body := jsonb_build_object('id', p_id, 'eleve', true));
  end if;
  if p_ok and exists (select 1 from public.magasin_abo) then
    perform net.http_post(url := 'https://nhxhfiaznuifcbobjuuv.supabase.co/functions/v1/panier-avis', headers := '{"Content-Type":"application/json"}'::jsonb, body := jsonb_build_object('id', p_id, 'comptoir', true));
  end if;
  return true;
end; $$;
revoke all on function public.panier_decider(text, text, uuid, boolean, text, text) from public;
grant execute on function public.panier_decider(text, text, uuid, boolean, text, text) to anon, authenticated;

-- 27 nov. (vérification Loi 25, point 10) : paniers et avis du magasin gardés 120 jours (une session), plus 1 an.
-- Déclencheur indépendant des versions de panier_envoyer : le ménage se fait à chaque nouveau panier.
create or replace function public.magasin_menage() returns trigger language plpgsql security definer set search_path = public as $$
begin
  delete from public.panier where t < now() - interval '120 days';
  delete from public.magasin_avis where t < now() - interval '120 days';
  return null;
end $$;
drop trigger if exists panier_menage on public.panier;
create trigger panier_menage after insert on public.panier for each statement execute function public.magasin_menage();
delete from public.panier where t < now() - interval '120 days';
delete from public.magasin_avis where t < now() - interval '120 days';

-- 27 nov. (vérification Loi 25 : aucun prénom d'élève en clair sur le serveur).
-- L'élève n'envoie plus son prénom; en approuvant, l'enseignant envoie le prénom CHIFFRÉ pour le compte « comptoir.magasin » (enveloppe « E… »).
-- Tout prénom en clair est refusé (déclencheurs), et les prénoms déjà gardés sont effacés.
create or replace function public.sans_prenom_clair() returns trigger language plpgsql as $$
begin
  if new.prenom is not null and not (new.prenom ~ '^E[A-Za-z0-9+/=]+$' and length(new.prenom) between 61 and 401) then new.prenom := null; end if;
  return new;
end $$;
drop trigger if exists panier_sans_prenom on public.panier;
create trigger panier_sans_prenom before insert or update of prenom on public.panier for each row execute function public.sans_prenom_clair();
drop trigger if exists absence_sans_prenom on public.absence;
create trigger absence_sans_prenom before insert or update of prenom on public.absence for each row execute function public.sans_prenom_clair();
drop trigger if exists avis_sans_prenom on public.magasin_avis;
create trigger avis_sans_prenom before insert or update of prenom on public.magasin_avis for each row execute function public.sans_prenom_clair();
update public.panier set prenom = null where prenom is not null and not (prenom ~ '^E[A-Za-z0-9+/=]+$' and length(prenom) between 61 and 401);
update public.absence set prenom = null where prenom is not null;
update public.magasin_avis set prenom = null where prenom is not null and not (prenom ~ '^E[A-Za-z0-9+/=]+$' and length(prenom) between 61 and 401);
create or replace function public.panier_decider(p_ens text, p_jeton text, p_id uuid, p_ok boolean, p_motif text default null, p_prenom text default null)
returns boolean language plpgsql security definer set search_path = public, extensions as $$
declare a jsonb; pr text := case when p_prenom ~ '^E[A-Za-z0-9+/=]+$' and length(p_prenom) between 61 and 401 then p_prenom else null end;
begin
  if not public.panier_prof_ok(p_ens, p_jeton) then return false; end if;
  update public.panier set etat = case when p_ok then 'approuve' else 'refuse' end, t_app = now(), motif = left(nullif(trim(p_motif), ''), 200), prenom = pr
    where id = p_id and (ens = p_ens or p_ens = any(profs)) and etat = 'attente' returning abo into a;
  if not found then return false; end if;
  if a is not null then
    perform net.http_post(url := 'https://nhxhfiaznuifcbobjuuv.supabase.co/functions/v1/panier-avis', headers := '{"Content-Type":"application/json"}'::jsonb, body := jsonb_build_object('id', p_id, 'eleve', true));
  end if;
  if p_ok and exists (select 1 from public.magasin_abo) then
    perform net.http_post(url := 'https://nhxhfiaznuifcbobjuuv.supabase.co/functions/v1/panier-avis', headers := '{"Content-Type":"application/json"}'::jsonb, body := jsonb_build_object('id', p_id, 'comptoir', true));
  end if;
  return true;
end; $$;
