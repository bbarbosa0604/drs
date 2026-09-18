import {
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';

import { RequirementCategory } from '../../../../common/enums/requirement-category.enum';

/**
 * Ou `requirementId` (selecionado da biblioteca global) ou `title` (requisito
 * customizado do projeto) deve ser informado — validado no service, nao aqui,
 * porque e uma regra entre campos (class-validator nao expressa isso bem sem
 * um decorator customizado, e nao ha regra equivalente em outro DTO do
 * projeto ainda).
 */
export class CreateProjectRequirementDto {
  @IsOptional()
  @IsUUID()
  requirementId?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  title?: string;

  @IsOptional()
  @IsEnum(RequirementCategory)
  category?: RequirementCategory;

  @IsOptional()
  @IsString()
  description?: string | null;

  @IsOptional()
  @IsString()
  observations?: string | null;
}

export class UpdateProjectRequirementDto {
  @IsOptional()
  @IsString()
  @MaxLength(200)
  title?: string;

  @IsOptional()
  @IsEnum(RequirementCategory)
  category?: RequirementCategory;

  @IsOptional()
  @IsString()
  description?: string | null;

  @IsOptional()
  @IsString()
  observations?: string | null;
}
