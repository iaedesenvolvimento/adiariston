# Projeto Igreja

Plataforma Next.js para site público, acolhimento de visitantes, pedidos de oração, administração interna e apoio de IA com Groq.

## Stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4
- Supabase
- Groq API
- Vitest
- Vercel

## Ambiente local

1. Instale dependências:

```bash
npm install
```

2. Crie `.env` a partir de `.env.example` e preencha as variáveis:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
GROQ_API_KEY=
GROQ_MODEL=openai/gpt-oss-20b
```

3. Rode o servidor:

```bash
npm run dev
```

4. Acesse:

```text
http://localhost:3000
```

## Verificações

Use a verificação completa antes de publicar:

```bash
npm run verify
```

Ou rode individualmente:

```bash
npm run lint
npm run typecheck
npm run test
npm run build
```

## Produção

O checklist de produção está em:

```text
docs/DEPLOYMENT.md
```

Após configurar as variáveis na Vercel e publicar, confira:

```text
/api/health
```

O endpoint deve retornar `status: "ok"` quando Supabase, Groq e service role estiverem configurados.

## Segurança

- Não commitar `.env` ou `.env.local`.
- Não expor `SUPABASE_SERVICE_ROLE_KEY` no cliente.
- Não expor `GROQ_API_KEY` no cliente.
- Dados sensíveis de oração e visitantes devem permanecer restritos ao admin autorizado.
