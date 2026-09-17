import Link from 'next/link';
import { redirect } from 'next/navigation';

import { EmptyState } from '@/components/dashboard/EmptyState';
import { SectionCard } from '@/components/dashboard/SectionCard';
import { clearSessionToken, getSessionToken } from '@/services/auth/session';
import { BackendApiError } from '@/services/http/backend-client';
import { listProjects } from '@/services/projects/projects.service';
import styles from './page.module.css';

export default async function ProjectsPage() {
  const token = await getSessionToken();

  if (!token) {
    redirect('/login');
  }

  try {
    const projects = await listProjects(token);

    return (
      <div className={styles.page}>
        <div className={styles.topBar}>
          <h1 className={styles.title}>Projetos</h1>
          <Link className={styles.newAction} href="/projects/new">
            Novo projeto
          </Link>
        </div>

        {projects.length === 0 ? (
          <EmptyState
            message="Nenhum projeto ainda."
            action={{ label: 'Novo projeto', href: '/projects/new' }}
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
    );
  } catch (error) {
    if (error instanceof BackendApiError && error.statusCode === 401) {
      await clearSessionToken();
      redirect('/login');
    }

    return (
      <div className={styles.page}>
        <SectionCard title="Nao foi possivel carregar os projetos">
          <EmptyState
            message="O backend nao respondeu. Tente novamente."
            action={{ label: 'Tentar novamente', href: '/projects' }}
          />
        </SectionCard>
      </div>
    );
  }
}
