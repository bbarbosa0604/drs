import clsx from 'clsx';

import styles from './DaryusLogo.module.css';

/**
 * Recriacao fiel do simbolo (triangulo, variante A: cor principal) + wordmark
 * do brandbook Daryus. O arquivo original (`LOGO RGB copy_Color.svg`, citado
 * no brandbook) nao foi fornecido nesta conversa — pendencia registrada na
 * Task 007 para substituir por este SVG quando o asset chegar.
 */
export function DaryusLogo({
  variant = 'light',
}: {
  variant?: 'light' | 'dark';
}) {
  return (
    <span className={styles.logo} aria-label="Daryus" role="img">
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
        <path d="M14 2 L26 24 H2 Z" fill="var(--color-brand-primary)" />
      </svg>
      <span
        className={clsx(
          styles.wordmark,
          variant === 'light' ? styles.wordmarkLight : styles.wordmarkDark,
        )}
      >
        DARYUS
      </span>
    </span>
  );
}
