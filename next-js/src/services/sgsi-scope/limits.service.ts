import { backendFetch } from '../http/backend-client';
import type { ScopeClassification } from './scope-engine.service';

export interface ScopeLocation {
  id: string;
  sgsiScopeId: string;
  name: string;
  address: string | null;
  description: string | null;
  classification: ScopeClassification | null;
  createdAt: string;
  updatedAt: string;
}

export interface ScopeLocationInput {
  name: string;
  address?: string | null;
  description?: string | null;
  classification?: ScopeClassification | null;
}

export interface ScopeEmployeeGroup {
  id: string;
  sgsiScopeId: string;
  areaOrGroup: string;
  quantity: number | null;
  description: string | null;
  classification: ScopeClassification | null;
  createdAt: string;
  updatedAt: string;
}

export interface ScopeEmployeeGroupInput {
  areaOrGroup: string;
  quantity?: number | null;
  description?: string | null;
  classification?: ScopeClassification | null;
}

export interface ScopeAsset {
  id: string;
  sgsiScopeId: string;
  assetName: string;
  category: string | null;
  description: string | null;
  responsible: string | null;
  classification: ScopeClassification | null;
  createdAt: string;
  updatedAt: string;
}

export interface ScopeAssetInput {
  assetName: string;
  category?: string | null;
  description?: string | null;
  responsible?: string | null;
  classification?: ScopeClassification | null;
}

export interface ScopeProvider {
  id: string;
  sgsiScopeId: string;
  providerName: string;
  service: string | null;
  description: string | null;
  classification: ScopeClassification | null;
  createdAt: string;
  updatedAt: string;
}

export interface ScopeProviderInput {
  providerName: string;
  service?: string | null;
  description?: string | null;
  classification?: ScopeClassification | null;
}

