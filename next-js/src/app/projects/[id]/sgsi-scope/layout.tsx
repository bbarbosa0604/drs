import type { ReactNode } from 'react';

import { FillPercentageIndicator } from '@/modules/sgsi-scope/FillPercentageIndicator';
import { getSessionToken } from '@/services/auth/session';
import { BackendApiError } from '@/services/http/backend-client';
import { getFillPercentage } from '@/services/sgsi-scope/scope-definition.service';
import styles from './layout.module.css';

/**
 * Compartilhado por todas as Etapas do Escopometro (Task 018): mostra o
 * indicador de percentual de preenchimento de forma persistente, nao so na
 * Etapa 4. Se o modulo ainda nao foi ativado (404) ou a sessao expirou, so
 * renderiza os filhos sem o indicador — a propria pagina trata esses casos.
 */
export default async function SgsiScopeLayout({
  params,
  children,
}: {
  params: Promise<{ id: string }>;
  children: ReactNode;
}) {
  const token = await getSessionToken();
  const { id: projectId } = await params;

  let fillPercentage = null;

  if (token) {
    try {
      fillPercentage = await getFillPercentage(token, projectId);
    } catch (error) {
      if (!(error instanceof BackendApiError)) {
        throw error;
      }
    }
  }

  return (
    <div className={styles.wrapper}>
      {fillPercentage ? (
        <FillPercentageIndicator
          label={fillPercentage.label}
          percentage={fillPercentage.percentage}
        />
      ) : null}
      {children}
    </div>
  );
}
