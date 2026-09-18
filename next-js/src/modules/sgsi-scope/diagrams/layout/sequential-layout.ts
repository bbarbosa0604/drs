import type { DiagramData, DiagramLayout, PositionedNode } from '../types';
import { resolveConnections } from './connections';
import { COLUMN_GAP, NODE_HEIGHT, NODE_WIDTH, PADDING, ROW_GAP } from './geometry';

const UNGROUPED = 'sem-grupo';

/**
 * Layout em linhas: uma linha por `group` (ordem de primeira ocorrencia nos
 * dados), nos dentro da linha em sequencia horizontal na ordem de entrada.
 * Usado pela Cadeia de Valor (PRD secao 12) - o numero e o nome dos grupos
 * (ex.: atividades primarias/de apoio) vem 100% dos dados, nao e fixo aqui.
 */
export function computeSequentialLayout(data: DiagramData): DiagramLayout {
  const rowOrder: string[] = [];
  const rows = new Map<string, PositionedNode[]>();

  data.nodes.forEach((node, index) => {
    const groupKey = node.group ?? UNGROUPED;

    if (!rows.has(groupKey)) {
      rows.set(groupKey, []);
      rowOrder.push(groupKey);
    }

    const rowNodes = rows.get(groupKey)!;
    const columnIndex = rowNodes.length;
    const rowIndex = rowOrder.indexOf(groupKey);

    rowNodes.push({
      ...node,
      x: PADDING + columnIndex * (NODE_WIDTH + COLUMN_GAP),
      y: PADDING + rowIndex * (NODE_HEIGHT + ROW_GAP),
      width: NODE_WIDTH,
      height: NODE_HEIGHT,
    });

    void index;
  });

  const nodes = rowOrder.flatMap((groupKey) => rows.get(groupKey)!);
  const maxColumns = Math.max(1, ...rowOrder.map((groupKey) => rows.get(groupKey)!.length));

  const width = PADDING * 2 + maxColumns * NODE_WIDTH + (maxColumns - 1) * COLUMN_GAP;
  const height = PADDING * 2 + rowOrder.length * NODE_HEIGHT + (rowOrder.length - 1) * ROW_GAP;

  const { connections, invalidConnectionIds } = resolveConnections(nodes, data.connections);

  return {
    nodes,
    connections,
    width: Math.max(width, PADDING * 2 + NODE_WIDTH),
    height: Math.max(height, PADDING * 2 + NODE_HEIGHT),
    invalidConnectionIds,
  };
}
