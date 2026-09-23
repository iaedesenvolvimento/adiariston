alter table public.programacao_semanal
  add column if not exists categoria text not null default 'Culto',
  add column if not exists horario_fim time,
  add column if not exists ministerio_id uuid references public.ministerios(id) on delete set null,
  add column if not exists data_inicio date not null default current_date,
  add column if not exists data_fim date,
  add column if not exists ordem integer not null default 0,
  add column if not exists updated_by uuid references public.usuarios(id) on delete set null;

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'programacao_semanal_categoria_tamanho'
  ) then
    alter table public.programacao_semanal
      add constraint programacao_semanal_categoria_tamanho
      check (char_length(categoria) between 3 and 80);
  end if;

  if not exists (
    select 1 from pg_constraint
    where conname = 'programacao_semanal_horario_fim_valido'
  ) then
    alter table public.programacao_semanal
      add constraint programacao_semanal_horario_fim_valido
      check (horario_fim is null or horario_fim >= horario);
  end if;

  if not exists (
    select 1 from pg_constraint
    where conname = 'programacao_semanal_periodo_valido'
  ) then
    alter table public.programacao_semanal
      add constraint programacao_semanal_periodo_valido
      check (data_fim is null or data_fim >= data_inicio);
  end if;
end;
$$;

create table if not exists public.excecoes_programacao (
  id uuid primary key default gen_random_uuid(),
  programacao_id uuid not null references public.programacao_semanal(id) on delete cascade,
  data date not null,
  status text not null default 'ALTERADA',
  titulo text,
  horario time,
  horario_fim time,
  local text,
  descricao text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  updated_by uuid references public.usuarios(id) on delete set null,

  constraint excecoes_programacao_status_valido check (
    status in ('NORMAL', 'ALTERADA', 'CANCELADA')
  ),
  constraint excecoes_programacao_titulo_tamanho check (
    titulo is null or char_length(titulo) between 3 and 100
  ),
  constraint excecoes_programacao_local_tamanho check (
    local is null or char_length(local) <= 160
  ),
  constraint excecoes_programacao_descricao_tamanho check (
    descricao is null or char_length(descricao) <= 1000
  ),
  constraint excecoes_programacao_horario_valido check (
    horario_fim is null
    or horario is null
    or horario_fim >= horario
  ),
  constraint excecoes_programacao_unica unique (programacao_id, data)
);

create index if not exists programacao_semanal_ordem_idx
  on public.programacao_semanal (ordem, dia_semana, horario);

create index if not exists excecoes_programacao_data_idx
  on public.excecoes_programacao (data, programacao_id);

create trigger excecoes_programacao_set_updated_at
before update on public.excecoes_programacao
for each row
execute function public.set_updated_at();

alter table public.excecoes_programacao enable row level security;

grant select on public.excecoes_programacao to anon, authenticated;
grant insert, update, delete on public.excecoes_programacao to authenticated;

create policy "Publico pode ler excecoes de programacao"
on public.excecoes_programacao
for select
to anon, authenticated
using (true);

create policy "Equipe autorizada pode ler excecoes de programacao"
on public.excecoes_programacao
for select
to authenticated
using (
  public.usuario_atual_tem_perfil(
    array['Admin', 'Leadership', 'Editor']::public.perfil_nome[]
  )
);

create policy "Editores podem gerenciar excecoes de programacao"
on public.excecoes_programacao
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
