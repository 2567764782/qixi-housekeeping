import { Module } from '@nestjs/common';
import { CleanerPlatformController } from './cleaner-platform.controller';
import { CleanerPlatformService } from './cleaner-platform.service';

@Module({
  controllers: [CleanerPlatformController],
  providers: [CleanerPlatformService],
  exports: [CleanerPlatformService],
})
export class CleanerPlatformModule {}
