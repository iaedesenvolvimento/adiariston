# PROJECT_INSTRUCTIONS.md

> **Especificação mestre do Projeto Igreja para agentes/LLMs de
> desenvolvimento**
>
> Este documento é a fonte principal de instruções de implementação.
> Antes de alterar o projeto, leia-o completamente, inspecione o código
> existente e preserve tudo que já funciona.

------------------------------------------------------------------------

## 1. Identidade e visão do produto

Construir uma **plataforma digital de acolhimento, comunicação e gestão
de relacionamento da igreja**, responsiva e preparada para evolução.

O produto não deve ser tratado apenas como um site institucional. O
sistema reúne experiência pública, acolhimento de visitantes, agenda,
pedidos de oração, acompanhamento interno, administração e apoio de IA.

### Objetivos

-   Apresentar a igreja e suas atividades.
-   Facilitar o acesso à programação e aos ministérios.
-   Acolher e registrar visitantes.
-   Receber e acompanhar pedidos de oração.
-   Permitir acompanhamento humano organizado.
-   Centralizar eventos e informações administrativas.
-   Oferecer painel administrativo com controle de acesso.
-   Utilizar IA como apoio, nunca como autoridade pastoral.
-   Respeitar segurança, privacidade e princípios da LGPD.

------------------------------------------------------------------------

## 2. Stack obrigatória

Manter esta stack salvo decisão explícita do responsável pelo projeto:

-   **Frontend/full stack:** Next.js
-   **UI:** React
-   **Linguagem:** TypeScript
-   **Estilização:** Tailwind CSS 4
-   **Banco:** PostgreSQL via Supabase
-   **Autenticação:** Supabase Auth
-   **IA:** Gemini API
-   **Deploy:** Vercel
-   **Versionamento:** Git + GitHub
-   **Design/prototipação:** Figma

### Versões atuais conhecidas

-   Next.js: 16.3.6
-   Tailwind CSS: 4.3.3
-   `@tailwindcss/postcss` em uso

Não fazer downgrade ou trocar a stack sem solicitação explícita.

------------------------------------------------------------------------

## 3. Estado atual do projeto

A aplicação Next.js já foi criada e utiliza a pasta `src/`.

Estrutura esperada:

``` text
projeto-igreja/
├── PROJECT_INSTRUCTIONS.md
├── README.md
├── package.json
├── tsconfig.json
├── public/
└── src/
    ├── app/
    ├── components/
    │   ├── ui/
    │   ├── layout/
    │   └── sections/
    ├── lib/
    ├── services/
    ├── types/
    └── utils/
```

O alias TypeScript está configurado para:

``` json
{
  "paths": {
    "@/*": ["./src/*"]
  }
}
```

### Já implementado

-   Estrutura base Next.js.
-   Tailwind CSS 4.
-   Design tokens iniciais.
-   Header.
-   Footer.
-   Home pública.
-   Hero.
-   Próximo culto.
-   Próximos eventos.
-   Seção sobre a comunidade.
-   Ministérios.
-   CTA de oração.
-   Localização.
-   Componentes UI iniciais.
-   Página `/visitante`.
-   Formulário de visitante.
-   Estado React do formulário.
-   Máscara de WhatsApp.
-   Validação de formulário.
-   Validação de e-mail.
-   Mensagens de erro.
-   Consentimento de privacidade.
-   Feedback local de sucesso.
-   Limpeza do formulário após sucesso.

### Ainda não implementado/concluído

-   Supabase.
-   Banco de dados real.
-   RLS.
-   Persistência de visitantes.
-   Agenda completa.
-   Detalhes de eventos.
-   Página completa de ministérios.
-   Pedido de oração.
-   Mural moderado de oração.
-   Contato.
-   Política de privacidade final.
-   Login administrativo.
-   Dashboard.
-   Gestão de visitantes.
-   Gestão de pedidos de oração.
-   Gestão de eventos.
-   Usuários e permissões.
-   Notificações.
-   Auditoria.
-   Configurações.
-   Gemini.
-   Testes abrangentes.
-   Deploy final.

------------------------------------------------------------------------

## 4. Design System

A interface deve transmitir:

-   acolhimento;
-   contemporaneidade;
-   humanidade;
-   clareza;
-   confiança.

Evitar aparência excessivamente corporativa, excesso de elementos
religiosos decorativos e poluição visual.

### Cores

``` text
Primary 900     #172554
Primary 700     #1D4ED8
Primary 600     #2563EB
Primary 100     #DBEAFE

Accent          #D4A853

Background      #F8FAFC
Surface         #FFFFFF

Text Primary    #0F172A
Text Secondary  #64748B

Border          #E2E8F0

Success         #15803D
Warning         #B45309
Error           #B91C1C
```

### Espaçamento

Escala preferencial:

``` text
4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96
```

### Border radius

``` text
small    6px
default  10px
large    16px
xlarge   24px
full     999px
```

### Sombras

Manter níveis consistentes para:

-   elementos pequenos;
-   cards;
-   modais.

### Tipografia

Direção planejada: **Inter**.

O projeto atual pode ainda utilizar Arial/Helvetica globalmente. Não
realizar mudança ampla de tipografia sem verificar impactos.

### Responsividade

Implementar mobile-first.

As páginas devem funcionar adequadamente em:

-   celular;
-   tablet;
-   notebook;
-   desktop.

------------------------------------------------------------------------

## 5. Tailwind CSS 4

O projeto utiliza `@theme`.

Tokens atuais:

