import { IsString, IsNumber, IsOptional, IsEnum, Min } from 'class-validator';

// 会员类型枚举
export enum MembershipType {
  MONTHLY = 'monthly',      // 按月
  QUARTERLY = 'quarterly',  // 按季度
  YEARLY = 'yearly',        // 包年
}

// 会员状态枚举
export enum MembershipStatus {
  ACTIVE = 'active',       // 生效中
  EXPIRED = 'expired',     // 已过期
  CANCELLED = 'cancelled', // 已取消
}

// 购买会员请求DTO
export class PurchaseMembershipDto {
  @IsEnum(MembershipType)
  type: MembershipType;

  @IsNumber()
  @Min(1)
  duration: number; // 购买时长（月/季度/年）

  @IsOptional()
  @IsString()
  paymentMethod?: string; // 支付方式
}

// 会员信息响应DTO
export class MembershipInfoDto {
  id: string;
  userId: string;
  type: MembershipType;
  status: MembershipStatus;
  startDate: string;
  endDate: string;
  discount: number; // 折扣
  benefits: string[]; // 权益列表
  createdAt: string;
}

// 会员套餐DTO
export class MembershipPlanDto {
  id: string;
  name: string;
  type: MembershipType;
  price: number;
  originalPrice: number;
  duration: number;
  durationUnit: string;
  discount: number;
  benefits: string[];
  recommended?: boolean;
}

// 创建会员记录DTO
export class CreateMembershipDto {
  userId: string;
  type: MembershipType;
  startDate: string;
  endDate: string;
  orderId?: string;
}
