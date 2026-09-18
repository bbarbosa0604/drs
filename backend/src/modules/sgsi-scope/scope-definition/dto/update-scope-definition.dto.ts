import { IsOptional, IsString } from 'class-validator';

/** Autosave por campo — mesmo padrao das Tasks 011/012. */
export class UpdateScopeDefinitionDto {
  @IsOptional()
  @IsString()
  formalDeclaration?: string | null;

  @IsOptional()
  @IsString()
  executiveJustification?: string | null;

  @IsOptional()
  @IsString()
  detailedDescriptionHtml?: string | null;
}
