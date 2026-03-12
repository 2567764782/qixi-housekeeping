import { Controller, Get, Post, Body, Param, Patch } from '@nestjs/common'
import { StaffService } from './staff.service'
import type { InsertStaff } from '../storage/database/shared/schema'

@Controller('staff')
export class StaffController {
  constructor(private readonly staffService: StaffService) {}

  @Get()
  async findAll() {
    return {
      code: 200,
      msg: 'success',
      data: await this.staffService.findAll()
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const staff = await this.staffService.findOne(id)
    if (!staff) {
      return {
        code: 404,
        msg: 'Staff not found',
        data: null
      }
    }
    return {
      code: 200,
      msg: 'success',
      data: staff
    }
  }

  @Get('category/:category')
  async findByCategory(@Param('category') category: string) {
    return {
      code: 200,
      msg: 'success',
      data: await this.staffService.findByCategory(category)
    }
  }

  @Post()
  async create(@Body() createStaffDto: InsertStaff) {
    try {
      const staff = await this.staffService.create(createStaffDto)
      return {
        code: 200,
        msg: 'success',
        data: staff
      }
    } catch (error) {
      return {
        code: 500,
        msg: error.message,
        data: null
      }
    }
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateStaffDto: Partial<InsertStaff>) {
    try {
      const staff = await this.staffService.update(id, updateStaffDto)
      return {
        code: 200,
        msg: 'success',
        data: staff
      }
    } catch (error) {
      return {
        code: 500,
        msg: error.message,
        data: null
      }
    }
  }

  @Patch(':id/status/:status')
  async updateStatus(
    @Param('id') id: string,
    @Param('status') status: 'online' | 'offline' | 'busy'
  ) {
    try {
      const staff = await this.staffService.updateStatus(id, status)
      return {
        code: 200,
        msg: 'success',
        data: staff
      }
    } catch (error) {
      return {
        code: 500,
        msg: error.message,
        data: null
      }
    }
  }
}
