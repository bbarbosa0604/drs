import { redirect } from 'next/navigation';

import { DaryusLogo } from '@/components/shell/DaryusLogo';
import { getSessionToken } from '@/services/auth/session';
import { LoginForm } from './LoginForm';
import styles from './login.module.css';

export default async function LoginPage() {
  const token = await getSessionToken();

  if (token) {
    redirect('/');
  }

  const year = new Date().getFullYear();

  return (
    <div className={styles.page}>
      <div className={styles.leftPanel}>
        <header className={styles.leftHeader}>
          <DaryusLogo variant="dark" />
          <span className={styles.badge}>DRS</span>
        </header>

        <div className={styles.leftContent}>
          <span className={styles.accentLine} />
          <p className={styles.greeting}>Ola, que bom ter voce aqui.</p>
          <h1 className={styles.title}>Bem-vindo de volta.</h1>
          <p className={styles.subtitle}>
            Acesse o DRS com sua conta interna.
          </p>

          <LoginForm />

          <p className={styles.secureNote}>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M12 2 L20 6 V12 C20 17 16.5 20.5 12 22 C7.5 20.5 4 17 4 12 V6 Z"
                stroke="currentColor"
                strokeWidth="1.5"
              />
            </svg>
            Acesso restrito a usuarios autorizados do DRS.
          </p>
        </div>

        <footer className={styles.leftFooter}>
          <span>DRS — Daryus Resilient Services</span>
          <span>© {year}</span>
        </footer>
      </div>

      <div className={styles.rightPanel}>
        <div className={styles.rightHeader}>
          <span className={styles.tagline}>SGSI · Governanca · Resiliencia</span>
        </div>

        <div className={styles.symbolWash} aria-hidden="true">
          <svg viewBox="0 0 28 28" fill="none">
            <path d="M14 2 L26 24 H2 Z" fill="#ffffff" />
          </svg>
        </div>

        <div className={styles.quoteCard}>
          <span className={styles.accentLine} />
          <h2 className={styles.quoteTitle}>
            Estruture o escopo. Sustente a resiliencia.
          </h2>
          <p className={styles.quoteText}>
            O DRS reune as metodologias Daryus num so lugar - o Escopometro
            SGSI e a primeira de varias solucoes para apoiar a gestao de
            seguranca da informacao.
          </p>
        </div>
      </div>
    </div>
  );
}
