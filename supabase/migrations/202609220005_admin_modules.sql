create type public.evento_status as enum (
  'RASCUNHO',
  'PUBLICADO',
  'ARQUIVADO'
);

create table public.categorias_evento (
  id uuid primary key default gen_random_uuid(),
  nome text not null unique,
  created_at timestamptz not null default now(),

  constraint categorias_evento_nome_tamanho check (
    char_length(nome) between 3 and 60
  )
);

insert into public.categorias_evento (nome)
values
  ('Culto'),
  ('Oração'),
  ('Jovens'),
  ('Famílias'),
  ('Crianças'),
  ('Comunidade')
on conflict (nome) do nothing;

create table public.eventos (
  id uuid primary key default gen_random_uuid(),
  categoria_id uuid references public.categorias_evento(id) on delete set null,
  titulo text not null,
  descricao text,
  inicio_em timestamptz not null,
  fim_em timestamptz,
  local text,
  status public.evento_status not null default 'RASCUNHO',
  publicado_em timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint eventos_titulo_tamanho check (
    char_length(titulo) between 3 and 120
  ),
  constraint eventos_descricao_tamanho check (
    descricao is null or char_length(descricao) <= 2000
  ),
  constraint eventos_local_tamanho check (
    local is null or char_length(local) <= 160
  ),
  constraint eventos_periodo_valido check (
    fim_em is null or fim_em >= inicio_em
  ),
  constraint eventos_publicacao_consistente check (
    (status = 'PUBLICADO' and publicado_em is not null)
    or status <> 'PUBLICADO'
  )
);

create table public.notificacoes (
  id uuid primary key default gen_random_uuid(),
  titulo text not null,
  mensagem text not null,
  tipo text not null default 'info',
  lida boolean not null default false,
  usuario_id uuid references public.usuarios(id) on delete cascade,
  entidade_tipo text,
  entidade_id uuid,
  created_at timestamptz not null default now(),

  constraint notificacoes_titulo_tamanho check (
    char_length(titulo) between 3 and 120
  ),
  constraint notificacoes_mensagem_tamanho check (
    char_length(mensagem) between 3 and 500
  ),
  constraint notificacoes_tipo_valido check (
    tipo in ('info', 'visitante', 'oracao', 'evento', 'sistema')
  )
);

create table public.logs_auditoria (
  id uuid primary key default gen_random_uuid(),
  usuario_id uuid references public.usuarios(id) on delete set null,
  entidade_tipo text not null,
  entidade_id uuid,
  acao text not null,
  resumo text,
  created_at timestamptz not null default now(),

  constraint logs_auditoria_entidade_tamanho check (
    char_length(entidade_tipo) between 3 and 80
  ),
  constraint logs_auditoria_acao_tamanho check (
    char_length(acao) between 3 and 80
  ),
  constraint logs_auditoria_resumo_tamanho check (
    resumo is null or char_length(resumo) <= 500
  )
);

create table public.configuracoes (
  chave text primary key,
  valor text not null,
  descricao text,
  publica boolean not null default false,
  updated_at timestamptz not null default now(),
  updated_by uuid references public.usuarios(id) on delete set null,

  constraint configuracoes_chave_formato check (
    chave ~ '^[a-z0-9_\\.]+$'
  ),
  constraint configuracoes_valor_tamanho check (
    char_length(valor) <= 2000
  ),
  constraint configuracoes_descricao_tamanho check (
    descricao is null or char_length(descricao) <= 300
  )
);

insert into public.configuracoes (chave, valor, descricao, publica)
values
  ('igreja.nome', 'IGREJA', 'Nome público da igreja.', true),
  ('igreja.endereco', 'Rua Exemplo, 123 - Centro', 'Endereço institucional.', true),
  ('igreja.whatsapp', '(11) 99999-9999', 'WhatsApp institucional.', true),
  ('igreja.email', 'contato@igreja.exemplo', 'E-mail institucional.', true),
  ('cultos.domingo', 'Domingos às 19:00', 'Horário principal de culto.', true)
on conflict (chave) do nothing;

create index eventos_inicio_status_idx
  on public.eventos (inicio_em desc, status);

create index notificacoes_usuario_lida_idx
  on public.notificacoes (usuario_id, lida, created_at desc);

create index logs_auditoria_created_at_idx
  on public.logs_auditoria (created_at desc);

create trigger eventos_set_updated_at
before update on public.eventos
for each row
execute function public.set_updated_at();

create or replace function public.set_configuracoes_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger configuracoes_set_updated_at
before update on public.configuracoes
for each row
execute function public.set_configuracoes_updated_at();

alter table public.categorias_evento enable row level security;
alter table public.eventos enable row level security;
alter table public.notificacoes enable row level security;
alter table public.logs_auditoria enable row level security;
alter table public.configuracoes enable row level security;

create policy "Equipe autorizada pode ler visitantes"
on public.visitantes
for select
to authenticated
using (
  public.usuario_atual_tem_perfil(
    array['Admin', 'Leadership', 'Reception']::public.perfil_nome[]
  )
);

create policy "Equipe autorizada pode atualizar visitantes"
on public.visitantes
for update
to authenticated
using (
  public.usuario_atual_tem_perfil(
    array['Admin', 'Leadership', 'Reception']::public.perfil_nome[]
  )
)
with check (
  public.usuario_atual_tem_perfil(
    array['Admin', 'Leadership', 'Reception']::public.perfil_nome[]
  )
);

create policy "Equipe autorizada pode ler categorias de evento"
on public.categorias_evento
for select
to authenticated
using (
  public.usuario_atual_tem_perfil(
    array['Admin', 'Leadership', 'Editor']::public.perfil_nome[]
  )
);

create policy "Editores podem gerenciar eventos"
on public.eventos
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

create policy "Lideranca pode ler eventos"
on public.eventos
for select
to authenticated
using (
  public.usuario_atual_tem_perfil(
    array['Leadership']::public.perfil_nome[]
  )
);

create policy "Usuario pode ler suas notificacoes"
on public.notificacoes
for select
to authenticated
using (
  usuario_id = auth.uid()
  or public.usuario_atual_tem_perfil(array['Admin']::public.perfil_nome[])
);

create policy "Admins podem gerenciar notificacoes"
on public.notificacoes
for all
to authenticated
using (public.usuario_atual_tem_perfil(array['Admin']::public.perfil_nome[]))
with check (public.usuario_atual_tem_perfil(array['Admin']::public.perfil_nome[]));

create policy "Admins podem ler auditoria"
on public.logs_auditoria
for select
to authenticated
using (public.usuario_atual_tem_perfil(array['Admin']::public.perfil_nome[]));

create policy "Sistema autenticado pode registrar auditoria"
on public.logs_auditoria
for insert
to authenticated
with check (
  usuario_id = auth.uid()
  and public.usuario_atual_tem_perfil(
    array['Admin', 'Leadership', 'Reception', 'Intercessor', 'Editor']::public.perfil_nome[]
  )
);

create policy "Admins podem gerenciar configuracoes"
on public.configuracoes
for all
to authenticated
using (public.usuario_atual_tem_perfil(array['Admin']::public.perfil_nome[]))
with check (public.usuario_atual_tem_perfil(array['Admin']::public.perfil_nome[]));

create policy "Equipe autenticada pode ler configuracoes"
on public.configuracoes
for select
to authenticated
using (
  publica is true
  or public.usuario_atual_tem_perfil(
    array['Admin', 'Leadership', 'Editor']::public.perfil_nome[]
  )
);
