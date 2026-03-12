import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
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
import { AuthModule } from './auth/auth.module';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { CacheModule } from './cache/cache.module';

@Module({
  imports: [
    CacheModule,
    AuthModule,
    ServicesModule,
    OrdersModule,
    StaffModule,
    UsersModule,
    SearchModule,
    CleaningOrdersModule,
    CleanersModule,
    NotificationsModule,
    RolesModule,
    StatisticsModule,
    RealtimeModule,
    PaymentModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
