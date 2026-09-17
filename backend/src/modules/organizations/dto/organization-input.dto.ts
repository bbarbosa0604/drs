import { Transform } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

/**
 * Mesmo schema `OrganizationInput` do contrato (contracts/openapi.yaml) e usado
 * para create e update: `name` e sempre obrigatorio, mesmo no PATCH.
 */
export class OrganizationInputDto {
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  @IsString()
  @IsNotEmpty()
  @MaxLength(160)
  name!: string;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  segment?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(60)
  employeeCount?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(160)
  geographicScope?: string | null;

  @IsOptional()
  @IsString()
  productsServices?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  logoUrl?: string | null;

  @IsOptional()
  @IsString()
  institutionalHistory?: string | null;

  @IsOptional()
  @IsString()
  business?: string | null;

  @IsOptional()
  @IsString()
  mission?: string | null;

  @IsOptional()
  @IsString()
  vision?: string | null;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  values?: string[];
}
