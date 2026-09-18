'use client';

import { useMemo, useState } from 'react';

import { EmptyState } from '@/components/dashboard/EmptyState';
import { Field, fieldStyles } from '@/components/forms/Field';
import {
  ArchitectureDiagram,
  TopologyDiagram,
  type DiagramData,
} from '@/modules/sgsi-scope/diagrams';
import type {
  ArchitectureComponent,
  ArchitectureComponentInput,
  ArchitectureInterface,
  ArchitectureInterfaceInput,
  TopologyLink,
  TopologyLinkInput,
  TopologyNode,
  TopologyNodeInput,
} from '@/services/sgsi-scope/scope-engine.service';
import pageStyles from '../etapa-empresa/EtapaEmpresaForm.module.css';
import {
  SCOPE_CLASSIFICATION_OPTIONS,
  toDiagramClassification,
  TOPOLOGY_NODE_TYPE_OPTIONS,
} from '../scope-engine-options';
import { StepNav } from '../StepNav';
import { ArchitectureComponentRow } from './ArchitectureComponentRow';
import { ArchitectureInterfaceRow } from './ArchitectureInterfaceRow';
import styles from './EtapaTopologiaArquiteturaForm.module.css';
import { TopologyLinkRow } from './TopologyLinkRow';
import { TopologyNodeRow } from './TopologyNodeRow';

const EMPTY_NODE_DRAFT: TopologyNodeInput = {
  name: '',
  type: 'APPLICATION',
  description: null,
  classification: null,
};

const EMPTY_COMPONENT_DRAFT: ArchitectureComponentInput = {
  name: '',
  layer: null,
  description: null,
  classification: null,
};

function toTopologyDiagramData(
  nodes: TopologyNode[],
  links: TopologyLink[],
): DiagramData {
  return {
    nodes: nodes.map((node) => ({
      id: node.id,
      label: node.name,
      classification: toDiagramClassification(node.classification),
      group: node.type,
    })),
    connections: links.map((link) => ({
      id: link.id,
      fromNodeId: link.fromNodeId,
      toNodeId: link.toNodeId,
      label: link.linkType ?? undefined,
    })),
  };
}

function toArchitectureDiagramData(
  components: ArchitectureComponent[],
  interfaces: ArchitectureInterface[],
): DiagramData {
  return {
    nodes: components.map((component) => ({
      id: component.id,
      label: component.name,
      classification: toDiagramClassification(component.classification),
      group: component.layer ?? 'Sem camada',
    })),
    connections: interfaces.map((architectureInterface) => ({
      id: architectureInterface.id,
      fromNodeId: architectureInterface.fromComponentId,
      toNodeId: architectureInterface.toComponentId,
    })),
  };
}

async function postJson<T>(url: string, body: unknown): Promise<T> {
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const data = (await response.json().catch(() => null)) as {
      message?: string;
    } | null;

    throw new Error(data?.message ?? 'Nao foi possivel salvar.');
  }

  return (await response.json()) as T;
}

async function patchJson<T>(url: string, body: unknown): Promise<T> {
  const response = await fetch(url, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const data = (await response.json().catch(() => null)) as {
      message?: string;
    } | null;

    throw new Error(data?.message ?? 'Nao foi possivel salvar.');
  }

  return (await response.json()) as T;
}

