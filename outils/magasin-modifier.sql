-- 25 nov. (Jeremy : « il devrait pouvoir modifier sa commande jusqu'à l'approbation du prof ») : l'élève modifie ou annule son panier.
-- Preuve : l'identifiant du panier (gardé seulement sur l'appareil qui l'a envoyé) + son code.
-- Modifier et annuler : seulement « en attente » (Jeremy : plus rien après l'approbation). Maximum 2 paniers en attente par élève.
create or replace function public.panier_etat(p_id uuid)
returns jsonb language sql stable security definer set search_path = public as $$
  select jsonb_build_object('etat', etat, 'motif', motif, 't_app', t_app, 't_remis', t_remis, 'items', case when etat = 'attente' then items end, 'note', case when etat = 'attente' then note end)
  from public.panier where id = p_id;
$$;
create or replace function public.panier_modifier(p_id uuid, p_code text, p_items jsonb, p_note text default null)
returns jsonb language plpgsql security definer set search_path = public as $$
declare n int := jsonb_array_length(coalesce(p_items, '[]'::jsonb));
begin
  if n < 1 or n > 80 or length(coalesce(p_note, '')) > 300 then return jsonb_build_object('ok', false, 'err', 'panier refusé'); end if;
  update public.panier set items = p_items, note = nullif(trim(p_note), '') where id = p_id and code = p_code and etat = 'attente';
  if not found then return jsonb_build_object('ok', false, 'err', 'déjà traité par ton enseignant'); end if;
  return jsonb_build_object('ok', true);
end; $$;
create or replace function public.panier_annuler(p_id uuid, p_code text)
returns boolean language plpgsql security definer set search_path = public as $$
begin
  delete from public.panier where id = p_id and code = p_code and etat = 'attente';
  return found;
end; $$;
revoke all on function public.panier_modifier(uuid, text, jsonb, text), public.panier_annuler(uuid, text) from public;
grant execute on function public.panier_etat(uuid), public.panier_modifier(uuid, text, jsonb, text), public.panier_annuler(uuid, text) to anon, authenticated;

-- 2 paniers en attente au maximum (l'élève modifie au lieu d'en envoyer un autre)
create or replace function public.panier_envoyer(p_ens text, p_groupe text, p_code text, p_items jsonb, p_note text default null, p_prenom text default null, p_profs text[] default null)
returns jsonb language plpgsql security definer set search_path = public, extensions as $$
declare r public.panier; n int := jsonb_array_length(coalesce(p_items, '[]'::jsonb)); pr text := left(split_part(trim(coalesce(p_prenom, '')), ' ', 1), 20);
  pf text[] := array(select distinct x from unnest(coalesce(p_profs, '{}')) x where x ~ '^[a-z0-9._-]{3,60}$' and x <> p_ens limit 8);
begin
  if p_ens !~ '^[a-z0-9._-]{3,60}$' or p_code !~ '^[0-9]{5}$' or length(coalesce(p_groupe, '')) not between 1 and 60 or n < 1 or n > 80 or length(coalesce(p_note, '')) > 300 then
    return jsonb_build_object('ok', false, 'err', 'panier refusé'); end if;
  if (select count(*) from public.panier where ens = p_ens and code = p_code and etat = 'attente') >= 2 then
    return jsonb_build_object('ok', false, 'err', 'trop de paniers en attente'); end if;
  if (select count(*) from public.panier where t > now() - interval '1 hour') >= 300 then
    return jsonb_build_object('ok', false, 'err', 'magasin trop occupé'); end if;
  insert into public.panier (ens, groupe, code, items, note, prenom, profs) values (p_ens, p_groupe, p_code, p_items, nullif(trim(p_note), ''), nullif(pr, ''), pf) returning * into r;
  delete from public.panier where t < now() - interval '365 days';
  if exists (select 1 from public.panier_prof where (ens = p_ens or ens = any(pf)) and jsonb_array_length(abonnements) > 0) then
    perform net.http_post(url := 'https://kjlotlhqrgekzohshmbn.supabase.co/functions/v1/panier-avis', headers := '{"Content-Type":"application/json"}'::jsonb, body := jsonb_build_object('id', r.id));
  end if;
  return jsonb_build_object('ok', true, 'id', r.id);
end; $$;

-- 25 nov. (Jeremy : « de beaux graphiques pour l'achalandage ») : paniers par jour, heures et jours de pointe au comptoir (anonyme)
create or replace function public.panier_achalandage(p_depuis date, p_groupe text default null)
returns jsonb language sql stable security definer set search_path = public as $$
  with p as (select etat, (t at time zone 'America/Toronto') lt, (t_remis at time zone 'America/Toronto') lr from public.panier
             where t >= p_depuis and (p_groupe is null or groupe = p_groupe))
  select jsonb_build_object(
    'envoyes', (select count(*) from p), 'remis', (select count(*) from p where etat = 'remis'), 'refuses', (select count(*) from p where etat = 'refuse'),
    'jours', coalesce((select jsonb_agg(jsonb_build_object('j', j, 'n', n) order by j) from (select lt::date j, count(*) n from p group by 1) x), '[]'::jsonb),
    'heures', coalesce((select jsonb_agg(jsonb_build_object('h', h, 'n', n) order by h) from (select extract(hour from lr)::int h, count(*) n from p where lr is not null group by 1) x), '[]'::jsonb),
    'semaine', coalesce((select jsonb_agg(jsonb_build_object('d', d, 'n', n) order by d) from (select extract(isodow from lr)::int d, count(*) n from p where lr is not null group by 1) x), '[]'::jsonb));
$$;
grant execute on function public.panier_achalandage(date, text) to anon, authenticated;

-- 25 nov. (Jeremy : « le magasinier pourrait déclarer les pièces à commander; une feuille prête à soumissionner ») : liste d'achats du magasin
create table if not exists public.magasin_acommander (
  id bigserial primary key, t timestamptz not null default now(), n text, nom text not null, q int not null check (q between 1 and 9999),
  note text, fait boolean not null default false, t_fait timestamptz);
alter table public.magasin_acommander enable row level security;
create or replace function public.magasin_acommander_ajouter(p_n text, p_nom text, p_q int, p_note text default null)
returns boolean language plpgsql security definer set search_path = public as $$
begin
  if length(coalesce(trim(p_nom), '')) not between 2 and 120 or p_q not between 1 and 9999 or length(coalesce(p_note, '')) > 200 or length(coalesce(p_n, '')) > 40 then return false; end if;
  if (select count(*) from public.magasin_acommander where t > now() - interval '1 day') >= 300 then return false; end if;
  -- même pièce encore à commander : on additionne
  update public.magasin_acommander set q = least(9999, q + p_q), note = coalesce(nullif(trim(p_note), ''), note), t = now()
    where not fait and coalesce(n, '') = coalesce(nullif(trim(p_n), ''), '') and lower(nom) = lower(trim(p_nom));
  if not found then insert into public.magasin_acommander(n, nom, q, note) values (nullif(trim(p_n), ''), trim(p_nom), p_q, nullif(trim(p_note), '')); end if;
  delete from public.magasin_acommander where fait and t_fait < now() - interval '365 days';
  return true;
end $$;
create or replace function public.magasin_acommander_liste()
returns setof public.magasin_acommander language sql stable security definer set search_path = public as $$
  select * from public.magasin_acommander where not fait or t_fait > now() - interval '60 days' order by fait, t desc limit 500;
$$;
-- commandé (case cochée) ou retiré (p_retirer : erreur de saisie, seulement si pas encore commandé)
create or replace function public.magasin_acommander_maj(p_id bigint, p_fait boolean, p_retirer boolean default false)
returns boolean language plpgsql security definer set search_path = public as $$
begin
  if p_retirer then delete from public.magasin_acommander where id = p_id and not fait; return found; end if;
  update public.magasin_acommander set fait = p_fait, t_fait = case when p_fait then now() end where id = p_id; return found;
end $$;
revoke all on table public.magasin_acommander from anon, authenticated;
grant execute on function public.magasin_acommander_ajouter(text, text, int, text), public.magasin_acommander_liste(), public.magasin_acommander_maj(bigint, boolean, boolean) to anon, authenticated;

-- 26 nov. (Jeremy : « à la fin du projet, l'élève fait une facture au client; ça part de sa carte ») :
-- raccords remis à l'élève (son code), pour préremplir le matériel de sa facture. Aucun nom : seulement les pièces.
-- par commande remise (Jeremy : « ils vont pouvoir cocher les raccords qu'ils ont été chercher au magasin pour leur facture »)
create or replace function public.panier_materiel_eleve(p_code text, p_depuis date default null)
returns table(panier uuid, jour date, n text, nom text, q bigint) language sql stable security definer set search_path = public as $$
  select s.panier, max(s.jour), s.n, max(s.nom), sum(s.q)::bigint from public.magasin_sorties s join public.panier p on p.id = s.panier
  where p.code = p_code and p_code ~ '^[0-9]{5}$' and s.jour >= coalesce(p_depuis, current_date - 120) group by s.panier, s.n order by 2 desc, 4 limit 400;
$$;
grant execute on function public.panier_materiel_eleve(text, date) to anon, authenticated;

-- 26 nov. (Jeremy : « un p'tit comique qui trouve le comptoir… le magasinier doit avoir un compte ») :
-- le comptoir demande le NIP du magasinier (défini par un enseignant dans Administration → Magasin).
-- Le navigateur envoie sha256("metier+|magasin|" + NIP); la base garde seulement cette empreinte.
create table if not exists public.magasin_cle (id int primary key default 1 check (id = 1), empreinte text not null, maj timestamptz default now());
alter table public.magasin_cle enable row level security;
create or replace function public.magasin_cle_definir(p_ens text, p_jeton text, p_empreinte text)
returns boolean language plpgsql security definer set search_path = public as $$
begin
  if not public.panier_prof_ok(p_ens, p_jeton) or p_empreinte !~ '^[0-9a-f]{64}$' then return false; end if;
  insert into public.magasin_cle(id, empreinte) values (1, p_empreinte) on conflict (id) do update set empreinte = excluded.empreinte, maj = now();
  return true;
end $$;
-- p_cle : empreinte du NIP du comptoir, ou « prof:<compte>:<jeton> » (un enseignant, depuis l'Administration)
create or replace function public.magasin_cle_ok(p_cle text) returns boolean language plpgsql stable security definer set search_path = public as $$
declare a text[];
begin
  if p_cle like 'prof:%' then a := regexp_split_to_array(p_cle, ':'); return array_length(a, 1) >= 3 and public.panier_prof_ok(a[2], array_to_string(a[3:], ':')); end if;
  return exists (select 1 from public.magasin_cle where empreinte = p_cle);
end $$;
create or replace function public.magasin_cle_verifier(p_cle text) returns boolean language sql stable security definer set search_path = public as $$ select public.magasin_cle_ok(p_cle); $$;
create or replace function public.panier_magasin_c(p_cle text)
returns table(id uuid, t timestamptz, ens text, groupe text, code text, prenom text, items jsonb, note text, etat text, t_app timestamptz, t_remis timestamptz)
language plpgsql stable security definer set search_path = public as $$
begin if not public.magasin_cle_ok(p_cle) then return; end if; return query select * from public.panier_magasin(); end $$;
create or replace function public.panier_remettre_c(p_cle text, p_id uuid, p_remis boolean default true) returns boolean language plpgsql security definer set search_path = public as $$
begin if not public.magasin_cle_ok(p_cle) then return false; end if; return public.panier_remettre(p_id, p_remis); end $$;
create or replace function public.panier_signaler_c(p_cle text, p_id uuid, p_regle int) returns jsonb language plpgsql security definer set search_path = public as $$
begin if not public.magasin_cle_ok(p_cle) then return jsonb_build_object('ok', false, 'err', 'comptoir non autorisé'); end if; return public.panier_signaler(p_id, p_regle); end $$;
create or replace function public.panier_signalements_c(p_cle text, p_ids uuid[]) returns table(panier uuid, regle smallint) language plpgsql stable security definer set search_path = public as $$
begin if not public.magasin_cle_ok(p_cle) then return; end if; return query select * from public.panier_signalements(p_ids); end $$;
create or replace function public.magasin_abonner_c(p_cle text, p_abonnement jsonb, p_oui boolean default true) returns boolean language plpgsql security definer set search_path = public as $$
begin if not public.magasin_cle_ok(p_cle) then return false; end if; return public.magasin_abonner(p_abonnement, p_oui); end $$;
create or replace function public.magasin_acommander_ajouter_c(p_cle text, p_n text, p_nom text, p_q int, p_note text default null) returns boolean language plpgsql security definer set search_path = public as $$
begin if not public.magasin_cle_ok(p_cle) then return false; end if; return public.magasin_acommander_ajouter(p_n, p_nom, p_q, p_note); end $$;
create or replace function public.magasin_acommander_maj_c(p_cle text, p_id bigint, p_fait boolean, p_retirer boolean default false) returns boolean language plpgsql security definer set search_path = public as $$
begin if not public.magasin_cle_ok(p_cle) then return false; end if; return public.magasin_acommander_maj(p_id, p_fait, p_retirer); end $$;
-- les anciennes portes sans clé sont fermées au public
revoke execute on function public.panier_magasin(), public.panier_remettre(uuid, boolean), public.panier_signaler(uuid, int), public.panier_signalements(uuid[]),
  public.magasin_abonner(jsonb, boolean), public.magasin_acommander_ajouter(text, text, int, text), public.magasin_acommander_maj(bigint, boolean, boolean) from anon, authenticated, public;
revoke all on table public.magasin_cle from anon, authenticated;
grant execute on function public.magasin_cle_definir(text, text, text), public.magasin_cle_verifier(text), public.panier_magasin_c(text), public.panier_remettre_c(text, uuid, boolean),
  public.panier_signaler_c(text, uuid, int), public.panier_signalements_c(text, uuid[]), public.magasin_abonner_c(text, jsonb, boolean),
  public.magasin_acommander_ajouter_c(text, text, text, int, text), public.magasin_acommander_maj_c(text, bigint, boolean, boolean) to anon, authenticated;
