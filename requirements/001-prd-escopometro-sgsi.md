# PRD --- DSR / Módulo Escopômetro SGSI

**Produto:** DSR --- Daryus Resilient Services\
**Módulo:** Escopômetro SGSI\
**Versão inicial de referência:** Protótipo HTML v0.1.3\
**Objetivo deste documento:** orientar o desenvolvimento do produto no
Claude Code.

---

## 1. Visão do Produto

O **DSR --- Daryus Resilient Services** será uma plataforma modular para
apoiar a execução, o registro, a gestão e a geração de artefatos
relacionados aos serviços e metodologias da Daryus.

O **Escopômetro SGSI** será o primeiro módulo do DSR.

Seu objetivo é permitir que especialistas estruturem e documentem, de
forma organizada e rastreável, a definição do escopo de um Sistema de
Gestão de Segurança da Informação (SGSI).

### Princípio fundamental

O Escopômetro **não avalia, não decide e não determina automaticamente o
escopo do SGSI**.

A responsabilidade pela definição do escopo permanece com o
especialista.

O sistema deve:

- estruturar informações;
- registrar decisões;
- representar visualmente o ambiente;
- facilitar revisões;
- gerar documentos;
- manter histórico;
- apoiar o especialista.

Dados importados de outros módulos, incluindo Identificômetro/CJD, devem
ser tratados apenas como referência e nunca como decisão automática de
escopo.

---

## 2. Estrutura conceitual do DSR

A arquitetura funcional deve seguir aproximadamente:

```text
DSR
└── Organizações
    └── Organização
        └── Projetos
            └── Projeto
                └── Módulos
                    └── Escopômetro SGSI
                        ├── Dados
                        ├── Diagramas
                        ├── Documentos
                        ├── Revisões
                        └── Aprovações
```

A aplicação não deve reproduzir a estrutura monolítica de estado do
protótipo HTML.

Devem existir entidades independentes para:

- Organização;
- Projeto;
- Instância de módulo;
- Escopo SGSI;
- versões;
- documentos;
- aprovações;
- histórico.

---

## 3. Usuários e papéis

Papéis previstos:

### DSR Admin

Pode administrar organizações, projetos, usuários e configurações da
plataforma.

### Consultor / Especialista

Principal usuário operacional.

Pode:

- criar projetos;
- preencher o Escopômetro;
- editar informações;
- montar diagramas;
- gerar documentos;
- preparar versões para revisão.

### Revisor

Pode revisar informações e registrar observações.

### Cliente / Aprovador

Poderá visualizar e aprovar versões do escopo.

### Prioridade do MVP

O MVP deve priorizar:

1.  DSR Admin;
2.  Consultor / Especialista.

Os demais papéis podem ser evoluídos posteriormente.

---

## 4. Dashboard

Após autenticação, o usuário deve acessar um dashboard contendo:

- organizações recentes;
- projetos recentes;
- projetos em andamento;
- módulos utilizados;
- documentos recentemente gerados;
- atividades recentes.

Ações principais:

- Nova organização;
- Novo projeto;
- Abrir projeto.

---

## 5. Organização

A organização representa o cliente e deve armazenar informações
institucionais reutilizáveis entre projetos.

Dados básicos:

- razão social / nome;
- segmento;
- número aproximado de colaboradores;
- abrangência geográfica;
- produtos e serviços;
- logotipo;
- histórico institucional;
- negócio;
- missão;
- visão;
- valores.

Informações institucionais não devem precisar ser novamente cadastradas
em cada projeto.

---

## 6. Projeto

Um projeto pertence a uma organização.

Campos:

- nome;
- organização;
- descrição;
- responsável;
- participantes;
- data de início;
- data prevista de conclusão;
- status;
- módulos ativos.

Status sugeridos:

```text
DRAFT
IN_PROGRESS
IN_REVIEW
WAITING_APPROVAL
APPROVED
ARCHIVED
```

---

# 7. Módulo Escopômetro SGSI

O fluxo do protótipo deve ser preservado em oito etapas.

```text
1. Empresa
2. Contexto
3. Requisitos & CGSI
4. Escopo
5. Cadeia de Valor
6. Topologia & Arquitetura
7. Limites & Recursos
8. Prévia & Exportação
```

A navegação entre etapas deve ser livre.

