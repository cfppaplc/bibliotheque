-- 25 nov. : l'élève retrouve sa carte avec son code à 5 chiffres + son prénom (carte.html).
-- Une rangée par code, lisible seulement par ces fonctions (pas de liste). 5 mauvais essais pour un code = bloqué 15 minutes.
create table if not exists carte_code (code text primary key, pch text not null, jeton text not null, data text, maj timestamptz default now());
alter table carte_code enable row level security;
create table if not exists carte_essais (code text primary key, n int not null default 0, depuis timestamptz not null default now());
alter table carte_essais enable row level security;

-- écrire (administrateur) : p_jeton prouve la clé de carte actuelle; p_nouveau = jeton de la nouvelle carte (carte perdue)
create or replace function carte_code_ecrire(p_code text, p_pch text, p_jeton text, p_nouveau text, p_data text)
returns boolean language plpgsql security definer set search_path = public as $$
begin
  if p_code !~ '^[0-9]{5}$' or length(coalesce(p_data, '')) > 2000 or length(p_jeton) <> 64 then return false; end if;
  insert into carte_code(code, pch, jeton, data) values (p_code, p_pch, coalesce(p_nouveau, p_jeton), p_data)
  on conflict (code) do update set pch = excluded.pch, jeton = excluded.jeton, data = excluded.data, maj = now()
    where carte_code.jeton = p_jeton or carte_code.jeton = coalesce(p_nouveau, p_jeton);
  return found;
end $$;

-- lire (élève) : { etat: ok | non | bloque, data }
create or replace function carte_code_lire(p_code text, p_pch text)
returns json language plpgsql security definer set search_path = public as $$
declare e carte_essais; d text;
begin
  if p_code !~ '^[0-9]{5}$' then return json_build_object('etat', 'non'); end if;
  select * into e from carte_essais where code = p_code;
  if found and e.n >= 5 and e.depuis > now() - interval '15 minutes' then return json_build_object('etat', 'bloque'); end if;
  select data into d from carte_code where code = p_code and pch = p_pch and data is not null;
  if d is not null then delete from carte_essais where code = p_code; return json_build_object('etat', 'ok', 'data', d); end if;
  insert into carte_essais(code, n, depuis) values (p_code, 1, now())
  on conflict (code) do update set n = case when carte_essais.depuis < now() - interval '15 minutes' then 1 else carte_essais.n + 1 end,
    depuis = case when carte_essais.depuis < now() - interval '15 minutes' then now() else carte_essais.depuis end;
  return json_build_object('etat', 'non');
end $$;
revoke all on carte_code, carte_essais from anon, authenticated;
grant execute on function carte_code_ecrire(text, text, text, text, text), carte_code_lire(text, text) to anon, authenticated;
