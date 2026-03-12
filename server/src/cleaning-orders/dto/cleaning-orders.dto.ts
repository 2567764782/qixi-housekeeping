import { IsString, IsNumber, IsArray, IsOptional, IsEnum, IsDateString, Min, Max } from 'class-validator';

export enum ServiceType {
  CLEANING = 'cleaning',
  CAR_WASH = 'car_wash',
  DEEP_CLEANING = 'deep_cleaning'
}

export enum OrderStatus {
  PENDING_REVIEW = 'pending_review',
  REVIEWING = 'reviewing',
  VERIFIED = 'verified',
  MATCHED = 'matched',
  ACCEPTED = 'accepted',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

export class CreateOrderDto {
  @IsNumber()
  customerId: number;

  @IsString()
  customerName: string;

  @IsString()
  customerPhone: string;

  @IsEnum(ServiceType)
  serviceType: ServiceType;

  @IsString()
  serviceDetail: string;

  @IsString()
  address: string;

  @IsOptional()
  @IsNumber()
  latitude?: number;

  @IsOptional()
  @IsNumber()
  longitude?: number;

  @IsDateString()
  scheduledTime: string;

  @IsOptional()
  @IsNumber()
  estimatedDuration?: number;

  @IsOptional()
  @IsNumber()
  budgetMin?: number;

  @IsOptional()
  @IsNumber()
  budgetMax?: number;

  @IsOptional()
  @IsString()
  specialRequirements?: string;
}

export class VerifyOrderDto {
  @IsEnum(OrderStatus)
  status: OrderStatus;

  @IsString()
  verificationNotes: string;
}

export class MatchOrderDto {
  @IsNumber()
  cleanerId: number;
}

export class AcceptOrderDto {
  @IsNumber()
  orderId: number;

  @IsNumber()
  cleanerId: number;
}
