create type public.perfil_nome as enum (
  'Admin',
  'Leadership',
  'Reception',
  'Intercessor',
  'Editor'
);

create table public.usuarios (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  nome text,
  ativo boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint usuarios_email_tamanho check (
    char_length(email) between 5 and 254
  ),
  constraint usuarios_nome_tamanho check (
    nome is null or char_length(nome) between 2 and 120
  )
);

create table public.perfis (
  id uuid primary key default gen_random_uuid(),
  nome public.perfil_nome not null unique,
  descricao text not null,
  created_at timestamptz not null default now()
);

insert into public.perfis (nome, descricao)
values
  ('Admin', 'Administração global, usuários, permissões, auditoria e configurações.'),
  ('Leadership', 'Visão gerencial e acompanhamento conforme políticas definidas.'),
  ('Reception', 'Acolhimento e acompanhamento de visitantes.'),
  ('Intercessor', 'Pedidos de oração autorizados, histórico e intercessão.'),
  ('Editor', 'Conteúdo institucional, eventos e páginas autorizadas.')
on conflict (nome) do nothing;

create table public.usuarios_perfis (
  usuario_id uuid not null references public.usuarios(id) on delete cascade,
  perfil_id uuid not null references public.perfis(id) on delete cascade,
  atribuido_em timestamptz not null default now(),
  atribuido_por uuid references public.usuarios(id) on delete set null,
  primary key (usuario_id, perfil_id)
);

create index usuarios_perfis_perfil_id_idx
  on public.usuarios_perfis (perfil_id);

create trigger usuarios_set_updated_at
before update on public.usuarios
for each row
execute function public.set_updated_at();

create or replace function public.criar_usuario_auth()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.usuarios (id, email, nome)
  values (
    new.id,
    coalesce(new.email, ''),
    nullif(new.raw_user_meta_data->>'name', '')
  )
  on conflict (id) do update
  set
    email = excluded.email,
    nome = coalesce(public.usuarios.nome, excluded.nome),
    updated_at = now();

  return new;
end;
$$;

create trigger auth_users_criar_usuario
after insert or update on auth.users
for each row
execute function public.criar_usuario_auth();

create or replace function public.usuario_atual_tem_perfil(
  perfis_necessarios public.perfil_nome[]
)
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.usuarios u
    inner join public.usuarios_perfis up on up.usuario_id = u.id
    inner join public.perfis p on p.id = up.perfil_id
    where
      u.id = auth.uid()
      and u.ativo is true
      and p.nome = any(perfis_necessarios)
  );
$$;

alter table public.usuarios enable row level security;
alter table public.perfis enable row level security;
alter table public.usuarios_perfis enable row level security;

create policy "Usuario autenticado pode ler seus dados"
on public.usuarios
for select
to authenticated
using (id = auth.uid());

create policy "Admins podem ler usuarios"
on public.usuarios
for select
to authenticated
using (public.usuario_atual_tem_perfil(array['Admin']::public.perfil_nome[]));

create policy "Usuario autenticado pode listar perfis"
on public.perfis
for select
to authenticated
using (true);

create policy "Usuario autenticado pode ler seus perfis"
on public.usuarios_perfis
for select
to authenticated
using (usuario_id = auth.uid());

create policy "Admins podem ler usuarios_perfis"
on public.usuarios_perfis
for select
to authenticated
using (public.usuario_atual_tem_perfil(array['Admin']::public.perfil_nome[]));
