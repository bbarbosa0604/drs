import {
  IsDateString,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';

/**
 * Autosave por secao (Task 011): todos os campos sao opcionais de proposito
 * — persiste o que foi enviado, sem exigir o payload completo (PRD secao 19).
 */
export class UpdateDocumentControlDto {
  @IsOptional()
  @IsString()
  @MaxLength(80)
  classification?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(40)
  version?: string | null;

  @IsOptional()
  @IsDateString()
  documentDate?: string | null;

  @IsOptional()
  @IsDateString()
  validUntil?: string | null;

  @IsOptional()
  @IsUUID()
  preparedByUserId?: string | null;

  @IsOptional()
  @IsUUID()
  approvedByUserId?: string | null;
}