export function EtapaTopologiaArquiteturaForm({
  projectId,
  initialNodes,
  initialLinks,
  initialComponents,
  initialInterfaces,
}: {
  projectId: string;
  initialNodes: TopologyNode[];
  initialLinks: TopologyLink[];
  initialComponents: ArchitectureComponent[];
  initialInterfaces: ArchitectureInterface[];
}) {
  const [nodes, setNodes] = useState(initialNodes);
  const [links, setLinks] = useState(initialLinks);
  const [components, setComponents] = useState(initialComponents);
  const [interfaces, setInterfaces] = useState(initialInterfaces);

  const [nodeDraft, setNodeDraft] = useState<TopologyNodeInput>(EMPTY_NODE_DRAFT);
  const [nodeError, setNodeError] = useState<string | null>(null);
  const [isSubmittingNode, setIsSubmittingNode] = useState(false);

  const [linkDraft, setLinkDraft] = useState<TopologyLinkInput | null>(null);
  const [linkError, setLinkError] = useState<string | null>(null);
  const [isSubmittingLink, setIsSubmittingLink] = useState(false);

  const [componentDraft, setComponentDraft] =
    useState<ArchitectureComponentInput>(EMPTY_COMPONENT_DRAFT);
  const [componentError, setComponentError] = useState<string | null>(null);
  const [isSubmittingComponent, setIsSubmittingComponent] = useState(false);

  const [interfaceDraft, setInterfaceDraft] =
    useState<ArchitectureInterfaceInput | null>(null);
  const [interfaceError, setInterfaceError] = useState<string | null>(null);
  const [isSubmittingInterface, setIsSubmittingInterface] = useState(false);

  const topologyDiagramData = useMemo(
    () => toTopologyDiagramData(nodes, links),
    [nodes, links],
  );
  const architectureDiagramData = useMemo(
    () => toArchitectureDiagramData(components, interfaces),
    [components, interfaces],
  );

  const activeLinkDraft =
    linkDraft ??
    (nodes.length > 0
      ? { fromNodeId: nodes[0].id, toNodeId: nodes[0].id, description: null, linkType: null }
      : null);
  const activeInterfaceDraft =
    interfaceDraft ??
    (components.length > 0
      ? { fromComponentId: components[0].id, toComponentId: components[0].id, description: null }
      : null);

  async function handleCreateNode(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setNodeError(null);

    if (!nodeDraft.name.trim()) {
      return;
    }

    setIsSubmittingNode(true);

    try {
      const created = await postJson<TopologyNode>(
        `/api/projects/${projectId}/sgsi-scope/topology/nodes`,
        nodeDraft,
      );

      setNodes((current) => [...current, created]);
      setNodeDraft(EMPTY_NODE_DRAFT);
    } catch (submitError) {
      setNodeError(
        submitError instanceof Error ? submitError.message : 'Erro ao criar no.',
      );
    } finally {
      setIsSubmittingNode(false);
    }
  }

  async function handleUpdateNode(nodeId: string, patch: Partial<TopologyNodeInput>) {
    const updated = await patchJson<TopologyNode>(
      `/api/projects/${projectId}/sgsi-scope/topology/nodes/${nodeId}`,
      patch,
    );

    setNodes((current) =>
      current.map((node) => (node.id === nodeId ? updated : node)),
    );
  }

  async function handleRemoveNode(nodeId: string) {
    const response = await fetch(
      `/api/projects/${projectId}/sgsi-scope/topology/nodes/${nodeId}`,
      { method: 'DELETE' },
    );

    if (!response.ok) {
      const data = (await response.json().catch(() => null)) as {
        message?: string;
      } | null;

      throw new Error(
        data?.message ?? 'No ainda referenciado por uma conexao - remova a conexao primeiro.',
      );
    }

    setNodes((current) => current.filter((node) => node.id !== nodeId));
  }

  async function handleCreateLink(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLinkError(null);

    if (!activeLinkDraft) {
      return;
    }

    setIsSubmittingLink(true);

    try {
      const created = await postJson<TopologyLink>(
        `/api/projects/${projectId}/sgsi-scope/topology/links`,
        activeLinkDraft,
      );

      setLinks((current) => [...current, created]);
      setLinkDraft(null);
    } catch (submitError) {
      setLinkError(
        submitError instanceof Error ? submitError.message : 'Erro ao criar conexao.',
      );
    } finally {
      setIsSubmittingLink(false);
    }
  }

  async function handleUpdateLink(linkId: string, patch: Partial<TopologyLinkInput>) {
    const updated = await patchJson<TopologyLink>(
      `/api/projects/${projectId}/sgsi-scope/topology/links/${linkId}`,
      patch,
    );

    setLinks((current) =>
      current.map((link) => (link.id === linkId ? updated : link)),
    );
  }

  async function handleRemoveLink(linkId: string) {
    setLinks((current) => current.filter((link) => link.id !== linkId));

    await fetch(`/api/projects/${projectId}/sgsi-scope/topology/links/${linkId}`, {
      method: 'DELETE',
    });
  }

  async function handleCreateComponent(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setComponentError(null);

    if (!componentDraft.name.trim()) {
      return;
    }

    setIsSubmittingComponent(true);

    try {
      const created = await postJson<ArchitectureComponent>(
        `/api/projects/${projectId}/sgsi-scope/architecture/components`,
        componentDraft,
      );

      setComponents((current) => [...current, created]);
      setComponentDraft(EMPTY_COMPONENT_DRAFT);
    } catch (submitError) {
      setComponentError(
        submitError instanceof Error ? submitError.message : 'Erro ao criar componente.',
      );
    } finally {
      setIsSubmittingComponent(false);
    }
  }

  async function handleUpdateComponent(
    componentId: string,
    patch: Partial<ArchitectureComponentInput>,
  ) {
    const updated = await patchJson<ArchitectureComponent>(
      `/api/projects/${projectId}/sgsi-scope/architecture/components/${componentId}`,
      patch,
    );

    setComponents((current) =>
      current.map((component) => (component.id === componentId ? updated : component)),
    );
  }

  async function handleRemoveComponent(componentId: string) {
    const response = await fetch(
      `/api/projects/${projectId}/sgsi-scope/architecture/components/${componentId}`,
      { method: 'DELETE' },
    );

    if (!response.ok) {
      const data = (await response.json().catch(() => null)) as {
        message?: string;
      } | null;

      throw new Error(
        data?.message ??
          'Componente ainda referenciado por uma interface - remova a interface primeiro.',
      );
    }

    setComponents((current) => current.filter((component) => component.id !== componentId));
  }

  async function handleCreateInterface(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setInterfaceError(null);

    if (!activeInterfaceDraft) {
      return;
    }

    setIsSubmittingInterface(true);

    try {
      const created = await postJson<ArchitectureInterface>(
        `/api/projects/${projectId}/sgsi-scope/architecture/interfaces`,
        activeInterfaceDraft,
      );

      setInterfaces((current) => [...current, created]);
      setInterfaceDraft(null);
    } catch (submitError) {
      setInterfaceError(
        submitError instanceof Error ? submitError.message : 'Erro ao criar interface.',
      );
    } finally {
      setIsSubmittingInterface(false);
    }
  }

  async function handleUpdateInterface(
    interfaceId: string,
    patch: Partial<ArchitectureInterfaceInput>,
  ) {
    const updated = await patchJson<ArchitectureInterface>(
      `/api/projects/${projectId}/sgsi-scope/architecture/interfaces/${interfaceId}`,
      patch,
    );

    setInterfaces((current) =>
      current.map((architectureInterface) =>
        architectureInterface.id === interfaceId ? updated : architectureInterface,
      ),
    );
  }

  async function handleRemoveInterface(interfaceId: string) {
    setInterfaces((current) =>
      current.filter((architectureInterface) => architectureInterface.id !== interfaceId),
    );

    await fetch(
      `/api/projects/${projectId}/sgsi-scope/architecture/interfaces/${interfaceId}`,
      { method: 'DELETE' },
    );
  }

  return (
    <div className={styles.page}>
      <StepNav projectId={projectId} activeStep={6} />

      <h2 className={styles.sectionTitle}>Topologia</h2>

      <section className={pageStyles.card} aria-labelledby="topology-diagram-title">
        <h2 className={pageStyles.cardTitle} id="topology-diagram-title">
          Diagrama de topologia
        </h2>
        <div className={styles.diagramWrapper}>
          <TopologyDiagram data={topologyDiagramData} />
        </div>
      </section>

      <section className={pageStyles.card} aria-labelledby="topology-nodes-title">
        <h2 className={pageStyles.cardTitle} id="topology-nodes-title">
          Nos
        </h2>
        {nodes.length === 0 ? (
          <EmptyState message="Nenhum no cadastrado ainda." />
        ) : (
          <ul className={styles.list}>
            {nodes.map((node) => (
              <TopologyNodeRow
                key={node.id}
                node={node}
                onSave={(patch) => handleUpdateNode(node.id, patch)}
                onRemove={() => handleRemoveNode(node.id)}
              />
            ))}
          </ul>
        )}
        <form className={styles.form} onSubmit={handleCreateNode}>
          <div className={styles.row}>
            <Field label="Nome" htmlFor="new-node-name">
              <input
                className={fieldStyles.input}
                id="new-node-name"
                value={nodeDraft.name}
                onChange={(event) =>
                  setNodeDraft((current) => ({ ...current, name: event.target.value }))
                }
              />
            </Field>
            <Field label="Tipo" htmlFor="new-node-type">
              <select
                className={fieldStyles.select}
                id="new-node-type"
                value={nodeDraft.type}
                onChange={(event) =>
                  setNodeDraft((current) => ({
                    ...current,
                    type: event.target.value as TopologyNodeInput['type'],
                  }))
                }
              >
                {TOPOLOGY_NODE_TYPE_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Classificacao de escopo" htmlFor="new-node-classification">
              <select
                className={fieldStyles.select}
                id="new-node-classification"
                value={nodeDraft.classification ?? ''}
                onChange={(event) =>
                  setNodeDraft((current) => ({
                    ...current,
                    classification:
                      (event.target.value as TopologyNodeInput['classification']) ||
                      null,
                  }))
                }
              >
                <option value="">Nao classificado</option>
                {SCOPE_CLASSIFICATION_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </Field>
          </div>
          <button className={styles.submit} type="submit" disabled={isSubmittingNode}>
            Adicionar no
          </button>
          {nodeError ? <p role="alert">{nodeError}</p> : null}
        </form>
      </section>

      <section className={pageStyles.card} aria-labelledby="topology-links-title">
        <h2 className={pageStyles.cardTitle} id="topology-links-title">
          Conexoes
        </h2>
        {links.length === 0 ? (
          <EmptyState message="Nenhuma conexao cadastrada ainda." />
        ) : (
          <ul className={styles.list}>
            {links.map((link) => (
              <TopologyLinkRow
                key={link.id}
                link={link}
                nodes={nodes}
                onSave={(patch) => handleUpdateLink(link.id, patch)}
                onRemove={() => handleRemoveLink(link.id)}
              />
            ))}
          </ul>
        )}
        {activeLinkDraft ? (
          <form className={styles.form} onSubmit={handleCreateLink}>
            <div className={styles.row}>
              <Field label="Origem" htmlFor="new-link-from">
                <select
                  className={fieldStyles.select}
                  id="new-link-from"
                  value={activeLinkDraft.fromNodeId}
                  onChange={(event) =>
                    setLinkDraft({ ...activeLinkDraft, fromNodeId: event.target.value })
                  }
                >
                  {nodes.map((node) => (
                    <option key={node.id} value={node.id}>
                      {node.name}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Destino" htmlFor="new-link-to">
                <select
                  className={fieldStyles.select}
                  id="new-link-to"
                  value={activeLinkDraft.toNodeId}
                  onChange={(event) =>
                    setLinkDraft({ ...activeLinkDraft, toNodeId: event.target.value })
                  }
                >
                  {nodes.map((node) => (
                    <option key={node.id} value={node.id}>
                      {node.name}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Tipo/relacao" htmlFor="new-link-type">
                <input
                  className={fieldStyles.input}
                  id="new-link-type"
                  value={activeLinkDraft.linkType ?? ''}
                  onChange={(event) =>
                    setLinkDraft({
                      ...activeLinkDraft,
                      linkType: event.target.value || null,
                    })
                  }
                />
              </Field>
            </div>
            <button className={styles.submit} type="submit" disabled={isSubmittingLink}>
              Adicionar conexao
            </button>
            {linkError ? <p role="alert">{linkError}</p> : null}
          </form>
        ) : (
          <p>Cadastre ao menos um no para criar conexoes.</p>
        )}
      </section>

      <h2 className={styles.sectionTitle}>Arquitetura</h2>

      <section className={pageStyles.card} aria-labelledby="architecture-diagram-title">
        <h2 className={pageStyles.cardTitle} id="architecture-diagram-title">
          Diagrama de arquitetura
        </h2>
        <div className={styles.diagramWrapper}>
          <ArchitectureDiagram data={architectureDiagramData} />
        </div>
      </section>

      <section className={pageStyles.card} aria-labelledby="architecture-components-title">
        <h2 className={pageStyles.cardTitle} id="architecture-components-title">
          Componentes
        </h2>
        {components.length === 0 ? (
          <EmptyState message="Nenhum componente cadastrado ainda." />
        ) : (
          <ul className={styles.list}>
            {components.map((component) => (
              <ArchitectureComponentRow
                key={component.id}
                component={component}
                onSave={(patch) => handleUpdateComponent(component.id, patch)}
                onRemove={() => handleRemoveComponent(component.id)}
              />
            ))}
          </ul>
        )}
        <form className={styles.form} onSubmit={handleCreateComponent}>
          <div className={styles.row}>
            <Field label="Nome" htmlFor="new-component-name">
              <input
                className={fieldStyles.input}
                id="new-component-name"
                value={componentDraft.name}
                onChange={(event) =>
                  setComponentDraft((current) => ({
                    ...current,
                    name: event.target.value,
                  }))
                }
              />
            </Field>
            <Field label="Camada" htmlFor="new-component-layer">
              <input
                className={fieldStyles.input}
                id="new-component-layer"
                value={componentDraft.layer ?? ''}
                onChange={(event) =>
                  setComponentDraft((current) => ({
                    ...current,
                    layer: event.target.value || null,
                  }))
                }
              />
            </Field>
            <Field
              label="Classificacao de escopo"
              htmlFor="new-component-classification"
            >
              <select
                className={fieldStyles.select}
                id="new-component-classification"
                value={componentDraft.classification ?? ''}
                onChange={(event) =>
                  setComponentDraft((current) => ({
                    ...current,
                    classification:
                      (event.target
                        .value as ArchitectureComponentInput['classification']) ||
                      null,
                  }))
                }
              >
                <option value="">Nao classificado</option>
                {SCOPE_CLASSIFICATION_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </Field>
          </div>
          <button
            className={styles.submit}
            type="submit"
            disabled={isSubmittingComponent}
          >
            Adicionar componente
          </button>
          {componentError ? <p role="alert">{componentError}</p> : null}
        </form>
      </section>

      <section className={pageStyles.card} aria-labelledby="architecture-interfaces-title">
        <h2 className={pageStyles.cardTitle} id="architecture-interfaces-title">
          Interfaces
        </h2>
        {interfaces.length === 0 ? (
          <EmptyState message="Nenhuma interface cadastrada ainda." />
        ) : (
          <ul className={styles.list}>
            {interfaces.map((architectureInterface) => (
              <ArchitectureInterfaceRow
                key={architectureInterface.id}
                architectureInterface={architectureInterface}
                components={components}
                onSave={(patch) =>
                  handleUpdateInterface(architectureInterface.id, patch)
                }
                onRemove={() => handleRemoveInterface(architectureInterface.id)}
              />
            ))}
          </ul>
        )}
        {activeInterfaceDraft ? (
          <form className={styles.form} onSubmit={handleCreateInterface}>
            <div className={styles.row}>
              <Field label="Origem" htmlFor="new-interface-from">
                <select
                  className={fieldStyles.select}
                  id="new-interface-from"
                  value={activeInterfaceDraft.fromComponentId}
                  onChange={(event) =>
                    setInterfaceDraft({
                      ...activeInterfaceDraft,
                      fromComponentId: event.target.value,
                    })
                  }
                >
                  {components.map((component) => (
                    <option key={component.id} value={component.id}>
                      {component.name}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Destino" htmlFor="new-interface-to">
                <select
                  className={fieldStyles.select}
                  id="new-interface-to"
                  value={activeInterfaceDraft.toComponentId}
                  onChange={(event) =>
                    setInterfaceDraft({
                      ...activeInterfaceDraft,
                      toComponentId: event.target.value,
                    })
                  }
                >
                  {components.map((component) => (
                    <option key={component.id} value={component.id}>
                      {component.name}
                    </option>
                  ))}
                </select>
              </Field>
            </div>
            <button
              className={styles.submit}
              type="submit"
              disabled={isSubmittingInterface}
            >
              Adicionar interface
            </button>
            {interfaceError ? <p role="alert">{interfaceError}</p> : null}
          </form>
        ) : (
          <p>Cadastre ao menos um componente para criar interfaces.</p>
        )}
      </section>
    </div>
  );
}
