import type { DiagramData, DiagramLayout } from './types';
import { computeSequentialLayout } from './layout/sequential-layout';

/** Cadeia de Valor (PRD secao 12): funcao pura dados -> layout, sem depender de SVG. */
export function computeValueChainLayout(data: DiagramData): DiagramLayout {
  return computeSequentialLayout(data);
}
