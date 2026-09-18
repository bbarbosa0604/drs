import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateGovernanceCommitteeDto {
  @IsOptional()
  @IsString()
  name?: string | null;

  @IsOptional()
  @IsString()
  objective?: string | null;

  @IsOptional()
  @IsString()
  responsibilities?: string | null;

  @IsOptional()
  @IsString()
  observations?: string | null;
}

export class CreateGovernanceMemberDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(160)
  name!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  jobRole!: string;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  area?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  committeeRole?: string | null;
}

export class UpdateGovernanceMemberDto {
  @IsOptional()
  @IsString()
  @MaxLength(160)
  name?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  jobRole?: string;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  area?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  committeeRole?: string | null;
}
