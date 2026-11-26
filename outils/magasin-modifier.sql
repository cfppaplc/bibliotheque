-- 25 nov. (Jeremy : « il devrait pouvoir modifier sa commande jusqu'à l'approbation du prof ») : l'élève modifie ou annule son panier.
-- Preuve : l'identifiant du panier (gardé seulement sur l'appareil qui l'a envoyé) + son code.
-- Modifier : seulement « en attente ». Annuler : « en attente » ou « approuvé » (pas encore remis).
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
  delete from public.panier where id = p_id and code = p_code and etat in ('attente', 'approuve');
  return found;
end; $$;
revoke all on function public.panier_modifier(uuid, text, jsonb, text), public.panier_annuler(uuid, text) from public;
grant execute on function public.panier_etat(uuid), public.panier_modifier(uuid, text, jsonb, text), public.panier_annuler(uuid, text) to anon, authenticated;
