import type { DiagramData } from './types';
import { computeValueChainLayout } from './value-chain-diagram';
import { DiagramSvg } from './render/DiagramSvg';

/** Diagrama de Cadeia de Valor (PRD secao 12). Componente puro: dados -> render. */
export function ValueChainDiagram({ data }: { data: DiagramData }) {
  const layout = computeValueChainLayout(data);

  return (
    <DiagramSvg
      layout={layout}
      title="Diagrama da cadeia de valor"
      emptyMessage="Nenhum bloco de cadeia de valor cadastrado ainda."
    />
  );
}
