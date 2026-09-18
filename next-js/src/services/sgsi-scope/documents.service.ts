import { backendFetch } from '../http/backend-client';

/**
 * PRD secao 17 - os 3 documentos do MVP. Contrato provisorio: o endpoint
 * real (`DocumentGenerationService`) e a Task 026, que roda depois desta
 * (Task 025) no backlog. Os tipos/paths aqui sao a interface esperada; se a
 * Task 026 definir algo diferente, atualizar este arquivo (e so este
 * arquivo - a UI nao muda) junto com a Task 026, nao antes.
 */
export type GeneratedDocumentKind =
  | 'SCOPE_DECLARATION'
  | 'APPROVAL_PROPOSAL'
  | 'APPROVAL_PRESENTATION';

export interface GeneratedDocument {
  id: string;
  sgsiScopeId: string;
  kind: GeneratedDocumentKind;
  fileName: string;
  downloadUrl: string;
  createdAt: string;
}

const PATH_BY_KIND: Record<GeneratedDocumentKind, string> = {
  SCOPE_DECLARATION: 'scope-declaration',
  APPROVAL_PROPOSAL: 'approval-proposal',
  APPROVAL_PRESENTATION: 'approval-presentation',
};

export function generateDocument(
  token: string,
  projectId: string,
  kind: GeneratedDocumentKind,
): Promise<GeneratedDocument> {
  return backendFetch<GeneratedDocument>(
    `/projects/${projectId}/sgsi-scope/documents/${PATH_BY_KIND[kind]}`,
    { method: 'POST', token },
  );
}
