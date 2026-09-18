import {
  calculateFillPercentage,
  type FillPercentageChecks,
} from './fill-percentage.util';

function buildChecks(
  overrides: Partial<FillPercentageChecks> = {},
): FillPercentageChecks {
  return {
    documentControlClassification: false,
    documentControlVersion: false,
    documentControlDocumentDate: false,
    documentControlValidUntil: false,
    documentControlPreparedBy: false,
    documentControlApprovedBy: false,
    contextHistory: false,
    directionBusiness: false,
    directionMission: false,
    directionVision: false,
    directionValues: false,
    hasExternalContextAspect: false,
    hasInternalContextAspect: false,
    hasStakeholder: false,
    hasProjectRequirement: false,
    governanceCommitteeName: false,
    hasGovernanceMember: false,
    scopeFormalDeclaration: false,
    scopeExecutiveJustification: false,
    scopeDetailedDescription: false,
    hasScopeCharacteristic: false,
    hasScopeBenefit: false,
    ...overrides,
  };
}

describe('calculateFillPercentage', () => {
  it('returns 0% when nothing is filled', () => {
    const result = calculateFillPercentage(buildChecks());

    expect(result.percentage).toBe(0);
    expect(result.passedChecks).toBe(0);
  });

  it('returns 100% when every check passes', () => {
    const allTrue = Object.fromEntries(
      Object.keys(buildChecks()).map((key) => [key, true]),
    ) as unknown as FillPercentageChecks;

    const result = calculateFillPercentage(allTrue);

    expect(result.percentage).toBe(100);
    expect(result.passedChecks).toBe(result.totalChecks);
  });

  it('returns a partial percentage proportional to the checks passed', () => {
    const checks = buildChecks({
      documentControlClassification: true,
      contextHistory: true,
    });

    const result = calculateFillPercentage(checks);

    expect(result.passedChecks).toBe(2);
    expect(result.percentage).toBe(Math.round((2 / result.totalChecks) * 100));
    expect(result.percentage).toBeGreaterThan(0);
    expect(result.percentage).toBeLessThan(100);
  });

  it('never labels the result as conformity/maturity/readiness (PRD section 16)', () => {
    const result = calculateFillPercentage(buildChecks());

    expect(result.label).toBe('Percentual de preenchimento do Escopometro');
    expect(Object.keys(result)).toEqual([
      'label',
      'percentage',
      'totalChecks',
      'passedChecks',
    ]);
  });
});
