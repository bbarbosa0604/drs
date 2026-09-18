import type {
  ScopeClassification,
  TopologyNodeType,
  ValueChainCategory,
} from '@/services/sgsi-scope/scope-engine.service';
import type { ScopeClassification as DiagramScopeClassification } from './diagrams';

/**
 * Rotulos em portugues dos enums do Scope Engine (PRD secoes 12-13, Task
 * 020). Usado pelas Etapas 5/6 (Tasks 021/022) - um lugar so para nao
 * duplicar a lista em cada formulario.
 */
export const VALUE_CHAIN_CATEGORY_OPTIONS: Array<{
  value: ValueChainCategory;
  label: string;
}> = [
  { value: 'INPUT', label: 'Entrada' },
  { value: 'PRIMARY_PROCESS', label: 'Processo primario' },
  { value: 'SUPPORT_PROCESS', label: 'Processo de apoio' },
  { value: 'OUTPUT', label: 'Saida' },
];

export const TOPOLOGY_NODE_TYPE_OPTIONS: Array<{
  value: TopologyNodeType;
  label: string;
}> = [
  { value: 'APPLICATION', label: 'Aplicacao' },
  { value: 'DATABASE', label: 'Banco de dados' },
  { value: 'NETWORK', label: 'Rede' },
  { value: 'FIREWALL', label: 'Firewall' },
  { value: 'CLOUD', label: 'Nuvem' },
  { value: 'SERVER', label: 'Servidor' },
  { value: 'USER', label: 'Usuario' },
  { value: 'INTERNET', label: 'Internet' },
  { value: 'THIRD_PARTY', label: 'Terceiro' },
  { value: 'PHYSICAL_UNIT', label: 'Unidade fisica' },
  { value: 'OTHER', label: 'Outro' },
];

export const SCOPE_CLASSIFICATION_OPTIONS: Array<{
  value: ScopeClassification;
  label: string;
}> = [
  { value: 'IN_SCOPE', label: 'Dentro do escopo' },
  { value: 'OUT_SCOPE', label: 'Fora do escopo' },
  { value: 'INTERFACE', label: 'Interface externa' },
];

const CATEGORY_LABEL_BY_VALUE = new Map(
  VALUE_CHAIN_CATEGORY_OPTIONS.map((option) => [option.value, option.label]),
);
const NODE_TYPE_LABEL_BY_VALUE = new Map(
  TOPOLOGY_NODE_TYPE_OPTIONS.map((option) => [option.value, option.label]),
);
const CLASSIFICATION_LABEL_BY_VALUE = new Map(
  SCOPE_CLASSIFICATION_OPTIONS.map((option) => [option.value, option.label]),
);

export function valueChainCategoryLabel(category: ValueChainCategory): string {
  return CATEGORY_LABEL_BY_VALUE.get(category) ?? category;
}

export function topologyNodeTypeLabel(type: TopologyNodeType): string {
  return NODE_TYPE_LABEL_BY_VALUE.get(type) ?? type;
}

/** `null`/omitido nunca e um default - e sempre "Nao classificado" (PRD secao 12/44). */
export function scopeClassificationLabel(
  classification: ScopeClassification | null | undefined,
): string {
  if (!classification) {
    return 'Nao classificado';
  }

  return CLASSIFICATION_LABEL_BY_VALUE.get(classification) ?? classification;
}

const DIAGRAM_CLASSIFICATION_BY_VALUE: Record<
  ScopeClassification,
  DiagramScopeClassification
> = {
  IN_SCOPE: 'in-scope',
  OUT_SCOPE: 'out-scope',
  INTERFACE: 'interface',
};

/** Adapta o enum do backend para o contrato de dados dos diagramas (Task 019). */
export function toDiagramClassification(
  classification: ScopeClassification | null,
): DiagramScopeClassification {
  if (!classification) {
    return 'unclassified';
  }

  return DIAGRAM_CLASSIFICATION_BY_VALUE[classification];
}
