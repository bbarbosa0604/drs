'use client';

import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';

import styles from './AppShell.module.css';
import { Sidebar } from './Sidebar';

/** Rotas com layout proprio de tela cheia, sem o menu lateral do shell. */
const FULL_BLEED_ROUTES = ['/login'];

/**
 * Shell de layout basico (menu lateral + area de conteudo), reutilizavel
 * pelas demais telas (dashboard, organizacao, projeto, Escopometro —
 * Tasks 008+, menu lateral — Task 028). `/login` tem sua propria diagramacao
 * (Task fora do backlog - pedido do Bruno) e nao deve repetir o shell aqui.
 * Tema escuro fica como pendencia futura (PRD secao 35), nao bloqueante do MVP.
 */
export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  if (FULL_BLEED_ROUTES.includes(pathname)) {
    return <>{children}</>;
  }

  return (
    <div className={styles.shell}>
      <Sidebar />
      <main className={styles.content}>{children}</main>
    </div>
  );
}
