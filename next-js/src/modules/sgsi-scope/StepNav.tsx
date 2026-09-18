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
  };

  return (
    <nav className={styles.steps} aria-label="Etapas do Escopometro">
      {STEPS.map((step, index) => {
        const stepNumber = index + 1;
        const href = hrefByStep[stepNumber];
        const className =
          stepNumber === activeStep ? styles.stepActive : styles.step;
        const label = `${stepNumber}. ${step}`;

        return href ? (
          <Link key={step} className={className} href={href}>
            {label}
          </Link>
        ) : (
          <span key={step} className={className}>
            {label}
          </span>
        );
      })}
    </nav>
  );
}
