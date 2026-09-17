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

export function listOrganizations(token: string): Promise<Organization[]> {
  return backendFetch<Organization[]>('/organizations', { token });
}
