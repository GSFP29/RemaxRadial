-- Aba "Vender" (pedido de avaliação) e pré-simulação de financiamento na
-- ficha do imóvel — ambos criam sempre uma linha em `leads` (para entrarem
-- no funil normal) com o detalhe estruturado aqui ao lado. Escrita sempre
-- via rota de servidor com a service role key (nunca INSERT anon direto
-- em `leads`), ver docs/decisoes.md.
--
-- Visibilidade: como uma lead nova nasce sem consultor_id, a política de
-- `leads` já só a mostra ao administrador até ser atribuída — o mesmo
-- critério aplica-se aqui, por serem dados mais sensíveis (rendimento,
-- encargos, morada de venda).

create table pedidos_venda (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid references leads (id),
  nome text not null,
  email text not null,
  telefone text not null,
  tipo_imovel text not null,
  distrito text not null,
  concelho text not null,
  freguesia text not null,
  criado_em timestamptz not null default now()
);

alter table pedidos_venda enable row level security;

create policy "administrador gere pedidos de venda"
  on pedidos_venda for all
  to authenticated
  using (is_administrador())
  with check (is_administrador());

create table simulacoes_financiamento (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid references leads (id),
  imovel_id uuid references imoveis (id),
  valor_imovel numeric(12, 2) not null,
  entrada numeric(12, 2) not null,
  taxa_tan numeric(5, 3) not null,
  prazo_anos integer not null,
  rendimento_liquido numeric(12, 2),
  prestacao_mensal numeric(12, 2) not null,
  montante_financiado numeric(12, 2) not null,
  ltv numeric(5, 2) not null,
  taxa_esforco numeric(5, 2),
  -- Encaminhamento para a MaxFinance Delta ainda é manual (não há
  -- API/webhook combinado) — este campo marca quando alguém já tratou disso.
  enviado_maxfinance boolean not null default false,
  criado_em timestamptz not null default now()
);

create index simulacoes_financiamento_imovel_id_idx on simulacoes_financiamento (imovel_id);

alter table simulacoes_financiamento enable row level security;

create policy "administrador gere simulações de financiamento"
  on simulacoes_financiamento for all
  to authenticated
  using (is_administrador())
  with check (is_administrador());
