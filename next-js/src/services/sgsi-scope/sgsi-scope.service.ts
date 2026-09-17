import { backendFetch } from '../http/backend-client';

export interface DocumentControl {
  id: string;
  sgsiScopeId: string;
  classification: string | null;
  version: string | null;
  documentDate: string | null;
  validUntil: string | null;
  preparedByUserId: string | null;
  approvedByUserId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface DocumentControlInput {
  classification?: string | null;
  version?: string | null;
  documentDate?: string | null;
  validUntil?: string | null;
  preparedByUserId?: string | null;
  approvedByUserId?: string | null;
}

export interface SgsiScope {
  id: string;
  projectId: string;
  moduleInstanceId: string;
  currentVersionNumber: number;
  currentVersionStatus: 'DRAFT' | 'APPROVED';
  documentControl: DocumentControl | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export function activateSgsiScopeModule(
  token: string,
  projectId: string,
): Promise<SgsiScope> {
  return backendFetch<SgsiScope>(`/projects/${projectId}/modules`, {
    method: 'POST',
    token,
    body: JSON.stringify({ moduleKey: 'SGSI_SCOPE' }),
  });
}

export function getSgsiScope(
  token: string,
  projectId: string,
): Promise<SgsiScope> {
  return backendFetch<SgsiScope>(`/projects/${projectId}/sgsi-scope`, {
    token,
  });
}

export function updateDocumentControl(
  token: string,
  projectId: string,
  input: DocumentControlInput,
): Promise<DocumentControl> {
  return backendFetch<DocumentControl>(
    `/projects/${projectId}/sgsi-scope/document-control`,
    {
      method: 'PATCH',
      token,
      body: JSON.stringify(input),
    },
  );
}
