import { IsDateString, IsOptional, IsString, MaxLength } from 'class-validator';

/** Todos os campos opcionais (PRD - Task 023: incompleto e permitido no MVP). */
export class UpdateScopeApprovalDto {
  @IsOptional()
  @IsString()
  @MaxLength(120)
  method?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  platform?: string | null;

  @IsOptional()
  @IsString()
  approvalText?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(160)
  responsible?: string | null;

  @IsOptional()
  @IsDateString()
  approvedAt?: string | null;

  @IsOptional()
  @IsString()
  observations?: string | null;
}
