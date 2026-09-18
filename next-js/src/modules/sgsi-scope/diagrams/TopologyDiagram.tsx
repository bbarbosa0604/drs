import type { DiagramData } from './types';
import { computeTopologyLayout } from './topology-diagram';
import { DiagramSvg } from './render/DiagramSvg';

/** Diagrama de Topologia (PRD secao 13). Componente puro: dados -> render. */
export function TopologyDiagram({ data }: { data: DiagramData }) {
  const layout = computeTopologyLayout(data);

  return (
    <DiagramSvg
      layout={layout}
      title="Diagrama de topologia"
      emptyMessage="Nenhum no de topologia cadastrado ainda."
    />
  );
}
