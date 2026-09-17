import { redirect } from 'next/navigation';

import { getSessionToken } from '@/services/auth/session';
import { LoginForm } from './LoginForm';
import styles from './login.module.css';

export default async function LoginPage() {
  const token = await getSessionToken();

  if (token) {
    redirect('/');
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <h1 className={styles.title}>Entrar no DSR</h1>
        <LoginForm />
      </div>
    </div>
  );
}
