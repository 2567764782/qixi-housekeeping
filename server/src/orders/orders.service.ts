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

  // 生成虚拟订单数据
  async generateMockOrders(count: number = 10): Promise<{ success: number; failed: number; orders: Order[] }> {
    // 模拟服务列表
    const mockServices = [
      { id: 'service-1', name: '家庭保洁', category: 'cleaning', price: '100元/小时' },
      { id: 'service-2', name: '深度保洁', category: 'cleaning', price: '150元/小时' },
      { id: 'service-3', name: '空调清洗', category: 'cleaning', price: '80元/台' },
      { id: 'service-4', name: '厨房油污清理', category: 'cleaning', price: '120元/次' },
      { id: 'service-5', name: '卫生间深度清洁', category: 'cleaning', price: '100元/次' },
      { id: 'service-6', name: '墙面刷新', category: 'renovation', price: '50元/平方米' },
      { id: 'service-7', name: '地板更换', category: 'renovation', price: '200元/平方米' },
      { id: 'service-8', name: '水电改造', category: 'renovation', price: '300元/小时' },
    ]

    // 模拟地址列表
    const mockAddresses = [
      '北京市朝阳区建国路88号',
      '北京市海淀区中关村大街1号',
      '北京市西城区金融街10号',
      '上海市浦东新区陆家嘴环路1000号',
      '上海市徐汇区淮海中路999号',
      '广州市天河区珠江新城华夏路',
      '深圳市福田区深南大道6000号',
      '杭州市西湖区文三路500号',
      '成都市武侯区天府大道',
      '南京市鼓楼区中山路',
    ]

    // 模拟联系人电话
    const mockPhones = [
      '13800138001',
      '13800138002',
      '13800138003',
      '13800138004',
      '13800138005',
      '13900139001',
      '13900139002',
      '13900139003',
      '13900139004',
      '13900139005',
    ]

    // 模拟日期列表（未来7天）
    const mockDates: string[] = []
    const today = new Date()
    for (let i = 1; i <= 7; i++) {
      const date = new Date(today)
      date.setDate(today.getDate() + i)
      mockDates.push(date.toISOString().split('T')[0])
    }

    // 模拟时间段
    const mockTimeSlots = ['09:00-11:00', '10:00-12:00', '14:00-16:00', '15:00-17:00', '16:00-18:00', '19:00-21:00']

    // 模拟用户 ID
    const mockUserIds = ['user-001', 'user-002', 'user-003', 'user-004', 'user-005']

    // 模拟备注
    const mockRemarks = [
      '家里有宠物，请注意安全',
      '请自备清洁工具',
      '需要携带专业的地板清洁剂',
      '门口有快递柜，请联系我开门',
      '',
      '需要额外擦窗户',
      '家里有小孩，请使用环保清洁剂',
      '',
      '请在约定时间前15分钟联系我',
      '工作完成后请拍照发给我',
    ]

    // 生成虚拟订单
    const generatedOrders: Order[] = []
    let success = 0
    let failed = 0

    for (let i = 0; i < count; i++) {
      try {
        const service = mockServices[Math.floor(Math.random() * mockServices.length)]
        const address = mockAddresses[Math.floor(Math.random() * mockAddresses.length)]
        const phone = mockPhones[Math.floor(Math.random() * mockPhones.length)]
        const appointmentDate = mockDates[Math.floor(Math.random() * mockDates.length)]
        const appointmentTime = mockTimeSlots[Math.floor(Math.random() * mockTimeSlots.length)]
        const userId = mockUserIds[Math.floor(Math.random() * mockUserIds.length)]
        const remark = mockRemarks[Math.floor(Math.random() * mockRemarks.length)]

        const order = await this.create({
          userId,
          serviceId: service.id,
          serviceName: service.name,
          address,
          phone,
          appointmentDate,
          appointmentTime,
          remark,
        })

        // 随机分配一个状态（pending, confirmed, completed, cancelled）
        const statuses = ['pending', 'pending', 'confirmed', 'confirmed', 'completed']
        const randomStatus = statuses[Math.floor(Math.random() * statuses.length)]

        if (randomStatus !== 'pending') {
          await this.update(order.id, { status: randomStatus })
        }

        generatedOrders.push({ ...order, status: randomStatus })
        success++
      } catch (error) {
        console.error(`Failed to generate mock order ${i + 1}:`, error.message)
        failed++
      }
    }

    return {
      success,
      failed,
      orders: generatedOrders
    }
  }
}
