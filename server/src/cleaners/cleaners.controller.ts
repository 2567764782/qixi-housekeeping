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
  HttpException,
  HttpStatus
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
    try {
      const cleaner = await this.cleanersService.createCleaner(createCleanerDto);
      return {
        code: 200,
        msg: '保洁员创建成功',
        data: cleaner
      };
    } catch (error) {
      const isProduction = process.env.NODE_ENV === 'production'
      throw new HttpException(
        {
          code: 500,
          message: isProduction ? '保洁员创建失败，请稍后重试' : (error.message || '保洁员创建失败'),
          data: null
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      )
    }
  }

  @Get()
  async getAllCleaners(
    @Query('isVerified') isVerified?: boolean,
    @Query('page') page: number = 1,
    @Query('pageSize') pageSize: number = 20
  ) {
    try {
      // 验证分页参数
      const pageNum = parseInt(String(page), 10)
      const pageSizeNum = parseInt(String(pageSize), 10)

      if (Number.isNaN(pageNum) || pageNum < 1) {
        throw new HttpException(
          { code: 400, message: '页码必须为正整数', data: null },
          HttpStatus.BAD_REQUEST
        )
      }
      if (pageNum > 1000) {
        throw new HttpException(
          { code: 400, message: '页码不能超过1000', data: null },
          HttpStatus.BAD_REQUEST
        )
      }
      if (Number.isNaN(pageSizeNum) || pageSizeNum < 1) {
        throw new HttpException(
          { code: 400, message: '每页数量必须为正整数', data: null },
          HttpStatus.BAD_REQUEST
        )
      }
      if (pageSizeNum > 100) {
        throw new HttpException(
          { code: 400, message: '每页数量不能超过100', data: null },
          HttpStatus.BAD_REQUEST
        )
      }

      const cleaners = await this.cleanersService.getAllCleaners(isVerified, pageNum, pageSizeNum);
      return {
        code: 200,
        msg: 'success',
        data: cleaners
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error
      }
      const isProduction = process.env.NODE_ENV === 'production'
      throw new HttpException(
        {
          code: 500,
          message: isProduction ? '获取保洁员列表失败，请稍后重试' : (error.message || '获取保洁员列表失败'),
          data: null
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      )
    }
  }

  @Get(':id')
  async getCleanerById(@Param('id', ParseIntPipe) id: number) {
    try {
      // 验证 ID 范围
      if (id < 1 || id > 2147483647) {
        throw new HttpException(
          { code: 400, message: '保洁员ID超出有效范围', data: null },
          HttpStatus.BAD_REQUEST
        )
      }

      const cleaner = await this.cleanersService.getCleanerById(id);
      return {
        code: 200,
        msg: 'success',
        data: cleaner
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error
      }
      const isProduction = process.env.NODE_ENV === 'production'
      throw new HttpException(
        {
          code: 500,
          message: isProduction ? '获取保洁员详情失败，请稍后重试' : (error.message || '获取保洁员详情失败'),
          data: null
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      )
    }
  }

  @Get(':id/stats')
  async getCleanerStats(@Param('id', ParseIntPipe) id: number) {
    try {
      // 验证 ID 范围
      if (id < 1 || id > 2147483647) {
        throw new HttpException(
          { code: 400, message: '保洁员ID超出有效范围', data: null },
          HttpStatus.BAD_REQUEST
        )
      }

      const stats = await this.cleanersService.getCleanerStats(id);
      return {
        code: 200,
        msg: 'success',
        data: stats
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error
      }
      const isProduction = process.env.NODE_ENV === 'production'
      throw new HttpException(
        {
          code: 500,
          message: isProduction ? '获取保洁员统计失败，请稍后重试' : (error.message || '获取保洁员统计失败'),
          data: null
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      )
    }
  }

  @Put(':id')
  async updateCleaner(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCleanerDto: UpdateCleanerDto
  ) {
    try {
      // 验证 ID 范围
      if (id < 1 || id > 2147483647) {
        throw new HttpException(
          { code: 400, message: '保洁员ID超出有效范围', data: null },
          HttpStatus.BAD_REQUEST
        )
      }

      const cleaner = await this.cleanersService.updateCleaner(id, updateCleanerDto);
      return {
        code: 200,
        msg: '保洁员信息更新成功',
        data: cleaner
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error
      }
      const isProduction = process.env.NODE_ENV === 'production'
      throw new HttpException(
        {
          code: 500,
          message: isProduction ? '保洁员信息更新失败，请稍后重试' : (error.message || '保洁员信息更新失败'),
          data: null
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      )
    }
  }

  @Put(':id/verify')
  async verifyCleaner(
    @Param('id', ParseIntPipe) id: number,
    @Body() verifyCleanerDto: VerifyCleanerDto,
    @Query('adminId') adminId: string
  ) {
    try {
      // 验证 ID 范围
      if (id < 1 || id > 2147483647) {
        throw new HttpException(
          { code: 400, message: '保洁员ID超出有效范围', data: null },
          HttpStatus.BAD_REQUEST
        )
      }

      // 验证 adminId
      if (!adminId || typeof adminId !== 'string' || adminId.trim().length === 0) {
        throw new HttpException(
          { code: 400, message: '管理员ID不能为空', data: null },
          HttpStatus.BAD_REQUEST
        )
      }

      const adminIdNum = parseInt(adminId.trim(), 10)
      if (Number.isNaN(adminIdNum) || adminIdNum < 1) {
        throw new HttpException(
          { code: 400, message: '管理员ID格式不正确', data: null },
          HttpStatus.BAD_REQUEST
        )
      }

      const cleaner = await this.cleanersService.verifyCleaner(id, verifyCleanerDto, adminIdNum);
      return {
        code: 200,
        msg: '保洁员审核成功',
        data: cleaner
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error
      }
      const isProduction = process.env.NODE_ENV === 'production'
      throw new HttpException(
        {
          code: 500,
          message: isProduction ? '保洁员审核失败，请稍后重试' : (error.message || '保洁员审核失败'),
          data: null
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      )
    }
  }

  @Put(':id/status')
  async updateCleanerStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateStatusDto: UpdateStatusDto
  ) {
    try {
      // 验证 ID 范围
      if (id < 1 || id > 2147483647) {
        throw new HttpException(
          { code: 400, message: '保洁员ID超出有效范围', data: null },
          HttpStatus.BAD_REQUEST
        )
      }

      // 验证 isOnline
      if (typeof updateStatusDto.isOnline !== 'boolean') {
        throw new HttpException(
          { code: 400, message: '在线状态必须是布尔值', data: null },
          HttpStatus.BAD_REQUEST
        )
      }

      const cleaner = await this.cleanersService.updateCleanerStatus(id, updateStatusDto.isOnline);
      return {
        code: 200,
        msg: '保洁员状态更新成功',
        data: cleaner
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error
      }
      const isProduction = process.env.NODE_ENV === 'production'
      throw new HttpException(
        {
          code: 500,
          message: isProduction ? '保洁员状态更新失败，请稍后重试' : (error.message || '保洁员状态更新失败'),
          data: null
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      )
    }
  }

  @Delete(':id')
  async deleteCleaner(@Param('id', ParseIntPipe) id: number) {
    try {
      // 验证 ID 范围
      if (id < 1 || id > 2147483647) {
        throw new HttpException(
          { code: 400, message: '保洁员ID超出有效范围', data: null },
          HttpStatus.BAD_REQUEST
        )
      }

      await this.cleanersService.deleteCleaner(id);
      return {
        code: 200,
        msg: '保洁员删除成功',
        data: null
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error
      }
      const isProduction = process.env.NODE_ENV === 'production'
      throw new HttpException(
        {
          code: 500,
          message: isProduction ? '保洁员删除失败，请稍后重试' : (error.message || '保洁员删除失败'),
          data: null
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      )
    }
  }
}
