# CLAUDE.md

Regras permanentes para qualquer sessao de IA (Claude Code ou equivalente) que trabalhe
neste projeto (DRS — Daryus Resilient Services, modulo Escopometro SGSI). Este arquivo e
um indice de decisao, nao um resumo do PRD — para detalhe, ver
`requirements/001-prd-escopometro-sgsi.md` e os docs referenciados abaixo.

## Fontes de verdade, em ordem

1. `AGENTS.md` / `GUIDE.md` (raiz) — orquestracao de tasks, backlog unico em `tasks/`.
2. `contracts/openapi.yaml` — contrato de API entre `next-js` e `backend`.
3. `docs/architecture.md`, `docs/database.md` (este par, mais este `CLAUDE.md`) — decisoes
   arquiteturais consolidadas, atualizadas incrementalmente a cada task/slice.
4. `requirements/001-prd-escopometro-sgsi.md` — requisito de produto original.
5. `backend/docs/ai/`, `next-js/docs/ai/` — convencoes locais de cada stack.

Se um doc local (`docs/ai/*`) contradisser o que este arquivo ou uma task explicitamente
pede, o doc local pode estar desatualizado (ja aconteceu — ver `tasks/007-design-tokens-shell.md`
e `tasks/009-telas-organizacao-projeto.md`, secao "Resultado da execucao"). Documentar a
contradicao na task, nao decidir em silencio.

## Decisoes arquiteturais nao-negociaveis (PRD secao 44)

1. DSR e a plataforma; Escopometro e um modulo.
2. Organizacao e Projeto sao entidades centrais reutilizaveis.
3. O Escopometro nao decide automaticamente o escopo.
4. Dados importados sao referencia.
5. Backend e a fonte oficial de dados.
6. Multitenancy deve existir desde o inicio.
7. Autorizacao deve ser validada no servidor.
8. Diagramas devem ser derivados de dados estruturados.
9. Documentos devem ser gerados por servico independente.
10. Versoes aprovadas precisam de rastreabilidade.
11. Conteudo rico precisa ser armazenado e renderizado com seguranca.
12. O codigo do prototipo (HTML v0.1.3) nao deve ser utilizado como arquitetura de producao.
13. Novos modulos devem conseguir utilizar a mesma estrutura de organizacao, projeto,
    usuarios, documentos e auditoria.

## O que NAO copiar do prototipo HTML (PRD secao 38)

O HTML v0.1.3 e referencia funcional e visual (conceitos, campos, fluxo, textos, regras,
diagramas, documentos, identidade visual) — nunca arquitetura. Especificamente, nao
replicar:

- objeto global monolitico;
- `localStorage` como banco principal;
- manipulacao imperativa do DOM;
- `document.execCommand`;
- geracao de IDs por timestamp;
- exportacao diretamente acoplada ao formulario;
- codigo monolitico.

## Stack real (decisoes ja tomadas, divergentes da recomendacao generica do PRD secao 24)

O PRD secao 24 recomenda uma stack generica (Next.js full-stack, Prisma, Tailwind,
TanStack Query). O que foi efetivamente decidido e implementado, e deve ser seguido:

- **Backend separado** (NestJS + TypeScript), nao a camada server-side do Next.js —
  decisao registrada em `tasks/000-index.md`, "Duvidas para validacao humana".
- **TypeORM + PostgreSQL**, nao Prisma — mesma origem de decisao. `docs/database.md`
  documenta o schema como entidades TypeORM, nao schema Prisma.
- **CSS puro (custom properties) + CSS Modules**, nao Tailwind — decisao da Task 007,
  porque o projeto ja usava esse padrao antes da introducao dos tokens Daryus.
  `next-js/docs/ai/STYLING.md` ainda descreve Tailwind e esta desatualizado; nao seguir
  esse arquivo ate ele ser corrigido.
- **React Hook Form + Zod** para formularios — isso bate com a recomendacao do PRD e foi
  adotado na Task 009 (dependencias novas, aprovadas explicitamente pelo usuario).
- **TanStack Query nao foi adotado** — as paginas next-js de Task 008/009 buscam dados em
  Server Components (fetch direto ao backend, sem cache client-side), nao em client-side
  data fetching. Reavaliar apenas se uma tela futura exigir revalidacao/cache client-side
  real.
- **Autenticacao**: o backend usa Passport JWT (bearer token) proprio, nao uma solucao de
  auth-as-a-service de terceiros — decisao ja existente no scaffold antes deste projeto
  (Tasks 001-003 descobriram e reaproveitaram, nao recriaram). O next-js guarda o token
  num cookie httpOnly proprio (BFF via Route Handlers, Task 008), nunca no bundle do
  client — ver `docs/architecture.md#autenticacao-e-sessao`.
- **Object Storage (S3-compativel)**: ainda nao implementado. `logoUrl` (Organization) e
  hoje um campo de texto livre (URL), sem upload real — storage definitivo e a Task 026.

## Multitenancy e autorizacao (nao-negociavel, PRD secao 23)

- Nunca confiar em `organizationId`/`projectId` vindo do frontend sem validar contra o
  vinculo do usuario autenticado no backend.
- Todo request a um recurso de Organizacao/Projeto passa por `OrganizationAccessGuard`/
  `ProjectAccessGuard` (Task 004), que recarregam o vinculo do banco a cada request —
  nunca confiam so no payload do JWT.
- Padrao de resposta: **404** quando o recurso (organizationId/projectId) nao existe,
  **403** quando existe mas o usuario nao tem vinculo. DSR Admin (`UserRole.ADMIN`) tem
  acesso irrestrito, sem checagem de vinculo.
- Guards de UI (esconder um botao, desabilitar um campo) sao so UX — a garantia real e
  sempre o backend.

## Pendencias arquiteturais em aberto

Ver `docs/architecture.md` (secao "Pendencias") para a lista completa. Resumo das mais
relevantes ao decidir proximas tasks:

- Nao ha endpoint que um usuario comum (Consultor) possa usar para listar usuarios de uma
  organizacao/projeto (`GET /users` e DSR-Admin-only) — bloqueia um seletor real de
  responsavel/participantes na UI de Projeto (Task 009).
- Politica de exclusao de Organizacao com projetos ativos (bloquear vs. cascatear) e
  regras de transicao de status de Projeto nao foram confirmadas com o usuario — os
  defaults atuais estao documentados nas Tasks 005/006 e devem ser tratados como
  provisorios.
- `next-js/docs/ai/STYLING.md` precisa ser corrigido para refletir CSS puro + CSS
  Modules em vez de Tailwind.

## Como toda task deve se comportar

- Task e a unidade de trabalho; backlog unico vive em `tasks/000-index.md`. Nao
  implementar produto fora de uma task rastreavel.
- Ao terminar uma task, atualizar o proprio arquivo da task (`## Status`, `## Status
final`, resultado, arquivos alterados, validacoes, pendencias) e, quando a task gerar
  decisao arquitetural nova ou entidade nova, atualizar `docs/architecture.md`/
  `docs/database.md` na mesma task — nao deixar para depois.
- Ambiguidade real (decisao de produto, nao tecnica) vira pendencia registrada na task,
  nunca uma decisao silenciosa que nao pode ser revertida sem custo (ex.: politica de
  exclusao, regra de transicao de status).
