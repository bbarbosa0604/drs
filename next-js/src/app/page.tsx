import Link from 'next/link';
import { redirect } from 'next/navigation';

import { LogoutButton } from './LogoutButton';
import styles from './page.module.css';
import { EmptyState } from '@/components/dashboard/EmptyState';
import { SectionCard } from '@/components/dashboard/SectionCard';
import { getCurrentUser } from '@/services/auth/auth.service';
import { clearSessionToken, getSessionToken } from '@/services/auth/session';
import { BackendApiError } from '@/services/http/backend-client';
import {
  listOrganizations,
  type Organization,
} from '@/services/organizations/organizations.service';
import { listProjects, type Project } from '@/services/projects/projects.service';

/**
 * Dashboard = rota inicial pos-login (PRD secao 4). "Modulos utilizados",
 * "Documentos gerados" e "Atividades recentes" ficam como placeholder
 * explicito ate as tasks que os implementam (Escopometro/Slice 002, geracao
 * de documentos/Task 026, auditoria/Task 027) — nunca dado inventado.
 */
export default async function DashboardPage() {
  const token = await getSessionToken();

  if (!token) {
    redirect('/login');
  }

  let user;
  let organizations: Organization[];
  let projects: Project[];

  try {
    [user, organizations, projects] = await Promise.all([
      getCurrentUser(token),
      listOrganizations(token),
      listProjects(token),
    ]);
  } catch (error) {
    if (error instanceof BackendApiError && error.statusCode === 401) {
      await clearSessionToken();
      redirect('/login');
    }

    return (
      <div className={styles.page}>
        <SectionCard title="Nao foi possivel carregar o dashboard">
          <EmptyState
            message="O backend nao respondeu. Verifique a conexao e tente novamente."
            action={{ label: 'Tentar novamente', href: '/' }}
          />
        </SectionCard>
      </div>
    );
  }

  const hasOrganizations = organizations.length > 0;
  const recentOrganizations = organizations.slice(0, 5);
  const recentProjects = projects.slice(0, 5);
  const projectsInProgress = projects
    .filter((project) => project.status === 'IN_PROGRESS')
    .slice(0, 5);

  return (
    <div className={styles.page}>
      <div className={styles.topBar}>
        <p className={styles.greeting}>Ola, {user.name}</p>
        <LogoutButton />
      </div>

      <div className={styles.actions}>
        <Link className={styles.primaryAction} href="/organizations/new">
          Nova organizacao
        </Link>
        <Link className={styles.secondaryAction} href="/projects/new">
          Novo projeto
        </Link>
      </div>

      {!hasOrganizations ? (
        <SectionCard title="Organizacoes">
          <EmptyState
            message="Voce ainda nao esta vinculado a nenhuma organizacao."
            action={{ label: 'Nova organizacao', href: '/organizations/new' }}
          />
        </SectionCard>
      ) : (
        <div className={styles.grid}>
          <SectionCard
            title="Organizacoes recentes"
            action={{ label: 'Ver todas', href: '/organizations' }}
          >
            <ul className={styles.list}>
              {recentOrganizations.map((organization) => (
                <li key={organization.id} className={styles.listItem}>
                  <Link href={`/organizations/${organization.id}`}>
                    {organization.name}
                  </Link>
                </li>
              ))}
            </ul>
          </SectionCard>

          <SectionCard
            title="Projetos recentes"
            action={{ label: 'Ver todos', href: '/projects' }}
          >
            {recentProjects.length === 0 ? (
              <EmptyState
                message="Nenhum projeto ainda."
                action={{ label: 'Novo projeto', href: '/projects/new' }}
              />
            ) : (
              <ul className={styles.list}>
                {recentProjects.map((project) => (
                  <li key={project.id} className={styles.listItem}>
                    <Link href={`/projects/${project.id}`}>{project.name}</Link>
                  </li>
                ))}
              </ul>
            )}
          </SectionCard>

          <SectionCard title="Projetos em andamento">
            {projectsInProgress.length === 0 ? (
              <EmptyState message="Nenhum projeto em andamento no momento." />
            ) : (
              <ul className={styles.list}>
                {projectsInProgress.map((project) => (
                  <li key={project.id} className={styles.listItem}>
                    <Link href={`/projects/${project.id}`}>{project.name}</Link>
                  </li>
                ))}
              </ul>
            )}
          </SectionCard>

          <SectionCard title="Modulos utilizados">
            <EmptyState message="Em breve, apos a ativacao do modulo Escopometro." />
          </SectionCard>

          <SectionCard title="Documentos gerados">
            <EmptyState message="Em breve, apos a geracao de documentos do Escopometro." />
          </SectionCard>

          <SectionCard title="Atividades recentes">
            <EmptyState message="Em breve, apos a auditoria e versionamento." />
          </SectionCard>
        </div>
      )}
    </div>
  );
}
