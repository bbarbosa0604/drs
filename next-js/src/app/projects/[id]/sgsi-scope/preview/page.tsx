import { redirect } from 'next/navigation';

import { EmptyState } from '@/components/dashboard/EmptyState';
import { SectionCard } from '@/components/dashboard/SectionCard';
import { EtapaPreviaExportacao } from '@/modules/sgsi-scope/etapa-previa/EtapaPreviaExportacao';
import { getOrganization } from '@/services/organizations/organizations.service';
import { getProject } from '@/services/projects/projects.service';
import { clearSessionToken, getSessionToken } from '@/services/auth/session';
import { BackendApiError } from '@/services/http/backend-client';
import { getLimitsSection } from '@/services/sgsi-scope/limits.service';
import {
  getFillPercentage,
  getScopeDefinitionSection,
} from '@/services/sgsi-scope/scope-definition.service';
import {
  getArchitectureSection,
  getTopologySection,
  getValueChainSection,
} from '@/services/sgsi-scope/scope-engine.service';
import { getSgsiScope } from '@/services/sgsi-scope/sgsi-scope.service';
import styles from '../../../page.module.css';

/**
 * Etapa 8 (PRD secao 15): visao consolidada. Nao existe endpoint de preview
 * agregado no backend ainda (nenhuma task do backlog atual o cria) - esta
 * pagina busca em paralelo os endpoints ja existentes das Etapas 1/5/6/7 e
 * so compoe a exibicao, sem recalcular nenhuma regra de negocio (mesmo
 * padrao ja usado pela Task 022 ao buscar Topologia+Arquitetura juntas).
 */
export default async function SgsiScopePreviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const token = await getSessionToken();

  if (!token) {
    redirect('/login');
  }

  const { id: projectId } = await params;

  try {
    const project = await getProject(token, projectId);

    const [
      organization,
      sgsiScope,
      fillPercentage,
      scopeDefinitionSection,
      valueChain,
      topology,
      architecture,
      limits,
    ] = await Promise.all([
      getOrganization(token, project.organizationId),
      getSgsiScope(token, projectId),
      getFillPercentage(token, projectId),
      getScopeDefinitionSection(token, projectId),
      getValueChainSection(token, projectId),
      getTopologySection(token, projectId),
      getArchitectureSection(token, projectId),
      getLimitsSection(token, projectId),
    ]);

    return (
      <EtapaPreviaExportacao
        projectId={projectId}
        organization={organization}
        project={project}
        sgsiScope={sgsiScope}
        fillPercentage={fillPercentage}
        scopeDefinition={scopeDefinitionSection.scopeDefinition}
        valueChain={valueChain}
        topology={topology}
        architecture={architecture}
        limits={limits}
      />
    );
  } catch (error) {
    if (error instanceof BackendApiError && error.statusCode === 401) {
      await clearSessionToken();
      redirect('/login');
    }

    if (error instanceof BackendApiError && error.statusCode === 404) {
      return (
        <div className={styles.page}>
          <SectionCard title="Escopometro nao ativado">
            <EmptyState
              message="Ative o Escopometro na Etapa 1 antes de acessar a previa."
              action={{
                label: 'Ir para Etapa 1',
                href: `/projects/${projectId}/sgsi-scope`,
              }}
            />
          </SectionCard>
        </div>
      );
    }

    if (error instanceof BackendApiError && error.statusCode === 403) {
      return (
        <div className={styles.page}>
          <SectionCard title="Sem acesso">
            <EmptyState message="Voce nao tem vinculo com este projeto." />
          </SectionCard>
        </div>
      );
    }

    return (
      <div className={styles.page}>
        <SectionCard title="Nao foi possivel carregar a previa">
          <EmptyState
            message="O backend nao respondeu. Tente novamente."
            action={{
              label: 'Tentar novamente',
              href: `/projects/${projectId}/sgsi-scope/preview`,
            }}
          />
        </SectionCard>
      </div>
    );
  }
}
