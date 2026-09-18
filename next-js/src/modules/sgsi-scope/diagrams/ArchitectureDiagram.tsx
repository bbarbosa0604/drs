import type { DiagramData } from './types';
import { computeArchitectureLayout } from './architecture-diagram';
import { DiagramSvg } from './render/DiagramSvg';

/** Diagrama de Arquitetura (PRD secoes 13, 37). Componente puro: dados -> render. */
export function ArchitectureDiagram({ data }: { data: DiagramData }) {
  const layout = computeArchitectureLayout(data);

  return (
    <DiagramSvg
      layout={layout}
      title="Diagrama de arquitetura"
      emptyMessage="Nenhum componente de arquitetura cadastrado ainda."
    />
  );
}