O preenchimento não deve obrigar o usuário a concluir uma etapa antes de
acessar outra.

---

# 8. Etapa 1 --- Empresa

## 8.1 Dados da organização

Campos:

- nome;
- segmento;
- colaboradores;
- abrangência geográfica;
- produtos e serviços;
- logotipo.

Sempre que possível, dados já existentes na entidade Organização devem
ser reutilizados.

## 8.2 Controle documental

Campos:

- classificação;
- versão;
- data de criação;
- validade;
- elaborado por;
- aprovado por.

## 8.3 Importação de referência

O módulo poderá consumir informações provenientes de outros módulos do
DSR, como Identificômetro/CJD.

Regra obrigatória:

> Informações importadas servem apenas como referência e não podem
> definir automaticamente o escopo.

No produto definitivo, módulos devem preferencialmente compartilhar
dados através da estrutura do projeto, evitando a necessidade de
importação manual.

Importação/exportação JSON pode continuar existindo como funcionalidade
auxiliar.

---

# 9. Etapa 2 --- Contexto

Deve permitir registrar o contexto organizacional.

## 9.1 Histórico

Editor de conteúdo rico para descrição do histórico da organização.

## 9.2 Direcionadores

Campos:

- negócio;
- missão;
- visão;
- valores.

## 9.3 Questões externas

Cadastro de aspectos externos relevantes.

Cada registro deve possuir:

- título;
- descrição;
- observações.

## 9.4 Questões internas

Cadastro de aspectos internos relevantes.

Cada registro deve possuir:

- título;
- descrição;
- observações.

---

# 10. Etapa 3 --- Requisitos & CGSI

## 10.1 Partes interessadas

Cadastro de stakeholders.

Campos:

- parte interessada;
- requisitos;
- necessidades;
- expectativas;
- observações.

## 10.2 Legislação e outros requisitos

Cadastro de requisitos legais, regulatórios, contratuais e outros
requisitos aplicáveis.

O protótipo contém uma biblioteca inicial com referências brasileiras,
incluindo:

- Constituição Federal;
- LGPD;
- Marco Civil da Internet;
- Lei Carolina Dieckmann;
- legislação de propriedade intelectual de software;
- Lei de Direitos Autorais;
- Código Civil;
- Código de Defesa do Consumidor;
- Decreto do Comércio Eletrônico;
- orientações da ANPD.

Essa biblioteca deve evoluir para uma estrutura reutilizável e
administrável, e não permanecer permanentemente hardcoded no frontend.

## 10.3 Governança / CGSI

Dados do comitê:

- nome;
- objetivo;
- responsabilidades;
- observações.

Membros:

- nome;
- função;
- área;
- papel no comitê.

---

# 11. Etapa 4 --- Escopo

Esta é a etapa central do módulo.

## 11.1 Declaração formal do escopo

Campo textual destinado à declaração de escopo utilizada em documentos
oficiais e processos de certificação.

## 11.2 Fundamentação executiva

Campo destinado à justificativa da proposta de escopo.

## 11.3 Descrição detalhada

Editor de conteúdo rico.

## 11.4 Características

Lista dinâmica de características relevantes do escopo.

## 11.5 Benefícios / resultados

Lista dinâmica de benefícios ou resultados esperados.

### Regra crítica

O sistema pode auxiliar o especialista a organizar informações, mas não
deve concluir automaticamente qual deve ser o escopo.

---

# 12. Etapa 5 --- Cadeia de Valor

O usuário deve construir uma representação da cadeia de valor.

Categorias:

```text
INPUT
PRIMARY_PROCESS
SUPPORT_PROCESS
OUTPUT
```

Cada bloco deve possuir:

- nome;
- descrição;
- área responsável;
- classificação de escopo.

Classificações:

```text
IN_SCOPE
OUT_SCOPE
INTERFACE
```

Representação visual de referência:

- grafite: dentro do escopo;
- cinza claro: fora do escopo;
- contorno laranja: interface externa.

O diagrama deve ser gerado automaticamente a partir dos dados
estruturados.

O modelo de dados não deve depender de SVG.

Criar uma abstração como:

```text
ValueChainDiagram
```

responsável pela transformação dos dados em representação visual.

---

# 13. Etapa 6 --- Topologia & Arquitetura

## 13.1 Topologia

Cadastro de nós.

Tipos inicialmente previstos:

