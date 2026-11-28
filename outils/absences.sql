-- 27 nov. (Jeremy : « sur la carte, l'élève pourrait signaler une absence, déjà faite ou future; choix des motifs, avertissements »;
-- « l'élève choisit avec qui il était à l'horaire »; « pas besoin d'appeler »).
-- Signalement seulement (ce n'est pas un motif officiel). Loi 25 : prénom, groupe, dates et un motif choisi dans une liste; aucun texte libre.
-- Preuve : la clé de la carte (même empreinte que carte_code) ou le code d'essai de l'administrateur.
-- Gardé 1 an. Avis Web Push aux enseignants choisis par la fonction panier-avis ({absence:id}).
create extension if not exists pgcrypto with schema extensions;
create extension if not exists pg_net;

create table if not exists public.absence (
  id      uuid primary key default gen_random_uuid(),
  t       timestamptz not null default now(),
  code    text not null,
  prenom  text,
  groupe  text not null,
  profs   text[] not null,            -- enseignants avisés (choisis par l'élève)
  genre   text not null,              -- absence | retard | depart
  du      date not null,
  au      date not null,
  part    text not null default 'j',  -- j (journée) | am | pm
  heure   text,                       -- retard / départ : « 9:35 »
  motif   int not null,               -- 1 maladie, 2 rendez-vous médical, 3 décès d'un proche, 4 services aux élèves, 5 activité autorisée, 6 autre
  vu      text[] not null default '{}'
);
create index if not exists absence_code on public.absence (code, du);
create index if not exists absence_profs on public.absence using gin (profs);
alter table public.absence enable row level security;
revoke all on public.absence from anon, authenticated;

create or replace function public.absence_carte_ok(p_code text, p_cle text) returns boolean language sql stable security definer set search_path = public, extensions as $$
  select p_code ~ '^[0-9]{5}$' and (
    exists (select 1 from public.carte_code where code = p_code and jeton = encode(extensions.digest('metier+|carte-code-jeton|' || p_code || '|' || upper(coalesce(p_cle, '')), 'sha256'), 'hex'))
    or encode(extensions.digest('metier+|essai|' || p_code, 'sha256'), 'hex') = '8f2f917e3d5ac0a9e8f455e8448e41577d02c10718efa3099c8e396e5bf0ca5a');
$$;

create or replace function public.absence_signaler(p_code text, p_cle text, p_groupe text, p_prenom text, p_profs text[], p_genre text, p_du date, p_au date, p_part text, p_heure text, p_motif int)
returns jsonb language plpgsql security definer set search_path = public, extensions as $$
declare r public.absence; pf text[] := array(select distinct x from unnest(coalesce(p_profs, '{}')) x where x ~ '^[a-z0-9._-]{3,60}$' limit 4);
begin
  if not public.absence_carte_ok(p_code, p_cle) then return jsonb_build_object('ok', false, 'err', 'carte'); end if;
  if array_length(pf, 1) is null or p_genre not in ('absence', 'retard', 'depart') or p_motif not between 1 and 6 or p_part not in ('j', 'am', 'pm')
     or p_du is null or p_au is null or p_au < p_du or p_au - p_du > 30 or p_du < current_date - 30 or p_du > current_date + 120
     or length(coalesce(p_groupe, '')) not between 1 and 60 or coalesce(p_heure, '') !~ '^([0-9]{1,2}:[0-9]{2})?$' then
    return jsonb_build_object('ok', false, 'err', 'refusé'); end if;
  if (select count(*) from public.absence where code = p_code and t > now() - interval '1 day') >= 10 then return jsonb_build_object('ok', false, 'err', 'trop'); end if;
  insert into public.absence (code, prenom, groupe, profs, genre, du, au, part, heure, motif)
    values (p_code, nullif(left(split_part(trim(coalesce(p_prenom, '')), ' ', 1), 20), ''), p_groupe, pf, p_genre, p_du, p_au, p_part, nullif(p_heure, ''), p_motif) returning * into r;
  delete from public.absence where t < now() - interval '1 year';
  if exists (select 1 from public.panier_prof where ens = any(pf) and jsonb_array_length(abonnements) > 0) then
    perform net.http_post(url := 'https://nhxhfiaznuifcbobjuuv.supabase.co/functions/v1/panier-avis', headers := '{"Content-Type":"application/json"}'::jsonb, body := jsonb_build_object('absence', r.id));
  end if;
  return jsonb_build_object('ok', true, 'id', r.id);
end; $$;

-- l'élève : ses signalements (90 derniers jours et à venir)
create or replace function public.absence_eleve(p_code text, p_cle text) returns setof jsonb language sql stable security definer set search_path = public, extensions as $$
  select jsonb_build_object('id', id, 't', t, 'genre', genre, 'du', du, 'au', au, 'part', part, 'heure', heure, 'motif', motif, 'profs', profs, 'vu', array_length(vu, 1) is not null)
  from public.absence where public.absence_carte_ok(p_code, p_cle) and code = p_code and au >= current_date - 90 order by du desc limit 50;
$$;
-- l'élève annule un signalement à venir
create or replace function public.absence_annuler(p_code text, p_cle text, p_id uuid) returns boolean language plpgsql security definer set search_path = public, extensions as $$
begin
  if not public.absence_carte_ok(p_code, p_cle) then return false; end if;
  delete from public.absence where id = p_id and code = p_code and du >= current_date; return found;
end; $$;

-- l'enseignant (clé d'approbation du magasin) : signalements qui le concernent
create or replace function public.absence_prof_lire(p_ens text, p_jeton text) returns setof jsonb language sql stable security definer set search_path = public, extensions as $$
  select jsonb_build_object('id', id, 't', t, 'code', code, 'prenom', prenom, 'groupe', groupe, 'genre', genre, 'du', du, 'au', au, 'part', part, 'heure', heure, 'motif', motif, 'vu', p_ens = any(vu))
  from public.absence where public.panier_prof_ok(p_ens, p_jeton) and p_ens = any(profs) and au >= current_date - 60 order by du desc, t desc limit 200;
$$;
create or replace function public.absence_vu(p_ens text, p_jeton text, p_id uuid) returns boolean language plpgsql security definer set search_path = public, extensions as $$
begin
  if not public.panier_prof_ok(p_ens, p_jeton) then return false; end if;
  update public.absence set vu = array_append(vu, p_ens) where id = p_id and p_ens = any(profs) and not (p_ens = any(vu)); return true;
end; $$;

grant execute on function public.absence_signaler(text, text, text, text, text[], text, date, date, text, text, int), public.absence_eleve(text, text),
  public.absence_annuler(text, text, uuid), public.absence_prof_lire(text, text), public.absence_vu(text, text, uuid) to anon, authenticated;
revoke execute on function public.absence_carte_ok(text, text) from anon, authenticated;

-- 27 nov. (vérification Loi 25) : plus aucun motif de santé. 1 = raison personnelle, 2 = rendez-vous, 3 (ancien deuil) → 1.
update public.absence set motif = 1 where motif = 3;
comment on column public.absence.motif is '1 raison personnelle, 2 rendez-vous, 4 services aux élèves, 5 activité autorisée, 6 autre (3 retiré le 27 nov. 2026)';
