import Link from 'next/link';
import { redirect } from 'next/navigation';

import { SectionCard } from '@/components/dashboard/SectionCard';
import { EmptyState } from '@/components/dashboard/EmptyState';
import { clearSessionToken, getSessionToken } from '@/services/auth/session';
import { BackendApiError } from '@/services/http/backend-client';
import { getOrganization } from '@/services/organizations/organizations.service';
import { listProjects } from '@/services/projects/projects.service';
import { OrganizationForm } from '../OrganizationForm';
import styles from '../page.module.css';

export default async function EditOrganizationPage({
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
    const [organization, projects] = await Promise.all([
      getOrganization(token, id),
      listProjects(token, id),
    ]);

    return (
      <div className={styles.page}>
        <h1 className={styles.title}>{organization.name}</h1>

        <div className={styles.section}>
          <div className={styles.topBar}>
            <h2 className={styles.sectionTitle}>Projetos</h2>
            <Link
              className={styles.newAction}
              href={`/projects/new?organizationId=${id}`}
            >
              Novo projeto
            </Link>
          </div>

          {projects.length === 0 ? (
            <EmptyState
              message="Nenhum projeto nesta organizacao ainda."
              action={{
                label: 'Novo projeto',
                href: `/projects/new?organizationId=${id}`,
              }}
            />
          ) : (
            <ul className={styles.list}>
              {projects.map((project) => (
                <li key={project.id}>
                  <Link className={styles.item} href={`/projects/${project.id}`}>
                    <p className={styles.itemName}>{project.name}</p>
                    <p className={styles.itemMeta}>{project.status}</p>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        <details className={styles.details}>
          <summary>Dados da organizacao</summary>
          <OrganizationForm organization={organization} />
        </details>
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
          <SectionCard title="Organizacao nao encontrada">
            <EmptyState
              message="Esta organizacao nao existe ou foi removida."
              action={{ label: 'Voltar para organizacoes', href: '/organizations' }}
            />
          </SectionCard>
        </div>
      );
    }

    if (error instanceof BackendApiError && error.statusCode === 403) {
      return (
        <div className={styles.page}>
          <SectionCard title="Sem acesso">
            <EmptyState message="Voce nao tem vinculo com esta organizacao." />
          </SectionCard>
        </div>
      );
    }

    return (
      <div className={styles.page}>
        <SectionCard title="Nao foi possivel carregar a organizacao">
          <EmptyState
            message="O backend nao respondeu. Tente novamente."
            action={{ label: 'Tentar novamente', href: `/organizations/${id}` }}
          />
        </SectionCard>
      </div>
    );
  }
}
