/**
 * Contrato de dados comum aos diagramas do Scope Engine (PRD secoes 12, 13, 37, 44):
 * o dominio nunca depende diretamente de SVG - cada diagrama e uma funcao pura
 * dados -> layout, e o render (hoje em SVG) e uma camada isolada e substituivel.
 */

export type ScopeClassification = 'in-scope' | 'out-scope' | 'interface';

export interface DiagramNode {
  id: string;
  label: string;
  classification: ScopeClassification;
  /** Agrupamento livre (ex.: atividade primaria/apoio, camada de topologia, componente). */
  group?: string;
}

export interface DiagramConnection {
  id: string;
  fromNodeId: string;
  toNodeId: string;
  label?: string;
}

export interface DiagramData {
  nodes: DiagramNode[];
  connections: DiagramConnection[];
}

export interface PositionedNode extends DiagramNode {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface PositionedConnection {
  id: string;
  label?: string;
  from: { x: number; y: number };
  to: { x: number; y: number };
}

export interface DiagramLayout {
  nodes: PositionedNode[];
  connections: PositionedConnection[];
  width: number;
  height: number;
  /**
   * Conexoes que referenciam um no inexistente. Omitidas de `connections` mas
   * reportadas aqui para o chamador decidir como sinalizar (PRD: tratar
   * graciosamente, nunca quebrar a renderizacao inteira).
   */
  invalidConnectionIds: string[];
}