``` css
@import "tailwindcss";

@theme {
  --color-primary-900: #172554;
  --color-primary-700: #1d4ed8;
  --color-primary-600: #2563eb;
  --color-primary-100: #dbeafe;

  --color-accent: #d4a853;

  --color-background: #f8fafc;
  --color-surface: #ffffff;

  --color-text-primary: #0f172a;
  --color-text-secondary: #64748b;

  --color-border-default: #e2e8f0;

  --color-success: #15803d;
  --color-warning: #b45309;
  --color-error: #b91c1c;

  --radius-sm: 6px;
  --radius-md: 10px;
  --radius-lg: 16px;
  --radius-xl: 24px;

  --shadow-sm: 0 1px 2px rgb(15 23 42 / 0.05);
  --shadow-card: 0 4px 16px rgb(15 23 42 / 0.08);
  --shadow-modal: 0 20px 40px rgb(15 23 42 / 0.15);
}
```

Preferir classes canônicas do Tailwind 4 quando disponíveis.

------------------------------------------------------------------------

## 6. Componentes reutilizáveis

Antes de criar um componente novo, verificar se existe um equivalente.

### UI prevista

-   Button
-   Input
-   Textarea
-   Select
-   Checkbox
-   Radio
-   Badge
-   Chip
-   Card
-   EventCard
-   PrayerCard
-   StatCard
-   Table
-   Modal
-   Drawer
-   Toast
-   Alert
-   Pagination
-   EmptyState
-   Loading/Skeleton

### Layout

-   Header
-   Navbar
-   Sidebar
-   Footer

### Button

Variantes:

-   primary
-   secondary
-   ghost
-   destructive

Estados:

-   default
-   hover
-   pressed
-   focus
-   disabled
-   loading

### Campos

Estados:

-   default
-   focus
-   filled
-   error
-   disabled

Não duplicar estilização se ela puder ser encapsulada nos componentes
existentes.

------------------------------------------------------------------------

## 7. Rotas públicas

Rotas planejadas:

``` text
/
 /sobre
 /agenda
 /agenda/[id]
 /ministerios
 /contribua
 /visitante
 /oracao
 /oracao/mural
 /contato
 /privacidade
 /login
```

### Home

Deve apresentar de forma organizada:

1.  Header.
2.  Hero.
3.  Próximo culto.
4.  Próximos eventos.
5.  Sobre a comunidade.
6.  Ministérios.
7.  CTA de pedido de oração.
8.  Localização.
9.  Footer.

Informações como endereço, horários e outros dados institucionais não
devem permanecer hardcoded indefinidamente. Devem migrar para
configurações/banco quando o backend estiver disponível.

------------------------------------------------------------------------

## 8. Módulo Visitantes

### Página

``` text
/visitante
```

Objetivo: acolher uma pessoa que visitou ou deseja se aproximar da
comunidade.

### Campos atuais

-   Nome completo.
-   WhatsApp.
-   E-mail.
-   Como conheceu a igreja.
-   Mensagem opcional.
-   Autorização opcional para contato.
-   Aceite da Política de Privacidade.

### Validações atuais

-   Nome obrigatório.
-   WhatsApp obrigatório.
-   WhatsApp com DDD e 10 ou 11 dígitos.
-   Máscara visual de telefone.
-   E-mail obrigatório e válido.
-   Origem obrigatória.
-   Política de Privacidade obrigatória.
-   Autorização de contato **não é obrigatória**.

### Regra importante

Consentimento para contato e aceite da Política de Privacidade não devem
ser tratados como a mesma coisa.

### Status de acompanhamento

Usar:

``` text
NOVO
AGUARDANDO_CONTATO
CONTATADO
EM_ACOMPANHAMENTO
INTEGRADO
```

Novos registros devem iniciar em `NOVO`, salvo regra futura
explicitamente definida.

### Persistência

O frontend atualmente apresenta apenas sucesso local.

Quando Supabase estiver conectado:

1.  validar no cliente para UX;
2.  validar novamente no servidor;
3.  persistir no banco;
4.  retornar resultado real;
5.  somente então exibir confirmação de cadastro persistido.

Nunca considerar validação client-side como mecanismo de segurança.

------------------------------------------------------------------------

## 9. Módulo de oração

### Rotas

``` text
/oracao
/oracao/mural
```

### Objetivos

-   Receber pedidos de oração.
-   Preservar pedidos privados.
-   Permitir compartilhamento somente quando autorizado.
-   Moderar qualquer conteúdo antes de aparecer publicamente.
-   Permitir acompanhamento por intercessores autorizados.

### Status

``` text
RECEBIDO
EM_ORACAO
ORADO
ACOMPANHAMENTO
ARQUIVADO
```

### Visibilidade

``` text
PRIVADO
COMPARTILHAVEL
```

`COMPARTILHAVEL` não significa publicação automática.

Fluxo:

``` text
pedido
→ autorização de compartilhamento
→ moderação
→ aprovação
→ mural
```

Pedidos privados nunca devem aparecer no mural.

------------------------------------------------------------------------

## 10. Gemini / Inteligência Artificial

A IA é um recurso de **apoio**, não uma autoridade pastoral, médica,
psicológica, jurídica ou espiritual.

### Responsabilidades permitidas

-   sugerir categoria do pedido;
-   gerar mensagem curta e acolhedora;
-   produzir apoio/devocional breve;
-   sinalizar possível necessidade de atenção humana.

### Categorias previstas

``` text
Saúde
Família
Finanças
Espiritual
Relacionamento
Trabalho
Luto
Outros
```

### Fluxo obrigatório

A ordem é crítica:

``` text
1. receber solicitação
2. validar
3. SALVAR O PEDIDO
4. chamar Gemini
5. receber categoria/mensagem/sinalização
6. atualizar o registro
```

**Nunca chamar a IA antes de garantir o salvamento do pedido.**

Se Gemini falhar:

``` text
pedido continua salvo
→ registrar falha técnica apropriada
→ processamento pode ser repetido posteriormente
```

Falha de IA não pode causar perda do pedido.

### Segurança

-   Gemini API Key somente no servidor.
-   Nunca colocar segredo em Client Component.
-   Não enviar dados desnecessários para a IA.
-   Minimizar dados pessoais no prompt.
-   Não permitir que texto gerado pela IA publique automaticamente
    conteúdo privado.

