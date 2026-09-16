# Repo Map

```text
next-js/
  docs/ai/
    ACCESSIBILITY.md
    AGENTS.md
    ARCHITECTURE.md
    CLEAN_CODE.md
    CODE_STYLE.md
    COMPONENT_REUSE.md
    DEVELOPMENT_WORKFLOW.md
    EXAMPLES.md
    FRONTEND_PATTERNS.md
    QA.md
    REPO_MAP.md
    SECURITY.md
    PAYLOAD_CMS.md     (anexo, so quando houver Payload)
    PERFORMANCE.md     (anexo)
    SEO.md             (anexo)
    STYLING.md         (anexo)
  src/
    app/
      globals.css
      layout.tsx
      page.tsx
      (frontend)/                          (quando houver Payload)
      (payload)/
        admin/[[...segments]]/             (painel do CMS)
        api/[...slug]/                     (REST do CMS)
        api/graphql/                       (GraphQL do CMS)
    core/
      content/
        ports.ts
        types.ts
    adapters/
      payload/
        mappers/
    collections/                           (quando houver Payload)
    globals/                               (quando houver Payload)
    blocks/                                (quando houver Payload)
    components/
      sections/
    constants/
    hooks/
    patterns/
    services/
      adapters/
      http/
    test/
    types/
    utils/
    payload.config.ts                      (quando houver Payload)
  AGENTS.md
  eslint.config.mjs
  next.config.ts
  package.json
  tsconfig.json
```

O bloco de Payload existe somente quando `Perfil do projeto` declarar `cms: payload`. Sem CMS, a stack fica com `src/app/`, `components/`, `services/` e os utilitarios.

`core/` e `adapters/` valem sempre que houver conteudo vindo de persistencia local. Com API externa, o caminho e `services/`.

- Todos os padroes e orientacoes descritos devem ser utilizados para resolver problemas reais e nao por antecipacao. Evitar overengineering.
