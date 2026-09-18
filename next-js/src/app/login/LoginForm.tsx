'use client';

import { useRouter } from 'next/navigation';
import { useState, type FormEvent } from 'react';

import styles from './login.module.css';

function MailIcon() {
  return (
    <svg
      className={styles.inputIcon}
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M4 7 L12 13 L20 7" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg
      className={styles.inputIcon}
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <rect x="5" y="11" width="14" height="9" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8 11 V8 a4 4 0 0 1 8 0 v3" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M5 12 H19 M13 6 L19 12 L13 18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as {
          message?: string;
        } | null;

        setError(data?.message ?? 'Nao foi possivel entrar.');

        return;
      }

      router.replace('/');
      router.refresh();
    } catch {
      setError('Nao foi possivel entrar. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <label className={styles.field}>
        <span className={styles.label}>E-mail</span>
        <span className={styles.inputWrapper}>
          <MailIcon />
          <input
            className={styles.input}
            type="email"
            name="email"
            placeholder="nome@empresa.com.br"
            autoComplete="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </span>
      </label>
      <label className={styles.field}>
        <span className={styles.label}>Senha</span>
        <span className={styles.inputWrapper}>
          <LockIcon />
          <input
            className={styles.input}
            type="password"
            name="password"
            placeholder="Digite sua senha"
            autoComplete="current-password"
            required
            minLength={8}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </span>
      </label>
      {error ? (
        <p className={styles.error} role="alert">
          {error}
        </p>
      ) : null}
      <button className={styles.submit} type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Entrando...' : 'Entrar na plataforma'}
        <ArrowIcon />
      </button>
    </form>
  );
}
