# Styling

## Objetivo

Este arquivo define como estilo e escrito nesta stack. O padrao e Tailwind v4 com tokens declarados em `@theme` dentro de `src/app/globals.css`. O objetivo e ter uma fonte unica de valor visual, para que mudanca de marca seja edicao de token, nao varredura de componente.

## Tokens Em 3 Niveis

- Nivel 1, raw: o valor bruto da marca. Cor, escala de espaco, familia de fonte, raio, sombra. Nome descreve o valor, nao o uso.
- Nivel 2, semantico: o papel do valor na interface. Superficie, texto padrao, texto secundario, borda, acento, estado de erro. Nome descreve intencao.
- Nivel 3, componente ou layout: o token de um componente especifico que precisa fugir do semantico. Existe so quando o semantico nao resolve.

Quem pode usar qual nivel:

- componente usa nivel 2 e, quando existir, nivel 3
- nivel 3 e definido a partir do nivel 2
- nivel 2 e definido a partir do nivel 1
- componente nunca usa nivel 1 direto

## Regras De Uso

- Declarar todo token em `@theme`, em um lugar so.
- Usar token semantico existente antes de criar token novo.
- Criar token de componente somente quando o semantico nao descrever o caso.
- Usar `clsx` para classe condicional.
- Manter ordem de classe previsivel: layout, depois espaco, depois tipografia, depois cor.
- Extrair componente quando a mesma sequencia de classe se repetir em tres lugares.
- Toda cor de texto e fundo deve formar par com contraste conferido. Ver `docs/ai/ACCESSIBILITY.md`.

## O Que Nao Fazer

- Nao criar CSS Module. Esta stack nao usa.
- Nao escrever valor arbitrario quando existir token equivalente.
- Nao usar `!important`.
- Nao definir token semantico dentro de bloco de componente.
- Nao usar `style` inline, salvo valor calculado em runtime.
- Nao duplicar paleta em arquivo de configuracao paralelo.

## Checklist Rapido

- Todo valor visual novo virou token ou usou token existente
- Nenhum valor arbitrario com token equivalente disponivel
- Nenhum CSS Module criado
- Componente nao referencia token de nivel 1
- Par de cor com contraste conferido

- Todos os padroes e orientacoes descritos devem ser utilizados para resolver problemas reais e nao por antecipacao. Evitar overengineering.
