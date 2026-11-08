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
