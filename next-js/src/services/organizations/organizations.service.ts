import { backendFetch } from '../http/backend-client';

/** Reflete o schema `Organization` de contracts/openapi.yaml. */
export interface Organization {
  id: string;
  name: string;
  segment: string | null;
  employeeCount: string | null;
  geographicScope: string | null;
  productsServices: string | null;
  logoUrl: string | null;
  institutionalHistory: string | null;
  business: string | null;
  mission: string | null;
  vision: string | null;
  values: string[];
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

/** Campos aceitos por `POST /organizations` e `PATCH /organizations/:id`. */
export interface OrganizationInput {
  name: string;
  segment?: string | null;
  employeeCount?: string | null;
  geographicScope?: string | null;
  productsServices?: string | null;
  logoUrl?: string | null;
  institutionalHistory?: string | null;
  business?: string | null;
  mission?: string | null;
  vision?: string | null;
  values?: string[];
}

export function listOrganizations(token: string): Promise<Organization[]> {
  return backendFetch<Organization[]>('/organizations', { token });
}

export function getOrganization(
  token: string,
  id: string,
): Promise<Organization> {
  return backendFetch<Organization>(`/organizations/${id}`, { token });
}

export function createOrganization(
  token: string,
  input: OrganizationInput,
): Promise<Organization> {
  return backendFetch<Organization>('/organizations', {
    method: 'POST',
    token,
    body: JSON.stringify(input),
  });
}

export function updateOrganization(
  token: string,
  id: string,
  input: OrganizationInput,
): Promise<Organization> {
  return backendFetch<Organization>(`/organizations/${id}`, {
    method: 'PATCH',
    token,
    body: JSON.stringify(input),
  });
}
