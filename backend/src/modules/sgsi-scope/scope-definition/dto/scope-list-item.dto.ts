import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

/** Usado por ScopeCharacteristic e ScopeBenefit (mesma forma). */
export class CreateScopeListItemDto {
  @IsString()
  @IsNotEmpty()
  description!: string;
}

export class UpdateScopeListItemDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  description?: string;
}
