import { describe, expect, it } from 'vitest';

import { computeGroupedColumnLayout } from '../layout/grouped-column-layout';
import type { DiagramData } from '../types';

describe('computeGroupedColumnLayout', () => {
  it('agrupa nos em colunas por group, preservando a ordem de entrada', () => {
    const data: DiagramData = {
      nodes: [
        { id: 'n1', label: 'Rede A', classification: 'in-scope', group: 'rede' },
        { id: 'n2', label: 'Sistema A', classification: 'interface', group: 'sistema' },
        { id: 'n3', label: 'Rede B', classification: 'out-scope', group: 'rede' },
      ],
      connections: [{ id: 'l1', fromNodeId: 'n1', toNodeId: 'n2' }],
    };

    const layout = computeGroupedColumnLayout(data);

    expect(layout.nodes.map((node) => node.id)).toEqual(['n1', 'n3', 'n2']);
    expect(layout.nodes[0].x).toBe(layout.nodes[1].x);
    expect(layout.nodes[2].x).toBeGreaterThan(layout.nodes[0].x);
    expect(layout.connections).toHaveLength(1);
    expect(layout.invalidConnectionIds).toEqual([]);
  });

  it('trata conexao para no inexistente graciosamente', () => {
    const data: DiagramData = {
      nodes: [{ id: 'n1', label: 'Isolado', classification: 'in-scope' }],
      connections: [{ id: 'l1', fromNodeId: 'n1', toNodeId: 'fantasma' }],
    };

    const layout = computeGroupedColumnLayout(data);

    expect(layout.nodes).toHaveLength(1);
    expect(layout.connections).toEqual([]);
    expect(layout.invalidConnectionIds).toEqual(['l1']);
  });
});
