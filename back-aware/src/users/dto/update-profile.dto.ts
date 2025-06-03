import {
  IsString,
  IsOptional,
  IsArray,
  ArrayNotEmpty,
  ArrayUnique,
} from 'class-validator';

export class UpdateProfileDto {
  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  bio?: string;

  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @ArrayUnique()
  language?: string[];

  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @ArrayUnique()
  country?: string[];

  @IsOptional()
  @IsArray()
  @ArrayUnique()
  favoriteTopics?: string[];

  @IsOptional()
  @IsString()
  profilePhoto?: string;

  @IsOptional()
  @IsString()
  bannerPhoto?: string;
}
