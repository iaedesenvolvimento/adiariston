create table public.departamentos (
  id uuid primary key default gen_random_uuid(),
  nome text not null unique,
  descricao text,
  ativo boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint departamentos_nome_tamanho check (
    char_length(nome) between 3 and 80
  ),
  constraint departamentos_descricao_tamanho check (
    descricao is null or char_length(descricao) <= 500
  )
);

create table public.ministerios (
  id uuid primary key default gen_random_uuid(),
  departamento_id uuid references public.departamentos(id) on delete set null,
  nome text not null unique,
  descricao text,
  publico boolean not null default true,
  ativo boolean not null default true,
  ordem integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint ministerios_nome_tamanho check (
    char_length(nome) between 3 and 100
  ),
  constraint ministerios_descricao_tamanho check (
    descricao is null or char_length(descricao) <= 1000
  )
);

create table public.programacao_semanal (
  id uuid primary key default gen_random_uuid(),
  titulo text not null,
  dia_semana integer not null,
  horario time not null,
  local text,
  descricao text,
  publico boolean not null default true,
  ativo boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint programacao_semanal_titulo_tamanho check (
    char_length(titulo) between 3 and 100
  ),
  constraint programacao_semanal_dia_valido check (
    dia_semana between 0 and 6
  ),
  constraint programacao_semanal_local_tamanho check (
    local is null or char_length(local) <= 160
  ),
  constraint programacao_semanal_descricao_tamanho check (
    descricao is null or char_length(descricao) <= 1000
  )
);

create table public.avisos (
  id uuid primary key default gen_random_uuid(),
  titulo text not null,
  mensagem text not null,
  publico boolean not null default true,
  ativo boolean not null default true,
  publicado_em timestamptz,
  expira_em timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint avisos_titulo_tamanho check (
    char_length(titulo) between 3 and 120
  ),
  constraint avisos_mensagem_tamanho check (
    char_length(mensagem) between 3 and 1000
  ),
  constraint avisos_periodo_valido check (
    expira_em is null
    or publicado_em is null
    or expira_em >= publicado_em
  )
);

create table public.conteudos_site (
  chave text primary key,
  titulo text not null,
  conteudo text not null,
  publico boolean not null default true,
  updated_at timestamptz not null default now(),
  updated_by uuid references public.usuarios(id) on delete set null,

  constraint conteudos_site_chave_formato check (
    chave ~ '^[a-z0-9_\\.]+$'
  ),
  constraint conteudos_site_titulo_tamanho check (
    char_length(titulo) between 3 and 120
  ),
  constraint conteudos_site_conteudo_tamanho check (
    char_length(conteudo) between 3 and 4000
  )
);

create table public.dados_igreja (
  chave text primary key,
  valor text not null,
  publico boolean not null default true,
  updated_at timestamptz not null default now(),
  updated_by uuid references public.usuarios(id) on delete set null,

  constraint dados_igreja_chave_formato check (
    chave ~ '^[a-z0-9_\\.]+$'
  ),
  constraint dados_igreja_valor_tamanho check (
    char_length(valor) between 1 and 2000
  )
);

create table public.metodos_contribuicao (
  id uuid primary key default gen_random_uuid(),
  titulo text not null,
  descricao text,
  tipo text not null default 'pix',
  chave text,
  instrucoes text,
  ativo boolean not null default true,
  ordem integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint metodos_contribuicao_titulo_tamanho check (
    char_length(titulo) between 3 and 120
  ),
  constraint metodos_contribuicao_descricao_tamanho check (
    descricao is null or char_length(descricao) <= 500
  ),
  constraint metodos_contribuicao_tipo_valido check (
    tipo in ('pix', 'transferencia', 'dinheiro', 'outro')
  ),
  constraint metodos_contribuicao_chave_tamanho check (
    chave is null or char_length(chave) <= 200
  ),
  constraint metodos_contribuicao_instrucoes_tamanho check (
    instrucoes is null or char_length(instrucoes) <= 1000
  )
);

insert into public.departamentos (nome, descricao)
values
  ('Acolhimento', 'Cuidado com visitantes e integração de novas pessoas.'),
  ('Comunicação', 'Conteúdos, avisos e apoio à comunicação institucional.'),
  ('Ensino', 'Formação bíblica, estudos e discipulado.'),
  ('Serviço', 'Ações práticas de apoio à comunidade.')