- Application;
- Database;
- Network;
- Firewall;
- Cloud;
- Server;
- User;
- Internet;
- Third Party;
- Physical Unit;
- Other.

Cada nó deve possuir:

- nome;
- tipo;
- descrição;
- classificação de escopo.

Cadastro de conexões:

- origem;
- destino;
- descrição;
- tipo/relação.

A aplicação deve gerar automaticamente uma visualização da topologia.

## 13.2 Arquitetura

Cadastro de componentes.

Campos:

- nome;
- camada;
- descrição;
- classificação de escopo.

Interfaces:

- origem;
- destino;
- descrição.

Criar abstrações independentes:

```text
TopologyDiagram
ArchitectureDiagram
```

Os dados devem permanecer estruturados e independentes da tecnologia
utilizada para renderização.

---

# 14. Etapa 7 --- Limites & Recursos

## 14.1 Localidades

Campos:

- nome;
- endereço/localização;
- descrição;
- classificação de escopo.

## 14.2 Colaboradores / áreas

Campos:

- área/grupo;
- quantidade;
- descrição;
- classificação de escopo.

## 14.3 Ativos tecnológicos

Campos:

- ativo;
- categoria;
- descrição;
- responsável;
- classificação de escopo.

## 14.4 Prestadores de serviço

Campos:

- prestador;
- serviço;
- descrição;
- classificação de escopo.

## 14.5 Aprovação

Campos:

- método;
- plataforma;
- texto de aprovação;
- responsável;
- data;
- observações.

## 14.6 Revisões

Histórico contendo:

- versão;
- data;
- responsável;
- descrição da alteração.

---

# 15. Etapa 8 --- Prévia & Exportação

A tela deve apresentar uma visão consolidada do Escopômetro.

Informações:

- organização;
- projeto;
- versão;
- declaração do escopo;
- estatísticas;
- elementos incluídos;
- elementos excluídos;
- interfaces;
- recursos;
- diagramas.

---

# 16. Indicador de preenchimento

O protótipo possui um indicador percentual.

No produto, ele deve ser claramente identificado como:

**Percentual de preenchimento do Escopômetro**

Ele não representa:

- conformidade ISO 27001;
- maturidade;
- qualidade;
- prontidão para certificação;
- adequação do escopo.

O cálculo deve considerar somente presença/preenchimento das informações
esperadas.

---

# 17. Documentos gerados

O MVP deve gerar:

1.  Declaração de Escopo --- DOCX;
2.  Proposta de Aprovação --- DOCX;
3.  Apresentação para Aprovação --- PPTX.

Futuramente:

4.  PDF.

A geração de documentos não deve ficar diretamente acoplada aos
componentes da interface.

Criar serviço dedicado:

```text
DocumentGenerationService
```

Exemplos:

```text
generateScopeDeclaration()
generateApprovalProposal()
generateApprovalPresentation()
```

Templates devem poder evoluir sem alteração do modelo de domínio.

---

# 18. Persistência

O protótipo utiliza `localStorage`.

O produto definitivo deve utilizar persistência server-side.

Stack recomendada:

```text
PostgreSQL
Prisma ORM
```

O frontend poderá manter estado temporário, mas o banco deve ser a fonte
oficial dos dados.

---

# 19. Salvamento automático

Implementar autosave com debounce.

Estados visuais:

```text
Salvando...
Salvo
Erro ao salvar
```

O usuário não deve depender exclusivamente de um botão manual de salvar.

---

# 20. Versionamento do escopo

Cada Escopômetro deve possuir versões.

Uma versão aprovada não deve ser silenciosamente sobrescrita.

Modelo conceitual:

```text
SgsiScope
└── SgsiScopeVersion
```

Uma nova alteração relevante após aprovação deve originar nova versão ou
revisão controlada.

---

# 21. Auditoria

Operações relevantes devem gerar histórico.

Exemplos:

- criação;
- alteração;
- exclusão;
- mudança de status;
- geração de documento;
- submissão para revisão;
- aprovação.

Entidade sugerida:

```text
AuditLog
```

Dados:

- organização;
- projeto;
- usuário;
- entidade;
- entidadeId;
- ação;
- timestamp;
- metadata.

---

# 22. Modelo de dados --- entidades principais

Entidades sugeridas:

