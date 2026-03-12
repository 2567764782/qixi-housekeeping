import { Injectable, NotFoundException } from '@nestjs/common'
import { getSupabaseClient } from '../storage/database/supabase-client'
import { StaffService } from '../staff/staff.service'
import type { Order, UpdateOrder } from '../storage/database/shared/schema'

@Injectable()
export class OrdersService {
  private readonly client = getSupabaseClient()

  constructor(private readonly staffService: StaffService) {}

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

  async findOne(id: string): Promise<Order | null> {
    const { data, error } = await this.client
      .from('orders')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      return null
    }

    return data
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

  async update(id: string, updateOrderDto: UpdateOrder): Promise<Order> {
    const { data, error } = await this.client
      .from('orders')
      .update(updateOrderDto)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to update order: ${error.message}`)
    }

    return data
  }

  // 自动接单 - 将订单状态从 pending 改为 confirmed
  async autoAccept(orderId: string): Promise<Order> {
    const order = await this.findOne(orderId)
    if (!order) {
      throw new NotFoundException('Order not found')
    }

    if (order.status !== 'pending') {
      throw new Error('Order can only be auto-accepted when status is pending')
    }

    const updatedOrder = await this.update(orderId, {
      status: 'confirmed',
      autoConfirmed: true
    })

    return updatedOrder
  }

  // 自动派单 - 根据服务类型自动分配给在线且评分最高的服务人员
  async autoAssign(orderId: string): Promise<Order> {
    const order = await this.findOne(orderId)
    if (!order) {
      throw new NotFoundException('Order not found')
    }

    if (order.status !== 'pending') {
      throw new Error('Order can only be auto-assigned when status is pending')
    }

    // 获取服务信息
    const { data: serviceData, error: serviceError } = await this.client
      .from('services')
      .select('category')
      .eq('id', order.serviceId)
      .single()

    if (serviceError || !serviceData) {
      throw new Error('Failed to fetch service information')
    }

    // 获取该服务类型下在线且评分最高的服务人员
    const staffList = await this.staffService.findByCategory(serviceData.category)

    if (staffList.length === 0) {
      throw new Error('No available staff for this service category')
    }

    // 选择评分最高且订单数最少的服务人员（简化算法）
    const bestStaff = staffList.reduce((best, current) => {
      const bestScore = parseFloat(best.rating || '0') - (best.totalOrders || 0) * 0.01
      const currentScore = parseFloat(current.rating || '0') - (current.totalOrders || 0) * 0.01
      return currentScore > bestScore ? current : best
    })

    // 更新订单状态
    const updatedOrder = await this.update(orderId, {
      status: 'confirmed',
      staffId: bestStaff.id,
      assignedAt: new Date().toISOString(),
      autoConfirmed: true,
      autoAssigned: true
    })

    // 更新服务人员订单数
    await this.staffService.incrementOrderCount(bestStaff.id)

    return updatedOrder
  }

  // 自动配置订单 - 同时执行自动接单和自动派单
  async autoConfigure(orderId: string): Promise<Order> {
    return this.autoAssign(orderId)
  }

  // 批量自动配置 - 对所有 pending 状态的订单执行自动配置
  async autoConfigureAll(): Promise<{ success: number; failed: number; orders: Order[] }> {
    const pendingOrders = await this.findAll()
    const pending = pendingOrders.filter(order => order.status === 'pending')

    let success = 0
    let failed = 0
    const processedOrders: Order[] = []

    for (const order of pending) {
      try {
        const updatedOrder = await this.autoConfigure(order.id)
        processedOrders.push(updatedOrder)
        success++
      } catch (error) {
        console.error(`Failed to auto-configure order ${order.id}:`, error.message)
        failed++
      }
    }

    return {
      success,
      failed,
      orders: processedOrders
    }
  }
}
