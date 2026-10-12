-- Avaliações do Google mostradas na homepage (só as de 5 estrelas).
-- Entrada manual pelo administrador — sem ligação à API do Google Places
-- por agora (ver docs/decisoes.md se um dia se automatizar).

create table avaliacoes_google (
  id uuid primary key default gen_random_uuid(),
  nome_autor text not null,
  texto text not null,
  estrelas integer not null check (estrelas between 1 and 5),
  url_avaliacao text,
  criado_em timestamptz not null default now()
);

alter table avaliacoes_google enable row level security;

create policy "público vê avaliações"
  on avaliacoes_google for select
  to anon, authenticated
  using (true);

create policy "administrador gere avaliações"
  on avaliacoes_google for all
  to authenticated
  using (is_administrador())
  with check (is_administrador());
