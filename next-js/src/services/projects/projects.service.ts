import { backendFetch } from '../http/backend-client';

export type ProjectStatus =
  | 'DRAFT'
  | 'IN_PROGRESS'
  | 'IN_REVIEW'
  | 'WAITING_APPROVAL'
  | 'APPROVED'
  | 'ARCHIVED';

/** Reflete o schema `Project` de contracts/openapi.yaml. */
export interface Project {
  id: string;
  name: string;
  organizationId: string;
  description: string | null;
  responsibleUserId: string;
  participantUserIds: string[];
  startDate: string | null;
  expectedEndDate: string | null;
  status: ProjectStatus;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

/** Campos aceitos por `POST /projects` e `PATCH /projects/:id`. */
export interface ProjectInput {
  name: string;
  organizationId: string;
  responsibleUserId: string;
  description?: string | null;
  participantUserIds?: string[];
  startDate?: string | null;
  expectedEndDate?: string | null;
  status?: ProjectStatus;
}

export function listProjects(
  token: string,
  organizationId?: string,
): Promise<Project[]> {
  const query = organizationId
    ? `?organizationId=${encodeURIComponent(organizationId)}`
    : '';

  return backendFetch<Project[]>(`/projects${query}`, { token });
}

export function getProject(token: string, id: string): Promise<Project> {
  return backendFetch<Project>(`/projects/${id}`, { token });
}

export function createProject(
  token: string,
  input: ProjectInput,
): Promise<Project> {
  return backendFetch<Project>('/projects', {
    method: 'POST',
    token,
    body: JSON.stringify(input),
  });
}

export function updateProject(
  token: string,
  id: string,
  input: ProjectInput,
): Promise<Project> {
  return backendFetch<Project>(`/projects/${id}`, {
    method: 'PATCH',
    token,
    body: JSON.stringify(input),
  });
}
