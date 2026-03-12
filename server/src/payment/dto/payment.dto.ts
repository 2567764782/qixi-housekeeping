import { IsString, IsNumber, IsNotEmpty, Min } from 'class-validator';

export class CreatePaymentDto {
  @IsString()
  @IsNotEmpty()
  orderId: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber()
  @Min(0.01)
  amount: number;

  @IsString()
  @IsNotEmpty()
  openid: string;
}

export class RefundDto {
  @IsString()
  @IsNotEmpty()
  orderId: string;

  @IsString()
  @IsNotEmpty()
  transactionId: string;

  @IsNumber()
  @Min(0.01)
  refundAmount: number;

  @IsNumber()
  @Min(0.01)
  totalAmount: number;
}
