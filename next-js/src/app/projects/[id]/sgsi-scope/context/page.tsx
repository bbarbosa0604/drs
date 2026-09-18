import { redirect } from 'next/navigation';

import { EmptyState } from '@/components/dashboard/EmptyState';
import { SectionCard } from '@/components/dashboard/SectionCard';
import { EtapaContextoForm } from '@/modules/sgsi-scope/etapa-contexto/EtapaContextoForm';
import { clearSessionToken, getSessionToken } from '@/services/auth/session';
import { BackendApiError } from '@/services/http/backend-client';
import { getOrganization } from '@/services/organizations/organizations.service';
import { getProject } from '@/services/projects/projects.service';
import { getContextSection } from '@/services/sgsi-scope/context.service';
import styles from '../../../page.module.css';

export default async function SgsiScopeContextPage({
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
    const [organization, contextSection] = await Promise.all([
      getOrganization(token, project.organizationId),
      getContextSection(token, projectId),
    ]);

    return (
      <EtapaContextoForm
        projectId={projectId}
        organization={organization}
        organizationContext={contextSection.organizationContext}
        aspects={contextSection.aspects}
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
              message="Ative o Escopometro na Etapa 1 antes de acessar o Contexto."
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
        <SectionCard title="Nao foi possivel carregar o Contexto">
          <EmptyState
            message="O backend nao respondeu. Tente novamente."
            action={{
              label: 'Tentar novamente',
              href: `/projects/${projectId}/sgsi-scope/context`,
            }}
          />
        </SectionCard>
      </div>
    );
  }
}