```text
User
Organization
OrganizationMember

Project
ProjectMember

ModuleInstance

SgsiScope
SgsiScopeVersion

DocumentControl

OrganizationContext
OrganizationValue
ContextAspect

Stakeholder
Requirement

GovernanceCommittee
GovernanceMember

ScopeDefinition
ScopeCharacteristic
ScopeBenefit

ValueChainBlock

TopologyNode
TopologyLink

ArchitectureComponent
ArchitectureInterface

ScopeLocation
ScopeEmployeeGroup
ScopeAsset
ScopeProvider

ScopeApproval
ScopeRevision

GeneratedDocument

AuditLog
```

---

# 23. Multitenancy

O DSR deve nascer preparado para múltiplas organizações.

Todos os dados de negócio devem estar associados, direta ou
indiretamente, a uma organização.

O backend deve validar autorização.

Nunca confiar apenas em um `organizationId` enviado pelo frontend.

Toda consulta deve verificar se o usuário possui acesso à
organização/projeto solicitado.

Proteções contra IDOR são obrigatórias.

---

# 24. Stack recomendada

## Frontend

```text
Next.js
TypeScript
React
Tailwind CSS
shadcn/ui
React Hook Form
Zod
TanStack Query
```

## Backend

Pode inicialmente utilizar a própria camada server-side do Next.js.

Se a evolução justificar, serviços podem posteriormente ser separados.

## Banco

```text
PostgreSQL
Prisma
```

## Arquivos

Object Storage compatível com S3 para:

- logotipos;
- documentos gerados;
- anexos futuros.

## Autenticação

Utilizar solução consolidada de autenticação.

Não implementar autenticação manual própria.

---

# 25. Organização de código sugerida

```text
src/
├── app/
│   ├── (auth)/
│   └── (dashboard)/
│       ├── organizations/
│       ├── projects/
│       └── dsr/
│
├── modules/
│   └── sgsi-scope/
│       ├── components/
│       ├── schemas/
│       ├── services/
│       ├── repositories/
│       ├── diagrams/
│       ├── documents/
│       ├── types/
│       └── utils/
│
├── components/
├── lib/
└── server/

prisma/
└── schema.prisma
```

---

# 26. Validação

Schemas devem ser compartilhados sempre que possível.

Utilizar Zod para:

- formulários;
- APIs;
- imports;
- dados estruturados;
- validações de domínio apropriadas.

Evitar duplicar regras entre frontend e backend.

---

# 27. Identificadores

Não reproduzir a geração de IDs do protótipo baseada em
timestamp/random.

Utilizar:

```text
UUID
```

ou

```text
CUID2
```

---

# 28. Exclusão lógica

Entidades importantes devem considerar soft delete.

Exemplo:

```text
deletedAt
```

Especialmente:

- projetos;
- módulos;
- versões;
- documentos;
- registros relevantes para auditoria.

---

# 29. Editor de conteúdo rico

O protótipo utiliza `document.execCommand`.

Essa implementação não deve ser levada para produção.

Utilizar editor moderno, por exemplo baseado em TipTap/ProseMirror.

Preferencialmente armazenar conteúdo estruturado em JSON.

Não armazenar HTML arbitrário sem sanitização.

---

# 30. Segurança

Requisitos mínimos:

- autenticação server-side;
- autorização server-side;
- isolamento entre organizações;
- proteção contra IDOR;
- validação de uploads;
- sanitização de conteúdo rico;
- rate limiting em endpoints sensíveis;
- logs de segurança;
- HTTPS;
- secrets apenas no servidor;
- validação de payload;
- tratamento seguro de erros.

---

# 31. Importação e exportação JSON

Manter como recurso auxiliar.

O formato deve possuir versão de schema.

Exemplo:

```json
{
  "schemaVersion": "1.0",
  "product": "DSR",
  "module": "SGSI_SCOPE",
  "data": {}
}
```

Isso permitirá futuras migrações.

---

# 32. Bibliotecas reutilizáveis

O produto deve permitir evolução para bibliotecas administráveis de:

- requisitos legais;
- categorias de ativos;
- tipos tecnológicos;
- modelos de texto;
- templates documentais;
- classificações.

Evitar hardcode permanente dessas informações nos componentes.

---

# 33. Inteligência Artificial --- evolução futura

IA poderá futuramente apoiar o especialista em atividades como:

- melhorar redação;
- resumir contexto;
- identificar inconsistências;
- sugerir perguntas;
- auxiliar elaboração de justificativas;
- comparar versões;
- identificar campos incompletos.

Regra obrigatória:

> IA oferece sugestões. O especialista decide.

Nenhuma sugestão de IA deve sobrescrever automaticamente conteúdo
aprovado.

---

# 34. Fora do escopo do MVP

Não implementar inicialmente:

- avaliação automática de conformidade ISO 27001;
- score de maturidade;
- recomendação automática do escopo;
- inventário completo/CMDB;
- gestão completa de riscos;
- Statement of Applicability;
- gestão de controles;
- auditoria completa;
- assinatura eletrônica complexa;
- workflow corporativo avançado de aprovação.

Esses recursos poderão virar módulos próprios do DSR.

---

# 35. Diretrizes de UX/UI

Preservar a identidade visual e a lógica funcional do protótipo.

Paleta de referência:

```text
Primary:    #2C3E50
Accent:     #E67E22
Blue:       #2980B9
Green:      #27AE60
Yellow:     #F1C40F
Red:        #E74C3C
Graphite:   #3F464C
Light Gray: #ECEFF1
```

Tipografia de referência:

```text
Lato
```

Suportar:

- tema claro;
- tema escuro.

A experiência deve transmitir:

- consultoria;
- segurança;
- governança;
- metodologia;
- profissionalismo;
- simplicidade.

Evitar aparência de formulário administrativo genérico.

---

# 36. Responsividade

Prioridades:

1.  Desktop;
2.  Tablet;
3.  Mobile.

Mobile deve permitir principalmente:

- consulta;
- revisão;
- pequenas alterações.

Editores complexos de diagramas não precisam ser totalmente otimizados
para celular no primeiro MVP.

---

# 37. Diagramas

Criar uma camada independente para diagramas:

```text
ValueChainDiagram
TopologyDiagram
ArchitectureDiagram
```

Responsabilidades:

- receber dados estruturados;
- calcular layout;
- renderizar;
- permitir exportação;
- ser reutilizada em documentos.

O domínio nunca deve depender diretamente de SVG.

SVG, Canvas ou outra tecnologia são apenas formas de renderização.

---

# 38. Migração do protótipo HTML

O HTML v0.1.3 deve ser tratado como:

> referência funcional e visual.

Devem ser preservados:

- conceitos;
- campos;
- fluxo;
- textos relevantes;
- regras;
- diagramas;
- documentos;
- identidade visual.

Não devem ser copiados como arquitetura:

- objeto global monolítico;
- `localStorage` como banco principal;
- manipulação imperativa do DOM;
- `document.execCommand`;
- geração de IDs por timestamp;
- exportação diretamente acoplada ao formulário;
- código monolítico.

---

# 39. Critérios de aceite do MVP

O MVP estará funcional quando:

1.  usuário puder autenticar;
2.  usuário puder criar organização;
3.  usuário puder criar projeto;
4.  projeto puder ativar o Escopômetro;
5.  dados da organização puderem ser reutilizados;
6.  etapa Empresa estiver funcional;
7.  etapa Contexto estiver funcional;
8.  stakeholders puderem ser cadastrados;
9.  requisitos puderem ser cadastrados;
10. CGSI puder ser configurado;
11. declaração formal do escopo puder ser registrada;
12. justificativa executiva puder ser registrada;
13. cadeia de valor puder ser criada;
14. itens puderem ser classificados como dentro, fora ou interface;
15. diagrama da cadeia puder ser visualizado;
16. topologia puder ser cadastrada;
17. diagrama de topologia puder ser visualizado;
18. arquitetura puder ser cadastrada;
19. localidades puderem ser cadastradas;
20. colaboradores/áreas puderem ser cadastrados;
21. ativos puderem ser cadastrados;
22. fornecedores/prestadores puderem ser cadastrados;
23. prévia consolidada estiver disponível;
24. documentos DOCX/PPTX puderem ser gerados;
25. dados persistirem no servidor;
26. regras de autorização e multitenancy estiverem implementadas;
27. alterações relevantes gerarem auditoria;
28. versões aprovadas estiverem protegidas contra sobrescrita
    silenciosa.

---

# 40. Fases de implementação

## Fase 1 --- Foundation