### Atenção humana

Qualquer sinalização da IA deve ser tratada como apoio de triagem, não
diagnóstico.

Situações potencialmente graves devem ser encaminhadas para revisão
humana conforme políticas futuras do projeto.

------------------------------------------------------------------------

## 11. Administração

Rotas previstas:

``` text
/admin
/admin/visitantes
/admin/visitantes/[id]
/admin/oracao
/admin/oracao/[id]
/admin/oracao/moderacao
/admin/eventos
/admin/eventos/novo
/admin/eventos/[id]
/admin/agenda-semanal
/admin/avisos
/admin/conteudo
/admin/ministerios
/admin/contribuicoes
/admin/dados-igreja
/admin/usuarios
/admin/usuarios/[id]
/admin/notificacoes
/admin/auditoria
/admin/configuracoes
```

O `/admin` deve ser protegido.

Não confiar apenas em ocultar links no frontend.

Autorização deve ser validada no servidor e apoiada por RLS no banco.

------------------------------------------------------------------------

## 12. Perfis e permissões

Perfis planejados:

``` text
Admin
Leadership
Reception
Intercessor
Editor
```

### Direção geral

**Admin** - administração global; - usuários; - configurações; -
permissões; - auditoria.

**Leadership** - visão gerencial; - acompanhamento; - acesso conforme
políticas definidas.

**Reception** - visitantes; - acompanhamento de visitantes.

**Intercessor** - pedidos de oração autorizados; - histórico de
oração; - ações pertinentes à intercessão.

**Editor** - conteúdo institucional; - eventos; - páginas/conteúdo
autorizado.

Implementar princípio do menor privilégio.

Não assumir que todo usuário autenticado pode acessar todos os
registros.

------------------------------------------------------------------------

## 13. Modelo de dados conceitual

Tabelas previstas:

``` text
usuarios
perfis
usuarios_perfis

visitantes
acompanhamentos

departamentos
ministerios

programacao_semanal
categorias_evento
eventos
avisos
conteudos_site
dados_igreja
metodos_contribuicao

categorias_oracao
pedidos_oracao
historico_oracao
moderacoes_oracao

notificacoes
logs_auditoria

configuracoes
```

A LLM pode detalhar colunas, índices, constraints e relacionamentos
durante a implementação, desde que preserve este modelo conceitual e as
regras deste documento.

### Diretrizes

Usar:

-   UUID quando adequado;
-   timestamps;
-   foreign keys;
-   constraints;
-   índices para consultas relevantes;
-   enums PostgreSQL ou constraints quando trouxerem clareza;
-   migrations versionadas.

Evitar campos genéricos sem necessidade.

------------------------------------------------------------------------

## 14. Supabase

Supabase será responsável por:

-   PostgreSQL;
-   autenticação;
-   políticas RLS;
-   recursos de backend adequados ao projeto.

### Regras

-   Habilitar RLS nas tabelas sensíveis.
-   Criar policies explícitas.
-   Não usar `service_role` no navegador.
-   Não confiar no ID enviado pelo cliente para autorização.
-   Validar sessão e permissões no servidor.
-   Variáveis públicas só podem conter valores realmente públicos.
-   Segredos ficam somente no ambiente do servidor.

### Cadastro público

Cadastros públicos como visitantes e oração exigem proteção contra
abuso.

Planejar:

-   validação;
-   rate limiting;
-   CAPTCHA/Turnstile ou solução equivalente quando necessário;
-   limites de tamanho;
-   sanitização/escape adequado na apresentação;
-   logs sem exposição desnecessária de dados pessoais.

------------------------------------------------------------------------

## 15. Segurança

Segurança é requisito de arquitetura, não etapa opcional posterior.

### Obrigatório

-   validação server-side;
-   autenticação server-side;
-   autorização server-side;
-   RLS;
-   proteção de secrets;
-   rate limiting para endpoints públicos;
-   auditoria de ações administrativas importantes;
-   tratamento seguro de erros;
-   não retornar stack traces ao usuário;
-   evitar exposição de dados pessoais em logs;
-   dependências mantidas atualizadas com cautela.

### Nunca

-   colocar `SUPABASE_SERVICE_ROLE_KEY` no frontend;
-   colocar Gemini API Key no frontend;
-   confiar em role enviada pelo navegador;
-   liberar tabela sensível com policy genérica;
-   usar `dangerouslySetInnerHTML` com conteúdo não confiável sem
    tratamento apropriado;
-   registrar pedidos privados completos em logs técnicos.

------------------------------------------------------------------------

## 16. LGPD e privacidade

O projeto lida com dados pessoais e potencialmente com informações
sensíveis presentes em mensagens livres.

Aplicar:

-   finalidade clara;
-   minimização;
-   transparência;
-   controle de acesso;
-   retenção definida;
-   possibilidade de correção/eliminação quando aplicável;
-   registro de consentimentos quando necessário;
-   política de privacidade acessível;
-   processo de anonimização/exclusão;
-   cuidado especial com pedidos de oração.

Não coletar dados "porque podem ser úteis no futuro".

------------------------------------------------------------------------

## 17. Auditoria

A tabela `logs_auditoria` deve permitir rastrear ações administrativas
relevantes, como:

-   alteração de status;
-   moderação;
-   mudança de permissões;
-   edição/exclusão relevante;
-   alterações de configurações.

O log deve priorizar:

``` text
quem
o quê
quando
entidade afetada
ação
```

Não armazenar conteúdo sensível completo quando não for necessário.

------------------------------------------------------------------------

## 18. Notificações

O sistema deve ser preparado para notificações relacionadas a:

-   novos visitantes;
-   necessidade de acompanhamento;
-   novos pedidos de oração;
-   moderação;
-   eventos/ações administrativas relevantes.

A primeira versão pode utilizar notificações internas. Canais externos
devem ser adicionados somente quando definidos.

------------------------------------------------------------------------

## 19. Eventos e agenda

