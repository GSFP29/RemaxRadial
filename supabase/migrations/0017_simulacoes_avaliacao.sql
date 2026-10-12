-- "Quanto vale a minha casa" — simulador de avaliação, a peça central do
-- site público (CLAUDE.md secção 7). Estimativa calculada em tempo real a
-- partir de comparáveis reais (imóveis ativos semelhantes na nossa
-- carteira), nunca inventada. Cria sempre uma lead, com o detalhe
-- estruturado aqui ao lado — mesmo padrão de pedidos_venda/simulacoes_financiamento.

create table simulacoes_avaliacao (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid references leads (id),
  concelho text not null,
  freguesia text,
  tipologia text not null,
  area_m2 numeric(8, 2) not null,
  amostra_n integer not null,
  preco_m2_estimado numeric(10, 2),
  estimativa_min numeric(12, 2),
  estimativa_max numeric(12, 2),
  criado_em timestamptz not null default now()
);

alter table simulacoes_avaliacao enable row level security;

create policy "administrador gere simulações de avaliação"
  on simulacoes_avaliacao for all
  to authenticated
  using (is_administrador())
  with check (is_administrador());
