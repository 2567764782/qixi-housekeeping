import { Injectable } from '@nestjs/common'
import { getSupabaseClient } from '../storage/database/supabase-client'
import type { Order } from '../storage/database/shared/schema'

@Injectable()
export class OrdersService {
  private readonly client = getSupabaseClient()

  async findAll(): Promise<Order[]> {
    const { data, error } = await this.client
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      throw new Error(`Failed to fetch orders: ${error.message}`)
    }

    return data || []
  }

  async findByUser(userId: string): Promise<Order[]> {
    const { data, error } = await this.client
      .from('orders')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      throw new Error(`Failed to fetch user orders: ${error.message}`)
    }

    return data || []
  }

  async create(createOrderDto: any): Promise<Order> {
    const { data, error } = await this.client
      .from('orders')
      .insert({
        user_id: createOrderDto.userId,
        service_id: createOrderDto.serviceId,
        service_name: createOrderDto.serviceName,
        address: createOrderDto.address,
        phone: createOrderDto.phone,
        appointment_date: createOrderDto.appointmentDate,
        appointment_time: createOrderDto.appointmentTime,
        remark: createOrderDto.remark
      })
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to create order: ${error.message}`)
    }

    return data
  }
}
