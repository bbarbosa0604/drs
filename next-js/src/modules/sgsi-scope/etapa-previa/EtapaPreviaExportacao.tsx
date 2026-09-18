import {
  ArchitectureDiagram,
  TopologyDiagram,
  ValueChainDiagram,
  type DiagramData,
} from '@/modules/sgsi-scope/diagrams';
import type { Organization } from '@/services/organizations/organizations.service';
import type { Project } from '@/services/projects/projects.service';
import type {
  ArchitectureSection,
  TopologySection,
  ValueChainSection,
} from '@/services/sgsi-scope/scope-engine.service';
import type {
  FillPercentage,
  ScopeDefinition,
} from '@/services/sgsi-scope/scope-definition.service';
import type { LimitsSection } from '@/services/sgsi-scope/limits.service';
import type { SgsiScope } from '@/services/sgsi-scope/sgsi-scope.service';
import {
  scopeClassificationLabel,
  toDiagramClassification,
} from '../scope-engine-options';
import { StepNav } from '../StepNav';
import { type ClassifiedItem, groupByClassification } from './classified-items';
import { DocumentGenerationButtons } from './DocumentGenerationButtons';
import styles from './EtapaPreviaExportacao.module.css';

function toValueChainDiagramData(valueChain: ValueChainSection): DiagramData {
  return {
    nodes: valueChain.blocks.map((block) => ({
      id: block.id,
      label: block.name,
      classification: toDiagramClassification(block.classification),
      group: block.category,
    })),
    connections: [],
  };
}

function toTopologyDiagramData(topology: TopologySection): DiagramData {
  return {
    nodes: topology.nodes.map((node) => ({
      id: node.id,
      label: node.name,
      classification: toDiagramClassification(node.classification),
      group: node.type,
    })),
    connections: topology.links.map((link) => ({
      id: link.id,
      fromNodeId: link.fromNodeId,
      toNodeId: link.toNodeId,
      label: link.linkType ?? undefined,
    })),
  };
}

function toArchitectureDiagramData(architecture: ArchitectureSection): DiagramData {
  return {
    nodes: architecture.components.map((component) => ({
      id: component.id,
      label: component.name,
      classification: toDiagramClassification(component.classification),
      group: component.layer ?? 'Sem camada',
    })),
    connections: architecture.interfaces.map((architectureInterface) => ({
      id: architectureInterface.id,
      fromNodeId: architectureInterface.fromComponentId,
      toNodeId: architectureInterface.toComponentId,
    })),
  };
}

function nodeName(nodes: TopologySection['nodes'], nodeId: string): string {
  return nodes.find((node) => node.id === nodeId)?.name ?? 'No removido';
}

function componentName(
  components: ArchitectureSection['components'],
  componentId: string,
): string {
  return (
    components.find((component) => component.id === componentId)?.name ??
    'Componente removido'
  );
}

