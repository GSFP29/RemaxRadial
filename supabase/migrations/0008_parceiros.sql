-- Contactos de Parceiros — diretório de fornecedores da agência
-- (ver CLAUDE.md secção 9 e docs/decisoes.md). Consultado por todos os
-- consultores autenticados; só o administrador mantém a lista.

create table parceiros (
  id uuid primary key default gen_random_uuid(),
  categoria text not null, -- ver CATEGORIAS_PARCEIROS em src/lib/parceiros-formato.ts
  nome text not null,
  contacto text, -- telefone, email ou o que fizer sentido
  condicoes text, -- condições negociadas, notas
  criado_em timestamptz not null default now()
);

create index parceiros_categoria_idx on parceiros (categoria);

alter table parceiros enable row level security;

create policy "consultores autenticados veem parceiros"
  on parceiros for select
  to authenticated
  using (true);

create policy "administrador gere parceiros"
  on parceiros for all
  to authenticated
  using (is_administrador())
  with check (is_administrador());
