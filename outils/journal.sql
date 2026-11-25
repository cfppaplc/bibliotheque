-- Journal de fluidité et d'erreurs (25 nov.) : rapports anonymes des appareils des enseignants (appareil, écran, page, durées).
-- Aucun nom, aucune donnée d'élève. Gardés 30 jours. À coller une fois dans Supabase → SQL Editor → Run.
create table if not exists public.journal (
  id    bigint generated always as identity primary key,
  t     timestamptz not null default now(),
  titre text not null,
  texte text not null
);
create index if not exists journal_t on public.journal (t);
alter table public.journal enable row level security;
revoke all on public.journal from anon, authenticated;

-- écrire : texte limité à 6000 caractères, au plus 400 rapports par heure pour tout le site, ménage des rapports de plus de 30 jours
create or replace function public.journal_ecrire(p_titre text, p_texte text)
returns void
language plpgsql security definer set search_path = public as $$
begin
  if p_titre is null or p_texte is null or length(p_titre) > 80 or length(p_texte) > 6000 then return; end if;
  if (select count(*) from public.journal where t > now() - interval '1 hour') >= 400 then return; end if;
  insert into public.journal (titre, texte) values (p_titre, p_texte);
  delete from public.journal where t < now() - interval '30 days';
end;
$$;

-- lire : les rapports des p_heures dernières heures (maximum 168 h = 7 jours, 300 rapports)
create or replace function public.journal_lire(p_heures integer default 24)
returns table(t timestamptz, titre text, texte text)
language sql stable security definer set search_path = public as $$
  select j.t, j.titre, j.texte from public.journal j
  where j.t > now() - make_interval(hours => least(greatest(coalesce(p_heures, 24), 1), 168))
  order by j.t desc limit 300;
$$;

revoke all on function public.journal_ecrire(text, text) from public;
revoke all on function public.journal_lire(integer) from public;
grant execute on function public.journal_ecrire(text, text) to anon, authenticated;
grant execute on function public.journal_lire(integer) to anon, authenticated;
