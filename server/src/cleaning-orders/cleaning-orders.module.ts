import { Module } from '@nestjs/common';
import { CleaningOrdersController } from './cleaning-orders.controller';
import { CleaningOrdersService } from './cleaning-orders.service';

@Module({
  controllers: [CleaningOrdersController],
  providers: [CleaningOrdersService],
  exports: [CleaningOrdersService]
})
export class CleaningOrdersModule {}
