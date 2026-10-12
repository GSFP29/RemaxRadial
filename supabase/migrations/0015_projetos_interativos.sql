-- Protótipo: "Projetos Interativos" — planta 2D carregada pelo consultor
-- com pontos de interesse clicáveis, para mostrar algo mais tangível ao
-- cliente. NÃO é o render 3D gerado a partir de fotogrametria (isso exige
-- equipamento e software especializado de terceiros) — é uma versão 2D
-- interativa, mais simples mas realmente construível. Ver docs/decisoes.md.

insert into storage.buckets (id, name, public)
values ('plantas-projetos', 'plantas-projetos', true)
on conflict (id) do nothing;

create policy "público vê plantas de projetos"
  on storage.objects for select
  to public
  using (bucket_id = 'plantas-projetos');

create policy "consultor carrega plantas"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'plantas-projetos');

create policy "consultor apaga as próprias plantas"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'plantas-projetos' and owner = auth.uid());

create table projetos_interativos (
  id uuid primary key default gen_random_uuid(),
  consultor_id uuid not null references consultores (id) on delete cascade,
  imovel_id uuid references imoveis (id),
  titulo text not null,
  imagem_path text not null,
  hotspots jsonb not null default '[]'::jsonb,
  criado_em timestamptz not null default now()
);

alter table projetos_interativos enable row level security;

-- Público, para o link poder ser partilhado com um cliente sem login.
create policy "público vê projetos interativos"
  on projetos_interativos for select
  to public
  using (true);

create policy "consultor gere os próprios projetos"
  on projetos_interativos for all
  to authenticated
  using (consultor_id = auth.uid() or is_administrador())
  with check (consultor_id = auth.uid() or is_administrador());
