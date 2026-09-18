import { IsDateString, IsNotEmpty, IsString, MaxLength } from 'class-validator';

/** Etapa 7.6 (PRD secao 14.6) - entrada de historico, so criacao (sem update/delete). */
export class CreateScopeRevisionDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(40)
  version!: string;

  @IsDateString()
  revisedAt!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(160)
  responsible!: string;

  @IsString()
  @IsNotEmpty()
  changeDescription!: string;
}