on conflict (nome) do nothing;

insert into public.ministerios (nome, descricao, ordem)
values
  ('Recepção', 'Equipe responsável pelo acolhimento nos encontros.', 10),
  ('Intercessão', 'Equipe dedicada ao cuidado e aos pedidos de oração.', 20),
  ('Jovens', 'Comunhão, ensino e serviço com jovens.', 30),
  ('Crianças', 'Cuidado e ensino para crianças durante a programação.', 40)
on conflict (nome) do nothing;

insert into public.programacao_semanal (
  titulo,
  dia_semana,
  horario,
  local,
  descricao
)
values
  ('Culto de celebração', 0, '19:00', 'Templo principal', 'Encontro semanal de celebração, palavra e comunhão.'),
  ('Reunião de oração', 3, '20:00', 'Sala de oração', 'Tempo comunitário de intercessão e cuidado.')
on conflict do nothing;

insert into public.avisos (titulo, mensagem, publicado_em)
values
  ('Bem-vindo ao novo painel', 'Os avisos públicos e internos serão organizados neste módulo.', now())
on conflict do nothing;

insert into public.conteudos_site (chave, titulo, conteudo, publico)
values
  ('home.missao', 'Missão', 'Servir pessoas, formar discípulos e fortalecer vínculos de fé na comunidade.', true),
  ('sobre.resumo', 'Resumo institucional', 'Conteúdo institucional inicial para ser revisado pela equipe.', true)
on conflict (chave) do nothing;

insert into public.dados_igreja (chave, valor, publico)
values
  ('igreja.nome', 'IGREJA', true),
  ('igreja.endereco', 'Rua Exemplo, 123 - Centro', true),
  ('igreja.whatsapp', '(11) 99999-9999', true),
  ('igreja.email', 'contato@igreja.exemplo', true)
on conflict (chave) do nothing;

insert into public.metodos_contribuicao (
  titulo,
  descricao,
  tipo,
  chave,
  instrucoes,
  ativo,
  ordem
)
values
  (
    'PIX institucional',
    'Use este método somente após confirmar os dados oficiais com a liderança.',
    'pix',
    'configure-a-chave-pix',
    'Atualize esta chave no painel administrativo antes de divulgar publicamente.',
    false,
    10
  )
on conflict do nothing;

create index ministerios_ordem_nome_idx
  on public.ministerios (ordem, nome);

create index programacao_semanal_dia_horario_idx
  on public.programacao_semanal (dia_semana, horario);

create index avisos_publicacao_idx
  on public.avisos (publicado_em desc, ativo);

create index metodos_contribuicao_ordem_idx
  on public.metodos_contribuicao (ordem, ativo);

create trigger departamentos_set_updated_at
before update on public.departamentos
for each row
execute function public.set_updated_at();

create trigger ministerios_set_updated_at
before update on public.ministerios
for each row
execute function public.set_updated_at();

create trigger programacao_semanal_set_updated_at
before update on public.programacao_semanal
for each row
execute function public.set_updated_at();

create trigger avisos_set_updated_at
before update on public.avisos
for each row
execute function public.set_updated_at();

create trigger conteudos_site_set_updated_at
before update on public.conteudos_site
for each row
execute function public.set_updated_at();

create trigger dados_igreja_set_updated_at
before update on public.dados_igreja
for each row
execute function public.set_updated_at();

create trigger metodos_contribuicao_set_updated_at
before update on public.metodos_contribuicao
for each row
execute function public.set_updated_at();

alter table public.departamentos enable row level security;
alter table public.ministerios enable row level security;
alter table public.programacao_semanal enable row level security;
alter table public.avisos enable row level security;
alter table public.conteudos_site enable row level security;
alter table public.dados_igreja enable row level security;
alter table public.metodos_contribuicao enable row level security;

grant select on public.departamentos to anon, authenticated;
grant select on public.ministerios to anon, authenticated;
grant select on public.programacao_semanal to anon, authenticated;
grant select on public.avisos to anon, authenticated;
grant select on public.conteudos_site to anon, authenticated;
grant select on public.dados_igreja to anon, authenticated;
grant select on public.metodos_contribuicao to anon, authenticated;

