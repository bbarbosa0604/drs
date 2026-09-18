import { describe, expect, it } from 'vitest';

import { computeSequentialLayout } from '../layout/sequential-layout';
import type { DiagramData } from '../types';

describe('computeSequentialLayout', () => {
  it('agrupa nos em linhas por group, preservando a ordem de entrada', () => {
    const data: DiagramData = {
      nodes: [
        { id: 'p1', label: 'Compras', classification: 'in-scope', group: 'primaria' },
        { id: 'p2', label: 'Vendas', classification: 'in-scope', group: 'primaria' },
        { id: 's1', label: 'RH', classification: 'out-scope', group: 'apoio' },
      ],
      connections: [],
    };

    const layout = computeSequentialLayout(data);

    expect(layout.nodes.map((node) => node.id)).toEqual(['p1', 'p2', 's1']);
    expect(layout.nodes[0].y).toBe(layout.nodes[1].y);
    expect(layout.nodes[2].y).toBeGreaterThan(layout.nodes[0].y);
    expect(layout.nodes[1].x).toBeGreaterThan(layout.nodes[0].x);
  });

  it('usa um grupo padrao quando o no nao declara group', () => {
    const data: DiagramData = {
      nodes: [{ id: 'a', label: 'Sem grupo', classification: 'in-scope' }],
      connections: [],
    };

    const layout = computeSequentialLayout(data);

    expect(layout.nodes).toHaveLength(1);
    expect(layout.invalidConnectionIds).toEqual([]);
  });

  it('omite conexoes para nos inexistentes sem quebrar as demais', () => {
    const data: DiagramData = {
      nodes: [
        { id: 'a', label: 'A', classification: 'in-scope' },
        { id: 'b', label: 'B', classification: 'in-scope' },
      ],
      connections: [
        { id: 'c1', fromNodeId: 'a', toNodeId: 'b' },
        { id: 'c2', fromNodeId: 'a', toNodeId: 'inexistente' },
      ],
    };

    const layout = computeSequentialLayout(data);

    expect(layout.connections).toHaveLength(1);
    expect(layout.connections[0].id).toBe('c1');
    expect(layout.invalidConnectionIds).toEqual(['c2']);
  });

  it('retorna layout vazio (sem quebrar) quando nao ha nos', () => {
    const layout = computeSequentialLayout({ nodes: [], connections: [] });

    expect(layout.nodes).toEqual([]);
    expect(layout.connections).toEqual([]);
    expect(layout.invalidConnectionIds).toEqual([]);
  });
});
