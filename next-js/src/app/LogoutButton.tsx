'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import styles from './LogoutButton.module.css';

export function LogoutButton() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  async function handleClick() {
    setIsLoading(true);

    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.replace('/login');
      router.refresh();
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <button
      className={styles.button}
      type="button"
      onClick={handleClick}
      disabled={isLoading}
    >
      Sair
    </button>
  );
}
