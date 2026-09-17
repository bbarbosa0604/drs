import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

import { ContextAspectType } from '../../../../common/enums/context-aspect-type.enum';

export class CreateContextAspectDto {
  @IsEnum(ContextAspectType)
  type!: ContextAspectType;

  @IsString()
  @IsNotEmpty()
  @MaxLength(160)
  title!: string;

  @IsOptional()
  @IsString()
  description?: string | null;

  @IsOptional()
  @IsString()
  observations?: string | null;
}
