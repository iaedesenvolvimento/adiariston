create policy "Equipe autorizada pode ler pedidos de oracao"
on public.pedidos_oracao
for select
to authenticated
using (
  public.usuario_atual_tem_perfil(
    array['Admin', 'Leadership', 'Intercessor']::public.perfil_nome[]
  )
);

create policy "Equipe autorizada pode atualizar pedidos de oracao"
on public.pedidos_oracao
for update
to authenticated
using (
  public.usuario_atual_tem_perfil(
    array['Admin', 'Leadership', 'Intercessor']::public.perfil_nome[]
  )
)
with check (
  public.usuario_atual_tem_perfil(
    array['Admin', 'Leadership', 'Intercessor']::public.perfil_nome[]
  )
);

create policy "Equipe autorizada pode ler historico de oracao"
on public.historico_oracao
for select
to authenticated
using (
  public.usuario_atual_tem_perfil(
    array['Admin', 'Leadership', 'Intercessor']::public.perfil_nome[]
  )
);

create policy "Equipe autorizada pode registrar historico de oracao"
on public.historico_oracao
for insert
to authenticated
with check (
  public.usuario_atual_tem_perfil(
    array['Admin', 'Leadership', 'Intercessor']::public.perfil_nome[]
  )
);

create policy "Equipe autorizada pode ler moderacoes de oracao"
on public.moderacoes_oracao
for select
to authenticated
using (
  public.usuario_atual_tem_perfil(
    array['Admin', 'Leadership', 'Intercessor']::public.perfil_nome[]
  )
);

create policy "Admin e intercessores podem atualizar moderacoes"
on public.moderacoes_oracao
for update
to authenticated
using (
  public.usuario_atual_tem_perfil(
    array['Admin', 'Intercessor']::public.perfil_nome[]
  )
)
with check (
  public.usuario_atual_tem_perfil(
    array['Admin', 'Intercessor']::public.perfil_nome[]
  )
);
