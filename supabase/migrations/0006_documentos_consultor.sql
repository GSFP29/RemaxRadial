-- Documentos úteis para consultores (contratos, fichas, checklists...).
-- Ficheiros ficam no Storage, esta tabela só guarda os metadados.
create type idioma_documento as enum ('pt', 'en', 'pt_en');

create table documentos_consultor (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  categoria text not null default 'Outros',
  idioma idioma_documento not null,
  caminho_storage text not null unique,
  extensao text not null,
  criado_em timestamptz not null default now()
);

alter table documentos_consultor enable row level security;

create policy "consultores autenticados veem documentos"
  on documentos_consultor for select
  to authenticated
  using (true);

create policy "administrador gere documentos"
  on documentos_consultor for all
  to authenticated
  using (is_administrador())
  with check (is_administrador());