O módulo deve permitir:

-   listar eventos;
-   visualizar detalhes;
-   filtrar quando aplicável;
-   criar/editar eventos no admin;
-   categorizar eventos;
-   definir data/horário;
-   local;
-   descrição;
-   status/publicação.

Rotas:

``` text
/agenda
/agenda/[id]

/admin/eventos
/admin/eventos/novo
/admin/eventos/[id]
```

Não deixar os eventos da Home permanentemente hardcoded.

------------------------------------------------------------------------

## 19A. Programação semanal administrável

A programação semanal recorrente deve ser separada dos eventos
especiais. O administrador autorizado deve poder criar, editar, ordenar,
publicar, ativar e desativar compromissos recorrentes, definindo dia da
semana, horário, título, local, ministério/departamento responsável e
período de validade quando necessário.

Rota administrativa:

``` text
/admin/agenda-semanal
```

As alterações publicadas devem refletir automaticamente na Home e na
Agenda pública, sem alteração de código.

------------------------------------------------------------------------

## 19B. Contribuições --- dízimos e ofertas

Criar as rotas:

``` text
/contribua
/admin/contribuicoes
```

### Objetivo do MVP

Disponibilizar de forma simples e voluntária os meios oficiais da igreja
para dízimos, ofertas e outras contribuições autorizadas.

O MVP deve priorizar **PIX configurável pelo administrador**, sem
transformar a aplicação em processadora financeira.

### Fluxo público

``` text
Usuário acessa /contribua
        ↓
Visualiza mensagem institucional
        ↓
Escolhe, quando aplicável:
Dízimo | Oferta | Outro
        ↓
Visualiza PIX ativo
        ↓
QR Code + PIX Copia e Cola
        ↓
Abre o aplicativo bancário
        ↓
Realiza a contribuição fora da aplicação
```

A geração ou exibição de um PIX **não significa pagamento confirmado**.

### Interface pública

A página pode apresentar:

``` text
CONTRIBUA

Dízimos e ofertas

[ Dízimo ] [ Oferta ] [ Outro ]

PIX

[ QR CODE ]

Chave PIX
financeiro@igreja.com
[ Copiar chave ]

PIX Copia e Cola
[ código... ]
[ Copiar código ]

Favorecido
Nome da Igreja

[ instruções institucionais ]

A contribuição é voluntária.
```

Os dados reais devem vir do banco/configuração.

### Configuração PIX

O administrador deve poder configurar:

-   status ativo/inativo;
-   tipo da chave PIX;
-   chave PIX;
-   favorecido;
-   instituição, quando aplicável;
-   instruções;
-   título/texto público;
-   ordem de exibição.

Tipos de chave podem incluir, conforme o uso real:

``` text
CPF/CNPJ
E-mail
Telefone
Chave aleatória
```

Não hardcodar chave PIX ou dados bancários em componentes React. A
configuração persistida é a fonte de verdade.

Quando tecnicamente apropriado, o QR Code deve ser gerado a partir de um
payload PIX válido. Uma imagem de QR Code enviada manualmente não deve
ser a fonte principal dos dados.

### Valor

O MVP não precisa obrigar o usuário a informar um valor.

Se for oferecido um valor opcional para gerar um payload PIX:

-   aceitar somente valor monetário válido;
-   não tratar PIX gerado como pagamento recebido;
-   não criar registro com status `PAGO` sem confirmação financeira
    real.

### Privacidade

Não exigir identificação do contribuinte quando ela não for necessária.

Evitar coletar no MVP nome, CPF, telefone, e-mail ou comprovante apenas
para permitir uma contribuição PIX.

As categorias `Dízimo`, `Oferta` e `Outro` podem ser informativas sem
gerar histórico financeiro nominal.

### Modelo de dados do MVP

``` text
metodos_contribuicao

id
tipo
titulo
tipo_chave_pix
chave_pix
favorecido
instituicao
instrucoes
ativo
ordem
created_at
updated_at
updated_by
```

A modelagem final pode ajustar nomes e tipos, preservando essas
responsabilidades.

### RLS e autorização

O público pode consultar apenas métodos ativos destinados à exibição
pública.

Somente administradores autorizados podem criar, editar,
ativar/desativar ou excluir quando permitido.

Aplicar RLS e autorização server-side. Não confiar apenas em ocultar a
rota administrativa.

### Auditoria

Alterações nos métodos de contribuição devem gerar auditoria contendo
administrador responsável, ação, registro afetado e data/hora.

### Segurança financeira

Nunca:

-   armazenar senha bancária;
-   armazenar credenciais de internet banking;
-   solicitar senha bancária ao usuário;
-   coletar cartão diretamente sem provedor adequado;
-   implementar processamento improvisado de cartão;
-   considerar geração de QR Code como confirmação de pagamento;
-   aceitar confirmação enviada pelo navegador como prova de pagamento.

### Fase futura --- pagamentos integrados

Pagamentos integrados ficam fora do MVP inicial.

Se futuramente forem necessários PIX dinâmico, cartão, boleto,
recorrência, confirmação automática ou conciliação, integrar um provedor
de pagamentos apropriado.

Fluxo futuro:

``` text
Usuário
   ↓
Seleciona tipo e valor
   ↓
Backend cria cobrança
   ↓
Provedor gera PIX
   ↓
Pagamento
   ↓
Webhook do provedor
   ↓
Validação server-side
   ↓
Persistência idempotente
   ↓
Admin / conciliação
```

Requisitos obrigatórios nessa fase:

-   credenciais somente no servidor;
-   criação de cobrança no servidor;
-   validação de webhook;
-   idempotência;
-   estados de pagamento;
-   expiração;
-   tratamento de duplicidade;
-   auditoria;
-   revisão específica de segurança e privacidade.

Estados conceituais futuros:

``` text
PENDENTE
PAGO
EXPIRADO
CANCELADO
FALHOU
```

