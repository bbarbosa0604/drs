import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

import { ScopeClassification } from '../../../../common/enums/scope-classification.enum';
import { TopologyNodeType } from '../../../../common/enums/topology-node-type.enum';

export class CreateTopologyNodeDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(160)
  name!: string;

  @IsEnum(TopologyNodeType)
  type!: TopologyNodeType;

  @IsOptional()
  @IsString()
  description?: string | null;

  /** Omitido/null = "nao classificado" — nunca inferido automaticamente (PRD secao 12/44). */
  @IsOptional()
  @IsEnum(ScopeClassification)
  classification?: ScopeClassification | null;
}

export class UpdateTopologyNodeDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(160)
  name?: string;

  @IsOptional()
  @IsEnum(TopologyNodeType)
  type?: TopologyNodeType;

  @IsOptional()
  @IsString()
  description?: string | null;

  @IsOptional()
  @IsEnum(ScopeClassification)
  classification?: ScopeClassification | null;
}
