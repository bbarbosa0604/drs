import { backendFetch } from '../http/backend-client';

export type ContextAspectType = 'EXTERNAL' | 'INTERNAL';

export interface OrganizationContext {
  id: string;
  sgsiScopeId: string;
  history: { html: string } | null;
  createdAt: string;
  updatedAt: string;
}

export interface ContextAspect {
  id: string;
  sgsiScopeId: string;
  type: ContextAspectType;
  title: string;
  description: string | null;
  observations: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ContextSection {
  organizationContext: OrganizationContext | null;
  aspects: ContextAspect[];
}

export interface ContextAspectInput {
  type: ContextAspectType;
  title: string;
  description?: string | null;
  observations?: string | null;
}

export function getContextSection(
  token: string,
  projectId: string,
): Promise<ContextSection> {
  return backendFetch<ContextSection>(
    `/projects/${projectId}/sgsi-scope/context`,
    { token },
  );
}

export function updateOrganizationContextHistory(
  token: string,
  projectId: string,
  historyHtml: string | null,
): Promise<OrganizationContext> {
  return backendFetch<OrganizationContext>(
    `/projects/${projectId}/sgsi-scope/context/history`,
    {
      method: 'PATCH',
      token,
      body: JSON.stringify({ historyHtml }),
    },
  );
}

export function createContextAspect(
  token: string,
  projectId: string,
  input: ContextAspectInput,
): Promise<ContextAspect> {
  return backendFetch<ContextAspect>(
    `/projects/${projectId}/sgsi-scope/context/aspects`,
    {
      method: 'POST',
      token,
      body: JSON.stringify(input),
    },
  );
}

export function updateContextAspect(
  token: string,
  projectId: string,
  aspectId: string,
  input: Partial<ContextAspectInput>,
): Promise<ContextAspect> {
  return backendFetch<ContextAspect>(
    `/projects/${projectId}/sgsi-scope/context/aspects/${aspectId}`,
    {
      method: 'PATCH',
      token,
      body: JSON.stringify(input),
    },
  );
}

export function deleteContextAspect(
  token: string,
  projectId: string,
  aspectId: string,
): Promise<void> {
  return backendFetch<void>(
    `/projects/${projectId}/sgsi-scope/context/aspects/${aspectId}`,
    {
      method: 'DELETE',
      token,
    },
  );
}
