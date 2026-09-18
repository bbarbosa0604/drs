import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateStakeholderDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(160)
  name!: string;

  @IsOptional()
  @IsString()
  requirements?: string | null;

  @IsOptional()
  @IsString()
  needs?: string | null;

  @IsOptional()
  @IsString()
  expectations?: string | null;

  @IsOptional()
  @IsString()
  observations?: string | null;
}

export class UpdateStakeholderDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(160)
  name?: string;

  @IsOptional()
  @IsString()
  requirements?: string | null;

  @IsOptional()
  @IsString()
  needs?: string | null;

  @IsOptional()
  @IsString()
  expectations?: string | null;

  @IsOptional()
  @IsString()
  observations?: string | null;
}
