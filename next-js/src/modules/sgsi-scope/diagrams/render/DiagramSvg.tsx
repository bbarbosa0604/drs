import { EmptyState } from '@/components/dashboard/EmptyState';

import type { DiagramLayout, ScopeClassification } from '../types';
import styles from './DiagramSvg.module.css';

const NODE_CLASS_BY_CLASSIFICATION: Record<ScopeClassification, string> = {
  'in-scope': styles.nodeInScope,
  'out-scope': styles.nodeOutScope,
  interface: styles.nodeInterface,
  unclassified: styles.nodeUnclassified,
};

const LABEL_CLASS_BY_CLASSIFICATION: Record<ScopeClassification, string> = {
  'in-scope': styles.labelInScope,
  'out-scope': styles.labelOnLight,
  interface: styles.labelOnLight,
  unclassified: styles.labelOnLight,
};

/**
 * Render generico de um `DiagramLayout` ja calculado, em SVG (escolha inicial
 * de tecnologia - PRD secoes 12, 37, 44). Nao conhece nenhuma regra de
 * negocio: so desenha nos e conexoes com a cor de classificacao de escopo.
 * Trocar a tecnologia de renderizacao no futuro (ex.: Canvas) significa
 * substituir este arquivo, sem tocar nos modulos de layout.
 */
export function DiagramSvg({
  layout,
  title,
  emptyMessage,
}: {
  layout: DiagramLayout;
  title: string;
  emptyMessage: string;
}) {
  if (layout.nodes.length === 0) {
    return <EmptyState message={emptyMessage} />;
  }

  return (
    <svg
      role="img"
      aria-label={title}
      viewBox={`0 0 ${layout.width} ${layout.height}`}
      className={styles.diagram}
    >
      {layout.connections.map((connection) => (
        <g key={connection.id}>
          <line
            className={styles.connection}
            x1={connection.from.x}
            y1={connection.from.y}
            x2={connection.to.x}
            y2={connection.to.y}
          />
          {connection.label ? (
            <text
              className={styles.connectionLabel}
              x={(connection.from.x + connection.to.x) / 2}
              y={(connection.from.y + connection.to.y) / 2 - 4}
              textAnchor="middle"
            >
              {connection.label}
            </text>
          ) : null}
        </g>
      ))}

      {layout.nodes.map((node) => (
        <g key={node.id}>
          <rect
            className={`${styles.node} ${NODE_CLASS_BY_CLASSIFICATION[node.classification]}`}
            x={node.x}
            y={node.y}
            width={node.width}
            height={node.height}
            rx={8}
          />
          <text
            className={LABEL_CLASS_BY_CLASSIFICATION[node.classification]}
            x={node.x + node.width / 2}
            y={node.y + node.height / 2}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize={13}
          >
            {node.label}
          </text>
        </g>
      ))}
    </svg>
  );
}
