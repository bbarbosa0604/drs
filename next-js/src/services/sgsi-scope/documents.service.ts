import { backendFetch } from '../http/backend-client';

/** PRD secao 17 - os 3 documentos do MVP (Task 026). */
export type GeneratedDocumentKind =
  | 'SCOPE_DECLARATION'
  | 'APPROVAL_PROPOSAL'
  | 'APPROVAL_PRESENTATION';

/**
 * Reflete `GeneratedDocument` do backend. Sem `downloadUrl` de proposito: o
 * backend exige bearer token, que o client component nao tem — o link de
 * download e sempre o proxy autenticado do next-js
 * (`/api/projects/:id/sgsi-scope/documents/:documentId/download`), montado
 * a partir do `id` por quem consome este tipo.
 */
export interface GeneratedDocument {
  id: string;
  sgsiScopeId: string;
  kind: GeneratedDocumentKind;
  fileName: string;
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
