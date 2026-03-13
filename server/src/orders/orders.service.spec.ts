import { Test, TestingModule } from '@nestjs/testing'
import { NotFoundException } from '@nestjs/common'
import { OrdersService } from './orders.service'

describe('OrdersService', () => {
  let service: OrdersService

  const mockOrder = {
    id: 'order-1',
    userId: 'user-1',
    serviceId: 'service-1',
    serviceName: '保洁服务',
    address: '北京市朝阳区',
    phone: '13800138000',
    appointmentDate: '2025-01-20',
    appointmentTime: '10:00',
    status: 'pending',
    remark: '备注信息',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  const mockStaffService = {
    findByCategory: jest.fn(),
    incrementOrderCount: jest.fn(),
  }

  const mockSupabaseClient = {
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        order: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn(),
      })),
      insert: jest.fn(() => ({
        select: jest.fn(() => ({
          single: jest.fn(),
        })),
      })),
      update: jest.fn(() => ({
        eq: jest.fn().mockReturnThis(),
        select: jest.fn(() => ({
          single: jest.fn(),
        })),
      })),
    })),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrdersService,
        {
          provide: StaffService,
          useValue: mockStaffService,
        },
      ],
    }).compile()

    service = module.get<OrdersService>(OrdersService)
    staffService = module.get<StaffService>(StaffService)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('findAll', () => {
    it('should return all orders', async () => {
      mockSupabaseClient.from().select().order.mockResolvedValue({
        data: [mockOrder],
        error: null,
      })

      const result = await service.findAll()

      expect(result).toEqual([mockOrder])
    })

    it('should return empty array if no orders exist', async () => {
      mockSupabaseClient.from().select().order.mockResolvedValue({
        data: [],
        error: null,
      })

      const result = await service.findAll()

      expect(result).toEqual([])
    })

    it('should throw error if database query fails', async () => {
      mockSupabaseClient.from().select().order.mockResolvedValue({
        data: null,
        error: { message: 'Database error' },
      })

      await expect(service.findAll()).rejects.toThrow('Failed to fetch orders')
    })
  })

  describe('findByUser', () => {
    it('should return orders for a specific user', async () => {
      mockSupabaseClient.from().select().eq().order.mockResolvedValue({
        data: [mockOrder],
        error: null,
      })

      const result = await service.findByUser('user-1')

      expect(result).toEqual([mockOrder])
    })

    it('should return empty array if user has no orders', async () => {
      mockSupabaseClient.from().select().eq().order.mockResolvedValue({
        data: [],
        error: null,
      })

      const result = await service.findByUser('nonexistent-user')

      expect(result).toEqual([])
    })
  })

  describe('findOne', () => {
    it('should return a single order', async () => {
      mockSupabaseClient.from().select().eq().single.mockResolvedValue({
        data: mockOrder,
        error: null,
      })

      const result = await service.findOne('order-1')

      expect(result).toEqual(mockOrder)
    })

    it('should return null if order not found', async () => {
      mockSupabaseClient.from().select().eq().single.mockResolvedValue({
        data: null,
        error: { message: 'Not found' },
      })

      const result = await service.findOne('nonexistent-order')

      expect(result).toBeNull()
    })
  })

  describe('create', () => {
    it('should create a new order', async () => {
      const createOrderDto = {
        userId: 'user-1',
        serviceId: 'service-1',
        serviceName: '保洁服务',
        address: '北京市朝阳区',
        phone: '13800138000',
        appointmentDate: '2025-01-20',
        appointmentTime: '10:00',
        remark: '备注信息',
      }

      mockSupabaseClient.from().insert().select().single.mockResolvedValue({
        data: mockOrder,
        error: null,
      })

      const result = await service.create(createOrderDto)

      expect(result).toEqual(mockOrder)
    })

    it('should throw error if creation fails', async () => {
      const createOrderDto = {
        userId: 'user-1',
        serviceId: 'service-1',
      }

      mockSupabaseClient.from().insert().select().single.mockResolvedValue({
        data: null,
        error: { message: 'Validation error' },
      })

      await expect(service.create(createOrderDto)).rejects.toThrow('Failed to create order')
    })
  })

  describe('update', () => {
    it('should update an order', async () => {
      const updateOrderDto = {
        status: 'confirmed',
      }

      mockSupabaseClient.from().update().eq().select().single.mockResolvedValue({
        data: { ...mockOrder, ...updateOrderDto },
        error: null,
      })

      const result = await service.update('order-1', updateOrderDto)

      expect(result).toEqual({ ...mockOrder, ...updateOrderDto })
    })

    it('should throw error if update fails', async () => {
      const updateOrderDto = {
        status: 'confirmed',
      }

      mockSupabaseClient.from().update().eq().select().single.mockResolvedValue({
        data: null,
        error: { message: 'Update failed' },
      })

      await expect(service.update('order-1', updateOrderDto)).rejects.toThrow('Failed to update order')
    })
  })

  describe('autoAccept', () => {
    it('should auto-accept a pending order', async () => {
      mockSupabaseClient.from().select().eq().single.mockResolvedValue({
        data: mockOrder,
        error: null,
      })

      mockSupabaseClient.from().update().eq().select().single.mockResolvedValue({
        data: { ...mockOrder, status: 'confirmed', autoConfirmed: true },
        error: null,
      })

      const result = await service.autoAccept('order-1')

      expect(result.status).toBe('confirmed')
      expect(result.autoConfirmed).toBe(true)
    })

    it('should throw NotFoundException if order not found', async () => {
      mockSupabaseClient.from().select().eq().single.mockResolvedValue({
        data: null,
        error: null,
      })

      await expect(service.autoAccept('nonexistent-order')).rejects.toThrow(NotFoundException)
    })

    it('should throw error if order status is not pending', async () => {
      const confirmedOrder = { ...mockOrder, status: 'confirmed' }
      mockSupabaseClient.from().select().eq().single.mockResolvedValue({
        data: confirmedOrder,
        error: null,
      })

      await expect(service.autoAccept('order-1')).rejects.toThrow('Order can only be auto-accepted when status is pending')
    })
  })

  describe('autoAssign', () => {
    const mockStaff = {
      id: 'staff-1',
      name: '保洁员1',
      rating: '5.0',
      totalOrders: 10,
    }

    it('should auto-assign a pending order to best staff', async () => {
      mockSupabaseClient.from().select().eq().single
        .mockResolvedValueOnce({ data: mockOrder, error: null }) // findOne
        .mockResolvedValueOnce({ data: { category: 'cleaning' }, error: null }) // getService

      mockStaffService.findByCategory.mockResolvedValue([mockStaff])
      mockStaffService.incrementOrderCount.mockResolvedValue(undefined)

      mockSupabaseClient.from().update().eq().select().single.mockResolvedValue({
        data: { ...mockOrder, status: 'confirmed', staffId: 'staff-1', autoConfirmed: true, autoAssigned: true },
        error: null,
      })

      const result = await service.autoAssign('order-1')

      expect(result.staffId).toBe('staff-1')
      expect(result.status).toBe('confirmed')
      expect(mockStaffService.incrementOrderCount).toHaveBeenCalledWith('staff-1')
    })

    it('should throw error if no available staff', async () => {
      mockSupabaseClient.from().select().eq().single
        .mockResolvedValueOnce({ data: mockOrder, error: null }) // findOne
        .mockResolvedValueOnce({ data: { category: 'cleaning' }, error: null }) // getService

      mockStaffService.findByCategory.mockResolvedValue([])

      await expect(service.autoAssign('order-1')).rejects.toThrow('No available staff for this service category')
    })

    it('should throw error if order status is not pending', async () => {
      const confirmedOrder = { ...mockOrder, status: 'confirmed' }
      mockSupabaseClient.from().select().eq().single.mockResolvedValue({
        data: confirmedOrder,
        error: null,
      })

      await expect(service.autoAssign('order-1')).rejects.toThrow('Order can only be auto-assigned when status is pending')
    })
  })

  describe('autoConfigureAll', () => {
    it('should auto-configure all pending orders', async () => {
      const pendingOrders = [mockOrder, { ...mockOrder, id: 'order-2' }]

      mockSupabaseClient.from().select().order.mockResolvedValue({
        data: pendingOrders,
        error: null,
      })

      const mockStaff = {
        id: 'staff-1',
        rating: '5.0',
        totalOrders: 10,
      }

      mockSupabaseClient.from().select().eq().single
        .mockResolvedValueOnce({ data: mockOrder, error: null })
        .mockResolvedValueOnce({ data: { category: 'cleaning' }, error: null })
        .mockResolvedValueOnce({ data: { ...mockOrder, id: 'order-2' }, error: null })
        .mockResolvedValueOnce({ data: { category: 'cleaning' }, error: null })

      mockStaffService.findByCategory.mockResolvedValue([mockStaff])
      mockStaffService.incrementOrderCount.mockResolvedValue(undefined)

      mockSupabaseClient.from().update().eq().select().single.mockResolvedValue({
        data: { ...mockOrder, status: 'confirmed', staffId: 'staff-1' },
        error: null,
      })

      const result = await service.autoConfigureAll()

      expect(result.success).toBe(2)
      expect(result.failed).toBe(0)
      expect(result.orders.length).toBe(2)
    })

    it('should handle failures gracefully', async () => {
      const pendingOrders = [mockOrder, { ...mockOrder, id: 'order-2' }]

      mockSupabaseClient.from().select().order.mockResolvedValue({
        data: pendingOrders,
        error: null,
      })

      mockSupabaseClient.from().select().eq().single
        .mockResolvedValueOnce({ data: mockOrder, error: null })
        .mockRejectedValueOnce(new Error('Service not found'))

      const result = await service.autoConfigureAll()

      expect(result.success).toBe(0)
      expect(result.failed).toBe(2)
    })
  })
})
