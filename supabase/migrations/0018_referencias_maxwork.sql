-- Referência de mercado agregada a partir de vendas reais na rede RE/MAX
-- (MAXWORK, ferramenta "Estudos de Mercado"), extraídas via sessão
-- assistida (ver docs/decisoes.md, secção Credenciais) e processadas por
-- scripts/importar-maxwork-vendidos.mjs. Não é live — atualizada
-- manualmente de vez em quando, à semelhança da referência do INE.
--
-- Uma linha por concelho+tipologia (comparáveis mais precisos) e uma linha
-- por concelho com tipologia = '' (todas as tipologias, para quando a
-- amostra específica é curta — mesmo padrão de fallback do simulador).
-- tipologia nunca é null propositadamente: simplifica o "on conflict" do
-- upsert (uma unique constraint normal não trata null como valor igual).

create table referencias_maxwork (
  id uuid primary key default gen_random_uuid(),
  concelho text not null,
  tipologia text not null default '',
  amostra_n integer not null,
  preco_m2_p10 numeric not null,
  preco_m2_p25 numeric not null,
  preco_m2_p50 numeric not null,
  preco_m2_p75 numeric not null,
  preco_m2_p90 numeric not null,
  mediana_dias_mercado numeric,
  periodo_meses integer not null,
  atualizado_em timestamptz not null default now(),
  unique (concelho, tipologia)
);

alter table referencias_maxwork enable row level security;

create policy "público vê referências de mercado"
  on referencias_maxwork for select
  to anon, authenticated
  using (true);

create policy "administrador gere referências de mercado"
  on referencias_maxwork for all
  to authenticated
  using (is_administrador())
  with check (is_administrador());
