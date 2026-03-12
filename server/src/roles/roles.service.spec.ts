import { Test, TestingModule } from '@nestjs/testing'
import { RolesService } from './roles.service'
import { getSupabaseClient } from '../storage/database/supabase-client'

describe('RolesService', () => {
  let service: RolesService

  const mockSupabaseClient = {
    from: jest.fn(),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RolesService],
    }).compile()

    service = module.get<RolesService>(RolesService)

    // Mock Supabase client
    jest.spyOn(require('../storage/database/supabase-client'), 'getSupabaseClient').mockReturnValue(mockSupabaseClient)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('getAllRoles', () => {
    it('should return all active roles', async () => {
      const mockRoles = [
        { id: '1', name: 'admin', description: 'Administrator', is_active: true },
        { id: '2', name: 'user', description: 'User', is_active: true },
      ]

      mockSupabaseClient.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            order: jest.fn().mockResolvedValue({ data: mockRoles, error: null }),
          }),
        }),
      })

      const result = await service.getAllRoles()

      expect(result).toEqual(mockRoles)
      expect(mockSupabaseClient.from).toHaveBeenCalledWith('roles')
    })

    it('should return empty array if no roles exist', async () => {
      mockSupabaseClient.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            order: jest.fn().mockResolvedValue({ data: null, error: null }),
          }),
        }),
      })

      const result = await service.getAllRoles()

      expect(result).toEqual([])
    })
  })

  describe('createRole', () => {
    it('should create a new role successfully', async () => {
      const newRole = {
        id: '3',
        name: 'staff',
        description: 'Staff member',
        is_active: true,
      }

      mockSupabaseClient.from.mockReturnValue({
        insert: jest.fn().mockReturnValue({
          select: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({ data: newRole, error: null }),
          }),
        }),
      })

      const result = await service.createRole('staff', 'Staff member')

      expect(result).toEqual(newRole)
      expect(mockSupabaseClient.from().insert).toHaveBeenCalledWith({
        name: 'staff',
        description: 'Staff member',
        is_active: true,
      })
    })

    it('should throw error if creation fails', async () => {
      mockSupabaseClient.from.mockReturnValue({
        insert: jest.fn().mockReturnValue({
          select: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({ data: null, error: { message: 'Creation failed' } }),
          }),
        }),
      })

      await expect(service.createRole('staff', 'Staff member')).rejects.toThrow('Failed to create role')
    })
  })

  describe('assignResourcePermission', () => {
    it('should assign permission to role successfully', async () => {
      mockSupabaseClient.from.mockImplementation((table: string) => {
        if (table === 'roles') {
          return {
            select: jest.fn().mockReturnValue({
              eq: jest.fn().mockReturnValue({
                single: jest.fn().mockResolvedValue({ data: { id: 'role-1' }, error: null }),
              }),
            }),
          }
        } else if (table === 'resources') {
          return {
            select: jest.fn().mockReturnValue({
              eq: jest.fn().mockReturnValue({
                single: jest.fn().mockResolvedValue({ data: { id: 'resource-1' }, error: null }),
              }),
            }),
          }
        } else if (table === 'actions') {
          return {
            select: jest.fn().mockReturnValue({
              eq: jest.fn().mockReturnValue({
                single: jest.fn().mockResolvedValue({ data: { id: 'action-1' }, error: null }),
              }),
            }),
          }
        } else if (table === 'permissions') {
          return {
            select: jest.fn().mockReturnValue({
              eq: jest.fn().mockReturnValue({
                eq: jest.fn().mockReturnValue({
                  eq: jest.fn().mockReturnValue({
                    single: jest.fn().mockResolvedValue({ data: null, error: { message: 'Not found' } }),
                  }),
                }),
              }),
            }),
            insert: jest.fn().mockReturnValue({
              select: jest.fn().mockReturnValue({
                single: jest.fn().mockResolvedValue({
                  data: {
                    id: 'permission-1',
                    resource: { name: 'orders' },
                    action: { name: 'create' },
                    role: { name: 'admin' },
                  },
                  error: null,
                }),
              }),
            }),
          }
        }
        return {}
      })

      const result = await service.assignResourcePermission('admin', 'orders', 'create')

      expect(result).toHaveProperty('resource')
      expect(result).toHaveProperty('action')
      expect(result).toHaveProperty('role')
    })

    it('should throw error if permission already exists', async () => {
      mockSupabaseClient.from.mockImplementation((table: string) => {
        if (table === 'roles') {
          return {
            select: jest.fn().mockReturnValue({
              eq: jest.fn().mockReturnValue({
                single: jest.fn().mockResolvedValue({ data: { id: 'role-1' }, error: null }),
              }),
            }),
          }
        } else if (table === 'resources') {
          return {
            select: jest.fn().mockReturnValue({
              eq: jest.fn().mockReturnValue({
                single: jest.fn().mockResolvedValue({ data: { id: 'resource-1' }, error: null }),
              }),
            }),
          }
        } else if (table === 'actions') {
          return {
            select: jest.fn().mockReturnValue({
              eq: jest.fn().mockReturnValue({
                single: jest.fn().mockResolvedValue({ data: { id: 'action-1' }, error: null }),
              }),
            }),
          }
        } else if (table === 'permissions') {
          return {
            select: jest.fn().mockReturnValue({
              eq: jest.fn().mockReturnValue({
                eq: jest.fn().mockReturnValue({
                  eq: jest.fn().mockReturnValue({
                    single: jest.fn().mockResolvedValue({
                      data: { id: 'existing-permission' },
                      error: null,
                    }),
                  }),
                }),
              }),
            }),
          }
        }
        return {}
      })

      await expect(service.assignResourcePermission('admin', 'orders', 'create')).rejects.toThrow('Permission already exists')
    })
  })

  describe('initializeResourcesAndActions', () => {
    it('should initialize basic resources and actions', async () => {
      let callCount = 0
      mockSupabaseClient.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            single: jest.fn().mockImplementation(() => {
              callCount++
              // Simulate resources and actions not existing
              return Promise.resolve({ data: null, error: { message: 'Not found' } })
            }),
          }),
        }),
        insert: jest.fn().mockResolvedValue({ error: null }),
      })

      const result = await service.initializeResourcesAndActions()

      expect(result).toEqual({ success: true })
      expect(mockSupabaseClient.from).toHaveBeenCalled()
    })
  })
})
