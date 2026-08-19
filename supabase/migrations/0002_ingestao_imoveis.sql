-- Suporte à ingestão diária da API RE/MAX — ver docs/api-remax.md
-- agent_id fica em bruto no imóvel (vem sempre na referência do anúncio);
-- consultor_id só se preenche quando existir already um consultor com esse
-- agent_id na tabela consultores (a maioria ainda não tem conta criada).

alter table imoveis add column agent_id text;
alter table imoveis add column visto_em timestamptz not null default now();

create index imoveis_agent_id_idx on imoveis (agent_id);

-- ---------------------------------------------------------------------------
-- imoveis_alteracoes
-- Registo de alterações (preço, estado) — não o estado atual completo a
-- cada corrida, só o que mudou. Ver "Estratégia de armazenamento" em
-- docs/api-remax.md.
-- ---------------------------------------------------------------------------
create table imoveis_alteracoes (
  id uuid primary key default gen_random_uuid(),
  imovel_id uuid not null references imoveis (id) on delete cascade,
  campo text not null,
  valor_anterior text,
  valor_novo text,
  criado_em timestamptz not null default now()
);

create index imoveis_alteracoes_imovel_id_idx on imoveis_alteracoes (imovel_id);

alter table imoveis_alteracoes enable row level security;

create policy "consultores autenticados veem alterações"
  on imoveis_alteracoes for select
  to authenticated
  using (true);
