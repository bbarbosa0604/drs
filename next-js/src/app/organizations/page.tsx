import Link from 'next/link';
import { redirect } from 'next/navigation';

import { EmptyState } from '@/components/dashboard/EmptyState';
import { SectionCard } from '@/components/dashboard/SectionCard';
import { clearSessionToken, getSessionToken } from '@/services/auth/session';
import { BackendApiError } from '@/services/http/backend-client';
import { listOrganizations } from '@/services/organizations/organizations.service';
import styles from './page.module.css';

export default async function OrganizationsPage() {
  const token = await getSessionToken();

  if (!token) {
    redirect('/login');
  }

  try {
    const organizations = await listOrganizations(token);

    return (
      <div className={styles.page}>
        <div className={styles.topBar}>
          <h1 className={styles.title}>Organizacoes</h1>
          <Link className={styles.newAction} href="/organizations/new">
            Nova organizacao
          </Link>
        </div>

        {organizations.length === 0 ? (
          <EmptyState
            message="Voce ainda nao esta vinculado a nenhuma organizacao."
            action={{ label: 'Nova organizacao', href: '/organizations/new' }}
          />
        ) : (
          <ul className={styles.list}>
            {organizations.map((organization) => (
              <li key={organization.id}>
                <Link
                  className={styles.item}
                  href={`/organizations/${organization.id}`}
                >
                  <p className={styles.itemName}>{organization.name}</p>
                  {organization.segment ? (
                    <p className={styles.itemMeta}>{organization.segment}</p>
                  ) : null}
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
        <SectionCard title="Nao foi possivel carregar as organizacoes">
          <EmptyState
            message="O backend nao respondeu. Tente novamente."
            action={{ label: 'Tentar novamente', href: '/organizations' }}
          />
        </SectionCard>
      </div>
    );
  }
}
