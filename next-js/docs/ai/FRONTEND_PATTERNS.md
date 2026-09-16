# Frontend Patterns

## Organizacao De Modulos

- `src/app/` deve orquestrar rotas, layouts e paginas, sem concentrar regra de integracao complexa.
- `components/` deve compor UI reutilizavel e regras de apresentacao.
- `services/` deve expor funcoes de negocio e integracao.
- `hooks/` deve ligar client components aos services e stores quando houver interatividade.

## Design Patterns Aplicaveis

### Strategy

- Uso: variar comportamento por status, tipo ou contexto sem proliferar `if` e `switch`.
- Exemplo: mapear status para label, tom visual e descricao acessivel.

### Factory

- Uso: centralizar criacao de clientes HTTP, formatadores ou objetos configurados repetidamente.
- Beneficio: configuracao consistente de headers, base URL, cache e timeout.

### Adapter

- Uso: transformar payload da API para o modelo interno consumido pela UI.
- Regra: pages e components nao devem conhecer detalhes do payload externo quando houver diferenca estrutural.

### Observer

- Uso: permitir que layouts e components reajam a mudancas globais de autenticacao, tema ou preferencias.
- Regra: aplicar somente para estado realmente compartilhado.

### Ports E Adapters

- Uso: isolar o front da ferramenta de persistencia quando o conteudo vier de CMS ou banco local.
- Regra: `core/` declara o port e a entidade; `adapters/` implementa; page consome o port.
- Quando nao usar: nao criar camada de caso de uso sem regra de negocio, nem port para dado que so existe em um lugar e nunca vai trocar.

### Decorator

- Uso: adicionar retry, logging, cache ou telemetria sem alterar a assinatura do service.

## Patterns Do Next.js

- Usar `loading.tsx` para estado de carregamento de rota quando aplicavel.
- Usar `error.tsx` para erros recuperaveis em segmentos de rota.
- Usar `not-found.tsx` para ausencia semantica de recurso.
- Usar route handlers apenas quando a aplicacao precisar expor endpoints no proprio Next.js.

## Campos De Formulario Com Mascara

Padrao do scaffold para telefone, CPF, CNPJ, CEP e formatos analogos: `react-imask`
(wrapper React do `imask`). Motivo da escolha: cobre todos os formatos comuns de
formulario brasileiro com a mesma biblioteca (nao uma por campo), tem bindings React
oficiais, e funciona sem `value`/`onChange` controlado — a mascara escreve direto no
`<input>` nativo, entao `FormData` le o valor formatado normalmente, sem estado React por
campo.

- Componente proprio por campo em `components/ui/` (ex.: `PhoneInput.tsx`), nunca
  `IMaskInput` espalhado direto nos formularios — um lugar so para ajustar o padrao.
- `inputRef` (nao `ref`) para acessar o `<input>` nativo — API do `react-imask`, usado
  para foco em campo com erro.
- **Telefone com fixo e celular (10 ou 11 digitos): usar mascara dinamica, nunca um
  padrao unico com digito opcional** (`"(00) 0000[0]-0000"`). O `[0]` do IMask preenche
  assim que um digito esta disponivel, nao conforme a contagem final do numero — um
  fixo de 10 digitos digitado sequencialmente quebra o ultimo bloco (`"1133334444"` vira
  `"(11) 33334-444"` em vez de `"(11) 3333-4444"`). Bug real, encontrado testando os dois
  formatos, nao hipotetico. A forma correta e um array de duas mascaras fixas
  (`"(00) 0000-0000"` e `"(00) 00000-0000"`) com uma funcao `dispatch`: conta os digitos
  do valor atual mais o que acabou de ser digitado, e escolhe a segunda mascara quando
  passar de 10 digitos.
- Validar o formato tambem no servidor (nunca confiar so na mascara do cliente — quem
  chama a rota direto, sem carregar o JS, pula a mascara inteira).
- `inputMode` e `autoComplete` corretos por tipo de campo (`inputMode="numeric"` para
  telefone/CPF/CNPJ/CEP, `autoComplete="tel"` para telefone) — teclado numerico no
  mobile, autopreenchimento do navegador.

## Quando Aplicar Patterns

- Use Strategy quando a variacao for orientada por tipo, estado ou contexto.
- Use Factory para objetos configurados repetidamente.
- Use Adapter quando o contrato externo nao for o ideal para a UI.
- Use Decorator para retry, logging, cache ou telemetria.
- Use Ports e Adapters quando o conteudo vier de CMS ou banco local.
- Use primitives do App Router quando elas representarem melhor o estado da rota.

- Todos os padroes e orientacoes descritos devem ser utilizados para resolver problemas reais e nao por antecipacao. Evitar overengineering.
