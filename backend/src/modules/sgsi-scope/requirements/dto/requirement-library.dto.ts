import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

import { RequirementCategory } from '../../../../common/enums/requirement-category.enum';

/** DSR Admin only — mantem a biblioteca global (ver `RequirementEntity`). */
export class CreateRequirementDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  title!: string;

  @IsOptional()
  @IsEnum(RequirementCategory)
  category?: RequirementCategory;

  @IsOptional()
  @IsString()
  description?: string | null;
}

export class UpdateRequirementDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  title?: string;

  @IsOptional()
  @IsEnum(RequirementCategory)
  category?: RequirementCategory;

  @IsOptional()
  @IsString()
  description?: string | null;
}
