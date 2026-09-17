import { redirect } from 'next/navigation';

import { SectionCard } from '@/components/dashboard/SectionCard';
import { EmptyState } from '@/components/dashboard/EmptyState';
import { getCurrentUser } from '@/services/auth/auth.service';
import { clearSessionToken, getSessionToken } from '@/services/auth/session';
import { BackendApiError } from '@/services/http/backend-client';
import { listOrganizations } from '@/services/organizations/organizations.service';
import { getProject } from '@/services/projects/projects.service';
import { ProjectForm } from '../ProjectForm';
import styles from '../page.module.css';

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const token = await getSessionToken();

  if (!token) {
    redirect('/login');
  }

  const { id } = await params;

  try {
    const [user, project, organizations] = await Promise.all([
      getCurrentUser(token),
      getProject(token, id),
      listOrganizations(token),
    ]);

    return (
      <div className={styles.page}>
        <h1 className={styles.title}>{project.name}</h1>
        <ProjectForm
          project={project}
          organizations={organizations}
          currentUserId={user.id}
        />
      </div>
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
        <SectionCard title="Nao foi possivel carregar o projeto">
          <EmptyState
            message="O backend nao respondeu. Tente novamente."
            action={{ label: 'Tentar novamente', href: `/projects/${id}` }}
          />
        </SectionCard>
      </div>
    );
  }
}
