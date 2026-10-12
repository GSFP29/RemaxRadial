-- Marcação de salas de reunião — só duas salas (Sala Paris, Sala Mundo),
-- horários de 30 em 30 minutos, 08:30–19:30. Visível a todos os
-- consultores autenticados (é uma agenda partilhada, não um dado privado).

create type sala_reuniao as enum ('Sala Paris', 'Sala Mundo');

create table reservas_salas (
  id uuid primary key default gen_random_uuid(),
  sala sala_reuniao not null,
  data date not null,
  hora_inicio time not null,
  consultor_id uuid not null references consultores (id) on delete cascade,
  cliente_associado text,
  criado_em timestamptz not null default now(),
  unique (sala, data, hora_inicio)
);

create index reservas_salas_data_idx on reservas_salas (data);

alter table reservas_salas enable row level security;

create policy "consultores autenticados veem todas as reservas"
  on reservas_salas for select
  to authenticated
  using (true);

create policy "consultor reserva (admin reserva por qualquer um)"
  on reservas_salas for insert
  to authenticated
  with check (consultor_id = auth.uid() or is_administrador());

create policy "consultor cancela a própria reserva"
  on reservas_salas for delete
  to authenticated
  using (consultor_id = auth.uid() or is_administrador());
