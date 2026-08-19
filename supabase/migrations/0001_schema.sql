-- Esquema inicial — RE/MAX Radial
-- Três níveis de acesso: público (anon, sem login), consultor, administrador.
-- Regras vivem aqui (RLS), nunca no frontend.

create type nivel_utilizador as enum ('consultor', 'administrador');
create type tipo_negocio as enum ('venda', 'arrendamento');
create type origem_lead as enum ('portal_remax', 'idealista', 'imovirtual', 'formulario_site', 'telefone', 'outro');

-- ---------------------------------------------------------------------------
-- consultores
-- ---------------------------------------------------------------------------
create table consultores (
  id uuid primary key references auth.users (id) on delete cascade,
  agent_id text unique, -- ID do agente no portal RE/MAX, ver docs/api-remax.md
  nome text not null,
  telemovel text,
  nivel nivel_utilizador not null default 'consultor',
  ativo boolean not null default true,
  criado_em timestamptz not null default now()
);

alter table consultores enable row level security;

-- Função auxiliar (security definer para evitar recursão nas políticas de RLS).
create function is_administrador()
returns boolean
language sql
security definer
stable
as $$
  select exists (
    select 1 from consultores
    where id = auth.uid() and nivel = 'administrador'
  );
$$;

create policy "consultores autenticados veem todos os consultores"
  on consultores for select
  to authenticated
  using (true);

create policy "consultor atualiza o próprio registo"
  on consultores for update
  to authenticated
  using (id = auth.uid())
  with check (id = auth.uid());

create policy "administrador gere consultores"
  on consultores for all
  to authenticated
  using (is_administrador())
  with check (is_administrador());

-- ---------------------------------------------------------------------------
-- imoveis
-- ---------------------------------------------------------------------------
create table imoveis (
  id uuid primary key default gen_random_uuid(),
  ref_remax text unique not null, -- referência do anúncio no portal RE/MAX
  consultor_id uuid references consultores (id),
  tipo tipo_negocio not null,
  estado text not null, -- ex: ativo, reservado, vendido, arrendado, cancelado
  preco_pedido numeric(12, 2),
  preco_fechado numeric(12, 2),
  morada text,
  freguesia text,
  concelho text,
  latitude double precision,
  longitude double precision,
  tipologia text,
  area_m2 numeric(8, 2),
  ano_construcao integer,
  quartos integer,
  casas_banho integer,
  certificado_energetico text,
  data_angariacao date,
  data_fecho date,
  data_cancelamento date,
  dados_api jsonb, -- payload bruto da API RE/MAX, para campos ainda não modelados
  criado_em timestamptz not null default now(),
  atualizado_em timestamptz not null default now()
);

create index imoveis_consultor_id_idx on imoveis (consultor_id);
create index imoveis_estado_idx on imoveis (estado);
create index imoveis_freguesia_idx on imoveis (freguesia);

alter table imoveis enable row level security;

-- Site público: só imóveis ativos, sem campos de negócio internos
-- (a view pública, separada, decide as colunas expostas).
create policy "público vê imóveis ativos"
  on imoveis for select
  to anon
  using (estado = 'ativo');

create policy "consultores autenticados veem todos os imóveis"
  on imoveis for select
  to authenticated
  using (true);

create policy "consultor gere os próprios imóveis"
  on imoveis for insert
  to authenticated
  with check (consultor_id = auth.uid() or is_administrador());

create policy "consultor atualiza os próprios imóveis"
  on imoveis for update
  to authenticated
  using (consultor_id = auth.uid() or is_administrador())
  with check (consultor_id = auth.uid() or is_administrador());

create policy "administrador apaga imóveis"
  on imoveis for delete
  to authenticated
  using (is_administrador());

-- ---------------------------------------------------------------------------
-- leads
-- Nunca inserida diretamente pelo cliente anon — os formulários do site e o
-- parsing de email escrevem através de uma rota de servidor com a service
-- role key, que não passa pelo RLS. Isto evita expor uma política de insert
-- pública que teria de validar tudo à mão.
-- ---------------------------------------------------------------------------
create table leads (
  id uuid primary key default gen_random_uuid(),
  origem origem_lead not null,
  nome text,
  telefone text,
  email text,
  mensagem text,
  imovel_id uuid references imoveis (id),
  consultor_id uuid references consultores (id),
  estado text not null default 'novo', -- novo, contactado, qualificado, perdido, convertido
  criado_em timestamptz not null default now(),
  atualizado_em timestamptz not null default now()
);

create index leads_consultor_id_idx on leads (consultor_id);
create index leads_estado_idx on leads (estado);

alter table leads enable row level security;

create policy "consultor vê as próprias leads"
  on leads for select
  to authenticated
  using (consultor_id = auth.uid() or is_administrador());

create policy "consultor atualiza as próprias leads"
  on leads for update
  to authenticated
  using (consultor_id = auth.uid() or is_administrador())
  with check (consultor_id = auth.uid() or is_administrador());

-- ---------------------------------------------------------------------------
-- pesquisas_guardadas
-- Privado por consultor. O administrador tem a ferramenta de pesquisa mas
-- NÃO acede ao histórico dos colegas — decisão explícita do cliente,
-- ver docs/decisoes.md. Por isso não há exceção para is_administrador() aqui.
-- ---------------------------------------------------------------------------
create table pesquisas_guardadas (
  id uuid primary key default gen_random_uuid(),
  consultor_id uuid not null references consultores (id) on delete cascade,
  nome text not null, -- nome que identifica o cliente a que se destina
  filtros jsonb not null default '{}'::jsonb,
  poligono jsonb, -- pontos do polígono desenhado no mapa, se aplicável
  criado_em timestamptz not null default now()
);

create index pesquisas_guardadas_consultor_id_idx on pesquisas_guardadas (consultor_id);

alter table pesquisas_guardadas enable row level security;

create policy "consultor gere as próprias pesquisas guardadas"
  on pesquisas_guardadas for all
  to authenticated
  using (consultor_id = auth.uid())
  with check (consultor_id = auth.uid());
