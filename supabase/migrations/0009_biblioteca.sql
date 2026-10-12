-- Biblioteca — conteúdos educativos de referência para os consultores,
-- mantidos pelo administrador. Mais simples que a "Universidade Radial"
-- planeada (essa terá módulos e testes); isto é só uma lista consultável.

create table biblioteca_recursos (
  id uuid primary key default gen_random_uuid(),
  titulo text not null,
  descricao text,
  url text not null, -- link externo (Drive, YouTube, etc.) — sem upload próprio por agora
  categoria text,
  criado_em timestamptz not null default now()
);

alter table biblioteca_recursos enable row level security;

create policy "consultores autenticados veem a biblioteca"
  on biblioteca_recursos for select
  to authenticated
  using (true);

create policy "administrador gere a biblioteca"
  on biblioteca_recursos for all
  to authenticated
  using (is_administrador())
  with check (is_administrador());
