insert into public.categorias_evento (nome)
values
  ('Reunião'),
  ('Ensaio'),
  ('Discipulado'),
  ('Célula'),
  ('Treinamento'),
  ('Conferência')
on conflict (nome) do nothing;
