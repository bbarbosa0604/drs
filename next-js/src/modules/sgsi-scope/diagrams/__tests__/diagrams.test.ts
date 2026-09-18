import { describe, expect, it } from 'vitest';

import { computeArchitectureLayout } from '../architecture-diagram';
import { computeTopologyLayout } from '../topology-diagram';
import { computeValueChainLayout } from '../value-chain-diagram';
import type { DiagramData } from '../types';

const sample: DiagramData = {
  nodes: [{ id: 'a', label: 'A', classification: 'in-scope', group: 'g1' }],
  connections: [],
};

describe('modulos de diagrama (contrato publico dados -> layout)', () => {
  it('computeValueChainLayout posiciona os nos de entrada', () => {
    expect(computeValueChainLayout(sample).nodes).toHaveLength(1);
  });

  it('computeTopologyLayout posiciona os nos de entrada', () => {
    expect(computeTopologyLayout(sample).nodes).toHaveLength(1);
  });

  it('computeArchitectureLayout posiciona os nos de entrada', () => {
    expect(computeArchitectureLayout(sample).nodes).toHaveLength(1);
  });
});
