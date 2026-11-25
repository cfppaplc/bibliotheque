-- Sauvegarde hebdomadaire (25 nov.) : lecture de toutes les tables, protégée par le mot de passe de sauvegarde (secret GitHub SAUVEGARDE_MDP).
-- Seule l'empreinte (sha256) du mot de passe est gardée. Elle est enregistrée par la première sauvegarde, seulement avant le 25 nov. 2026 à 15 h (heure de l'Est);
-- ensuite, plus personne ne peut la changer sans passer par le SQL Editor.
create extension if not exists pgcrypto with schema extensions;
create table if not exists public.sauvegarde_cle (id int primary key default 1 check (id = 1), empreinte text not null, t timestamptz not null default now());
alter table public.sauvegarde_cle enable row level security;
revoke all on public.sauvegarde_cle from anon, authenticated;

create or replace function public.sauvegarde_lire(p_mdp text, p_table text, p_depart integer default 0)
returns jsonb
language plpgsql security definer set search_path = public, extensions as $$
declare e text; r jsonb;
begin
  if p_mdp is null or length(p_mdp) < 20 then return null; end if;
  e := encode(extensions.digest(p_mdp, 'sha256'), 'hex');
  if not exists (select 1 from public.sauvegarde_cle) then
    if now() > timestamptz '2026-11-25 15:00 America/Toronto' then return null; end if;
    insert into public.sauvegarde_cle (empreinte) values (e);
  end if;
  if (select empreinte from public.sauvegarde_cle) <> e then return null; end if;
  if p_table = 'coffre' then select coalesce(jsonb_agg(to_jsonb(x)), '[]') into r from (select * from public.coffre order by id offset greatest(p_depart, 0) limit 50) x;
  elsif p_table = 'stats' then select coalesce(jsonb_agg(to_jsonb(x)), '[]') into r from (select * from public.stats order by cle, mois offset greatest(p_depart, 0) limit 1000) x;
  elsif p_table = 'journal' then select coalesce(jsonb_agg(to_jsonb(x)), '[]') into r from (select * from public.journal order by id offset greatest(p_depart, 0) limit 1000) x;
  else return null; end if;
  return r;
end;
$$;
revoke all on function public.sauvegarde_lire(text, text, integer) from public;
grant execute on function public.sauvegarde_lire(text, text, integer) to anon, authenticated;
