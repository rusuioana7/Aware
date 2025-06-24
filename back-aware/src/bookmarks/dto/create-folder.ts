import { IsOptional, IsString, IsBoolean } from 'class-validator';

export class CreateFolderDto {
  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  color?: string;

  @IsOptional()
  @IsBoolean()
  starred?: boolean;

  @IsOptional()
  @IsString()
  parentId?: string;
}
