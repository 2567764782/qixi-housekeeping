import { Test, TestingModule } from '@nestjs/testing'
import { ConfigService } from '@nestjs/config'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { RolesService } from './roles.service'
import { Role } from './entities/role.entity'

describe('RolesService', () => {
  let service: RolesService
  let repository: Repository<Role>
  let configService: ConfigService

  const mockRole = {
    id: 1,
    name: 'CUSTOMER',
    description: '普通用户',
    permissions: ['order:create', 'order:view'],
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  const mockRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  }

  const mockConfigService = {
    get: jest.fn(),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RolesService,
        {
          provide: getRepositoryToken(Role),
          useValue: mockRepository,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile()

    service = module.get<RolesService>(RolesService)
    repository = module.get<Repository<Role>>(getRepositoryToken(Role))
    configService = module.get<ConfigService>(ConfigService)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('getAllRoles', () => {
    it('should return all roles', async () => {
      mockRepository.find.mockResolvedValue([mockRole])

      const result = await service.getAllRoles()

      expect(result).toEqual([mockRole])
      expect(mockRepository.find).toHaveBeenCalled()
    })

    it('should return empty array if no roles exist', async () => {
      mockRepository.find.mockResolvedValue([])

      const result = await service.getAllRoles()

      expect(result).toEqual([])
    })
  })

  describe('getRoleById', () => {
    it('should return a role by id', async () => {
      mockRepository.findOne.mockResolvedValue(mockRole)

      const result = await service.getRoleById(1)

      expect(result).toEqual(mockRole)
      expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } })
    })

    it('should return null if role not found', async () => {
      mockRepository.findOne.mockResolvedValue(null)

      const result = await service.getRoleById(999)

      expect(result).toBeNull()
    })
  })

  describe('getRoleByName', () => {
    it('should return a role by name', async () => {
      mockRepository.findOne.mockResolvedValue(mockRole)

      const result = await service.getRoleByName('CUSTOMER')

      expect(result).toEqual(mockRole)
      expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { name: 'CUSTOMER' } })
    })

    it('should return null if role name not found', async () => {
      mockRepository.findOne.mockResolvedValue(null)

      const result = await service.getRoleByName('NONEXISTENT')

      expect(result).toBeNull()
    })
  })

  describe('createRole', () => {
    it('should create a new role', async () => {
      const createRoleDto = {
        name: 'NEW_ROLE',
        description: '新角色',
        permissions: ['permission:read'],
      }

      mockRepository.create.mockReturnValue(mockRole)
      mockRepository.save.mockResolvedValue(mockRole)

      const result = await service.createRole(createRoleDto)

      expect(result).toEqual(mockRole)
      expect(mockRepository.create).toHaveBeenCalledWith(createRoleDto)
      expect(mockRepository.save).toHaveBeenCalledWith(mockRole)
    })
  })

  describe('updateRole', () => {
    it('should update a role', async () => {
      const updateRoleDto = {
        description: '更新后的描述',
      }

      mockRepository.findOne.mockResolvedValue(mockRole)
      mockRepository.save.mockResolvedValue({ ...mockRole, ...updateRoleDto })

      const result = await service.updateRole(1, updateRoleDto)

      expect(result).toEqual({ ...mockRole, ...updateRoleDto })
      expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } })
      expect(mockRepository.save).toHaveBeenCalled()
    })

    it('should return null if role not found', async () => {
      const updateRoleDto = {
        description: '更新后的描述',
      }

      mockRepository.findOne.mockResolvedValue(null)

      const result = await service.updateRole(999, updateRoleDto)

      expect(result).toBeNull()
    })
  })

  describe('deleteRole', () => {
    it('should delete a role', async () => {
      mockRepository.findOne.mockResolvedValue(mockRole)
      mockRepository.delete.mockResolvedValue({ affected: 1 })

      const result = await service.deleteRole(1)

      expect(result).toEqual({ affected: 1 })
      expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } })
      expect(mockRepository.delete).toHaveBeenCalledWith(1)
    })

    it('should return null if role not found', async () => {
      mockRepository.findOne.mockResolvedValue(null)

      const result = await service.deleteRole(999)

      expect(result).toBeNull()
    })
  })

  describe('addPermission', () => {
    it('should add a permission to role', async () => {
      const updatedRole = {
        ...mockRole,
        permissions: ['order:create', 'order:view', 'order:delete'],
      }

      mockRepository.findOne.mockResolvedValue(mockRole)
      mockRepository.save.mockResolvedValue(updatedRole)

      const result = await service.addPermission(1, 'order:delete')

      expect(result).toEqual(updatedRole)
      expect(mockRepository.save).toHaveBeenCalledWith(updatedRole)
    })
  })

  describe('removePermission', () => {
    it('should remove a permission from role', async () => {
      const updatedRole = {
        ...mockRole,
        permissions: ['order:create'],
      }

      mockRepository.findOne.mockResolvedValue(mockRole)
      mockRepository.save.mockResolvedValue(updatedRole)

      const result = await service.removePermission(1, 'order:view')

      expect(result).toEqual(updatedRole)
      expect(mockRepository.save).toHaveBeenCalledWith(updatedRole)
    })
  })
})
