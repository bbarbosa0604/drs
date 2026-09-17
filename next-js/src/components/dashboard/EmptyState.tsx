import Link from 'next/link';

import styles from './EmptyState.module.css';

export function EmptyState({
  message,
  action,
}: {
  message: string;
  action?: { label: string; href: string };
}) {
  return (
    <div className={styles.empty}>
      <p className={styles.message}>{message}</p>
      {action ? (
        <Link className={styles.action} href={action.href}>
          {action.label}
        </Link>
      ) : null}
    </div>
  );
}
