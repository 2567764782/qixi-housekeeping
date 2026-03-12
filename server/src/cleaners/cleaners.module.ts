import { Module } from '@nestjs/common';
import { CleanersService } from './cleaners.service';
import { CleanersController } from './cleaners.controller';

@Module({
  controllers: [CleanersController],
  providers: [CleanersService],
  exports: [CleanersService]
})
export class CleanersModule {}
