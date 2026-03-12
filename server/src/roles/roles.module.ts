import { Module } from '@nestjs/common';
import { RolesService } from './roles.service';
import { RolesGuard, PermissionsGuard } from './roles.guard';
import { APP_GUARD } from '@nestjs/core';

@Module({
  providers: [
    RolesService,
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    {
      provide: APP_GUARD,
      useClass: PermissionsGuard,
    },
  ],
  exports: [RolesService],
})
export class RolesModule {}
