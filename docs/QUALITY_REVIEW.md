# Quality Review

## Segurança

- Segredos permanecem fora do cliente. O frontend usa apenas variáveis `NEXT_PUBLIC_*`.
- `SUPABASE_SERVICE_ROLE_KEY` não é usada no navegador.
- Rotas administrativas validam sessão e perfil no servidor.
- RLS cobre tabelas sensíveis criadas até esta fase.
- Pedidos de oração privados não são expostos ao mural.

## LGPD

- Consentimento de privacidade e autorização de contato seguem separados.
- Formulários coletam apenas dados necessários ao fluxo atual.
- Mensagens livres não são registradas em logs técnicos.
- O acesso administrativo é restrito por perfil.
- A política pública existe, mas ainda requer revisão jurídica antes de produção.

## Performance

- Páginas públicas estáticas continuam prerenderizadas onde possível.
- Rotas com sessão ou dados sensíveis permanecem dinâmicas.
- Fontes usam `next/font`.
- Estados globais de loading e erro foram adicionados para reduzir telas sem feedback.
