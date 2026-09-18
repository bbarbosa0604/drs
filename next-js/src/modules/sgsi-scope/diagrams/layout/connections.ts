import type { DiagramConnection, PositionedConnection, PositionedNode } from '../types';

function centerOf(node: PositionedNode): { x: number; y: number } {
  return { x: node.x + node.width / 2, y: node.y + node.height / 2 };
}

/**
 * Resolve conexoes contra os nos ja posicionados. Uma conexao para um
 * `fromNodeId`/`toNodeId` inexistente e omitida (nao quebra as demais) e seu
 * id volta em `invalidConnectionIds` para o chamador decidir como sinalizar.
 */
export function resolveConnections(
  nodes: PositionedNode[],
  connections: DiagramConnection[],
): { connections: PositionedConnection[]; invalidConnectionIds: string[] } {
  const nodeById = new Map(nodes.map((node) => [node.id, node]));
  const resolved: PositionedConnection[] = [];
  const invalidConnectionIds: string[] = [];

  for (const connection of connections) {
    const from = nodeById.get(connection.fromNodeId);
    const to = nodeById.get(connection.toNodeId);

    if (!from || !to) {
      invalidConnectionIds.push(connection.id);
      continue;
    }

    resolved.push({
      id: connection.id,
      label: connection.label,
      from: centerOf(from),
      to: centerOf(to),
    });
  }

  return { connections: resolved, invalidConnectionIds };
}
