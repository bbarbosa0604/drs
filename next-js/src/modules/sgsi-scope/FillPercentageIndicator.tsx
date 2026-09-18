import styles from './FillPercentageIndicator.module.css';

/**
 * PRD secao 16: o indicador NUNCA representa conformidade, maturidade,
 * qualidade, prontidao ou adequacao do escopo — so presenca de
 * preenchimento. O disclaimer fica sempre visivel (texto abaixo da barra),
 * nao escondido atras de um tooltip, e a cor e neutra (nunca semaforo
 * verde/vermelho de aprovado/reprovado).
 */
export function FillPercentageIndicator({
  label,
  percentage,
}: {
  label: string;
  percentage: number;
}) {
  return (
    <div className={styles.wrapper} role="status" aria-label={label}>
      <div className={styles.topRow}>
        <p className={styles.label}>{label}</p>
        <p className={styles.percentage}>{percentage}%</p>
      </div>
      <div className={styles.track}>
        <div
          className={styles.fill}
          style={{ width: `${Math.min(100, Math.max(0, percentage))}%` }}
        />
      </div>
      <p className={styles.disclaimer}>
        Mede apenas presenca de preenchimento das informacoes esperadas. Nao
        representa conformidade com a ISO 27001, maturidade, qualidade,
        prontidao para certificacao ou adequacao do escopo.
      </p>
    </div>
  );
}