export function EtapaPreviaExportacao({
  projectId,
  organization,
  project,
  sgsiScope,
  fillPercentage,
  scopeDefinition,
  valueChain,
  topology,
  architecture,
  limits,
}: {
  projectId: string;
  organization: Organization;
  project: Project;
  sgsiScope: SgsiScope;
  fillPercentage: FillPercentage;
  scopeDefinition: ScopeDefinition | null;
  valueChain: ValueChainSection;
  topology: TopologySection;
  architecture: ArchitectureSection;
  limits: LimitsSection;
}) {
  const classifiedItems: ClassifiedItem[] = [
    ...valueChain.blocks.map((block) => ({
      id: block.id,
      label: block.name,
      origin: 'Cadeia de valor',
      classification: block.classification,
    })),
    ...topology.nodes.map((node) => ({
      id: node.id,
      label: node.name,
      origin: 'Topologia',
      classification: node.classification,
    })),
    ...architecture.components.map((component) => ({
      id: component.id,
      label: component.name,
      origin: 'Arquitetura',
      classification: component.classification,
    })),
    ...limits.locations.map((location) => ({
      id: location.id,
      label: location.name,
      origin: 'Localidade',
      classification: location.classification,
    })),
    ...limits.assets.map((asset) => ({
      id: asset.id,
      label: asset.assetName,
      origin: 'Ativo',
      classification: asset.classification,
    })),
    ...limits.providers.map((provider) => ({
      id: provider.id,
      label: provider.providerName,
      origin: 'Prestador',
      classification: provider.classification,
    })),
  ];

  const groups = groupByClassification(classifiedItems);

  const totalInterfaceConnections = topology.links.length + architecture.interfaces.length;

  return (
    <div className={styles.page}>
      <StepNav projectId={projectId} activeStep={8} />

      <article className={styles.report}>
        <header className={styles.reportHeader}>
          <h1 className={styles.reportTitle}>Escopometro SGSI - Previa consolidada</h1>
          <div className={styles.reportMeta}>
            <span>Organizacao: {organization.name}</span>
            <span>Projeto: {project.name}</span>
            <span>
              Versao: {sgsiScope.currentVersionNumber} (
              {sgsiScope.currentVersionStatus === 'APPROVED' ? 'Aprovada' : 'Rascunho'})
            </span>
          </div>
        </header>

        <section className={styles.section} aria-labelledby="preview-declaration-title">
          <h2 className={styles.sectionTitle} id="preview-declaration-title">
            Declaracao de escopo
          </h2>
          <p>
            {scopeDefinition?.formalDeclaration ??
              'Declaracao formal ainda nao preenchida (Etapa 4).'}
          </p>
        </section>

        <section className={styles.section} aria-labelledby="preview-stats-title">
          <h2 className={styles.sectionTitle} id="preview-stats-title">
            Estatisticas
          </h2>
          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <p className={styles.statValue}>{fillPercentage.percentage}%</p>
              <p className={styles.statLabel}>{fillPercentage.label}</p>
            </div>
            <div className={styles.statCard}>
              <p className={styles.statValue}>{groups.inScope.length}</p>
              <p className={styles.statLabel}>Elementos dentro do escopo</p>
            </div>
            <div className={styles.statCard}>
              <p className={styles.statValue}>{groups.outScope.length}</p>
              <p className={styles.statLabel}>Elementos fora do escopo</p>
            </div>
            <div className={styles.statCard}>
              <p className={styles.statValue}>{totalInterfaceConnections}</p>
              <p className={styles.statLabel}>Conexoes/interfaces mapeadas</p>
            </div>
          </div>
        </section>

        <section className={styles.section} aria-labelledby="preview-elements-title">
          <h2 className={styles.sectionTitle} id="preview-elements-title">
            Elementos incluidos e excluidos
          </h2>
          <div className={styles.classificationGroups}>
            {(
              [
                ['inScope', 'Dentro do escopo'],
                ['outScope', 'Fora do escopo'],
                ['interface', 'Interface externa'],
                ['unclassified', 'Nao classificado'],
              ] as const
            ).map(([key, title]) => (
              <div key={key} className={styles.classificationGroup}>
                <p className={styles.classificationGroupTitle}>{title}</p>
                {groups[key].length === 0 ? (
                  <p className={styles.itemOrigin}>Nenhum item</p>
                ) : (
                  <ul className={styles.itemList}>
                    {groups[key].map((item) => (
                      <li key={item.id} className={styles.itemRow}>
                        <span>{item.label}</span>
                        <span className={styles.itemOrigin}>{item.origin}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>

        <section className={styles.section} aria-labelledby="preview-interfaces-title">
          <h2 className={styles.sectionTitle} id="preview-interfaces-title">
            Interfaces (conexoes)
          </h2>
          {totalInterfaceConnections === 0 ? (
            <p className={styles.itemOrigin}>Nenhuma conexao mapeada ainda.</p>
          ) : (
            <ul className={styles.itemList}>
              {topology.links.map((link) => (
                <li key={link.id} className={styles.itemRow}>
                  <span>
                    {nodeName(topology.nodes, link.fromNodeId)} →{' '}
                    {nodeName(topology.nodes, link.toNodeId)}
                  </span>
                  <span className={styles.itemOrigin}>Topologia</span>
                </li>
              ))}
              {architecture.interfaces.map((architectureInterface) => (
                <li key={architectureInterface.id} className={styles.itemRow}>
                  <span>
                    {componentName(
                      architecture.components,
                      architectureInterface.fromComponentId,
                    )}{' '}
                    →{' '}
                    {componentName(
                      architecture.components,
                      architectureInterface.toComponentId,
                    )}
                  </span>
                  <span className={styles.itemOrigin}>Arquitetura</span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className={styles.section} aria-labelledby="preview-resources-title">
          <h2 className={styles.sectionTitle} id="preview-resources-title">
            Recursos
          </h2>
          <div className={styles.classificationGroups}>
            <div className={styles.classificationGroup}>
              <p className={styles.classificationGroupTitle}>
                Localidades ({limits.locations.length})
              </p>
              <ul className={styles.itemList}>
                {limits.locations.map((location) => (
                  <li key={location.id} className={styles.itemRow}>
                    <span>{location.name}</span>
                    <span className={styles.itemOrigin}>
                      {scopeClassificationLabel(location.classification)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <div className={styles.classificationGroup}>
              <p className={styles.classificationGroupTitle}>
                Colaboradores/areas ({limits.employeeGroups.length})
              </p>
              <ul className={styles.itemList}>
                {limits.employeeGroups.map((group) => (
                  <li key={group.id} className={styles.itemRow}>
                    <span>{group.areaOrGroup}</span>
                    <span className={styles.itemOrigin}>{group.quantity ?? '—'}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className={styles.classificationGroup}>
              <p className={styles.classificationGroupTitle}>
                Ativos ({limits.assets.length})
              </p>
              <ul className={styles.itemList}>
                {limits.assets.map((asset) => (
                  <li key={asset.id} className={styles.itemRow}>
                    <span>{asset.assetName}</span>
                    <span className={styles.itemOrigin}>
                      {scopeClassificationLabel(asset.classification)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <div className={styles.classificationGroup}>
              <p className={styles.classificationGroupTitle}>
                Prestadores ({limits.providers.length})
              </p>
              <ul className={styles.itemList}>
                {limits.providers.map((provider) => (
                  <li key={provider.id} className={styles.itemRow}>
                    <span>{provider.providerName}</span>
                    <span className={styles.itemOrigin}>
                      {scopeClassificationLabel(provider.classification)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className={styles.section} aria-labelledby="preview-diagrams-title">
          <h2 className={styles.sectionTitle} id="preview-diagrams-title">
            Diagramas
          </h2>
          <p className={styles.diagramTitle}>Cadeia de valor</p>
          <div className={styles.diagramWrapper}>
            <ValueChainDiagram data={toValueChainDiagramData(valueChain)} />
          </div>
          <p className={styles.diagramTitle}>Topologia</p>
          <div className={styles.diagramWrapper}>
            <TopologyDiagram data={toTopologyDiagramData(topology)} />
          </div>
          <p className={styles.diagramTitle}>Arquitetura</p>
          <div className={styles.diagramWrapper}>
            <ArchitectureDiagram data={toArchitectureDiagramData(architecture)} />
          </div>
        </section>
      </article>

      <section className={styles.section} aria-labelledby="preview-export-title">
        <h2 className={styles.sectionTitle} id="preview-export-title">
          Exportacao
        </h2>
        <DocumentGenerationButtons projectId={projectId} />
      </section>
    </div>
  );
}