- projeto Next.js;
- design system;
- autenticação;
- PostgreSQL;
- Prisma;
- usuários;
- organizações;
- projetos;
- RBAC;
- estrutura modular.

## Fase 2 --- Core Escopômetro

- Empresa;
- Contexto;
- Requisitos;
- CGSI;
- Escopo;
- autosave.

## Fase 3 --- Scope Engine

- cadeia de valor;
- topologia;
- arquitetura;
- classificações;
- diagramas.

## Fase 4 --- Limites

- localidades;
- colaboradores;
- ativos;
- prestadores;
- aprovação;
- revisões.

## Fase 5 --- Documentos

- prévia;
- DOCX;
- PPTX;
- armazenamento;
- histórico de documentos.

## Fase 6 --- Productização

- auditoria;
- versionamento;
- melhorias de RBAC;
- bibliotecas;
- importação/exportação;
- UX;
- preparação para novos módulos.

---

# 41. Regra de implementação para Claude Code

Antes de implementar qualquer funcionalidade, identificar:

```text
1. Entidade de domínio
2. Schema
3. Validação
4. Autorização
5. Repository
6. Service
7. API / Server Action
8. UI
9. Testes
10. Impacto de multitenancy
```

Não implementar regra de negócio exclusivamente dentro de componentes
React.

---

# 42. Testes

Cobertura mínima para regras importantes:

- autorização;
- isolamento entre organizações;
- criação/edição de projetos;
- classificação de escopo;
- versionamento;
- aprovação;
- importação;
- geração documental;
- validação;
- cálculo do percentual de preenchimento.

Testes E2E devem cobrir o fluxo principal do Escopômetro.

---

# 43. Evolução do DSR

O Escopômetro deve ser desenvolvido como módulo, não como aplicação
isolada.

Visão futura possível:

```text
Projeto ISO 27001
├── Identificômetro
├── Escopômetro SGSI
├── Gestão de Riscos
├── SoA
├── Plano de Tratamento
├── Auditoria
├── Documentos
├── Evidências
└── Histórico
```

Os módulos devem compartilhar dados através das entidades centrais do
DSR.

---

# 44. Decisões arquiteturais não negociáveis

1.  DSR é a plataforma; Escopômetro é um módulo.
2.  Organização e Projeto são entidades centrais reutilizáveis.
3.  O Escopômetro não decide automaticamente o escopo.
4.  Dados importados são referência.
5.  Backend é a fonte oficial de dados.
6.  Multitenancy deve existir desde o início.
7.  Autorização deve ser validada no servidor.
8.  Diagramas devem ser derivados de dados estruturados.
9.  Documentos devem ser gerados por serviço independente.
10. Versões aprovadas precisam de rastreabilidade.
11. Conteúdo rico precisa ser armazenado e renderizado com segurança.
12. O código do protótipo não deve ser utilizado como arquitetura de
    produção.
13. Novos módulos devem conseguir utilizar a mesma estrutura de
    organização, projeto, usuários, documentos e auditoria.

---

# 45. Próximos documentos recomendados

Após este PRD, criar:

```text
CLAUDE.md
docs/architecture.md
docs/database.md
docs/modules/sgsi-scope.md
```

### CLAUDE.md

Deve conter as regras permanentes que o Claude Code precisa respeitar
durante todo o desenvolvimento.

### docs/architecture.md

Deve detalhar:

- arquitetura;
- camadas;
- multitenancy;
- autorização;
- serviços;
- repositories;
- documentos;
- diagramas;
- storage;
- auditoria.

### docs/database.md

Deve detalhar:

- entidades;
- relacionamentos;
- enums;
- índices;
- soft delete;
- versionamento;
- schema Prisma.

### docs/modules/sgsi-scope.md

Deve conter a especificação funcional detalhada das oito etapas do
Escopômetro.

---

## Conclusão

O protótipo atual demonstra de forma consistente a experiência e as
funcionalidades esperadas para o Escopômetro SGSI.

A implementação definitiva deve transformar essa experiência em um
módulo sustentável dentro do **DSR --- Daryus Resilient Services**, com
arquitetura preparada para múltiplos clientes, múltiplos projetos, novos
módulos, versionamento, auditoria, documentos e evolução futura com
recursos de inteligência artificial.

O objetivo não é simplesmente converter o HTML em React.

O objetivo é transformar o protótipo em um **produto modular, seguro,
rastreável e evolutivo**.