Não adicionar esses estados ao MVP estático se ainda não houver
transações reais.

### Critérios de aceite do MVP

A área de contribuições só é considerada concluída quando:

-   `/contribua` funciona em mobile e desktop;
-   os dados vêm da configuração persistida;
-   o Admin consegue alterá-los sem editar código;
-   somente métodos ativos aparecem publicamente;
-   copiar chave PIX funciona;
-   PIX Copia e Cola funciona quando disponibilizado;
-   o QR Code corresponde à configuração usada;
-   nenhuma credencial financeira é exposta;
-   alterações administrativas respeitam autorização;
-   alterações relevantes geram auditoria;
-   nenhum pagamento é declarado como confirmado sem confirmação
    financeira real.

------------------------------------------------------------------------

## 20. Configurações institucionais

Informações que podem mudar sem alteração de código devem futuramente
ser gerenciáveis.

Exemplos:

-   nome da igreja;
-   endereço;
-   telefone;
-   e-mail;
-   horários;
-   redes sociais;
-   localização/mapa;
-   textos institucionais apropriados.

Usar `configuracoes` quando fizer sentido.

------------------------------------------------------------------------

## 21. Acessibilidade

Aplicar boas práticas:

-   HTML semântico;
-   `label` associado aos campos;
-   navegação por teclado;
-   foco visível;
-   contraste adequado;
-   `aria-*` quando necessário;
-   mensagens de erro compreensíveis;
-   `role="status"`/`aria-live` para feedback dinâmico quando
    apropriado;
-   botões com texto ou nome acessível.

Acessibilidade não deve depender somente de cor.

------------------------------------------------------------------------

## 22. Tratamento de erros e UX

Diferenciar:

-   erro de validação;
-   erro de rede;
-   erro do servidor;
-   falha de autenticação;
-   falta de permissão;
-   falha da IA.

Não mostrar "sucesso" antes da operação real terminar.

Durante requisições:

-   bloquear envio duplicado quando apropriado;
-   apresentar estado loading;
-   restaurar interação após erro;
-   preservar os dados digitados quando houver falha recuperável.

------------------------------------------------------------------------

## 23. TypeScript e padrões de código

-   Utilizar TypeScript.
-   Evitar `any`.
-   Criar tipos reutilizáveis em `src/types` quando fizer sentido.
-   Separar regras de negócio da camada visual.
-   Evitar componentes excessivamente grandes.
-   Preferir nomes descritivos.
-   Evitar duplicação.
-   Não abstrair prematuramente.
-   Manter imports organizados.
-   Preservar o alias `@/*`.

Client Components devem usar `"use client"` somente quando necessário.

Preferir Server Components por padrão quando a tela não exigir
estado/interatividade no cliente.

------------------------------------------------------------------------

## 24. Camadas recomendadas

Organizar responsabilidades aproximadamente assim:

``` text
src/app
→ rotas, layouts, páginas e endpoints/server actions

src/components
→ UI e composição visual

src/lib
→ clientes, configuração e infraestrutura compartilhada

src/services
→ regras/operações de domínio e integrações

src/types
→ tipos compartilhados

src/utils
→ funções puras utilitárias
```

Não colocar toda a lógica do sistema dentro de páginas React.

------------------------------------------------------------------------

## 25. Variáveis de ambiente

Criar `.env.example` sem valores secretos reais.

Exemplo conceitual:

``` env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=

SUPABASE_SERVICE_ROLE_KEY=

GEMINI_API_KEY=
```

Os nomes finais devem ser compatíveis com os SDKs adotados.

### Regra

Arquivos com valores secretos reais:

``` text
.env
.env.local
```

não devem ser commitados.

O `.env.example` deve conter apenas nomes e valores fictícios/vazios.

------------------------------------------------------------------------

## 26. Fluxo de visitante esperado

``` text
Visitante abre /visitante
        ↓
Preenche formulário
        ↓
Validação client-side
        ↓
Envia
        ↓
Validação server-side
        ↓
Proteção antiabuso
        ↓
Persistência no Supabase
        ↓
status = NOVO
        ↓
Confirmação real
        ↓
Equipe autorizada visualiza no admin
        ↓
Acompanhamento
        ↓
Atualização de status + histórico
```

------------------------------------------------------------------------

## 27. Fluxo de oração esperado

``` text
Usuário abre /oracao
        ↓
Preenche pedido
        ↓
Define privacidade/compartilhamento
        ↓
Validação client-side
        ↓
Validação server-side
        ↓
Proteção antiabuso
        ↓
SALVAR NO BANCO
        ↓
Gemini
        ↓
categoria
mensagem de acolhimento
sinalização de atenção humana
        ↓
Atualizar pedido
        ↓
Intercessão
        ↓
Se compartilhável:
moderação humana
        ↓
Mural somente após aprovação
```

------------------------------------------------------------------------

## 28. Regras obrigatórias para a LLM

Você é um agente de desenvolvimento responsável por implementar este
projeto.

Antes de modificar qualquer arquivo:

1.  Leia este documento completamente.
2.  Inspecione a estrutura atual do repositório.
3.  Leia os arquivos relacionados à tarefa.
4.  Identifique o que já funciona.
5.  Preserve funcionalidades existentes.
6.  Prefira completar/refatorar código existente a recriar tudo.
7.  Não altere o Design System sem necessidade.
8.  Não altere a stack sem autorização.
9.  Não exponha secrets.
10. Não use `service_role` no cliente.
11. Não chame Gemini diretamente do navegador.
12. Valide entradas no servidor.
13. Respeite RLS e autorização.
14. Não publique pedidos de oração automaticamente.
15. Salve pedidos de oração antes de chamar IA.
16. Falha da IA nunca pode apagar/perder o pedido.
17. Não torne autorização de contato obrigatória.
18. Preserve consentimentos separadamente.
19. Não remova funcionalidades para implementar novas.
20. Não invente dados institucionais definitivos.
21. Não faça alterações destrutivas no banco sem migration e análise.
22. Evite adicionar dependências sem necessidade.
23. Use componentes reutilizáveis.
24. Mantenha responsividade.
25. Mantenha acessibilidade.
26. Corrija erros introduzidos pela própria implementação.
27. Não declare uma etapa concluída sem verificar o resultado.

