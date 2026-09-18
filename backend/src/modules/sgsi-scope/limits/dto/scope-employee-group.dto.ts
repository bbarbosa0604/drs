import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
  MaxLength,
} from 'class-validator';

import { ScopeClassification } from '../../../../common/enums/scope-classification.enum';

export class CreateScopeEmployeeGroupDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(160)
  areaOrGroup!: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  quantity?: number | null;

  @IsOptional()
  @IsString()
  description?: string | null;

  @IsOptional()
  @IsEnum(ScopeClassification)
  classification?: ScopeClassification | null;
}

export class UpdateScopeEmployeeGroupDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(160)
  areaOrGroup?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  quantity?: number | null;

  @IsOptional()
  @IsString()
  description?: string | null;

  @IsOptional()
  @IsEnum(ScopeClassification)
  classification?: ScopeClassification | null;
}
