import { type ScopeApprovalEntity } from '../../sgsi-scope/limits/entities/scope-approval.entity';
import { type ScopeDefinitionEntity } from '../../sgsi-scope/scope-definition/entities/scope-definition.entity';

/**
 * Dados agregados que os 3 templates consomem (PRD secao 17/44): os
 * templates nunca acessam repository/entity direto, so este objeto -
 * permite o template evoluir sem alterar o modelo de dominio.
 */
export interface DocumentContext {
  organizationName: string;
  projectName: string;
  versionNumber: number;
  versionStatus: 'DRAFT' | 'APPROVED';
  scopeDefinition: ScopeDefinitionEntity;
  approval: ScopeApprovalEntity | null;
}
