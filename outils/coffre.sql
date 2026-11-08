-- © 2026 Jérémy Raymond. Tous droits réservés.
-- Coffre de Métier+ : données de chaque enseignant (quiz, préférences, tableaux, modèles, où il est rendu dans les livres).
-- À coller une seule fois dans Supabase → SQL Editor → Run.
-- Les données arrivent déjà chiffrées par le navigateur : Supabase ne peut pas les lire.
-- Personne ne peut lister la table; écrire exige le jeton secret du compte.

create table if not exists public.coffre (
  id    text primary key,
  env   text not null,          -- clé du coffre, enveloppée pour la clé publique du compte
  jeton text not null,          -- secret d'écriture (jamais renvoyé)
  data  text,                   -- contenu chiffré
  maj   timestamptz not null default now()
);
alter table public.coffre enable row level security;   -- aucune règle : aucun accès direct à la table
revoke all on public.coffre from anon, authenticated;

create or replace function public.coffre_lire(p_id text)
returns table(env text, data text, maj timestamptz)
language sql security definer set search_path = public as $$
  select c.env, c.data, c.maj from public.coffre c where c.id = p_id;
$$;

create or replace function public.coffre_ecrire(p_id text, p_jeton text, p_env text, p_data text)
returns boolean
language plpgsql security definer set search_path = public as $$
begin
  if length(p_id) < 20 or length(p_jeton) < 20 or length(coalesce(p_data, '')) > 12000000 then
    return false;
  end if;
  insert into public.coffre as c (id, env, jeton, data) values (p_id, p_env, p_jeton, p_data)
  on conflict (id) do update set data = excluded.data, maj = now() where c.jeton = p_jeton;
  return found;
end;
$$;

revoke all on function public.coffre_lire(text) from public;
revoke all on function public.coffre_ecrire(text, text, text, text) from public;
grant execute on function public.coffre_lire(text) to anon, authenticated;
grant execute on function public.coffre_ecrire(text, text, text, text) to anon, authenticated;

-- Statistiques anonymes (7 nov.) : combien de fois chaque livre, quiz ou outil est ouvert, par mois. Jamais par qui.
create table if not exists public.stats (
  cle  text not null,
  mois text not null,
  n    integer not null default 0,
  primary key (cle, mois)
);
alter table public.stats enable row level security;
revoke all on public.stats from anon, authenticated;

create or replace function public.stats_plus(p_cle text)
returns void
language plpgsql security definer set search_path = public as $$
begin
  if p_cle !~ '^[a-z]+:[a-z0-9._-]{1,80}$' then return; end if;
  insert into public.stats (cle, mois, n) values (p_cle, to_char(now() at time zone 'America/Toronto', 'YYYY-MM'), 1)
  on conflict (cle, mois) do update set n = public.stats.n + 1;
end;
$$;

create or replace function public.stats_lire()
returns table(cle text, mois text, n integer)
language sql security definer set search_path = public as $$
  select s.cle, s.mois, s.n from public.stats s where s.mois >= to_char(now() - interval '12 months', 'YYYY-MM');
$$;

revoke all on function public.stats_plus(text) from public;
revoke all on function public.stats_lire() from public;
grant execute on function public.stats_plus(text) to anon, authenticated;
grant execute on function public.stats_lire() to anon, authenticated;

-- Effacer une rangée de son propre coffre (8 nov.) : fichiers de « Préparer le cours » retirés un jour après leur dernier cours. Exige le jeton secret.
create or replace function public.coffre_effacer(p_id text, p_jeton text)
returns boolean
language plpgsql security definer set search_path = public as $$
begin
  delete from public.coffre where id = p_id and jeton = p_jeton;
  return found;
end;
$$;
revoke all on function public.coffre_effacer(text, text) from public;
grant execute on function public.coffre_effacer(text, text) to anon, authenticated;

-- Garde-fou de taille (8 nov.) : Supabase gratuit = 500 Mo. Passé 400 Mo, les gros envois (fichiers) sont refusés;
-- les petites données (quiz, préférences, tableaux) passent toujours.
create or replace function public.coffre_ecrire(p_id text, p_jeton text, p_env text, p_data text)
returns boolean
language plpgsql security definer set search_path = public as $$
begin
  if length(p_id) < 20 or length(p_jeton) < 20 or length(coalesce(p_data, '')) > 12000000 then
    return false;
  end if;
  if length(coalesce(p_data, '')) > 300000 and pg_database_size(current_database()) > 400 * 1024 * 1024 then
    return false;
  end if;
  insert into public.coffre as c (id, env, jeton, data) values (p_id, p_env, p_jeton, p_data)
  on conflict (id) do update set data = excluded.data, maj = now() where c.jeton = p_jeton;
  return found;
end;
$$;
revoke all on function public.coffre_ecrire(text, text, text, text) from public;
grant execute on function public.coffre_ecrire(text, text, text, text) to anon, authenticated;
