-- 27 nov. (Loi 25, Jeremy : « go ») : la « boîte » remplace ntfy.sh (service américain) pour les demandes d'accès, les propositions,
-- les signalements et les erreurs. Même usage qu'avant (un sujet secret = une boîte), gardé 14 jours au lieu de 12 h, au Canada.
-- Les avis importants (demande d'accès, signalement, panne) partent sur le cellulaire des administrateurs (fonction panier-avis).
create table if not exists public.boite (
  id     bigint generated always as identity primary key,
  sujet  text not null,
  t      timestamptz not null default now(),
  titre  text,
  corps  text not null,
  prio   int not null default 3,          -- 1 min, 2 bas, 3 normal, 4 haut, 5 urgent (comme ntfy)
  tags   text
);
create index if not exists boite_sujet_t on public.boite (sujet, t);
alter table public.boite enable row level security;
revoke all on public.boite from anon, authenticated;

create or replace function public.boite_poster(p_sujet text, p_corps text, p_titre text default null, p_prio int default 3, p_tags text default null)
returns boolean language plpgsql security definer set search_path = public, extensions as $$
declare r public.boite;
begin
  if p_sujet not in ('metierplus-signal-f3ce60fd2f6c0f46', 'biblio-pavillon-5edf93926a704efe') or length(coalesce(p_corps, '')) not between 1 and 8000
     or length(coalesce(p_titre, '')) > 200 or length(coalesce(p_tags, '')) > 200 or coalesce(p_prio, 3) not between 1 and 5 then return false; end if;
  if (select count(*) from public.boite where sujet = p_sujet and t > now() - interval '1 hour') >= 400 then return false; end if;
  insert into public.boite (sujet, titre, corps, prio, tags) values (p_sujet, nullif(p_titre, ''), p_corps, coalesce(p_prio, 3), nullif(p_tags, '')) returning * into r;
  delete from public.boite where t < now() - interval '14 days';
  if (r.prio >= 3 and coalesce(r.tags, '') !~ 'chart') or p_sujet = 'biblio-pavillon-5edf93926a704efe' then
    perform net.http_post(url := 'https://nhxhfiaznuifcbobjuuv.supabase.co/functions/v1/panier-avis', headers := '{"Content-Type":"application/json"}'::jsonb, body := jsonb_build_object('boite', r.id));
  end if;
  return true;
end; $$;

-- lecture au format des messages ntfy (une ligne JSON par message), pour garder le code des pages
create or replace function public.boite_lire(p_sujet text, p_heures int default 12) returns setof jsonb language sql stable security definer set search_path = public as $$
  select jsonb_build_object('id', 'b' || id, 'time', extract(epoch from t)::bigint, 'event', 'message', 'title', titre, 'message', corps,
    'priority', prio, 'tags', coalesce(to_jsonb(string_to_array(tags, ',')), '[]'::jsonb))
  from public.boite where sujet = p_sujet and t > now() - make_interval(hours => least(greatest(coalesce(p_heures, 12), 1), 336)) order by t limit 2000;
$$;
revoke all on function public.boite_poster(text, text, text, int, text), public.boite_lire(text, int) from public;
grant execute on function public.boite_poster(text, text, text, int, text), public.boite_lire(text, int) to anon, authenticated;
grant all on public.boite to service_role;
