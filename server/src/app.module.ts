import { Module } from '@nestjs/common';
import { AppController } from '@/app.controller';
import { AppService } from '@/app.service';
import { ServicesModule } from './services/services.module';
import { OrdersModule } from './orders/orders.module';
import { StaffModule } from './staff/staff.module';
import { UsersModule } from './users/users.module';
import { SearchModule } from './search/search.module';

@Module({
  imports: [ServicesModule, OrdersModule, StaffModule, UsersModule, SearchModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
