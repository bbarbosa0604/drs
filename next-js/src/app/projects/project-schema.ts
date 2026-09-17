import { z } from 'zod';

/**
 * Espelha `ProjectInput` de contracts/openapi.yaml (PRD secao 6).
 * `responsibleUserId` nao e um campo do formulario: nao ha endpoint de
 * listagem de usuarios acessivel a um Consultor (so DSR Admin acessa
 * `GET /users`), entao o responsavel e sempre o usuario autenticado que
 * cria o projeto — ver pendencia registrada na Task 009. Pelo mesmo motivo,
 * `participantUserIds` nao e editavel nesta tela ainda.
 */
export const PROJECT_STATUS_OPTIONS = [
  'DRAFT',
  'IN_PROGRESS',
  'IN_REVIEW',
  'WAITING_APPROVAL',
  'APPROVED',
  'ARCHIVED',
] as const;

export const projectSchema = z.object({
  name: z.string().trim().min(1, 'Obrigatorio').max(160),
  organizationId: z.string().uuid('Selecione uma organizacao'),
  description: z.string().optional().or(z.literal('')),
  startDate: z.string().optional().or(z.literal('')),
  expectedEndDate: z.string().optional().or(z.literal('')),
  status: z.enum(PROJECT_STATUS_OPTIONS).optional(),
});

export type ProjectFormValues = z.infer<typeof projectSchema>;
