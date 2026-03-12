import { IsString, IsOptional, IsEnum, IsArray } from 'class-validator';

export enum NotificationType {
  ORDER_MATCHED = 'order_matched',
  ORDER_ACCEPTED = 'order_accepted',
  ORDER_IN_PROGRESS = 'order_in_progress',
  ORDER_COMPLETED = 'order_completed',
  ORDER_CANCELLED = 'order_cancelled'
}

export class SendNotificationDto {
  @IsString()
  templateId: string;

  @IsArray()
  @IsString({ each: true })
  touser: string[];

  @IsString()
  page: string;

  data: Record<string, { value: string }>;
}

export class CreateSubscriptionDto {
  @IsString()
  userId: string;

  @IsString()
  templateId: string;

  @IsEnum(NotificationType)
  type: NotificationType;
}

export class QueryNotificationsDto {
  @IsOptional()
  @IsString()
  userId?: string;

  @IsOptional()
  @IsEnum(NotificationType)
  type?: NotificationType;
}
