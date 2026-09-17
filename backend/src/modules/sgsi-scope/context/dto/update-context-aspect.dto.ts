import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

import { ContextAspectType } from '../../../../common/enums/context-aspect-type.enum';

export class UpdateContextAspectDto {
  @IsOptional()
  @IsEnum(ContextAspectType)
  type?: ContextAspectType;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(160)
  title?: string;

  @IsOptional()
  @IsString()
  description?: string | null;

  @IsOptional()
  @IsString()
  observations?: string | null;
}
