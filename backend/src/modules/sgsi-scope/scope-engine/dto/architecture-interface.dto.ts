import { IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateArchitectureInterfaceDto {
  @IsUUID()
  fromComponentId!: string;

  @IsUUID()
  toComponentId!: string;

  @IsOptional()
  @IsString()
  description?: string | null;
}

export class UpdateArchitectureInterfaceDto {
  @IsOptional()
  @IsUUID()
  fromComponentId?: string;

  @IsOptional()
  @IsUUID()
  toComponentId?: string;

  @IsOptional()
  @IsString()
  description?: string | null;
}
