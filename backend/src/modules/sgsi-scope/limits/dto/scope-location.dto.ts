import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

import { ScopeClassification } from '../../../../common/enums/scope-classification.enum';

export class CreateScopeLocationDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(160)
  name!: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  address?: string | null;

  @IsOptional()
  @IsString()
  description?: string | null;

  @IsOptional()
  @IsEnum(ScopeClassification)
  classification?: ScopeClassification | null;
}

export class UpdateScopeLocationDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(160)
  name?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  address?: string | null;

  @IsOptional()
  @IsString()
  description?: string | null;

  @IsOptional()
  @IsEnum(ScopeClassification)
  classification?: ScopeClassification | null;
}
