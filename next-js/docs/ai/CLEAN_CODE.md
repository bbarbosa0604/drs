# Clean Code

## Objetivo

Este arquivo define como manter o Next.js simples de entender, barato de evoluir e previsivel para devs e agentes. A regra principal e reduzir acoplamento, ambiguidade e codigo que exige contexto demais para ser alterado.

## Regras Principais

- Cada page, component, hook ou service deve ter uma responsabilidade clara.
- Se um arquivo crescer demais, dividir por responsabilidade antes de adicionar mais regra.
- Evitar pages gigantes que buscam dado, tratam estado, formatam resposta e renderizam tudo ao mesmo tempo.
- Preferir nomes que expliquem intencao, nao implementacao.
- Evitar `if`, `switch` e branching longos quando um pattern resolver melhor.
- Cada modulo deve ser facil de ler sem precisar abrir muitos arquivos auxiliares para entender o basico.
- O codigo deve ser escrito para manutencao, nao apenas para funcionar agora.

## Como Dividir Responsabilidades

### Page

Responsavel por:

- montar entrada de rota
- compor layout e components
- chamar services server-side quando apropriado

Nao deve:

- transformar resposta da API na mao quando houver adapter
- carregar validacao complexa misturada com render
- virar client component inteiro sem necessidade

### Client Component

Responsavel por:

- controlar interacao local
- tratar eventos do usuario
- encapsular estado visual pequeno

Nao deve:

- concentrar regra de negocio ampla
- fazer request direto quando service ja deveria existir
- controlar multiplos fluxos sem relacao

### Hook

Responsavel por:

- controlar loading
- tratar erro
- encapsular efeitos e estado derivado em client components

Nao deve:

- renderizar JSX
- conhecer detalhes de layout
- centralizar mais de um fluxo de negocio sem relacao

### Service

Usado quando houver API externa.

Responsavel por:

- chamar API
- adaptar resposta
- centralizar contratos de integracao

Nao deve:

- conhecer modal, roteamento visual ou detalhes de UI
- manipular estado visual

### Port

Responsavel por:

- declarar a operacao de conteudo que o front precisa
- definir a entidade de dominio devolvida
- manter o front independente da ferramenta de persistencia

Nao deve:

- importar SDK de CMS, cliente de banco ou modulo de infraestrutura
- conhecer o formato de documento do CMS
- conter regra de renderizacao

### Adapter Payload

Responsavel por:

- implementar o port usando a Local API
- mapear documento do CMS para entidade de dominio
- concentrar filtro de publicacao e chave de cache

Nao deve:

- vazar tipo gerado pelo CMS para fora da pasta
- ser importado por component ou page
- decidir layout ou texto de interface

## Checklist Rapido

- Responsabilidade unica por modulo
- Nomes claros
- Sem duplicacao obvia
- Logica fora da UI quando crescer
- Patterns usados quando evitam branching grande
- Request e adaptacao fora de components quando houver complexidade
- Boundaries de client component pequenas
- Ferramenta de persistencia confinada aos adapters

- Todos os padroes e orientacoes descritos devem ser utilizados para resolver problemas reais e nao por antecipacao. Evitar overengineering.
