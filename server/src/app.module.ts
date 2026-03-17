import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from '@/app.controller';
import { AppService } from '@/app.service';
import { ServicesModule } from './services/services.module';
import { OrdersModule } from './orders/orders.module';
import { StaffModule } from './staff/staff.module';
import { AuthModule } from './auth/auth.module';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { HealthModule } from './health/health.module';
import { CleanerPlatformModule } from './cleaner-platform/cleaner-platform.module';
import { PaymentModule } from './payment/payment.module';
import { PaymentExtensionModule } from './payment-extension/payment-extension.module';
import { MembershipModule } from './membership/membership.module';
import { AdminModule } from './admin/admin.module';
import { NewsModule } from './news/news.module';

@Module({
  imports: [
    AuthModule,
    ServicesModule,
    OrdersModule,
    StaffModule,
    HealthModule,
    CleanerPlatformModule,
    PaymentModule,
    PaymentExtensionModule,
    MembershipModule,
    AdminModule,
    NewsModule,
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
