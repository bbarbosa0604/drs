import { redirect } from 'next/navigation';

import { EmptyState } from '@/components/dashboard/EmptyState';
import { SectionCard } from '@/components/dashboard/SectionCard';
import { EtapaCadeiaValorForm } from '@/modules/sgsi-scope/etapa-cadeia-valor/EtapaCadeiaValorForm';
import { clearSessionToken, getSessionToken } from '@/services/auth/session';
import { BackendApiError } from '@/services/http/backend-client';
import { getValueChainSection } from '@/services/sgsi-scope/scope-engine.service';
import styles from '../../../page.module.css';

export default async function SgsiScopeValueChainPage({
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
    const section = await getValueChainSection(token, projectId);

    return (
      <EtapaCadeiaValorForm projectId={projectId} initialBlocks={section.blocks} />
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
              message="Ative o Escopometro na Etapa 1 antes de acessar a cadeia de valor."
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
        <SectionCard title="Nao foi possivel carregar a cadeia de valor">
          <EmptyState
            message="O backend nao respondeu. Tente novamente."
            action={{
              label: 'Tentar novamente',
              href: `/projects/${projectId}/sgsi-scope/value-chain`,
            }}
          />
        </SectionCard>
      </div>
    );
  }
}
