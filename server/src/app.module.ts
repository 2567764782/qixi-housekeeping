import { Module } from '@nestjs/common';
import { AppController } from '@/app.controller';
import { AppService } from '@/app.service';
import { ServicesModule } from './services/services.module';
import { OrdersModule } from './orders/orders.module';
import { StaffModule } from './staff/staff.module';

@Module({
  imports: [ServicesModule, OrdersModule, StaffModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
