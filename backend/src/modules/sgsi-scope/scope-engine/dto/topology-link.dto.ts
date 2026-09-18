import { IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';

export class CreateTopologyLinkDto {
  @IsUUID()
  fromNodeId!: string;

  @IsUUID()
  toNodeId!: string;

  @IsOptional()
  @IsString()
  description?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  linkType?: string | null;
}

export class UpdateTopologyLinkDto {
  @IsOptional()
  @IsUUID()
  fromNodeId?: string;

  @IsOptional()
  @IsUUID()
  toNodeId?: string;

  @IsOptional()
  @IsString()
  description?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  linkType?: string | null;
}
