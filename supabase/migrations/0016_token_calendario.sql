-- Link secreto de subscrição do calendário pessoal (.ics) — o mesmo
-- padrão do "endereço iCal privado" do Google Calendar: o token em si é a
-- credencial, por isso fica numa tabela à parte da `consultores` (que é
-- legível por todos os consultores autenticados — não podia lá estar,
-- senão qualquer consultor via o token de qualquer colega).

create table tokens_calendario_pessoal (
  consultor_id uuid primary key references consultores (id) on delete cascade,
  token uuid not null default gen_random_uuid(),
  criado_em timestamptz not null default now()
);

alter table tokens_calendario_pessoal enable row level security;

create policy "consultor vê o próprio token"
  on tokens_calendario_pessoal for select
  to authenticated
  using (consultor_id = auth.uid() or is_administrador());

create policy "consultor cria o próprio token"
  on tokens_calendario_pessoal for insert
  to authenticated
  with check (consultor_id = auth.uid());
