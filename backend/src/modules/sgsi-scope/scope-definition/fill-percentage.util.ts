/**
 * Percentual de preenchimento do Escopometro (PRD secao 16) — NUNCA rotular
 * como conformidade/maturidade/qualidade/prontidao/adequacao. So mede
 * presenca/preenchimento de campos, nunca julga o conteudo.
 *
 * Lista fechada (Task 016, registrada explicitamente para evitar ambiguidade
 * futura): so considera secoes ja modeladas ate o Slice 003 (Etapas 1-4).
 * Etapas 5-8 nao tem entidade ainda e portanto nao entram na conta — o
 * percentual so pode medir o que existe como dado estruturado.
 *
 * "Dados da organizacao" da Etapa 1 (nome, segmento, etc.) ficam de fora de
 * proposito: sao referencia reaproveitada da Organizacao (Task 013), nao algo
 * que o usuario preenche dentro do fluxo do Escopometro. "Direcionadores" da
 * Etapa 2 SIM entram, porque o PRD os lista como parte do que a Etapa 2 pede
 * ativamente ao usuario, mesmo armazenados na Organizacao.
 */
export interface FillPercentageChecks {
  documentControlClassification: boolean;
  documentControlVersion: boolean;
  documentControlDocumentDate: boolean;
  documentControlValidUntil: boolean;
  documentControlPreparedBy: boolean;
  documentControlApprovedBy: boolean;
  contextHistory: boolean;
  directionBusiness: boolean;
  directionMission: boolean;
  directionVision: boolean;
  directionValues: boolean;
  hasExternalContextAspect: boolean;
  hasInternalContextAspect: boolean;
  hasStakeholder: boolean;
  hasProjectRequirement: boolean;
  governanceCommitteeName: boolean;
  hasGovernanceMember: boolean;
  scopeFormalDeclaration: boolean;
  scopeExecutiveJustification: boolean;
  scopeDetailedDescription: boolean;
  hasScopeCharacteristic: boolean;
  hasScopeBenefit: boolean;
}

export interface FillPercentageResult {
  label: 'Percentual de preenchimento do Escopometro';
  percentage: number;
  totalChecks: number;
  passedChecks: number;
}

export function calculateFillPercentage(
  checks: FillPercentageChecks,
): FillPercentageResult {
  const values = Object.values(checks);
  const totalChecks = values.length;
  const passedChecks = values.filter(Boolean).length;
  const percentage =
    totalChecks === 0 ? 0 : Math.round((passedChecks / totalChecks) * 100);

  return {
    label: 'Percentual de preenchimento do Escopometro',
    percentage,
    totalChecks,
    passedChecks,
  };
}
