import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  ParseIntPipe,
  UseGuards
} from '@nestjs/common';
import { CleanersService } from './cleaners.service';
import {
  CreateCleanerDto,
  UpdateCleanerDto,
  VerifyCleanerDto,
  UpdateStatusDto
} from './dto/cleaners.dto';

@Controller('cleaners')
export class CleanersController {
  constructor(private readonly cleanersService: CleanersService) {}

  @Post()
  async createCleaner(@Body() createCleanerDto: CreateCleanerDto) {
    const cleaner = await this.cleanersService.createCleaner(createCleanerDto);
    return {
      status: 'success',
      data: cleaner
    };
  }

  @Get()
  async getAllCleaners(
    @Query('isVerified') isVerified?: boolean,
    @Query('page', ParseIntPipe) page: number = 1,
    @Query('pageSize', ParseIntPipe) pageSize: number = 20
  ) {
    const cleaners = await this.cleanersService.getAllCleaners(isVerified, page, pageSize);
    return {
      status: 'success',
      data: cleaners
    };
  }

  @Get(':id')
  async getCleanerById(@Param('id', ParseIntPipe) id: number) {
    const cleaner = await this.cleanersService.getCleanerById(id);
    return {
      status: 'success',
      data: cleaner
    };
  }

  @Get(':id/stats')
  async getCleanerStats(@Param('id', ParseIntPipe) id: number) {
    const stats = await this.cleanersService.getCleanerStats(id);
    return {
      status: 'success',
      data: stats
    };
  }

  @Put(':id')
  async updateCleaner(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCleanerDto: UpdateCleanerDto
  ) {
    const cleaner = await this.cleanersService.updateCleaner(id, updateCleanerDto);
    return {
      status: 'success',
      data: cleaner
    };
  }

  @Put(':id/verify')
  async verifyCleaner(
    @Param('id', ParseIntPipe) id: number,
    @Body() verifyCleanerDto: VerifyCleanerDto,
    @Query('adminId') adminId: number
  ) {
    const cleaner = await this.cleanersService.verifyCleaner(id, verifyCleanerDto, adminId);
    return {
      status: 'success',
      data: cleaner
    };
  }

  @Put(':id/status')
  async updateCleanerStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateStatusDto: UpdateStatusDto
  ) {
    const cleaner = await this.cleanersService.updateCleanerStatus(id, updateStatusDto.isOnline);
    return {
      status: 'success',
      data: cleaner
    };
  }

  @Delete(':id')
  async deleteCleaner(@Param('id', ParseIntPipe) id: number) {
    await this.cleanersService.deleteCleaner(id);
    return {
      status: 'success',
      message: 'Cleaner deleted successfully'
    };
  }
}
