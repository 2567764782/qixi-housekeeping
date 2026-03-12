import { IsString, IsNumber, IsArray, IsOptional, IsEnum, Min, Max, IsBoolean } from 'class-validator';

export enum ServiceType {
  CLEANING = 'cleaning',
  CAR_WASH = 'car_wash',
  DEEP_CLEANING = 'deep_cleaning'
}

export class CreateCleanerDto {
  @IsString()
  name: string;

  @IsString()
  phone: string;

  @IsArray()
  @IsEnum(ServiceType, { each: true })
  serviceTypes: ServiceType[];

  @IsOptional()
  @IsNumber()
  latitude?: number;

  @IsOptional()
  @IsNumber()
  longitude?: number;
}

export class UpdateCleanerDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsArray()
  @IsEnum(ServiceType, { each: true })
  serviceTypes?: ServiceType[];

  @IsOptional()
  @IsNumber()
  latitude?: number;

  @IsOptional()
  @IsNumber()
  longitude?: number;

  @IsOptional()
  @IsBoolean()
  isOnline?: boolean;
}

export class VerifyCleanerDto {
  @IsBoolean()
  isVerified: boolean;

  @IsOptional()
  @IsString()
  verificationNotes?: string;
}

export class UpdateStatusDto {
  @IsBoolean()
  isOnline: boolean;
}
