import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

import { ScopeClassification } from '../../../../common/enums/scope-classification.enum';

export class CreateScopeProviderDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(160)
  providerName!: string;

  @IsOptional()
  @IsString()
  @MaxLength(160)
  service?: string | null;

  @IsOptional()
  @IsString()
  description?: string | null;

  @IsOptional()
  @IsEnum(ScopeClassification)
  classification?: ScopeClassification | null;
}

export class UpdateScopeProviderDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(160)
  providerName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(160)
  service?: string | null;

  @IsOptional()
  @IsString()
  description?: string | null;

  @IsOptional()
  @IsEnum(ScopeClassification)
  classification?: ScopeClassification | null;
}