grant insert, update, delete on public.departamentos to authenticated;
grant insert, update, delete on public.ministerios to authenticated;
grant insert, update, delete on public.programacao_semanal to authenticated;
grant insert, update, delete on public.avisos to authenticated;
grant insert, update, delete on public.conteudos_site to authenticated;
grant insert, update, delete on public.dados_igreja to authenticated;
grant insert, update, delete on public.metodos_contribuicao to authenticated;

create policy "Publico pode ler ministerios publicados"
on public.ministerios
for select
to anon, authenticated
using (publico is true and ativo is true);

create policy "Publico pode ler programacao publicada"
on public.programacao_semanal
for select
to anon, authenticated
using (publico is true and ativo is true);

create policy "Publico pode ler avisos publicados"
on public.avisos
for select
to anon, authenticated
using (
  publico is true
  and ativo is true
  and (publicado_em is null or publicado_em <= now())
  and (expira_em is null or expira_em >= now())
);

create policy "Publico pode ler conteudos publicados"
on public.conteudos_site
for select
to anon, authenticated
using (publico is true);

create policy "Publico pode ler dados publicados"
on public.dados_igreja
for select
to anon, authenticated
using (publico is true);

create policy "Publico pode ler metodos ativos"
on public.metodos_contribuicao
for select
to anon, authenticated
using (ativo is true);

create policy "Equipe autorizada pode ler departamentos"
on public.departamentos
for select
to authenticated
using (
  public.usuario_atual_tem_perfil(
    array['Admin', 'Leadership', 'Editor']::public.perfil_nome[]
  )
);

create policy "Equipe autorizada pode ler ministerios"
on public.ministerios
for select
to authenticated
using (
  public.usuario_atual_tem_perfil(
    array['Admin', 'Leadership', 'Editor']::public.perfil_nome[]
  )
);

create policy "Equipe autorizada pode ler programacao semanal"
on public.programacao_semanal
for select
to authenticated
using (
  public.usuario_atual_tem_perfil(
    array['Admin', 'Leadership', 'Editor']::public.perfil_nome[]
  )
);

create policy "Equipe autorizada pode ler avisos"
on public.avisos
for select
to authenticated
using (
  public.usuario_atual_tem_perfil(
    array['Admin', 'Leadership', 'Editor']::public.perfil_nome[]
  )
);

create policy "Equipe autorizada pode ler conteudos"
on public.conteudos_site
for select
to authenticated
using (
  public.usuario_atual_tem_perfil(
    array['Admin', 'Leadership', 'Editor']::public.perfil_nome[]
  )
);

create policy "Equipe autorizada pode ler dados da igreja"
on public.dados_igreja
for select
to authenticated
using (
  public.usuario_atual_tem_perfil(
    array['Admin', 'Leadership', 'Editor']::public.perfil_nome[]
  )
);

create policy "Equipe autorizada pode ler contribuicoes"
on public.metodos_contribuicao
for select
to authenticated
using (
  public.usuario_atual_tem_perfil(
    array['Admin', 'Leadership']::public.perfil_nome[]
  )
);

create policy "Editores podem gerenciar departamentos"
on public.departamentos
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

create policy "Editores podem gerenciar ministerios"
on public.ministerios
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

create policy "Editores podem gerenciar programacao semanal"
on public.programacao_semanal
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

create policy "Editores podem gerenciar avisos"
on public.avisos
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

create policy "Editores podem gerenciar conteudos"
on public.conteudos_site
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

create policy "Admins podem gerenciar dados da igreja"
on public.dados_igreja
for all
to authenticated
using (public.usuario_atual_tem_perfil(array['Admin']::public.perfil_nome[]))
with check (public.usuario_atual_tem_perfil(array['Admin']::public.perfil_nome[]));

create policy "Admins podem gerenciar contribuicoes"
on public.metodos_contribuicao
for all
to authenticated
using (public.usuario_atual_tem_perfil(array['Admin']::public.perfil_nome[]))
with check (public.usuario_atual_tem_perfil(array['Admin']::public.perfil_nome[]));
