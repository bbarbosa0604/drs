import { redirect } from 'next/navigation';

import { EmptyState } from '@/components/dashboard/EmptyState';
import { SectionCard } from '@/components/dashboard/SectionCard';
import { EtapaRequisitosForm } from '@/modules/sgsi-scope/etapa-requisitos/EtapaRequisitosForm';
import { clearSessionToken, getSessionToken } from '@/services/auth/session';
import { BackendApiError } from '@/services/http/backend-client';
import {
  getGovernanceSection,
  getProjectRequirements,
  listStakeholders,
} from '@/services/sgsi-scope/requirements.service';
import styles from '../../../page.module.css';

export default async function SgsiScopeRequirementsPage({
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
    const [stakeholders, requirementsSection, governanceSection] =
      await Promise.all([
        listStakeholders(token, projectId),
        getProjectRequirements(token, projectId),
        getGovernanceSection(token, projectId),
      ]);

    return (
      <EtapaRequisitosForm
        projectId={projectId}
        stakeholders={stakeholders}
        requirementsLibrary={requirementsSection.library}
        selectedRequirements={requirementsSection.selected}
        governanceCommittee={governanceSection.committee}
        governanceMembers={governanceSection.members}
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
              message="Ative o Escopometro na Etapa 1 antes de acessar Requisitos & CGSI."
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
        <SectionCard title="Nao foi possivel carregar Requisitos & CGSI">
          <EmptyState
            message="O backend nao respondeu. Tente novamente."
            action={{
              label: 'Tentar novamente',
              href: `/projects/${projectId}/sgsi-scope/requirements`,
            }}
          />
        </SectionCard>
      </div>
    );
  }
}
