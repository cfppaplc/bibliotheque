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
