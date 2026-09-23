alter table public.metodos_contribuicao
  add column if not exists categoria text not null default 'oferta',
  add column if not exists tipo_chave_pix text,
  add column if not exists chave_pix text,
  add column if not exists pix_copia_cola text,
  add column if not exists favorecido text,
  add column if not exists instituicao text,
  add column if not exists updated_by uuid references public.usuarios(id) on delete set null;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'metodos_contribuicao_categoria_valida'
  ) then
    alter table public.metodos_contribuicao
      add constraint metodos_contribuicao_categoria_valida
      check (categoria in ('dizimo', 'oferta', 'outro'));
  end if;

  if not exists (
    select 1
    from pg_constraint
    where conname = 'metodos_contribuicao_tipo_chave_pix_valido'
  ) then
    alter table public.metodos_contribuicao
      add constraint metodos_contribuicao_tipo_chave_pix_valido
      check (
        tipo_chave_pix is null
        or tipo_chave_pix in ('cpf_cnpj', 'email', 'telefone', 'aleatoria')
      );
  end if;

  if not exists (
    select 1
    from pg_constraint
    where conname = 'metodos_contribuicao_chave_pix_tamanho'
  ) then
    alter table public.metodos_contribuicao
      add constraint metodos_contribuicao_chave_pix_tamanho
      check (chave_pix is null or char_length(chave_pix) <= 200);
  end if;

  if not exists (
    select 1
    from pg_constraint
    where conname = 'metodos_contribuicao_pix_copia_cola_tamanho'
  ) then
    alter table public.metodos_contribuicao
      add constraint metodos_contribuicao_pix_copia_cola_tamanho
      check (
        pix_copia_cola is null
        or char_length(pix_copia_cola) <= 2000
      );
  end if;

  if not exists (
    select 1
    from pg_constraint
    where conname = 'metodos_contribuicao_favorecido_tamanho'
  ) then
    alter table public.metodos_contribuicao
      add constraint metodos_contribuicao_favorecido_tamanho
      check (favorecido is null or char_length(favorecido) <= 160);
  end if;

  if not exists (
    select 1
    from pg_constraint
    where conname = 'metodos_contribuicao_instituicao_tamanho'
  ) then
    alter table public.metodos_contribuicao
      add constraint metodos_contribuicao_instituicao_tamanho
      check (instituicao is null or char_length(instituicao) <= 160);
  end if;
end;
$$;

update public.metodos_contribuicao
set
  chave_pix = coalesce(chave_pix, chave),
  tipo_chave_pix = coalesce(tipo_chave_pix, 'email'),
  favorecido = coalesce(favorecido, 'IGREJA')
where tipo = 'pix';

insert into public.metodos_contribuicao (
  titulo,
  descricao,
  tipo,
  categoria,
  tipo_chave_pix,
  chave,
  chave_pix,
  favorecido,
  instituicao,
  instrucoes,
  ativo,
  ordem
)
select
  'PIX para dízimos e ofertas',
  'Canal oficial para contribuições voluntárias da igreja.',
  'pix',
  'oferta',
  'email',
  'configure-a-chave-pix',
  'configure-a-chave-pix',
  'IGREJA',
  null,
  'Confira os dados do favorecido no aplicativo do banco antes de concluir a contribuição.',
  false,
  10
where not exists (
  select 1
  from public.metodos_contribuicao
  where tipo = 'pix'
);
