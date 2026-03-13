import { APP_GUARD } from '@nestjs/core';
import { Module } from '@nestjs/common';
import { RolesGuard, PermissionsGuard } from './roles.guard';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';

@Module({
  controllers: [RolesController],
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
