import { backendFetch } from '../http/backend-client';

/** PRD secao 12/44 - nunca inferida automaticamente; `null` = "nao classificado". */
export type ScopeClassification = 'IN_SCOPE' | 'OUT_SCOPE' | 'INTERFACE';

export type ValueChainCategory =
  | 'INPUT'
  | 'PRIMARY_PROCESS'
  | 'SUPPORT_PROCESS'
  | 'OUTPUT';

export type TopologyNodeType =
  | 'APPLICATION'
  | 'DATABASE'
  | 'NETWORK'
  | 'FIREWALL'
  | 'CLOUD'
  | 'SERVER'
  | 'USER'
  | 'INTERNET'
  | 'THIRD_PARTY'
  | 'PHYSICAL_UNIT'
  | 'OTHER';

export interface ValueChainBlock {
  id: string;
  sgsiScopeId: string;
  name: string;
  description: string | null;
  responsibleArea: string | null;
  category: ValueChainCategory;
  classification: ScopeClassification | null;
  createdAt: string;
  updatedAt: string;
}

export interface ValueChainBlockInput {
  name: string;
  description?: string | null;
  responsibleArea?: string | null;
  category: ValueChainCategory;
  classification?: ScopeClassification | null;
}

export interface ValueChainSection {
  blocks: ValueChainBlock[];
}

export interface TopologyNode {
  id: string;
  sgsiScopeId: string;
  name: string;
  type: TopologyNodeType;
  description: string | null;
  classification: ScopeClassification | null;
  createdAt: string;
  updatedAt: string;
}

export interface TopologyNodeInput {
  name: string;
  type: TopologyNodeType;
  description?: string | null;
  classification?: ScopeClassification | null;
}

