-- 25 nov. : l'élève affiche sa carte avec son code à 5 chiffres seulement (carte.html; Jeremy : « juste le code »).
-- Une rangée par code, lisible seulement par ces fonctions (pas de liste).
-- Protection contre qui essaie tous les codes : plus de 30 codes inconnus en 10 minutes = recherche en pause 10 minutes.
create table if not exists carte_code (code text primary key, jeton text not null, data text, maj timestamptz default now());
alter table carte_code enable row level security;
create table if not exists carte_echecs (t timestamptz not null default now());
alter table carte_echecs enable row level security;

-- écrire (administrateur) : p_jeton prouve la clé de carte actuelle; p_nouveau = jeton de la nouvelle carte (carte perdue)
create or replace function carte_code_ecrire(p_code text, p_jeton text, p_nouveau text, p_data text)
returns boolean language plpgsql security definer set search_path = public as $$
begin
  if p_code !~ '^[0-9]{5}$' or length(coalesce(p_data, '')) > 2000 or length(p_jeton) <> 64 then return false; end if;
  insert into carte_code(code, jeton, data) values (p_code, coalesce(p_nouveau, p_jeton), p_data)
  on conflict (code) do update set jeton = excluded.jeton, data = excluded.data, maj = now()
    where carte_code.jeton = p_jeton or carte_code.jeton = coalesce(p_nouveau, p_jeton);
  return found;
end $$;

-- lire (élève) : { etat: ok | non | bloque, data }
create or replace function carte_code_lire(p_code text)
returns json language plpgsql security definer set search_path = public as $$
declare d text;
begin
  if p_code !~ '^[0-9]{5}$' then return json_build_object('etat', 'non'); end if;
  if (select count(*) from carte_echecs where t > now() - interval '10 minutes') >= 30 then return json_build_object('etat', 'bloque'); end if;
  select data into d from carte_code where code = p_code and data is not null;
  if d is not null then return json_build_object('etat', 'ok', 'data', d); end if;
  insert into carte_echecs default values; delete from carte_echecs where t < now() - interval '1 day';
  return json_build_object('etat', 'non');
end $$;
revoke all on carte_code, carte_echecs from anon, authenticated;
grant execute on function carte_code_ecrire(text, text, text, text), carte_code_lire(text) to anon, authenticated;