export interface ScopeApproval {
  id: string;
  sgsiScopeId: string;
  method: string | null;
  platform: string | null;
  approvalText: string | null;
  responsible: string | null;
  approvedAt: string | null;
  observations: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ScopeApprovalInput {
  method?: string | null;
  platform?: string | null;
  approvalText?: string | null;
  responsible?: string | null;
  approvedAt?: string | null;
  observations?: string | null;
}

export interface ScopeRevision {
  id: string;
  sgsiScopeId: string;
  version: string;
  revisedAt: string;
  responsible: string;
  changeDescription: string;
  createdAt: string;
}

export interface ScopeRevisionInput {
  version: string;
  revisedAt: string;
  responsible: string;
  changeDescription: string;
}

export interface LimitsSection {
  locations: ScopeLocation[];
  employeeGroups: ScopeEmployeeGroup[];
  assets: ScopeAsset[];
  providers: ScopeProvider[];
  approval: ScopeApproval | null;
  revisions: ScopeRevision[];
}

export function getLimitsSection(
  token: string,
  projectId: string,
): Promise<LimitsSection> {
  return backendFetch<LimitsSection>(`/projects/${projectId}/sgsi-scope/limits`, {
    token,
  });
}

export function createScopeLocation(
  token: string,
  projectId: string,
  input: ScopeLocationInput,
): Promise<ScopeLocation> {
  return backendFetch<ScopeLocation>(
    `/projects/${projectId}/sgsi-scope/limits/locations`,
    { method: 'POST', token, body: JSON.stringify(input) },
  );
}

export function updateScopeLocation(
  token: string,
  projectId: string,
  locationId: string,
  input: Partial<ScopeLocationInput>,
): Promise<ScopeLocation> {
  return backendFetch<ScopeLocation>(
    `/projects/${projectId}/sgsi-scope/limits/locations/${locationId}`,
    { method: 'PATCH', token, body: JSON.stringify(input) },
  );
}

export function deleteScopeLocation(
  token: string,
  projectId: string,
  locationId: string,
): Promise<void> {
  return backendFetch<void>(
    `/projects/${projectId}/sgsi-scope/limits/locations/${locationId}`,
    { method: 'DELETE', token },
  );
}

export function createScopeEmployeeGroup(
  token: string,
  projectId: string,
  input: ScopeEmployeeGroupInput,
): Promise<ScopeEmployeeGroup> {
  return backendFetch<ScopeEmployeeGroup>(
    `/projects/${projectId}/sgsi-scope/limits/employee-groups`,
    { method: 'POST', token, body: JSON.stringify(input) },
  );
}

export function updateScopeEmployeeGroup(
  token: string,
  projectId: string,
  groupId: string,
  input: Partial<ScopeEmployeeGroupInput>,
): Promise<ScopeEmployeeGroup> {
  return backendFetch<ScopeEmployeeGroup>(
    `/projects/${projectId}/sgsi-scope/limits/employee-groups/${groupId}`,
    { method: 'PATCH', token, body: JSON.stringify(input) },
  );
}

export function deleteScopeEmployeeGroup(
  token: string,
  projectId: string,
  groupId: string,
): Promise<void> {
  return backendFetch<void>(
    `/projects/${projectId}/sgsi-scope/limits/employee-groups/${groupId}`,
    { method: 'DELETE', token },
  );
}

export function createScopeAsset(
  token: string,
  projectId: string,
  input: ScopeAssetInput,
): Promise<ScopeAsset> {
  return backendFetch<ScopeAsset>(
    `/projects/${projectId}/sgsi-scope/limits/assets`,
    { method: 'POST', token, body: JSON.stringify(input) },
  );
}

export function updateScopeAsset(
  token: string,
  projectId: string,
  assetId: string,
  input: Partial<ScopeAssetInput>,
): Promise<ScopeAsset> {
  return backendFetch<ScopeAsset>(
    `/projects/${projectId}/sgsi-scope/limits/assets/${assetId}`,
    { method: 'PATCH', token, body: JSON.stringify(input) },
  );
}

export function deleteScopeAsset(
  token: string,
  projectId: string,
  assetId: string,
): Promise<void> {
  return backendFetch<void>(
    `/projects/${projectId}/sgsi-scope/limits/assets/${assetId}`,
    { method: 'DELETE', token },
  );
}

export function createScopeProvider(
  token: string,
  projectId: string,
  input: ScopeProviderInput,
): Promise<ScopeProvider> {
  return backendFetch<ScopeProvider>(
    `/projects/${projectId}/sgsi-scope/limits/providers`,
    { method: 'POST', token, body: JSON.stringify(input) },
  );
}

export function updateScopeProvider(
  token: string,
  projectId: string,
  providerId: string,
  input: Partial<ScopeProviderInput>,
): Promise<ScopeProvider> {
  return backendFetch<ScopeProvider>(
    `/projects/${projectId}/sgsi-scope/limits/providers/${providerId}`,
    { method: 'PATCH', token, body: JSON.stringify(input) },
  );
}

export function deleteScopeProvider(
  token: string,
  projectId: string,
  providerId: string,
): Promise<void> {
  return backendFetch<void>(
    `/projects/${projectId}/sgsi-scope/limits/providers/${providerId}`,
    { method: 'DELETE', token },
  );
}

export function updateScopeApproval(
  token: string,
  projectId: string,
  input: ScopeApprovalInput,
): Promise<ScopeApproval> {
  return backendFetch<ScopeApproval>(
    `/projects/${projectId}/sgsi-scope/limits/approval`,
    { method: 'PATCH', token, body: JSON.stringify(input) },
  );
}

export function createScopeRevision(
  token: string,
  projectId: string,
  input: ScopeRevisionInput,
): Promise<ScopeRevision> {
  return backendFetch<ScopeRevision>(
    `/projects/${projectId}/sgsi-scope/limits/revisions`,
    { method: 'POST', token, body: JSON.stringify(input) },
  );
}
