import clsx from 'clsx';

import styles from './AutosaveIndicator.module.css';
import type { AutosaveStatus } from './hooks/useAutosave';

const LABEL: Record<AutosaveStatus, string> = {
  idle: '',
  saving: 'Salvando...',
  saved: 'Salvo',
  error: 'Erro ao salvar',
};

export function AutosaveIndicator({ status }: { status: AutosaveStatus }) {
  if (status === 'idle') {
    return null;
  }

  return (
    <p
      className={clsx(styles.indicator, styles[status])}
      role="status"
      aria-live="polite"
    >
      {LABEL[status]}
    </p>
  );
}
