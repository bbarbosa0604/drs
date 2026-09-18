import Link from 'next/link';

import { DSR_SOLUTIONS } from './solutions-catalog';
import styles from './SolutionsGrid.module.css';

/** Hub de solucoes DSR dentro de um projeto - o Escopometro e uma das ~10-15 planejadas. */
export function SolutionsGrid({ projectId }: { projectId: string }) {
  return (
    <div className={styles.grid}>
      {DSR_SOLUTIONS.map((solution) => {
        const content = (
          <>
            <div className={styles.cardHeader}>
              <p className={styles.cardName}>{solution.name}</p>
              {solution.status === 'coming-soon' ? (
                <span className={styles.badge}>Em breve</span>
              ) : null}
            </div>
            <p className={styles.cardDescription}>{solution.description}</p>
          </>
        );

        if (solution.status === 'available' && solution.href) {
          return (
            <Link
              key={solution.key}
              className={`${styles.card} ${styles.cardAvailable}`}
              href={solution.href(projectId)}
            >
              {content}
            </Link>
          );
        }

        return (
          <div
            key={solution.key}
            className={`${styles.card} ${styles.cardComingSoon}`}
          >
            {content}
          </div>
        );
      })}
    </div>
  );
}
