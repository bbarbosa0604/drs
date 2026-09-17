import { Transform } from 'class-transformer';
import {
  IsArray,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';

import { ProjectStatus } from '../../../common/enums/project-status.enum';

/**
 * Mesmo schema `ProjectInput` do contrato (contracts/openapi.yaml) e usado
 * para create e update; `status` e opcional (default `DRAFT` no create,
 * so gera AuditLog de STATUS_CHANGE quando muda de valor no update).
 */
export class ProjectInputDto {
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  @IsString()
  @IsNotEmpty()
  @MaxLength(160)
  name!: string;

  @IsUUID()
  organizationId!: string;

  @IsOptional()
  @IsString()
  description?: string | null;

  @IsUUID()
  responsibleUserId!: string;

  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  participantUserIds?: string[];

  @IsOptional()
  @IsDateString()
  startDate?: string | null;

  @IsOptional()
  @IsDateString()
  expectedEndDate?: string | null;

  @IsOptional()
  @IsEnum(ProjectStatus)
  status?: ProjectStatus;
}
