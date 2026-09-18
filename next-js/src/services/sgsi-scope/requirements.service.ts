import { backendFetch } from '../http/backend-client';

export interface Stakeholder {
  id: string;
  sgsiScopeId: string;
  name: string;
  requirements: string | null;
  needs: string | null;
  expectations: string | null;
  observations: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface StakeholderInput {
  name: string;
  requirements?: string | null;
  needs?: string | null;
  expectations?: string | null;
  observations?: string | null;
}

export type RequirementCategory =
  | 'LEGAL'
  | 'REGULATORY'
  | 'CONTRACTUAL'
  | 'OTHER';

export interface Requirement {
  id: string;
  title: string;
  category: RequirementCategory;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectRequirement {
  id: string;
  sgsiScopeId: string;
  requirementId: string | null;
  title: string;
  category: RequirementCategory;
  description: string | null;
  observations: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectRequirementsSection {
  library: Requirement[];
  selected: ProjectRequirement[];
}

export interface GovernanceCommittee {
  id: string;
  sgsiScopeId: string;
  name: string | null;
  objective: string | null;
  responsibilities: string | null;
  observations: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface GovernanceMember {
  id: string;
  governanceCommitteeId: string;
  name: string;
  jobRole: string;
  area: string | null;
  committeeRole: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface GovernanceSection {
  committee: GovernanceCommittee | null;
  members: GovernanceMember[];
}

export function listStakeholders(
  token: string,
  projectId: string,
): Promise<Stakeholder[]> {
  return backendFetch<Stakeholder[]>(
    `/projects/${projectId}/sgsi-scope/stakeholders`,
    { token },
  );
}

export function createStakeholder(
  token: string,
  projectId: string,
  input: StakeholderInput,
): Promise<Stakeholder> {
  return backendFetch<Stakeholder>(
    `/projects/${projectId}/sgsi-scope/stakeholders`,
    { method: 'POST', token, body: JSON.stringify(input) },
  );
}

export function deleteStakeholder(
  token: string,
  projectId: string,
  stakeholderId: string,
): Promise<void> {
  return backendFetch<void>(
    `/projects/${projectId}/sgsi-scope/stakeholders/${stakeholderId}`,
    { method: 'DELETE', token },
  );
}

export function getProjectRequirements(
  token: string,
  projectId: string,
): Promise<ProjectRequirementsSection> {
  return backendFetch<ProjectRequirementsSection>(
    `/projects/${projectId}/sgsi-scope/requirements`,
    { token },
  );
}

export function createProjectRequirement(
  token: string,
  projectId: string,
  input: { requirementId?: string; title?: string },
): Promise<ProjectRequirement> {
  return backendFetch<ProjectRequirement>(
    `/projects/${projectId}/sgsi-scope/requirements`,
    { method: 'POST', token, body: JSON.stringify(input) },
  );
}

export function deleteProjectRequirement(
  token: string,
  projectId: string,
  projectRequirementId: string,
): Promise<void> {
  return backendFetch<void>(
    `/projects/${projectId}/sgsi-scope/requirements/${projectRequirementId}`,
    { method: 'DELETE', token },
  );
}

export function getGovernanceSection(
  token: string,
  projectId: string,
): Promise<GovernanceSection> {
  return backendFetch<GovernanceSection>(
    `/projects/${projectId}/sgsi-scope/governance`,
    { token },
  );
}

export function updateGovernanceCommittee(
  token: string,
  projectId: string,
  input: Partial<
    Pick<GovernanceCommittee, 'name' | 'objective' | 'responsibilities' | 'observations'>
  >,
): Promise<GovernanceCommittee> {
  return backendFetch<GovernanceCommittee>(
    `/projects/${projectId}/sgsi-scope/governance`,
    { method: 'PATCH', token, body: JSON.stringify(input) },
  );
}

export function createGovernanceMember(
  token: string,
  projectId: string,
  input: { name: string; jobRole: string; area?: string; committeeRole?: string },
): Promise<GovernanceMember> {
  return backendFetch<GovernanceMember>(
    `/projects/${projectId}/sgsi-scope/governance/members`,
    { method: 'POST', token, body: JSON.stringify(input) },
  );
}

export function deleteGovernanceMember(
  token: string,
  projectId: string,
  memberId: string,
): Promise<void> {
  return backendFetch<void>(
    `/projects/${projectId}/sgsi-scope/governance/members/${memberId}`,
    { method: 'DELETE', token },
  );
}
