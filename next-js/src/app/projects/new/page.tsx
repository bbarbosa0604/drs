import { redirect } from 'next/navigation';

import { EmptyState } from '@/components/dashboard/EmptyState';
import { getCurrentUser } from '@/services/auth/auth.service';
import { getSessionToken } from '@/services/auth/session';
import { listOrganizations } from '@/services/organizations/organizations.service';
import { ProjectForm } from '../ProjectForm';
import styles from '../page.module.css';

export default async function NewProjectPage({
  searchParams,
}: {
  searchParams: Promise<{ organizationId?: string }>;
}) {
  const token = await getSessionToken();

  if (!token) {
    redirect('/login');
  }

  const [{ organizationId }, [user, organizations]] = await Promise.all([
    searchParams,
    Promise.all([getCurrentUser(token), listOrganizations(token)]),
  ]);

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Novo projeto</h1>
      {organizations.length === 0 ? (
        <EmptyState
          message="Crie uma organizacao antes de criar um projeto."
          action={{ label: 'Nova organizacao', href: '/organizations/new' }}
        />
      ) : (
        <ProjectForm
          organizations={organizations}
          currentUserId={user.id}
          defaultOrganizationId={organizationId}
        />
      )}
    </div>
  );
}