------------------------------------------------------------------------

## 29. Modo autônomo de execução

Quando o responsável disser algo como:

> Continue a implementação do projeto conforme PROJECT_INSTRUCTIONS.md.

O agente deve:

1.  ler este arquivo;
2.  inspecionar o repositório;
3.  consultar o checklist;
4.  identificar a próxima etapa lógica incompleta;
5.  planejar internamente a alteração;
6.  implementar todos os arquivos necessários;
7.  executar verificações;
8.  corrigir problemas encontrados;
9.  atualizar o checklist quando a etapa estiver realmente concluída;
10. apresentar um resumo objetivo.

Não pedir confirmação para:

-   criar arquivos previstos;
-   editar arquivos necessários;
-   criar componentes necessários;
-   fazer refatorações pequenas e seguras;
-   corrigir lint/type errors;
-   executar testes;
-   implementar uma etapa já especificada neste documento.

Pedir confirmação antes de:

-   excluir grandes volumes de código/dados;
-   alterar stack;
-   fazer migration destrutiva;
-   remover funcionalidades;
-   alterar regras de negócio não especificadas;
-   mudar substancialmente identidade visual;
-   tomar decisão que exija informação institucional inexistente.

------------------------------------------------------------------------

## 30. Verificações obrigatórias

Após alterações relevantes, executar conforme scripts disponíveis:

``` bash
npm run lint
```

e, quando apropriado:

``` bash
npx tsc --noEmit
```

e:

``` bash
npm run build
```

Também executar testes automatizados existentes.

Se algum comando não existir, não inventar que foi executado.

Se houver erro:

``` text
identificar
→ corrigir
→ executar novamente
```

Não finalizar a tarefa afirmando que está tudo correto enquanto houver
erro conhecido causado pela alteração.

------------------------------------------------------------------------

## 31. Git

Trabalhar em alterações coerentes e revisáveis.

Nunca:

-   apagar histórico;
-   sobrescrever alterações do usuário sem necessidade;
-   executar comandos destrutivos sem autorização;
-   incluir secrets em commit.

Mensagens de commit, quando solicitadas, devem ser descritivas.

Exemplo:

``` text
feat(visitors): persist visitor registration
```

------------------------------------------------------------------------

## 32. Critérios gerais de aceite

Uma funcionalidade só deve ser considerada concluída quando:

-   atende às regras deste documento;
-   funciona em mobile e desktop quando possuir UI;
-   possui validação adequada;
-   trata estados de erro;
-   respeita autenticação/autorização quando necessário;
-   não expõe secrets;
-   não quebra funcionalidades existentes;
-   passa nas verificações disponíveis;
-   possui código legível e coerente com o projeto.

------------------------------------------------------------------------

## 33. Ordem recomendada de implementação

### Fase 1 --- Fundação

-   [x] Next.js + TypeScript.
-   [x] Tailwind CSS.
-   [x] Estrutura `src`.
-   [x] Design tokens iniciais.
-   [x] Componentes UI iniciais.

### Fase 2 --- Site público inicial

-   [x] Header.
-   [x] Footer.
-   [x] Home.
-   [x] Página de visitante.
-   [x] Formulário local de visitante.
-   [ ] Sobre.
-   [ ] Agenda.
-   [ ] Detalhe de evento.
-   [ ] Ministérios.
-   [ ] Contato.
-   [ ] Privacidade.

### Fase 3 --- Backend e visitantes

-   [ ] Criar/configurar Supabase.
-   [ ] Configurar variáveis de ambiente.
-   [ ] Criar migrations iniciais.
-   [ ] Criar tabela de visitantes.
-   [ ] Configurar RLS.
-   [ ] Criar validação server-side.
-   [ ] Persistir visitante.
-   [ ] Implementar loading/erro/sucesso real.
-   [ ] Proteção antiabuso.

### Fase 4 --- Oração

-   [ ] Categorias de oração.
-   [ ] Pedidos de oração.
-   [ ] Histórico.
-   [ ] Visibilidade.
-   [ ] Moderação.
-   [ ] Página pública.
-   [ ] Mural.
-   [ ] RLS.
-   [ ] Fluxos administrativos.

### Fase 5 --- IA

-   [ ] Configurar Gemini server-side.
-   [ ] Classificação.
-   [ ] Mensagem de acolhimento.
-   [ ] Sinalização de atenção humana.
-   [ ] Tratamento de falhas.
-   [ ] Retentativa segura quando aplicável.

### Fase 6 --- Autenticação e administração

-   [ ] Supabase Auth.
-   [ ] Login.
-   [ ] Perfis.
-   [ ] Permissões.
-   [ ] Proteção `/admin`.
-   [ ] Dashboard.
-   [ ] Visitantes.
-   [ ] Intercessão.
-   [ ] Eventos.
-   [ ] Usuários.
-   [ ] Notificações.
-   [ ] Auditoria.
-   [ ] Configurações.

### Fase 7 --- Qualidade

-   [ ] Responsividade completa.
-   [ ] Acessibilidade.
-   [ ] Estados de loading.
-   [ ] Empty states.
-   [ ] Tratamento global de erros quando necessário.
-   [ ] Testes.
-   [ ] Revisão de segurança.
-   [ ] Revisão LGPD.
-   [ ] Performance.

### Fase 8 --- Produção

-   [ ] Variáveis Vercel.
-   [ ] Supabase produção.
-   [ ] Domínio.
-   [ ] Build de produção.
-   [ ] Testes finais.
-   [ ] Observabilidade/logs apropriados.
-   [ ] Deploy.

------------------------------------------------------------------------

