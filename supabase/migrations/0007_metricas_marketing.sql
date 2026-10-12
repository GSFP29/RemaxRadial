-- Funil de Marketing — métricas mensais do plano de estratégia digital
-- (ver Desktop/Radial/Marketing/Radial_Estrategia_Digital_v3.html, partes 11
-- e 12, para a origem de cada meta). Só o administrador tem acesso: é uma
-- ferramenta de gestão da agência, não de acompanhamento por consultor.
--
-- Entrada manual até as contas de Instagram, Facebook e Google Ads estarem
-- ligadas via API — ver docs/decisoes.md.

create table metricas_marketing_mensais (
  id uuid primary key default gen_random_uuid(),
  mes date not null, -- sempre o dia 1 do mês, ex. 2026-08-01
  chave text not null, -- ver METRICAS em src/lib/marketing-formato.ts
  valor numeric not null,
  criado_por uuid references consultores (id),
  criado_em timestamptz not null default now(),
  atualizado_em timestamptz not null default now(),
  unique (mes, chave)
);

create index metricas_marketing_mensais_mes_idx on metricas_marketing_mensais (mes);

alter table metricas_marketing_mensais enable row level security;

create policy "administrador gere métricas de marketing"
  on metricas_marketing_mensais for all
  to authenticated
  using (is_administrador())
  with check (is_administrador());
