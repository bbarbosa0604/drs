import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

import { ScopeClassification } from '../../../../common/enums/scope-classification.enum';

export class CreateScopeAssetDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(160)
  assetName!: string;

  @IsOptional()
  @IsString()
  @MaxLength(160)
  category?: string | null;

  @IsOptional()
  @IsString()
  description?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(160)
  responsible?: string | null;

  @IsOptional()
  @IsEnum(ScopeClassification)
  classification?: ScopeClassification | null;
}

export class UpdateScopeAssetDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(160)
  assetName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(160)
  category?: string | null;

  @IsOptional()
  @IsString()
  description?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(160)
  responsible?: string | null;

  @IsOptional()
  @IsEnum(ScopeClassification)
  classification?: ScopeClassification | null;
}