## 34. Próxima etapa atual

No momento desta especificação, a próxima etapa recomendada é:

``` text
FASE 3 — BACKEND E VISITANTES
```

Sequência:

``` text
Supabase
→ variáveis de ambiente
→ schema/migration
→ visitantes
→ RLS
→ camada server-side
→ integração do VisitorForm
→ teste real
```

Não avançar diretamente para Gemini antes de existir persistência e
segurança adequadas.

------------------------------------------------------------------------

## 35. Prompt principal para um agente de desenvolvimento

Este prompt pode ser usado após o agente ter acesso ao repositório:

``` text
Leia integralmente o arquivo PROJECT_INSTRUCTIONS.md da raiz do projeto.

Em seguida:

1. inspecione o repositório atual;
2. identifique o que já está implementado;
3. compare com o checklist do documento;
4. preserve o código e o design existentes;
5. implemente a próxima etapa lógica incompleta;
6. siga todas as regras de arquitetura, segurança, Supabase, LGPD e TypeScript definidas no documento;
7. não exponha secrets;
8. não remova funcionalidades existentes;
9. execute lint, typecheck, build e testes disponíveis conforme aplicável;
10. corrija os problemas causados pelas alterações;
11. atualize o checklist somente para itens realmente concluídos;
12. ao terminar, informe resumidamente:
   - etapa implementada;
   - arquivos criados;
   - arquivos modificados;
   - banco/migrations alterados;
   - verificações executadas;
   - pendências;
   - próxima etapa recomendada.

Trabalhe de forma autônoma nas decisões técnicas já cobertas pelo PROJECT_INSTRUCTIONS.md.
Peça confirmação somente para decisões destrutivas, mudanças de stack, mudanças substanciais de design ou regras de negócio não definidas.
```

------------------------------------------------------------------------

## 36. Regra de manutenção deste documento

Este arquivo deve evoluir junto com o produto.

Quando uma decisão arquitetural permanente mudar:

1.  atualizar este documento;
2.  atualizar código relacionado;
3.  evitar contradições entre documentação e implementação.

Quando uma etapa for concluída:

``` text
[ ] → [x]
```

somente após validação.

Se o código existente e este documento divergirem, o agente deve:

1.  identificar a divergência;
2.  não fazer alteração destrutiva automaticamente;
3.  determinar se o código representa evolução intencional;
4.  preservar dados e funcionalidades;
5.  atualizar a documentação quando a mudança for confirmada como nova
    regra.

------------------------------------------------------------------------

# Resumo para a LLM

Este é um sistema Next.js/TypeScript/Tailwind/Supabase para acolhimento
e gestão de relacionamento de uma igreja.

Os pilares são:

``` text
ACOLHIMENTO
+
COMUNICAÇÃO
+
VISITANTES
+
ORAÇÃO
+
GESTÃO
+
SEGURANÇA
+
PRIVACIDADE
+
APOIO DE IA
```

A prioridade não é apenas produzir telas.

A prioridade é produzir um sistema:

-   funcional;
-   seguro;
-   acolhedor;
-   sustentável;
-   acessível;
-   responsivo;
-   auditável;
-   preparado para evolução.

**Preserve o que funciona. Proteja os dados. Mantenha humanos
responsáveis pelas decisões humanas.**

---

# ADENDO OFICIAL — AGENDA SEMANAL, ORAÇÃO EM ÁUDIO E LIVES

Este adendo faz parte dos requisitos obrigatórios do projeto e complementa as seções anteriores do documento. Em caso de implementação, estas regras devem ser consideradas juntamente com os requisitos já definidos para Admin, Supabase, RLS, oração, eventos, auditoria e conteúdo administrável.

## Agenda semanal — cultos, ensaios e recorrência

A agenda semanal deve representar a rotina recorrente da igreja e ser administrável sem alteração de código.

Exemplos de atividades: Culto, Ensaio, Escola Bíblica, Reunião, Célula/Pequeno Grupo, Encontro de Jovens, Intercessão, Atividade de Ministério e Outro.

Cada item deve permitir título, categoria, dia da semana, horário inicial, horário final opcional, local, descrição, ministério/departamento responsável, data de início, data de término opcional, status ativo/inativo e publicação pública.

### Recorrência e exceções

Não cadastrar manualmente todas as ocorrências semanais. Uma programação recorrente deve aceitar exceções em datas específicas.

Estados de uma ocorrência:

```text
NORMAL
ALTERADA
CANCELADA
```

Exemplo:

```text
Culto recorrente: Domingo às 18:00
Exceção: 04/10/2026 — início às 19:00
```

ou:

```text
Ensaio recorrente: Sábado às 16:00
Exceção: 10/10/2026 — CANCELADO
```

Estruturas conceituais adicionais:

```text
programacao_semanal
excecoes_programacao
```

A Home deve exibir automaticamente a programação da semana. A rota `/agenda` deve combinar programação semanal, exceções e eventos especiais.

Admin:

```text
/admin/agenda-semanal
```

O Admin deve conseguir criar, editar, ordenar, publicar, cancelar uma ocorrência específica e alterar apenas uma ocorrência sem destruir a regra recorrente.

## Oração em áudio

A área de oração deve oferecer, quando habilitada:

```text
[ 🔊 Ouvir oração ]
```

A geração do conteúdo e a geração da voz são responsabilidades separadas.

Fluxo obrigatório:

```text
Pedido recebido
→ validar
→ salvar pedido
→ Gemini processa o conteúdo
→ obter texto final apropriado
→ usuário solicita Ouvir oração
→ backend solicita Text-to-Speech
→ áudio é gerado
→ player reproduz o áudio
```

O TTS não deve receber o pedido bruto do usuário como instrução livre para criar uma nova resposta. Primeiro deve existir um texto final apropriado; depois esse texto é enviado ao serviço de síntese somente para geração da voz.

Preferir geração sob demanda:

