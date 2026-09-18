'use client';

import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';

import styles from './AppShell.module.css';
import { DaryusLogo } from './DaryusLogo';

/** Rotas com layout proprio de tela cheia, sem o header/padding do shell. */
const FULL_BLEED_ROUTES = ['/login'];

/**
 * Shell de layout basico (header + area de conteudo), reutilizavel pelas
 * demais telas (dashboard, organizacao, projeto, Escopometro — Tasks 008+).
 * `/login` tem sua propria diagramacao (Task fora do backlog - pedido do
 * Bruno) e nao deve repetir o header aqui.
 * Tema escuro fica como pendencia futura (PRD secao 35), nao bloqueante do MVP.
 */
export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  if (FULL_BLEED_ROUTES.includes(pathname)) {
    return <>{children}</>;
  }

  return (
    <div className={styles.shell}>
      <header className={styles.header}>
        <DaryusLogo variant="light" />
      </header>
      <main className={styles.content}>{children}</main>
    </div>
  );
}
