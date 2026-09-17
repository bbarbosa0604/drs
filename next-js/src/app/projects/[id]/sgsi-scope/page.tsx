import { redirect } from 'next/navigation';

import { EmptyState } from '@/components/dashboard/EmptyState';
import { SectionCard } from '@/components/dashboard/SectionCard';
import { EtapaEmpresaForm } from '@/modules/sgsi-scope/etapa-empresa/EtapaEmpresaForm';
import { getCurrentUser } from '@/services/auth/auth.service';
import { clearSessionToken, getSessionToken } from '@/services/auth/session';
import { BackendApiError } from '@/services/http/backend-client';
import { getOrganization } from '@/services/organizations/organizations.service';
import { getProject } from '@/services/projects/projects.service';
import { activateSgsiScopeModule } from '@/services/sgsi-scope/sgsi-scope.service';
import styles from '../../page.module.css';

export default async function SgsiScopePage({
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
    const [user, organization, sgsiScope] = await Promise.all([
      getCurrentUser(token),
      getOrganization(token, project.organizationId),
      activateSgsiScopeModule(token, projectId),
    ]);

    return (
      <EtapaEmpresaForm
        projectId={projectId}
        organization={organization}
        documentControl={sgsiScope.documentControl}
        currentUserName={user.name}
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
          <SectionCard title="Projeto nao encontrado">
            <EmptyState
              message="Este projeto nao existe ou foi removido."
              action={{ label: 'Voltar para projetos', href: '/projects' }}
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
        <SectionCard title="Nao foi possivel carregar o Escopometro">
          <EmptyState
            message="O backend nao respondeu. Tente novamente."
            action={{
              label: 'Tentar novamente',
              href: `/projects/${projectId}/sgsi-scope`,
            }}
          />
        </SectionCard>
      </div>
    );
  }
}
