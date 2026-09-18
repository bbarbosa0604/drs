import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

import { ScopeClassification } from '../../../../common/enums/scope-classification.enum';
import { ValueChainCategory } from '../../../../common/enums/value-chain-category.enum';

export class CreateValueChainBlockDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(160)
  name!: string;

  @IsOptional()
  @IsString()
  description?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(160)
  responsibleArea?: string | null;

  @IsEnum(ValueChainCategory)
  category!: ValueChainCategory;

  /** Omitido/null = "nao classificado" — nunca inferido automaticamente (PRD secao 12/44). */
  @IsOptional()
  @IsEnum(ScopeClassification)
  classification?: ScopeClassification | null;
}

export class UpdateValueChainBlockDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(160)
  name?: string;

  @IsOptional()
  @IsString()
  description?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(160)
  responsibleArea?: string | null;

  @IsOptional()
  @IsEnum(ValueChainCategory)
  category?: ValueChainCategory;

  @IsOptional()
  @IsEnum(ScopeClassification)
  classification?: ScopeClassification | null;
}
