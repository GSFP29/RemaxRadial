-- Calendário pessoal do consultor — visitas, eventos pessoais e escalas,
-- tudo na mesma vista (ver CLAUDE.md secção 9). A escala não é um
-- separador à parte: é um evento como outro qualquer no calendário de
-- quem está de escala. O administrador atribui escalas a qualquer
-- consultor; cada consultor só gere os seus próprios eventos.

create type tipo_evento_calendario as enum ('visita', 'pessoal', 'escala', 'outro');

create table eventos_calendario (
  id uuid primary key default gen_random_uuid(),
  consultor_id uuid not null references consultores (id) on delete cascade,
  tipo tipo_evento_calendario not null default 'pessoal',
  titulo text not null,
  data_inicio timestamptz not null,
  cliente_associado text,
  notas text,
  criado_por uuid references consultores (id),
  criado_em timestamptz not null default now()
);

create index eventos_calendario_consultor_id_idx on eventos_calendario (consultor_id);
create index eventos_calendario_data_inicio_idx on eventos_calendario (data_inicio);

alter table eventos_calendario enable row level security;

create policy "consultor vê os próprios eventos"
  on eventos_calendario for select
  to authenticated
  using (consultor_id = auth.uid() or is_administrador());

create policy "consultor cria eventos (admin cria para qualquer consultor)"
  on eventos_calendario for insert
  to authenticated
  with check (consultor_id = auth.uid() or is_administrador());

create policy "consultor atualiza os próprios eventos"
  on eventos_calendario for update
  to authenticated
  using (consultor_id = auth.uid() or is_administrador())
  with check (consultor_id = auth.uid() or is_administrador());

create policy "consultor apaga os próprios eventos"
  on eventos_calendario for delete
  to authenticated
  using (consultor_id = auth.uid() or is_administrador());
