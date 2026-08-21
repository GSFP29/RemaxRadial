-- O índice parcial da migração 0004 não serve de alvo para ON CONFLICT
-- (o Postgres exige um índice único sem cláusula WHERE para isso).
-- NULLs continuam a poder repetir-se num índice único normal, por isso
-- não perdemos nada em tirar o "where".
drop index if exists leads_id_externo_idx;
create unique index leads_id_externo_idx on leads (id_externo);
