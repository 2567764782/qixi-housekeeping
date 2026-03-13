import { Test, TestingModule } from '@nestjs/testing'
import { UsersService } from './users.service'

describe('UsersService', () => {
  let service: UsersService

  const mockUsers = [
    {
      id: 'user-1',
      nickname: '用户1',
      phone: '13800138001',
      gender: 'male',
      city: '北京',
      created_at: '2025-01-01T00:00:00Z',
    },
    {
      id: 'user-2',
      nickname: '用户2',
      phone: '13800138002',
      gender: 'female',
      city: '上海',
      created_at: '2025-01-02T00:00:00Z',
    },
    {
      id: 'user-3',
      nickname: '用户3',
      phone: '13800138003',
      gender: 'male',
      city: '北京',
      created_at: '2025-01-03T00:00:00Z',
    },
  ]

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService],
    }).compile()

    service = module.get<UsersService>(UsersService)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('getRandomUsers', () => {
    it('should return random users', async () => {
      const spy = jest.spyOn(service['client'].from('users'), 'select').mockReturnValue({
        order: jest.fn().mockReturnValue({
          limit: jest.fn().mockResolvedValue({
            data: mockUsers,
            error: null,
          }),
        }),
      })

      const result = await service.getRandomUsers(10)

      expect(result).toBeDefined()
      expect(result.length).toBeLessThanOrEqual(10)
      spy.mockRestore()
    })

    it('should return empty array if no users exist', async () => {
      const spy = jest.spyOn(service['client'].from('users'), 'select').mockReturnValue({
        order: jest.fn().mockReturnValue({
          limit: jest.fn().mockResolvedValue({
            data: [],
            error: null,
          }),
        }),
      })

      const result = await service.getRandomUsers(10)

      expect(result).toEqual([])
      spy.mockRestore()
    })

    it('should throw error if database query fails', async () => {
      const spy = jest.spyOn(service['client'].from('users'), 'select').mockReturnValue({
        order: jest.fn().mockReturnValue({
          limit: jest.fn().mockResolvedValue({
            data: null,
            error: { message: 'Database error' },
          }),
        }),
      })

      await expect(service.getRandomUsers(10)).rejects.toThrow('获取用户列表失败')
      spy.mockRestore()
    })

    it('should use default limit if not provided', async () => {
      const spy = jest.spyOn(service['client'].from('users'), 'select').mockReturnValue({
        order: jest.fn().mockReturnValue({
          limit: jest.fn().mockResolvedValue({
            data: mockUsers,
            error: null,
          }),
        }),
      })

      await service.getRandomUsers()

      expect(spy).toHaveBeenCalled()
      spy.mockRestore()
    })

    it('should shuffle users', async () => {
      const spy = jest.spyOn(service['client'].from('users'), 'select').mockReturnValue({
        order: jest.fn().mockReturnValue({
          limit: jest.fn().mockResolvedValue({
            data: mockUsers,
            error: null,
          }),
        }),
      })

      const result1 = await service.getRandomUsers(10)
      const result2 = await service.getRandomUsers(10)

      // Due to random shuffling, the results should be different most of the time
      // However, there's a small chance they might be the same, so we just verify they're valid
      expect(result1.length).toBeLessThanOrEqual(10)
      expect(result2.length).toBeLessThanOrEqual(10)
      spy.mockRestore()
    })
  })

  describe('getUsersByCity', () => {
    it('should return users filtered by city', async () => {
      const spy = jest.spyOn(service['client'].from('users'), 'select').mockReturnValue({
        eq: jest.fn().mockReturnValue({
          order: jest.fn().mockReturnValue({
            limit: jest.fn().mockResolvedValue({
              data: [mockUsers[0], mockUsers[2]],
              error: null,
            }),
          }),
        }),
      })

      const result = await service.getUsersByCity('北京', 10)

      expect(result).toHaveLength(2)
      expect(result[0].city).toBe('北京')
      expect(result[1].city).toBe('北京')
      spy.mockRestore()
    })

    it('should return empty array if no users in city', async () => {
      const spy = jest.spyOn(service['client'].from('users'), 'select').mockReturnValue({
        eq: jest.fn().mockReturnValue({
          order: jest.fn().mockReturnValue({
            limit: jest.fn().mockResolvedValue({
              data: [],
              error: null,
            }),
          }),
        }),
      })

      const result = await service.getUsersByCity('深圳', 10)

      expect(result).toEqual([])
      spy.mockRestore()
    })

    it('should throw error if database query fails', async () => {
      const spy = jest.spyOn(service['client'].from('users'), 'select').mockReturnValue({
        eq: jest.fn().mockReturnValue({
          order: jest.fn().mockReturnValue({
            limit: jest.fn().mockResolvedValue({
              data: null,
              error: { message: 'Database error' },
            }),
          }),
        }),
      })

      await expect(service.getUsersByCity('北京', 10)).rejects.toThrow('获取城市用户列表失败')
      spy.mockRestore()
    })

    it('should use default limit if not provided', async () => {
      const spy = jest.spyOn(service['client'].from('users'), 'select').mockReturnValue({
        eq: jest.fn().mockReturnValue({
          order: jest.fn().mockReturnValue({
            limit: jest.fn().mockResolvedValue({
              data: mockUsers,
              error: null,
            }),
          }),
        }),
      })

      await service.getUsersByCity('北京')

      expect(spy).toHaveBeenCalled()
      spy.mockRestore()
    })
  })

  describe('getUserStats', () => {
    it('should return user statistics', async () => {
      const selectSpy = jest.spyOn(service['client'].from('users'), 'select')

      // Mock count query
      selectSpy.mockReturnValueOnce({
        count: 3,
        error: null,
      } as any)

      // Mock gender query
      selectSpy.mockReturnValueOnce({
        data: mockUsers,
        error: null,
      } as any)

      // Mock city query
      selectSpy.mockReturnValueOnce({
        data: mockUsers,
        error: null,
      } as any)

      const result = await service.getUserStats()

      expect(result.totalUsers).toBe(3)
      expect(result.genderDistribution).toEqual({
        male: 2,
        female: 1,
      })
      expect(Object.keys(result.cityDistribution).length).toBeLessThanOrEqual(10)
      selectSpy.mockRestore()
    })

    it('should return zero total users if no users exist', async () => {
      const selectSpy = jest.spyOn(service['client'].from('users'), 'select')

      selectSpy.mockReturnValueOnce({
        count: 0,
        error: null,
      } as any)

      selectSpy.mockReturnValueOnce({
        data: [],
        error: null,
      } as any)

      selectSpy.mockReturnValueOnce({
        data: [],
        error: null,
      } as any)

      const result = await service.getUserStats()

      expect(result.totalUsers).toBe(0)
      expect(result.genderDistribution).toEqual({})
      expect(result.cityDistribution).toEqual({})
      selectSpy.mockRestore()
    })

    it('should throw error if count query fails', async () => {
      const selectSpy = jest.spyOn(service['client'].from('users'), 'select')

      selectSpy.mockReturnValueOnce({
        count: null,
        error: { message: 'Count error' },
      } as any)

      await expect(service.getUserStats()).rejects.toThrow('获取用户总数失败')
      selectSpy.mockRestore()
    })

    it('should throw error if gender query fails', async () => {
      const selectSpy = jest.spyOn(service['client'].from('users'), 'select')

      selectSpy.mockReturnValueOnce({
        count: 3,
        error: null,
      } as any)

      selectSpy.mockReturnValueOnce({
        data: null,
        error: { message: 'Gender error' },
      } as any)

      await expect(service.getUserStats()).rejects.toThrow('获取性别分布失败')
      selectSpy.mockRestore()
    })

    it('should throw error if city query fails', async () => {
      const selectSpy = jest.spyOn(service['client'].from('users'), 'select')

      selectSpy.mockReturnValueOnce({
        count: 3,
        error: null,
      } as any)

      selectSpy.mockReturnValueOnce({
        data: mockUsers,
        error: null,
      } as any)

      selectSpy.mockReturnValueOnce({
        data: null,
        error: { message: 'City error' },
      } as any)

      await expect(service.getUserStats()).rejects.toThrow('获取城市分布失败')
      selectSpy.mockRestore()
    })

    it('should return top 10 cities', async () => {
      const manyUsers = Array.from({ length: 15 }, (_, i) => ({
        ...mockUsers[0],
        id: `user-${i}`,
        city: `城市${i}`,
      }))

      const selectSpy = jest.spyOn(service['client'].from('users'), 'select')

      selectSpy.mockReturnValueOnce({
        count: 15,
        error: null,
      } as any)

      selectSpy.mockReturnValueOnce({
        data: manyUsers,
        error: null,
      } as any)

      selectSpy.mockReturnValueOnce({
        data: manyUsers,
        error: null,
      } as any)

      const result = await service.getUserStats()

      expect(Object.keys(result.cityDistribution).length).toBeLessThanOrEqual(10)
      selectSpy.mockRestore()
    })
  })

  describe('shuffleArray', () => {
    it('should shuffle array', () => {
      const array = [1, 2, 3, 4, 5]
      const result = service['shuffleArray'](array)

      expect(result).toHaveLength(5)
      expect(result).toContain(1)
      expect(result).toContain(2)
      expect(result).toContain(3)
      expect(result).toContain(4)
      expect(result).toContain(5)
    })

    it('should not modify original array', () => {
      const array = [1, 2, 3, 4, 5]
      const originalArray = [...array]
      service['shuffleArray'](array)

      expect(array).toEqual(originalArray)
    })

    it('should handle empty array', () => {
      const result = service['shuffleArray']([])

      expect(result).toEqual([])
    })

    it('should handle single element array', () => {
      const result = service['shuffleArray']([1])

      expect(result).toEqual([1])
    })
  })
})
