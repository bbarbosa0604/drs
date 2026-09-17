import type { ReactNode } from 'react';

import styles from './AppShell.module.css';
import { DaryusLogo } from './DaryusLogo';

/**
 * Shell de layout basico (header + area de conteudo), reutilizavel pelas
 * demais telas (dashboard, organizacao, projeto, Escopometro — Tasks 008+).
 * Tema escuro fica como pendencia futura (PRD secao 35), nao bloqueante do MVP.
 */
export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className={styles.shell}>
      <header className={styles.header}>
        <DaryusLogo variant="light" />
      </header>
      <main className={styles.content}>{children}</main>
    </div>
  );
}
