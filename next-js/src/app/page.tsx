import Link from "next/link";

import styles from "./page.module.css";

export default function Home() {
  return (
    <main className={styles.page}>
      <section className={styles.main} aria-labelledby="home-title">
        <p className={styles.eyebrow}>Scaffold Next.js</p>
        <h1 id="home-title" className={styles.title}>
          Front-end web pronto para tasks da raiz.
        </h1>
        <p className={styles.copy}>
          Use esta aplicacao quando o planejamento indicar Next.js como stack
          web. O backlog, contrato e design system continuam governados pela
          raiz do monorepo.
        </p>
        <div className={styles.actions}>
          <Link className={`${styles.link} ${styles.linkPrimary}`} href="/">
            Comecar
          </Link>
          <Link className={styles.link} href="/">
            Ver aplicacao
          </Link>
        </div>
      </section>
    </main>
  );
}
