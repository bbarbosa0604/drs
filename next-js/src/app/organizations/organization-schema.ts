import { z } from 'zod';

/**
 * Espelha `OrganizationInput` de contracts/openapi.yaml (PRD secao 5). A
 * fonte de verdade da validacao continua o backend (Task 005); este schema
 * so evita round-trip obvio (campo vazio) antes de chamar a API.
 */
export const organizationSchema = z.object({
  name: z.string().trim().min(1, 'Obrigatorio').max(160),
  segment: z.string().max(120).optional().or(z.literal('')),
  employeeCount: z.string().max(60).optional().or(z.literal('')),
  geographicScope: z.string().max(160).optional().or(z.literal('')),
  productsServices: z.string().optional().or(z.literal('')),
  logoUrl: z.string().max(500).optional().or(z.literal('')),
  institutionalHistory: z.string().optional().or(z.literal('')),
  business: z.string().optional().or(z.literal('')),
  mission: z.string().optional().or(z.literal('')),
  vision: z.string().optional().or(z.literal('')),
  valuesText: z.string().optional().or(z.literal('')),
});

export type OrganizationFormValues = z.infer<typeof organizationSchema>;

/** `values` e uma lista no contrato; a UI usa uma textarea (1 valor por linha). */
export function parseValuesText(valuesText: string | undefined): string[] {
  if (!valuesText) {
    return [];
  }

  return valuesText
    .split('\n')
    .map((value) => value.trim())
    .filter((value) => value.length > 0);
}