export interface TopologyLink {
  id: string;
  sgsiScopeId: string;
  fromNodeId: string;
  toNodeId: string;
  description: string | null;
  linkType: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface TopologyLinkInput {
  fromNodeId: string;
  toNodeId: string;
  description?: string | null;
  linkType?: string | null;
}

export interface TopologySection {
  nodes: TopologyNode[];
  links: TopologyLink[];
}

export interface ArchitectureComponent {
  id: string;
  sgsiScopeId: string;
  name: string;
  layer: string | null;
  description: string | null;
  classification: ScopeClassification | null;
  createdAt: string;
  updatedAt: string;
}

export interface ArchitectureComponentInput {
  name: string;
  layer?: string | null;
  description?: string | null;
  classification?: ScopeClassification | null;
}

export interface ArchitectureInterface {
  id: string;
  sgsiScopeId: string;
  fromComponentId: string;
  toComponentId: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ArchitectureInterfaceInput {
  fromComponentId: string;
  toComponentId: string;
  description?: string | null;
}

export interface ArchitectureSection {
  components: ArchitectureComponent[];
  interfaces: ArchitectureInterface[];
}

// Cadeia de Valor (Etapa 5, PRD secao 12)

export function getValueChainSection(
  token: string,
  projectId: string,
): Promise<ValueChainSection> {
  return backendFetch<ValueChainSection>(
    `/projects/${projectId}/sgsi-scope/value-chain`,
    { token },
  );
}

export function createValueChainBlock(
  token: string,
  projectId: string,
  input: ValueChainBlockInput,
): Promise<ValueChainBlock> {
  return backendFetch<ValueChainBlock>(
    `/projects/${projectId}/sgsi-scope/value-chain/blocks`,
    { method: 'POST', token, body: JSON.stringify(input) },
  );
}

export function updateValueChainBlock(
  token: string,
  projectId: string,
  blockId: string,
  input: Partial<ValueChainBlockInput>,
): Promise<ValueChainBlock> {
  return backendFetch<ValueChainBlock>(
    `/projects/${projectId}/sgsi-scope/value-chain/blocks/${blockId}`,
    { method: 'PATCH', token, body: JSON.stringify(input) },
  );
}

export function deleteValueChainBlock(
  token: string,
  projectId: string,
  blockId: string,
): Promise<void> {
  return backendFetch<void>(
    `/projects/${projectId}/sgsi-scope/value-chain/blocks/${blockId}`,
    { method: 'DELETE', token },
  );
}

// Topologia (Etapa 6.1, PRD secao 13.1)

export function getTopologySection(
  token: string,
  projectId: string,
): Promise<TopologySection> {
  return backendFetch<TopologySection>(
    `/projects/${projectId}/sgsi-scope/topology`,
    { token },
  );
}

export function createTopologyNode(
  token: string,
  projectId: string,
  input: TopologyNodeInput,
): Promise<TopologyNode> {
  return backendFetch<TopologyNode>(
    `/projects/${projectId}/sgsi-scope/topology/nodes`,
    { method: 'POST', token, body: JSON.stringify(input) },
  );
}

export function updateTopologyNode(
  token: string,
  projectId: string,
  nodeId: string,
  input: Partial<TopologyNodeInput>,
): Promise<TopologyNode> {
  return backendFetch<TopologyNode>(
    `/projects/${projectId}/sgsi-scope/topology/nodes/${nodeId}`,
    { method: 'PATCH', token, body: JSON.stringify(input) },
  );
}

export function deleteTopologyNode(
  token: string,
  projectId: string,
  nodeId: string,
): Promise<void> {
  return backendFetch<void>(
    `/projects/${projectId}/sgsi-scope/topology/nodes/${nodeId}`,
    { method: 'DELETE', token },
  );
}

export function createTopologyLink(
  token: string,
  projectId: string,
  input: TopologyLinkInput,
): Promise<TopologyLink> {
  return backendFetch<TopologyLink>(
    `/projects/${projectId}/sgsi-scope/topology/links`,
    { method: 'POST', token, body: JSON.stringify(input) },
  );
}

export function updateTopologyLink(
  token: string,
  projectId: string,
  linkId: string,
  input: Partial<TopologyLinkInput>,
): Promise<TopologyLink> {
  return backendFetch<TopologyLink>(
    `/projects/${projectId}/sgsi-scope/topology/links/${linkId}`,
    { method: 'PATCH', token, body: JSON.stringify(input) },
  );
}

export function deleteTopologyLink(
  token: string,
  projectId: string,
  linkId: string,
): Promise<void> {
  return backendFetch<void>(
    `/projects/${projectId}/sgsi-scope/topology/links/${linkId}`,
    { method: 'DELETE', token },
  );
}

// Arquitetura (Etapa 6.2, PRD secao 13.2)

export function getArchitectureSection(
  token: string,
  projectId: string,
): Promise<ArchitectureSection> {
  return backendFetch<ArchitectureSection>(
    `/projects/${projectId}/sgsi-scope/architecture`,
    { token },
  );
}

export function createArchitectureComponent(
  token: string,
  projectId: string,
  input: ArchitectureComponentInput,
): Promise<ArchitectureComponent> {
  return backendFetch<ArchitectureComponent>(
    `/projects/${projectId}/sgsi-scope/architecture/components`,
    { method: 'POST', token, body: JSON.stringify(input) },
  );
}

export function updateArchitectureComponent(
  token: string,
  projectId: string,
  componentId: string,
  input: Partial<ArchitectureComponentInput>,
): Promise<ArchitectureComponent> {
  return backendFetch<ArchitectureComponent>(
    `/projects/${projectId}/sgsi-scope/architecture/components/${componentId}`,
    { method: 'PATCH', token, body: JSON.stringify(input) },
  );
}

export function deleteArchitectureComponent(
  token: string,
  projectId: string,
  componentId: string,
): Promise<void> {
  return backendFetch<void>(
    `/projects/${projectId}/sgsi-scope/architecture/components/${componentId}`,
    { method: 'DELETE', token },
  );
}

export function createArchitectureInterface(
  token: string,
  projectId: string,
  input: ArchitectureInterfaceInput,
): Promise<ArchitectureInterface> {
  return backendFetch<ArchitectureInterface>(
    `/projects/${projectId}/sgsi-scope/architecture/interfaces`,
    { method: 'POST', token, body: JSON.stringify(input) },
  );
}

export function updateArchitectureInterface(
  token: string,
  projectId: string,
  interfaceId: string,
  input: Partial<ArchitectureInterfaceInput>,
): Promise<ArchitectureInterface> {
  return backendFetch<ArchitectureInterface>(
    `/projects/${projectId}/sgsi-scope/architecture/interfaces/${interfaceId}`,
    { method: 'PATCH', token, body: JSON.stringify(input) },
  );
}

export function deleteArchitectureInterface(
  token: string,
  projectId: string,
  interfaceId: string,
): Promise<void> {
  return backendFetch<void>(
    `/projects/${projectId}/sgsi-scope/architecture/interfaces/${interfaceId}`,
    { method: 'DELETE', token },
  );
}
