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
    perform net.http_post(url := 'https://kjlotlhqrgekzohshmbn.supabase.co/functions/v1/panier-avis', headers := '{"Content-Type":"application/json"}'::jsonb, body := jsonb_build_object('id', r.id));
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
    perform net.http_post(url := 'https://kjlotlhqrgekzohshmbn.supabase.co/functions/v1/panier-avis', headers := '{"Content-Type":"application/json"}'::jsonb, body := jsonb_build_object('id', r.id));
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
