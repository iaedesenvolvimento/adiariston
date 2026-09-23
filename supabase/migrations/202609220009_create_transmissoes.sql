create type public.transmissao_status as enum (
  'AGENDADA',
  'AO_VIVO',
  'ENCERRADA',
  'CANCELADA'
);

create table public.transmissoes (
  id uuid primary key default gen_random_uuid(),
  titulo text not null,
  descricao text,
  youtube_video_id text not null,
  inicio_previsto timestamptz not null,
  fim_previsto timestamptz,
  status public.transmissao_status not null default 'AGENDADA',
  destacar_home boolean not null default false,
  exibir_gravacao boolean not null default false,
  ativo boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  updated_by uuid references public.usuarios(id) on delete set null,

  constraint transmissoes_titulo_tamanho check (
    char_length(titulo) between 3 and 140
  ),
  constraint transmissoes_descricao_tamanho check (
    descricao is null or char_length(descricao) <= 1000
  ),
  constraint transmissoes_youtube_video_id_formato check (
    youtube_video_id ~ '^[A-Za-z0-9_-]{6,32}$'
  ),
  constraint transmissoes_periodo_valido check (
    fim_previsto is null or fim_previsto >= inicio_previsto
  )
);

create index transmissoes_status_inicio_idx
  on public.transmissoes (status, inicio_previsto desc);

create index transmissoes_destaque_idx
  on public.transmissoes (destacar_home, ativo, inicio_previsto desc);

create trigger transmissoes_set_updated_at
before update on public.transmissoes
for each row
execute function public.set_updated_at();

alter table public.transmissoes enable row level security;

grant select on public.transmissoes to anon, authenticated;
grant insert, update, delete on public.transmissoes to authenticated;

create policy "Publico pode ler transmissoes ativas"
on public.transmissoes
for select
to anon, authenticated
using (
  ativo is true
  and status <> 'CANCELADA'
);

create policy "Equipe autorizada pode ler transmissoes"
on public.transmissoes
for select
to authenticated
using (
  public.usuario_atual_tem_perfil(
    array['Admin', 'Leadership', 'Editor']::public.perfil_nome[]
  )
);

create policy "Editores podem gerenciar transmissoes"
on public.transmissoes
for all
to authenticated
using (
  public.usuario_atual_tem_perfil(
    array['Admin', 'Editor']::public.perfil_nome[]
  )
)
with check (
  public.usuario_atual_tem_perfil(
    array['Admin', 'Editor']::public.perfil_nome[]
  )
);
