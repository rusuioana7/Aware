import { IsString } from 'class-validator';

export class UnlinkOauthDto {
  @IsString()
  provider!: string;
}
