import { Module } from '@nestjs/common';
import { AppController } from '@/app.controller';
import { AppService } from '@/app.service';
import { ServicesModule } from './services/services.module';
import { OrdersModule } from './orders/orders.module';
import { StaffModule } from './staff/staff.module';
import { UsersModule } from './users/users.module';
import { SearchModule } from './search/search.module';
import { CleaningOrdersModule } from './cleaning-orders/cleaning-orders.module';
import { CleanersModule } from './cleaners/cleaners.module';
import { NotificationsModule } from './notifications/notifications.module';
import { RolesModule } from './roles/roles.module';
import { StatisticsModule } from './statistics/statistics.module';
import { RealtimeModule } from './realtime/realtime.module';
import { PaymentModule } from './payment/payment.module';

@Module({
  imports: [ServicesModule, OrdersModule, StaffModule, UsersModule, SearchModule, CleaningOrdersModule, CleanersModule, NotificationsModule, RolesModule, StatisticsModule, RealtimeModule, PaymentModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
