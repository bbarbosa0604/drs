import { backendFetch } from '../http/backend-client';

export interface ScopeDefinition {
  id: string;
  sgsiScopeId: string;
  formalDeclaration: string | null;
  executiveJustification: string | null;
  detailedDescription: { html: string } | null;
  createdAt: string;
  updatedAt: string;
}

export interface ScopeDefinitionInput {
  formalDeclaration?: string | null;
  executiveJustification?: string | null;
  detailedDescriptionHtml?: string | null;
}

export interface ScopeListItem {
  id: string;
  sgsiScopeId: string;
  description: string;
  createdAt: string;
}

export interface ScopeDefinitionSection {
  scopeDefinition: ScopeDefinition | null;
  characteristics: ScopeListItem[];
  benefits: ScopeListItem[];
}

export interface FillPercentage {
  label: string;
  percentage: number;
  totalChecks: number;
  passedChecks: number;
}

export function getScopeDefinitionSection(
  token: string,
  projectId: string,
): Promise<ScopeDefinitionSection> {
  return backendFetch<ScopeDefinitionSection>(
    `/projects/${projectId}/sgsi-scope/scope-definition`,
    { token },
  );
}

export function updateScopeDefinition(
  token: string,
  projectId: string,
  input: ScopeDefinitionInput,
): Promise<ScopeDefinition> {
  return backendFetch<ScopeDefinition>(
    `/projects/${projectId}/sgsi-scope/scope-definition`,
    { method: 'PATCH', token, body: JSON.stringify(input) },
  );
}

export function createScopeCharacteristic(
  token: string,
  projectId: string,
  description: string,
): Promise<ScopeListItem> {
  return backendFetch<ScopeListItem>(
    `/projects/${projectId}/sgsi-scope/scope-definition/characteristics`,
    { method: 'POST', token, body: JSON.stringify({ description }) },
  );
}

export function deleteScopeCharacteristic(
  token: string,
  projectId: string,
  characteristicId: string,
): Promise<void> {
  return backendFetch<void>(
    `/projects/${projectId}/sgsi-scope/scope-definition/characteristics/${characteristicId}`,
    { method: 'DELETE', token },
  );
}

export function createScopeBenefit(
  token: string,
  projectId: string,
  description: string,
): Promise<ScopeListItem> {
  return backendFetch<ScopeListItem>(
    `/projects/${projectId}/sgsi-scope/scope-definition/benefits`,
    { method: 'POST', token, body: JSON.stringify({ description }) },
  );
}

export function deleteScopeBenefit(
  token: string,
  projectId: string,
  benefitId: string,
): Promise<void> {
  return backendFetch<void>(
    `/projects/${projectId}/sgsi-scope/scope-definition/benefits/${benefitId}`,
    { method: 'DELETE', token },
  );
}

export function getFillPercentage(
  token: string,
  projectId: string,
): Promise<FillPercentage> {
  return backendFetch<FillPercentage>(
    `/projects/${projectId}/sgsi-scope/fill-percentage`,
    { token },
  );
}