```text
Usuário clica em Ouvir oração
→ verificar áudio/cache válido
→ se existir, reproduzir
→ se não existir, gerar via TTS
→ armazenar/cachear de forma privada quando apropriado
→ reproduzir
```

O player deve oferecer play/pause, progresso, duração, volume quando suportado, loading, tratamento de erro e acessibilidade. O texto continua disponível visualmente; áudio é uma alternativa.

Estrutura conceitual:

```text
audios_oracao

id
pedido_oracao_id
origem_texto
status
storage_path
provider
voice
duration_seconds
created_at
expires_at
```

Estados:

```text
PENDENTE
PROCESSANDO
PRONTO
FALHOU
```

Áudios derivados de pedidos privados também são privados. Não expor URL pública permanente de conteúdo sensível sem necessidade. Falha de TTS nunca pode apagar o pedido ou impedir a leitura do texto.

## Lives e transmissões do YouTube

Criar suporte administrável para transmissões da igreja, principalmente os cultos ao vivo exibidos aos domingos.

Rotas:

```text
/ao-vivo
/admin/transmissoes
```

Quando houver uma transmissão ativa/configurada, a Home deve poder destacar:

```text
🔴 Culto ao vivo
[ Player YouTube ]
```

Fora da janela de transmissão, pode exibir a próxima transmissão ou uma gravação anterior quando isso estiver habilitado pelo Admin.

A arquitetura não deve depender de uma regra rígida `if domingo`. Deve suportar vigílias, congressos, conferências, cultos especiais e transmissões em qualquer dia.

O Admin deve controlar título, descrição, identificador/URL válida do YouTube, data, horário previsto, janela de exibição, status, destaque na Home e opção de exibir gravação após encerramento.

Estados conceituais:

```text
AGENDADA
AO_VIVO
ENCERRADA
CANCELADA
```

No MVP, o estado pode ser administrado manualmente. Integração automática com APIs externas pode ser adicionada em fase posterior.

A aplicação deve usar incorporação oficial/compatível do YouTube. Não baixar, retransmitir ou armazenar o vídeo da live. Não aceitar HTML/iframe arbitrário e renderizá-lo diretamente; validar o URL/ID e construir a incorporação de forma controlada.

Estrutura conceitual:

```text
transmissoes

id
titulo
descricao
youtube_video_id
inicio_previsto
fim_previsto
status
destacar_home
exibir_gravacao
ativo
created_at
updated_at
updated_by
```

## Atualização do Admin

Adicionar ao painel administrativo:

```text
Dashboard

Conteúdo
├── Home
├── Avisos
├── Ministérios
└── Dados da igreja

Programação
├── Agenda semanal
├── Eventos
└── Transmissões / Lives

Relacionamento
├── Visitantes
└── Acompanhamentos

Intercessão
├── Pedidos
├── Moderação
└── Áudio / IA

Contribuições
└── PIX / Métodos

Sistema
├── Usuários
├── Permissões
├── Notificações
├── Auditoria
└── Configurações
```

Novas rotas administrativas obrigatórias:

```text
/admin/agenda-semanal
/admin/transmissoes
```

## Home dinâmica

A Home deve ser alimentada por dados administráveis e pode priorizar:

```text
Próximo culto
→ Live ativa, quando houver
→ Programação desta semana
→ Próximos eventos
→ Pedido de oração / Ouvir oração quando aplicável
→ Contribuições
```

Alterações administrativas de agenda, transmissões, dados da igreja, avisos ou contribuições não devem exigir alteração de componentes React nem novo deploy.

## Ordem atualizada de implementação

```text
1. Supabase + autenticação + RLS
2. Admin base + permissões
3. Dados da igreja + conteúdo administrável da Home
4. Agenda semanal + recorrência + exceções + eventos
5. Lives do YouTube
6. Visitantes + acompanhamento
7. Pedidos de oração
8. Gemini + oração em áudio via TTS
9. Contribuições PIX
10. Auditoria + notificações
11. Testes + segurança + deploy
```

## Checklist adicional

### Agenda semanal
- [x] Criar `programacao_semanal`.
- [x] Criar `excecoes_programacao`.
- [x] Implementar cultos, ensaios e outras atividades recorrentes.
- [x] Implementar alteração/cancelamento de ocorrência específica.
- [x] Criar `/admin/agenda-semanal`.
- [x] Integrar programação à Home e `/agenda`.

### Lives
- [x] Criar `transmissoes`.
- [x] Criar `/admin/transmissoes`.
- [x] Criar `/ao-vivo`.
- [x] Implementar player controlado do YouTube.
- [x] Destacar live ativa na Home.
- [ ] Testar estados AGENDADA, AO_VIVO, ENCERRADA e CANCELADA.

### Oração em áudio
- [ ] Definir texto final elegível para áudio.
- [ ] Integrar serviço TTS server-side.
- [ ] Implementar geração sob demanda.
- [ ] Implementar cache/armazenamento privado quando apropriado.
- [ ] Criar `audios_oracao` se a persistência for necessária.
- [ ] Implementar player acessível.
- [ ] Garantir fallback para texto em falha do TTS.
- [ ] Garantir que a privacidade do áudio acompanhe a privacidade do pedido.

## Critérios de aceite adicionais

A implementação dessas melhorias só é considerada concluída quando:

- programação recorrente não exige cadastrar manualmente cada semana;
- uma ocorrência pode ser alterada ou cancelada isoladamente;
- a Home reflete a agenda publicada pelo Admin;
- lives podem ser administradas sem alterar código;
- o player do YouTube funciona de forma responsiva;
- transmissões não ficam limitadas apenas aos domingos;
- o pedido de oração é salvo antes de qualquer processamento de IA;
- o áudio é gerado somente a partir do texto final apropriado;
- falha do TTS mantém o texto e o pedido disponíveis;
- conteúdo privado de oração permanece privado também no áudio;
- lint, typecheck e build continuam aprovados após a implementação.
