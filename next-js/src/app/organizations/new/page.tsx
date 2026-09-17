import { redirect } from 'next/navigation';

import { getSessionToken } from '@/services/auth/session';
import { OrganizationForm } from '../OrganizationForm';
import styles from '../page.module.css';

export default async function NewOrganizationPage() {
  const token = await getSessionToken();

  if (!token) {
    redirect('/login');
  }

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Nova organizacao</h1>
      <OrganizationForm />
    </div>
  );
}
