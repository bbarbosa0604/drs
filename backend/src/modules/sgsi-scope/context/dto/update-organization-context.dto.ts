import { IsOptional, IsString } from 'class-validator';

/** Autosave da Etapa 2.1 (Historico) — mesmo padrao por secao da Task 011. */
export class UpdateOrganizationContextDto {
  @IsOptional()
  @IsString()
  historyHtml?: string | null;
}
