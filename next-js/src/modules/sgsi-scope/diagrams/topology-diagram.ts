import type { DiagramData, DiagramLayout } from './types';
import { computeGroupedColumnLayout } from './layout/grouped-column-layout';

/** Topologia (PRD secao 13): funcao pura dados -> layout, sem depender de SVG. */
export function computeTopologyLayout(data: DiagramData): DiagramLayout {
  return computeGroupedColumnLayout(data);
}
