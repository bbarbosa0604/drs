import { redirect } from 'next/navigation';

import { EmptyState } from '@/components/dashboard/EmptyState';
import { SectionCard } from '@/components/dashboard/SectionCard';
import { EtapaEscopoForm } from '@/modules/sgsi-scope/etapa-escopo/EtapaEscopoForm';
import { clearSessionToken, getSessionToken } from '@/services/auth/session';
import { BackendApiError } from '@/services/http/backend-client';
import { getScopeDefinitionSection } from '@/services/sgsi-scope/scope-definition.service';
import styles from '../../../page.module.css';

export default async function SgsiScopeScopeDefinitionPage({
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
    const section = await getScopeDefinitionSection(token, projectId);

    return (
      <EtapaEscopoForm
        projectId={projectId}
        scopeDefinition={section.scopeDefinition}
        characteristics={section.characteristics}
        benefits={section.benefits}
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
              message="Ative o Escopometro na Etapa 1 antes de acessar a declaracao de escopo."
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
        <SectionCard title="Nao foi possivel carregar a declaracao de escopo">
          <EmptyState
            message="O backend nao respondeu. Tente novamente."
            action={{
              label: 'Tentar novamente',
              href: `/projects/${projectId}/sgsi-scope/scope-definition`,
            }}
          />
        </SectionCard>
      </div>
    );
  }
}
