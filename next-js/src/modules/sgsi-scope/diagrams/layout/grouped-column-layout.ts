import type { DiagramData, DiagramLayout, PositionedNode } from '../types';
import { resolveConnections } from './connections';
import { COLUMN_GAP, NODE_HEIGHT, NODE_WIDTH, PADDING, ROW_GAP } from './geometry';

const UNGROUPED = 'sem-grupo';

/**
 * Layout em colunas: uma coluna por `group` (ordem de primeira ocorrencia nos
 * dados), nos dentro da coluna em sequencia vertical na ordem de entrada.
 * Usado por Topologia e Arquitetura (PRD secoes 12-13) - grafo de nos e
 * conexoes onde o agrupamento (camada/tipo de componente) vem dos dados.
 */
export function computeGroupedColumnLayout(data: DiagramData): DiagramLayout {
  const columnOrder: string[] = [];
  const columns = new Map<string, PositionedNode[]>();

  data.nodes.forEach((node) => {
    const groupKey = node.group ?? UNGROUPED;

    if (!columns.has(groupKey)) {
      columns.set(groupKey, []);
      columnOrder.push(groupKey);
    }

    const columnNodes = columns.get(groupKey)!;
    const rowIndex = columnNodes.length;
    const columnIndex = columnOrder.indexOf(groupKey);

    columnNodes.push({
      ...node,
      x: PADDING + columnIndex * (NODE_WIDTH + COLUMN_GAP),
      y: PADDING + rowIndex * (NODE_HEIGHT + ROW_GAP),
      width: NODE_WIDTH,
      height: NODE_HEIGHT,
    });
  });

  const nodes = columnOrder.flatMap((groupKey) => columns.get(groupKey)!);
  const maxRows = Math.max(1, ...columnOrder.map((groupKey) => columns.get(groupKey)!.length));

  const width = PADDING * 2 + columnOrder.length * NODE_WIDTH + (columnOrder.length - 1) * COLUMN_GAP;
  const height = PADDING * 2 + maxRows * NODE_HEIGHT + (maxRows - 1) * ROW_GAP;

  const { connections, invalidConnectionIds } = resolveConnections(nodes, data.connections);

  return {
    nodes,
    connections,
    width: Math.max(width, PADDING * 2 + NODE_WIDTH),
    height: Math.max(height, PADDING * 2 + NODE_HEIGHT),
    invalidConnectionIds,
  };
}
