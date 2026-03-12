import { Injectable } from '@nestjs/common'
import { getSupabaseClient } from '../storage/database/supabase-client'
import type { Staff, InsertStaff, UpdateStaff } from '../storage/database/shared/schema'

@Injectable()
export class StaffService {
  private readonly client = getSupabaseClient()

  async findAll(): Promise<Staff[]> {
    const { data, error } = await this.client
      .from('staff')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      throw new Error(`Failed to fetch staff: ${error.message}`)
    }

    return data || []
  }

  async findByCategory(category: string): Promise<Staff[]> {
    const { data, error } = await this.client
      .from('staff')
      .select('*')
      .eq('category', category)
      .eq('status', 'online')
      .order('rating', { ascending: false })

    if (error) {
      throw new Error(`Failed to fetch staff by category: ${error.message}`)
    }

    return data || []
  }

  async findOne(id: string): Promise<Staff | null> {
    const { data, error } = await this.client
      .from('staff')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      return null
    }

    return data
  }

  async create(createStaffDto: InsertStaff): Promise<Staff> {
    const { data, error } = await this.client
      .from('staff')
      .insert({
        name: createStaffDto.name,
        phone: createStaffDto.phone,
        category: createStaffDto.category,
        status: createStaffDto.status || 'offline',
        location: createStaffDto.location
      })
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to create staff: ${error.message}`)
    }

    return data
  }

  async update(id: string, updateStaffDto: UpdateStaff): Promise<Staff> {
    const { data, error } = await this.client
      .from('staff')
      .update(updateStaffDto)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to update staff: ${error.message}`)
    }

    return data
  }

  async updateStatus(id: string, status: 'online' | 'offline' | 'busy'): Promise<Staff> {
    return this.update(id, { status })
  }

  async incrementOrderCount(id: string): Promise<void> {
    const staff = await this.findOne(id)
    if (staff) {
      const totalOrders = (staff.totalOrders || 0) + 1
      await this.update(id, { totalOrders })
    }
  }
}
