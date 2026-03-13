import { Test, TestingModule } from '@nestjs/testing'
import { RolesService } from './roles.service'

describe('RolesService', () => {
  let service: RolesService

  const mockRole = {
    id: 1,
    name: 'CUSTOMER',
    description: '普通用户',
    is_active: true,
    created_at: new Date(),
    updated_at: new Date(),
  }

  const mockPermission = {
    id: 1,
    name: '创建订单',
    code: 'order:create',
    description: '允许创建订单',
    resource: 'order',
    action: 'create',
    is_active: true,
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RolesService],
    }).compile()

    service = module.get<RolesService>(RolesService)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('getAllRoles', () => {
    it('should return all active roles', async () => {
      const spy = jest.spyOn(service['client'].from('roles'), 'select').mockResolvedValue({
        data: [mockRole],
        error: null,
      })

      const result = await service.getAllRoles()

      expect(result).toEqual([mockRole])
      spy.mockRestore()
    })

    it('should return empty array if no roles exist', async () => {
      const spy = jest.spyOn(service['client'].from('roles'), 'select').mockResolvedValue({
        data: [],
        error: null,
      })

      const result = await service.getAllRoles()

      expect(result).toEqual([])
      spy.mockRestore()
    })

    it('should throw error if query fails', async () => {
      const spy = jest.spyOn(service['client'].from('roles'), 'select').mockResolvedValue({
        data: null,
        error: { message: 'Database error' },
      })

      await expect(service.getAllRoles()).rejects.toThrow('Failed to get roles')
      spy.mockRestore()
    })
  })

  describe('getUserRoles', () => {
    it('should return user roles', async () => {
      const mockUserData = [
        {
          role_id: 1,
          roles: mockRole,
        },
      ]

      const spy = jest.spyOn(service['client'].from('user_roles'), 'select').mockResolvedValue({
        data: mockUserData,
        error: null,
      })

      const result = await service.getUserRoles(1)

      expect(result).toEqual([mockRole])
      spy.mockRestore()
    })

    it('should return empty array if user has no roles', async () => {
      const spy = jest.spyOn(service['client'].from('user_roles'), 'select').mockResolvedValue({
        data: [],
        error: null,
      })

      const result = await service.getUserRoles(999)

      expect(result).toEqual([])
      spy.mockRestore()
    })
  })

  describe('getUserPermissions', () => {
    it('should return user permissions', async () => {
      const mockUserData = [
        {
          role_id: 1,
          roles: {
            ...mockRole,
            role_permissions: [
              {
                permission_id: 1,
                permissions: mockPermission,
              },
            ],
          },
        },
      ]

      const spy = jest.spyOn(service['client'].from('user_roles'), 'select').mockResolvedValue({
        data: mockUserData,
        error: null,
      })

      const result = await service.getUserPermissions(1)

      expect(result).toEqual([mockPermission])
      spy.mockRestore()
    })
  })

  describe('hasPermission', () => {
    it('should return true if user has permission', async () => {
      const spy = jest.spyOn(service, 'getUserPermissions').mockResolvedValue([mockPermission])

      const result = await service.hasPermission(1, 'order', 'create')

      expect(result).toBe(true)
      spy.mockRestore()
    })

    it('should return false if user does not have permission', async () => {
      const spy = jest.spyOn(service, 'getUserPermissions').mockResolvedValue([])

      const result = await service.hasPermission(1, 'order', 'delete')

      expect(result).toBe(false)
      spy.mockRestore()
    })
  })

  describe('hasRole', () => {
    it('should return true if user has role', async () => {
      const spy = jest.spyOn(service, 'getUserRoles').mockResolvedValue([mockRole])

      const result = await service.hasRole(1, 'CUSTOMER')

      expect(result).toBe(true)
      spy.mockRestore()
    })

    it('should return false if user does not have role', async () => {
      const spy = jest.spyOn(service, 'getUserRoles').mockResolvedValue([])

      const result = await service.hasRole(1, 'ADMIN')

      expect(result).toBe(false)
      spy.mockRestore()
    })
  })

  describe('assignRole', () => {
    it('should assign role to user', async () => {
      const roleSpy = jest.spyOn(service['client'].from('roles'), 'select').mockResolvedValue({
        data: mockRole,
        error: null,
      })

      const insertSpy = jest.spyOn(service['client'].from('user_roles'), 'insert').mockResolvedValue({
        data: { user_id: 1, role_id: 1 },
        error: null,
      })

      const result = await service.assignRole(1, 'CUSTOMER')

      expect(result).toEqual({ user_id: 1, role_id: 1 })
      roleSpy.mockRestore()
      insertSpy.mockRestore()
    })

    it('should throw error if role not found', async () => {
      const roleSpy = jest.spyOn(service['client'].from('roles'), 'select').mockResolvedValue({
        data: null,
        error: { message: 'Not found' },
      })

      await expect(service.assignRole(1, 'NONEXISTENT')).rejects.toThrow('Role not found')
      roleSpy.mockRestore()
    })
  })

  describe('removeRole', () => {
    it('should remove role from user', async () => {
      const roleSpy = jest.spyOn(service['client'].from('roles'), 'select').mockResolvedValue({
        data: mockRole,
        error: null,
      })

      const deleteSpy = jest.spyOn(service['client'].from('user_roles'), 'delete').mockReturnValue({
        eq: jest.fn().mockReturnValue({
          eq: jest.fn().mockResolvedValue({ error: null }),
        }),
      })

      const result = await service.removeRole(1, 'CUSTOMER')

      expect(result).toEqual({ success: true })
      roleSpy.mockRestore()
      deleteSpy.mockRestore()
    })
  })

  describe('createRole', () => {
    it('should create a new role', async () => {
      const spy = jest.spyOn(service['client'].from('roles'), 'insert').mockReturnValue({
        select: jest.fn().mockReturnValue({
          single: jest.fn().mockResolvedValue({
            data: mockRole,
            error: null,
          }),
        }),
      })

      const result = await service.createRole('NEW_ROLE', 'New role description')

      expect(result).toEqual(mockRole)
      spy.mockRestore()
    })

    it('should throw error if creation fails', async () => {
      const spy = jest.spyOn(service['client'].from('roles'), 'insert').mockReturnValue({
        select: jest.fn().mockReturnValue({
          single: jest.fn().mockResolvedValue({
            data: null,
            error: { message: 'Validation error' },
          }),
        }),
      })

      await expect(service.createRole('NEW_ROLE', 'New role description')).rejects.toThrow('Failed to create role')
      spy.mockRestore()
    })
  })

  describe('updateRole', () => {
    it('should update a role', async () => {
      const spy = jest.spyOn(service['client'].from('roles'), 'update').mockReturnValue({
        eq: jest.fn().mockReturnValue({
          select: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({
              data: { ...mockRole, description: 'Updated description' },
              error: null,
            }),
          }),
        }),
      })

      const result = await service.updateRole(1, { description: 'Updated description' })

      expect(result.description).toBe('Updated description')
      spy.mockRestore()
    })

    it('should throw error if update fails', async () => {
      const spy = jest.spyOn(service['client'].from('roles'), 'update').mockReturnValue({
        eq: jest.fn().mockReturnValue({
          select: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({
              data: null,
              error: { message: 'Update failed' },
            }),
          }),
        }),
      })

      await expect(service.updateRole(1, { description: 'Updated description' })).rejects.toThrow('Failed to update role')
      spy.mockRestore()
    })
  })

  describe('deleteRole', () => {
    it('should delete a role', async () => {
      const deleteSpy1 = jest.spyOn(service['client'].from('role_permissions'), 'delete').mockReturnValue({
        eq: jest.fn().mockResolvedValue({ error: null }),
      })

      const deleteSpy2 = jest.spyOn(service['client'].from('user_roles'), 'delete').mockReturnValue({
        eq: jest.fn().mockResolvedValue({ error: null }),
      })

      const deleteSpy3 = jest.spyOn(service['client'].from('roles'), 'delete').mockReturnValue({
        eq: jest.fn().mockResolvedValue({ error: null }),
      })

      await expect(service.deleteRole(1)).resolves.not.toThrow()

      deleteSpy1.mockRestore()
      deleteSpy2.mockRestore()
      deleteSpy3.mockRestore()
    })
  })

  describe('assignPermissionToRole', () => {
    it('should assign permission to role', async () => {
      const spy = jest.spyOn(service['client'].from('role_permissions'), 'insert').mockReturnValue({
        select: jest.fn().mockReturnValue({
          single: jest.fn().mockResolvedValue({
            data: { role_id: 1, permission_id: 1 },
            error: null,
          }),
        }),
      })

      const result = await service.assignPermissionToRole(1, 1)

      expect(result).toEqual({ role_id: 1, permission_id: 1 })
      spy.mockRestore()
    })
  })

  describe('removePermissionFromRole', () => {
    it('should remove permission from role', async () => {
      const spy = jest.spyOn(service['client'].from('role_permissions'), 'delete').mockReturnValue({
        eq: jest.fn().mockReturnValue({
          eq: jest.fn().mockResolvedValue({ error: null }),
        }),
      })

      await expect(service.removePermissionFromRole(1, 1)).resolves.not.toThrow()

      spy.mockRestore()
    })
  })

  describe('getAllPermissions', () => {
    it('should return all active permissions', async () => {
      const spy = jest.spyOn(service['client'].from('permissions'), 'select').mockResolvedValue({
        data: [mockPermission],
        error: null,
      })

      const result = await service.getAllPermissions()

      expect(result).toEqual([mockPermission])
      spy.mockRestore()
    })
  })

  describe('createPermission', () => {
    it('should create a new permission', async () => {
      const spy = jest.spyOn(service['client'].from('permissions'), 'insert').mockReturnValue({
        select: jest.fn().mockReturnValue({
          single: jest.fn().mockResolvedValue({
            data: mockPermission,
            error: null,
          }),
        }),
      })

      const result = await service.createPermission('创建订单', 'order:create', '允许创建订单', 'order', 'create')

      expect(result).toEqual(mockPermission)
      spy.mockRestore()
    })
  })
})
