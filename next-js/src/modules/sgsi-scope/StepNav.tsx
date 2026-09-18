import Link from 'next/link';

import styles from './etapa-empresa/EtapaEmpresaForm.module.css';

const STEPS = [
  'Empresa',
  'Contexto',
  'Requisitos & CGSI',
  'Escopo',
  'Cadeia de Valor',
  'Topologia & Arquitetura',
  'Limites & Recursos',
  'Previa & Exportacao',
];

/**
 * Navegacao livre entre etapas (PRD secao 7): so etapas ja implementadas tem
 * `href` (Etapas 1-2 nesta task); as demais ficam so como rotulo ate ganharem UI.
 */
export function StepNav({
  projectId,
  activeStep,
}: {
  projectId: string;
  activeStep: number;
}) {
  const hrefByStep: Record<number, string> = {
    1: `/projects/${projectId}/sgsi-scope`,
    2: `/projects/${projectId}/sgsi-scope/context`,
    3: `/projects/${projectId}/sgsi-scope/requirements`,
    4: `/projects/${projectId}/sgsi-scope/scope-definition`,
    5: `/projects/${projectId}/sgsi-scope/value-chain`,
    6: `/projects/${projectId}/sgsi-scope/topology`,
    7: `/projects/${projectId}/sgsi-scope/limits`,
    8: `/projects/${projectId}/sgsi-scope/preview`,
  };

  return (
    <div className={styles.stepNavWrapper}>
      <Link className={styles.backLink} href={`/projects/${projectId}`}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M19 12 H5 M11 6 L5 12 L11 18"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        Voltar ao projeto
      </Link>
      <nav className={styles.steps} aria-label="Etapas do Escopometro">
        {STEPS.map((step, index) => {
          const stepNumber = index + 1;
          const href = hrefByStep[stepNumber];
          const isActive = stepNumber === activeStep;
          const className = isActive ? styles.stepActive : styles.step;

          const content = (
            <>
              <span className={styles.stepNumber}>{stepNumber}</span>
              <span className={styles.stepLabel}>{step}</span>
            </>
          );

          return href ? (
            <Link key={step} className={className} href={href}>
              {content}
            </Link>
          ) : (
            <span key={step} className={className}>
              {content}
            </span>
          );
        })}
      </nav>
    </div>
  );
}
