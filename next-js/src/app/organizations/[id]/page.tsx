import { redirect } from 'next/navigation';

import { SectionCard } from '@/components/dashboard/SectionCard';
import { EmptyState } from '@/components/dashboard/EmptyState';
import { clearSessionToken, getSessionToken } from '@/services/auth/session';
import { BackendApiError } from '@/services/http/backend-client';
import { getOrganization } from '@/services/organizations/organizations.service';
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
    const organization = await getOrganization(token, id);

    return (
      <div className={styles.page}>
        <h1 className={styles.title}>{organization.name}</h1>
        <OrganizationForm organization={organization} />
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
