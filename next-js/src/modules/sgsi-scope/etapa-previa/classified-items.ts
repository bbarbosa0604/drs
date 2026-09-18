import type { ScopeClassification } from '@/services/sgsi-scope/scope-engine.service';

/**
 * Forma comum para qualquer entidade classificavel (PRD secao 12/44) exibida
 * na previa (Etapa 8). Apenas para apresentacao - nao e um modelo de
 * dominio novo, so um adaptador de exibicao sobre os dados ja retornados
 * pelos endpoints das Etapas 5-7 (nao duplica agregacao que devesse vir do
 * backend, PRD - Task 025).
 */
export interface ClassifiedItem {
  id: string;
  label: string;
  origin: string;
  classification: ScopeClassification | null;
}

export interface ClassifiedGroups {
  inScope: ClassifiedItem[];
  outScope: ClassifiedItem[];
  interface: ClassifiedItem[];
  unclassified: ClassifiedItem[];
}

export function groupByClassification(items: ClassifiedItem[]): ClassifiedGroups {
  const groups: ClassifiedGroups = {
    inScope: [],
    outScope: [],
    interface: [],
    unclassified: [],
  };

  for (const item of items) {
    switch (item.classification) {
      case 'IN_SCOPE':
        groups.inScope.push(item);
        break;
      case 'OUT_SCOPE':
        groups.outScope.push(item);
        break;
      case 'INTERFACE':
        groups.interface.push(item);
        break;
      default:
        groups.unclassified.push(item);
    }
  }

  return groups;
}
