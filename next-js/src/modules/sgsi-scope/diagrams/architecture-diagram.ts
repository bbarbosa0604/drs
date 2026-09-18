import type { DiagramData, DiagramLayout } from './types';
import { computeGroupedColumnLayout } from './layout/grouped-column-layout';

/** Arquitetura (PRD secoes 13, 37): funcao pura dados -> layout, sem depender de SVG. */
export function computeArchitectureLayout(data: DiagramData): DiagramLayout {
  return computeGroupedColumnLayout(data);
}
