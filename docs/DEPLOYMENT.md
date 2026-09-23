# Deploy de produção

Este checklist prepara a publicação do projeto na Vercel com Supabase em produção.

## 1. Verificação local

Execute antes de publicar:

```bash
npm run verify
```

O comando roda:

- `npm run lint`
- `npm run typecheck`
- `npm run test`
- `npm run build`

## 2. Supabase produção

No projeto Supabase de produção:

1. Aplique as migrations em ordem:
   - `supabase/migrations/202609220001_create_visitantes.sql`
   - `supabase/migrations/202609220002_create_oracao.sql`
   - `supabase/migrations/202609220003_create_admin_auth.sql`
   - `supabase/migrations/202609220004_admin_oracao_policies.sql`
   - `supabase/migrations/202609220005_admin_modules.sql`
   - `supabase/migrations/202609220006_updated_content_modules.sql`
   - `supabase/migrations/202609220007_event_categories_seed.sql`
   - `supabase/migrations/202609220008_contributions_pix_mvp.sql`
   - `supabase/migrations/202609220009_create_transmissoes.sql`
   - `supabase/migrations/202609220010_weekly_schedule_exceptions.sql`
2. Crie o usuário administrativo no Supabase Auth.
3. Insira o usuário na tabela `usuarios`.
4. Vincule o perfil `Admin` em `usuarios_perfis`.
5. Faça login em `/login` e confirme acesso a `/admin`.

## 3. Variáveis na Vercel

Configure em Project Settings > Environment Variables:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
GROQ_API_KEY=
GROQ_MODEL=openai/gpt-oss-20b
```

Regras:

- `SUPABASE_SERVICE_ROLE_KEY` e `GROQ_API_KEY` são segredos de servidor.
- Nunca prefixe segredos com `NEXT_PUBLIC_`.
- Use valores do projeto Supabase/Groq de produção, não do ambiente local.

## 4. Deploy na Vercel

1. Conecte o repositório GitHub na Vercel.
2. Confirme o framework como Next.js.
3. Use o comando de build padrão:

```bash
npm run build
```

4. Publique o projeto.
5. Acesse `/api/health`.

Resultado esperado:

```json
{
  "status": "ok"
}
```

Se o status for `degraded`, alguma variável obrigatória não foi configurada.

## 5. Domínio

1. Adicione o domínio em Vercel > Domains.
2. Configure os registros DNS conforme a Vercel indicar.
3. Aguarde a emissão automática do SSL.
4. Teste:
   - `/`
   - `/visitante`
   - `/oracao`
   - `/contribua`
   - `/login`
   - `/admin`
   - `/api/health`

## 6. Testes finais em produção

Validar manualmente:

- Cadastro de visitante persiste no Supabase.
- Pedido de oração persiste antes do processamento de IA.
- Retentativa de IA funciona quando aplicável.
- Login administrativo redireciona corretamente para `/admin`.
- Admin consegue ver visitantes, pedidos, eventos e configurações.
- Eventos publicados aparecem em `/agenda`.
- Programação semanal e exceções aparecem em `/agenda` e na Home.
- Dados da igreja aparecem no site público.
- Apenas métodos de contribuição ativos aparecem em `/contribua`.
- Mural exibe somente pedidos aprovados.
- `/api/health` retorna `status: ok`.

## 7. Observabilidade inicial

Monitorar após o deploy:

- Vercel Runtime Logs.
- Supabase Logs.
- Respostas 4xx/5xx em rotas `/api/*`.
- Falhas de IA registradas nos pedidos de oração.
- Logs de auditoria em `logs_auditoria`.

Não registrar mensagens sensíveis completas em logs técnicos.
