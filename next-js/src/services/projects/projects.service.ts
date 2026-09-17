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

export function listProjects(
  token: string,
  organizationId?: string,
): Promise<Project[]> {
  const query = organizationId
    ? `?organizationId=${encodeURIComponent(organizationId)}`
    : '';

  return backendFetch<Project[]>(`/projects${query}`, { token });
}
