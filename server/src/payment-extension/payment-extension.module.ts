import { Module } from '@nestjs/common';
import { PaymentExtensionController } from './payment-extension.controller';
import { PaymentExtensionService } from './payment-extension.service';

@Module({
  controllers: [PaymentExtensionController],
  providers: [PaymentExtensionService],
  exports: [PaymentExtensionService],
})
export class PaymentExtensionModule {}
