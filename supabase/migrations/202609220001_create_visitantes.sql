create type public.visitante_status as enum (
  'NOVO',
  'AGUARDANDO_CONTATO',
  'CONTATADO',
  'EM_ACOMPANHAMENTO',
  'INTEGRADO'
);

create table public.visitantes (
  id uuid primary key default gen_random_uuid(),
  nome_completo text not null,
  whatsapp text not null,
  email text not null,
  origem text not null,
  mensagem text,
  permite_contato boolean not null default false,
  privacidade_aceita boolean not null,
  status public.visitante_status not null default 'NOVO',
  consentimento_privacidade_em timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint visitantes_nome_completo_tamanho check (
    char_length(nome_completo) between 3 and 120
  ),
  constraint visitantes_whatsapp_apenas_digitos check (
    whatsapp ~ '^[0-9]{10,11}$'
  ),
  constraint visitantes_email_tamanho check (
    char_length(email) between 5 and 254
  ),
  constraint visitantes_origem_valida check (
    origem in ('amigo', 'instagram', 'youtube', 'google', 'outro')
  ),
  constraint visitantes_mensagem_tamanho check (
    mensagem is null or char_length(mensagem) <= 1000
  ),
  constraint visitantes_privacidade_obrigatoria check (
    privacidade_aceita is true
  )
);

create index visitantes_status_created_at_idx
  on public.visitantes (status, created_at desc);

create index visitantes_email_idx
  on public.visitantes (lower(email));

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger visitantes_set_updated_at
before update on public.visitantes
for each row
execute function public.set_updated_at();

alter table public.visitantes enable row level security;

create policy "Publico pode cadastrar visitante"
on public.visitantes
for insert
to anon, authenticated
with check (
  status = 'NOVO'
  and privacidade_aceita is true
);
