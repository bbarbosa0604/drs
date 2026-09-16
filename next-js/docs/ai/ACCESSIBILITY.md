# Accessibility

## Objetivo

Definir praticas minimas de acessibilidade para interfaces Next.js.
Este guia deve ser aplicado em novas features e em manutencao de telas existentes.

## Checklist Rapido

- Navegacao completa por teclado (Tab, Shift+Tab, Enter, Space, Esc).
- Hierarquia de titulos coerente (`h1` ate `h6` sem saltos semanticos).
- Campos de formulario com `label` associado e mensagens de erro claras.
- Contraste de cor minimo em conformidade com WCAG AA.
- Conteudo e acoes compreensiveis sem depender apenas de cor ou icone.
- Estados dinamicos anunciados para tecnologias assistivas quando necessario.

## Regras Obrigatorias

### Semantica E Estrutura

- Preferir elementos HTML semanticos (`button`, `nav`, `main`, `form`, `table`) em vez de `div` generica.
- Manter uma estrutura logica de titulos e secoes para leitura por leitor de tela.
- Usar `aria-*` apenas quando semantica nativa nao resolver o caso.
- Em App Router, garantir que layouts e pages preservem landmarks claros.

### Teclado E Foco

- Todo elemento interativo deve ser focavel e acionavel por teclado.
- Nunca remover indicador de foco sem fornecer alternativa visivel equivalente.
- Garantir ordem de foco previsivel, respeitando a ordem visual e de leitura.
- Em modais, prender foco dentro do modal e devolver foco ao elemento de origem ao fechar.

### Formularios

- Associar cada campo a um `label` visivel.
- Conectar ajuda e erros com `aria-describedby` quando aplicavel.
- Exibir erro em texto claro, nao apenas por cor.
- Indicar obrigatoriedade e formato esperado antes da submissao.

### Conteudo, Midia E Links

- Toda imagem informativa deve ter `alt` significativo; imagem decorativa deve usar `alt=""`.
- Botoes somente com icone devem ter nome acessivel (`aria-label` ou texto oculto).
- Links devem descrever destino ou acao (evitar "clique aqui").
- Usar `next/image` quando fizer sentido, mantendo texto alternativo correto.

### Cor E Contraste

- Texto normal deve manter contraste minimo de 4.5:1 com o fundo.
- Texto grande e componentes de UI devem manter contraste minimo de 3:1.
- Informacao critica nao pode depender apenas de diferenca de cor.

### Movimento

- Toda animacao de entrada/transicao respeita `prefers-reduced-motion: reduce`: a
  transicao encurta a quase zero, o elemento continua aparecendo — nunca fica preso
  invisivel esperando uma animacao que o usuario pediu para nao ver.
- Ver `docs/ai/PERFORMANCE.md § Animacoes De Entrada` para o mecanismo (CSS +
  `IntersectionObserver`, sem lib).

### Estados Dinamicos

- Carregamentos relevantes devem ser comunicados de forma acessivel (`aria-busy`, mensagens de status).
- Alertas e feedbacks assincronos devem usar regiao `aria-live` apropriada.
- Mudancas de contexto devem ser claras para teclado e leitor de tela.

### Conteudo Vindo De CMS

- Campo de upload exige texto alternativo, com decorativo declarado explicitamente.
- Nivel de heading e decisao de codigo, nunca campo editavel.
- Richtext nao pode emitir `h1`.
- Link cadastrado no CMS precisa de rotulo que descreva o destino.
- Reordenar conteudo no CMS nao pode quebrar a ordem de foco da tela.

## Validacao Minima Antes De Entregar

- Teste manual com teclado em fluxo principal da tela.
- Verificacao de contraste nos elementos criticos da interface.
- Revisao de nomes acessiveis em botoes, links e campos.
- Validacao de mensagens de erro e estados de loading/feedback.

## Criterio De Aceite

Uma entrega de UI so esta concluida quando os itens deste guia forem atendidos ou quando gaps residuais estiverem documentados na task com plano de correcao.
