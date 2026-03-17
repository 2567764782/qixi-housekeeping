import { IsString, IsNotEmpty, IsOptional, IsArray, IsNumber, IsBoolean, Min, Max, IsEmail } from 'class-validator';

export class CreateCleanerApplicationDto {
  @IsString()
  @IsNotEmpty({ message: '姓名不能为空' })
  name: string;

  @IsString()
  @IsNotEmpty({ message: '手机号不能为空' })
  phone: string;

  @IsOptional()
  @IsString()
  avatar?: string;

  @IsOptional()
  @IsString()
  gender?: string;

  @IsOptional()
  @IsNumber()
  age?: number;

  @IsOptional()
  @IsString()
  idCard?: string;

  @IsArray()
  @IsNotEmpty({ message: '服务类型不能为空' })
  serviceTypes: string[];

  @IsOptional()
  @IsNumber()
  experienceYears?: number;

  @IsOptional()
  @IsString()
  introduction?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsNumber()
  latitude?: number;

  @IsOptional()
  @IsNumber()
  longitude?: number;
}

export class UpdateCleanerProfileDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  avatar?: string;

  @IsOptional()
  @IsString()
  gender?: string;

  @IsOptional()
  @IsNumber()
  age?: number;

  @IsOptional()
  @IsArray()
  serviceTypes?: string[];

  @IsOptional()
  @IsNumber()
  experienceYears?: number;

  @IsOptional()
  @IsString()
  introduction?: string;

  @IsOptional()
  @IsString()
  address?: string;
}

export class UpdateOnlineStatusDto {
  @IsBoolean()
  @IsNotEmpty({ message: '在线状态不能为空' })
  isOnline: boolean;
}

export class AcceptOrderDto {
  @IsString()
  @IsNotEmpty({ message: '订单ID不能为空' })
  orderId: string;
}

export class CreateReviewDto {
  @IsString()
  @IsNotEmpty({ message: '订单ID不能为空' })
  orderId: string;

  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number;

  @IsOptional()
  @IsString()
  comment?: string;

  @IsOptional()
  @IsArray()
  images?: string[];

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(5)
  serviceAttitude?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(5)
  serviceQuality?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(5)
  punctuality?: number;

  @IsOptional()
  @IsBoolean()
  isAnonymous?: boolean;
}

export class QueryReviewsDto {
  @IsOptional()
  @IsNumber()
  cleanerId?: number;

  @IsOptional()
  @IsNumber()
  page?: number;

  @IsOptional()
  @IsNumber()
  pageSize?: number;
}
