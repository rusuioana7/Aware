import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateNotificationsDto {
  @IsOptional() @IsBoolean() notifyWeeklyEmail?: boolean;
  @IsOptional() @IsBoolean() notifyDailyEmail?: boolean;
  @IsOptional() @IsBoolean() notifyTopicAlertsEmail?: boolean;
  @IsOptional() @IsBoolean() notifyWeeklyPush?: boolean;
  @IsOptional() @IsBoolean() notifyDailyPush?: boolean;
  @IsOptional() @IsBoolean() notifyTopicAlertsPush?: boolean;
}
