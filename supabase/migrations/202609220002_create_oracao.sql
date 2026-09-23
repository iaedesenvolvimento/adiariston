create type public.pedido_oracao_status as enum (
  'RECEBIDO',
  'EM_ORACAO',
  'ORADO',
  'ACOMPANHAMENTO',
  'ARQUIVADO'
);

create type public.pedido_oracao_visibilidade as enum (
  'PRIVADO',
  'COMPARTILHAVEL'
);

create type public.moderacao_oracao_status as enum (
  'PENDENTE',
  'APROVADO',
  'REJEITADO'
);

create table public.categorias_oracao (
  id uuid primary key default gen_random_uuid(),
  nome text not null unique,
  created_at timestamptz not null default now(),

  constraint categorias_oracao_nome_tamanho check (
    char_length(nome) between 3 and 40
  )
);

insert into public.categorias_oracao (nome)
values
  ('Saúde'),
  ('Família'),
  ('Finanças'),
  ('Espiritual'),
  ('Relacionamento'),
  ('Trabalho'),
  ('Luto'),
  ('Outros')
on conflict (nome) do nothing;

create table public.pedidos_oracao (
  id uuid primary key default gen_random_uuid(),
  nome text,
  email text,
  whatsapp text,
  pedido text not null,
  visibilidade public.pedido_oracao_visibilidade not null default 'PRIVADO',
  status public.pedido_oracao_status not null default 'RECEBIDO',
  categoria_sugerida text,
  mensagem_acolhimento text,
  requer_atencao_humana boolean not null default false,
  ia_processada_em timestamptz,
  ia_erro text,
  privacidade_aceita boolean not null,
  consentimento_compartilhamento_em timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint pedidos_oracao_nome_tamanho check (
    nome is null or char_length(nome) between 3 and 120
  ),
  constraint pedidos_oracao_email_tamanho check (
    email is null or char_length(email) between 5 and 254
  ),
  constraint pedidos_oracao_whatsapp_apenas_digitos check (
    whatsapp is null or whatsapp ~ '^[0-9]{10,11}$'
  ),
  constraint pedidos_oracao_pedido_tamanho check (
    char_length(pedido) between 10 and 2000
  ),
  constraint pedidos_oracao_categoria_sugerida_valida check (
    categoria_sugerida is null
    or categoria_sugerida in (
      'Saúde',
      'Família',
      'Finanças',
      'Espiritual',
      'Relacionamento',
      'Trabalho',
      'Luto',
      'Outros'
    )
  ),
  constraint pedidos_oracao_mensagem_acolhimento_tamanho check (
    mensagem_acolhimento is null
    or char_length(mensagem_acolhimento) <= 500
  ),
  constraint pedidos_oracao_ia_erro_tamanho check (
    ia_erro is null or char_length(ia_erro) <= 300
  ),
  constraint pedidos_oracao_privacidade_obrigatoria check (
    privacidade_aceita is true
  ),
  constraint pedidos_oracao_consentimento_compartilhavel check (
    (
      visibilidade = 'PRIVADO'
      and consentimento_compartilhamento_em is null
    )
    or (
      visibilidade = 'COMPARTILHAVEL'
      and consentimento_compartilhamento_em is not null
    )
  )
);

create table public.historico_oracao (
  id uuid primary key default gen_random_uuid(),
  pedido_id uuid not null references public.pedidos_oracao(id) on delete cascade,
  acao text not null,
  ator_tipo text not null default 'sistema',
  observacao text,
  created_at timestamptz not null default now(),

  constraint historico_oracao_acao_tamanho check (
    char_length(acao) between 3 and 80
  ),
  constraint historico_oracao_ator_tipo_valido check (
    ator_tipo in ('sistema', 'admin', 'intercessor')
  ),
  constraint historico_oracao_observacao_tamanho check (
    observacao is null or char_length(observacao) <= 300
  )
);

create table public.moderacoes_oracao (
  id uuid primary key default gen_random_uuid(),
  pedido_id uuid not null unique references public.pedidos_oracao(id) on delete cascade,
  status public.moderacao_oracao_status not null default 'PENDENTE',
  texto_publico text,
  moderado_por uuid,
  moderado_em timestamptz,
  observacao_interna text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint moderacoes_oracao_texto_publico_tamanho check (
    texto_publico is null or char_length(texto_publico) between 10 and 1000
  ),
  constraint moderacoes_oracao_observacao_tamanho check (
    observacao_interna is null or char_length(observacao_interna) <= 500
  ),
  constraint moderacoes_oracao_aprovacao_consistente check (
    (
      status = 'APROVADO'
      and texto_publico is not null
      and moderado_em is not null
    )
    or status <> 'APROVADO'
  )
);

create index pedidos_oracao_status_created_at_idx
  on public.pedidos_oracao (status, created_at desc);

create index pedidos_oracao_visibilidade_created_at_idx
  on public.pedidos_oracao (visibilidade, created_at desc);

create index historico_oracao_pedido_created_at_idx
  on public.historico_oracao (pedido_id, created_at desc);

create index moderacoes_oracao_status_created_at_idx
  on public.moderacoes_oracao (status, created_at desc);

create trigger pedidos_oracao_set_updated_at
before update on public.pedidos_oracao
for each row
execute function public.set_updated_at();

create trigger moderacoes_oracao_set_updated_at
before update on public.moderacoes_oracao
for each row
execute function public.set_updated_at();

alter table public.categorias_oracao enable row level security;
alter table public.pedidos_oracao enable row level security;
alter table public.historico_oracao enable row level security;
alter table public.moderacoes_oracao enable row level security;

create policy "Publico pode listar categorias de oracao"
on public.categorias_oracao
for select
to anon, authenticated
using (true);

create policy "Publico pode cadastrar pedido de oracao"
on public.pedidos_oracao
for insert
to anon, authenticated
with check (
  status = 'RECEBIDO'
  and privacidade_aceita is true
  and categoria_sugerida is null
  and mensagem_acolhimento is null
  and requer_atencao_humana is false
  and ia_processada_em is null
  and ia_erro is null
);

create policy "Sistema pode registrar historico inicial publico"
on public.historico_oracao
for insert
to anon, authenticated
with check (
  acao = 'PEDIDO_RECEBIDO'
  and ator_tipo = 'sistema'
);

create policy "Sistema pode criar moderacao pendente publica"
on public.moderacoes_oracao
for insert
to anon, authenticated
with check (
  status = 'PENDENTE'
  and texto_publico is null
  and moderado_por is null
  and moderado_em is null
);

create or replace function public.listar_mural_oracao()
returns table (
  id uuid,
  pedido_id uuid,
  texto_publico text,
  categoria text,
  publicado_em timestamptz
)
language sql
security definer
set search_path = public
as $$
  select
    mo.id,
    mo.pedido_id,
    mo.texto_publico,
    po.categoria_sugerida as categoria,
    mo.moderado_em as publicado_em
  from public.moderacoes_oracao mo
  inner join public.pedidos_oracao po on po.id = mo.pedido_id
  where
    po.visibilidade = 'COMPARTILHAVEL'
    and po.status <> 'ARQUIVADO'
    and mo.status = 'APROVADO'
    and mo.texto_publico is not null
  order by mo.moderado_em desc;
$$;

grant execute on function public.listar_mural_oracao()
to anon, authenticated;
