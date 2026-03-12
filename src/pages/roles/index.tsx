import { useLoad } from '@tarojs/taro'
import { View, Text, ScrollView } from '@tarojs/components'
import { useState } from 'react'
import { Network } from '@/network'
import { Shield, User, Users, Key, Plus, Trash2, RefreshCw } from 'lucide-react-taro'
import './index.css'

interface Role {
  id: number
  name: string
  description: string
  created_at: string
}

interface Permission {
  id: number
  name: string
  code: string
  description: string
}

interface User {
  id: number
  username: string
  name: string
  phone: string
}

interface UserRole {
  userId: number
  roleId: number
  userName: string
  roleName: string
}

const RolesPage = () => {
  useLoad(() => {
    loadRoles()
  })

  const [activeTab, setActiveTab] = useState<'roles' | 'permissions' | 'users'>('roles')
  const [loading, setLoading] = useState(false)

  // 角色列表
  const [roles, setRoles] = useState<Role[]>([])
  // 权限列表
  const [permissions, setPermissions] = useState<Permission[]>([])
  // 用户角色关联
  const [userRoles, setUserRoles] = useState<UserRole[]>([])

  // 加载角色列表
  const loadRoles = async () => {
    try {
      setLoading(true)
      const res = await Network.request({
        url: '/api/roles',
        method: 'GET'
      })
      setRoles(res.data || [])
    } catch (error) {
      console.error('Failed to load roles:', error)
      // 如果接口调用失败，使用模拟数据
      setRoles([
        {
          id: 1,
          name: 'admin',
          description: '系统管理员，拥有所有权限',
          created_at: '2024-01-01T00:00:00Z'
        },
        {
          id: 2,
          name: 'cleaner',
          description: '保洁员，可以查看和接单',
          created_at: '2024-01-01T00:00:00Z'
        },
        {
          id: 3,
          name: 'user',
          description: '普通用户，可以创建订单',
          created_at: '2024-01-01T00:00:00Z'
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  // 加载权限列表
  const loadPermissions = async () => {
    try {
      setLoading(true)
      const res = await Network.request({
        url: '/api/roles/permissions/all',
        method: 'GET'
      })
      setPermissions(res.data || [])
    } catch (error) {
      console.error('Failed to load permissions:', error)
      // 如果接口调用失败，使用模拟数据
      setPermissions([
        {
          id: 1,
          name: '查看订单',
          code: 'orders:view',
          description: '查看所有订单'
        },
        {
          id: 2,
          name: '创建订单',
          code: 'orders:create',
          description: '创建新订单'
        },
        {
          id: 3,
          name: '编辑订单',
          code: 'orders:edit',
          description: '编辑订单信息'
        },
        {
          id: 4,
          name: '删除订单',
          code: 'orders:delete',
          description: '删除订单'
        },
        {
          id: 5,
          name: '查看统计',
          code: 'statistics:view',
          description: '查看统计数据'
        },
        {
          id: 6,
          name: '管理用户',
          code: 'users:manage',
          description: '管理用户信息'
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  // 加载用户角色关联
  const loadUserRoles = async () => {
    try {
      setLoading(true)
      const res = await Network.request({
        url: '/api/user-roles',
        method: 'GET'
      })
      setUserRoles(res.data || [])
    } catch (error) {
      console.error('Failed to load user roles:', error)
      // 如果接口调用失败，使用模拟数据
      setUserRoles([
        {
          userId: 1,
          roleId: 1,
          userName: 'admin',
          roleName: 'admin'
        },
        {
          userId: 2,
          roleId: 2,
          userName: '张三',
          roleName: 'cleaner'
        },
        {
          userId: 3,
          roleId: 2,
          userName: '李四',
          roleName: 'cleaner'
        },
        {
          userId: 4,
          roleId: 3,
          userName: '王五',
          roleName: 'user'
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  // 切换标签页
  const handleTabChange = (tab: 'roles' | 'permissions' | 'users') => {
    setActiveTab(tab)
    switch (tab) {
      case 'roles':
        loadRoles()
        break
      case 'permissions':
        loadPermissions()
        break
      case 'users':
        loadUserRoles()
        break
    }
  }

  // 渲染标签栏
  const renderTabs = () => {
    const tabs = [
      { key: 'roles', label: '角色管理', icon: <Shield size={16} /> },
      { key: 'permissions', label: '权限管理', icon: <Key size={16} /> },
      { key: 'users', label: '用户角色', icon: <Users size={16} /> }
    ]

    return (
      <View className="bg-white px-4 py-4 border-b border-gray-100">
        <View className="flex flex-row gap-2">
          {tabs.map(tab => (
            <View
              key={tab.key}
              className={`flex-1 rounded-2xl py-3 px-4 flex flex-row items-center justify-center gap-2 border ${
                activeTab === tab.key
                  ? 'bg-emerald-600 border-emerald-600'
                  : 'bg-white border-gray-200'
              }`}
              onClick={() => handleTabChange(tab.key as any)}
            >
              <View style={{ color: activeTab === tab.key ? '#fff' : '#6B7280' }}>
                {tab.icon}
              </View>
              <Text
                className="text-sm font-bold"
                style={{ color: activeTab === tab.key ? '#fff' : '#6B7280' }}
              >
                {tab.label}
              </Text>
            </View>
          ))}
        </View>
      </View>
    )
  }

  // 渲染角色列表
  const renderRoles = () => {
    if (roles.length === 0) {
      return (
        <View className="flex flex-col items-center justify-center py-16">
          <Shield size={48} color="#E5E7EB" />
          <Text className="block text-base text-gray-500 mt-4">暂无角色</Text>
        </View>
      )
    }

    return (
      <View className="space-y-4 p-4">
        {roles.map(role => (
          <View key={role.id} className="bg-white rounded-2xl p-6 border border-gray-100">
            <View className="flex flex-row items-center justify-between mb-4">
              <View className="flex flex-row items-center">
                <View className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center mr-3">
                  <Shield size={20} color="#10B981" />
                </View>
                <View>
                  <Text className="block text-lg font-bold text-gray-800">{role.name}</Text>
                  <Text className="block text-xs text-gray-500 mt-1">
                    ID: {role.id} | 创建于: {new Date(role.created_at).toLocaleDateString()}
                  </Text>
                </View>
              </View>
              <View className="flex flex-row gap-2">
                <View className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                  <RefreshCw size={16} color="#3B82F6" />
                </View>
                <View className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center">
                  <Trash2 size={16} color="#EF4444" />
                </View>
              </View>
            </View>

            <Text className="block text-sm text-gray-600 mb-4">{role.description}</Text>

            <View className="flex flex-row gap-2">
              <View className="bg-emerald-50 px-3 py-1.5 rounded-xl">
                <Text className="text-xs font-bold text-emerald-600">查看详情</Text>
              </View>
              <View className="bg-gray-100 px-3 py-1.5 rounded-xl">
                <Text className="text-xs font-bold text-gray-600">分配权限</Text>
              </View>
            </View>
          </View>
        ))}

        {/* 添加角色按钮 */}
        <View
          className="bg-white border-2 border-dashed border-gray-300 rounded-2xl p-6 flex flex-col items-center justify-center"
          style={{ borderStyle: 'dashed' }}
        >
          <Plus size={32} color="#9CA3AF" />
          <Text className="block text-sm font-bold text-gray-500 mt-3">添加新角色</Text>
        </View>
      </View>
    )
  }

  // 渲染权限列表
  const renderPermissions = () => {
    if (permissions.length === 0) {
      return (
        <View className="flex flex-col items-center justify-center py-16">
          <Key size={48} color="#E5E7EB" />
          <Text className="block text-base text-gray-500 mt-4">暂无权限</Text>
        </View>
      )
    }

    return (
      <View className="space-y-4 p-4">
        {permissions.map(permission => (
          <View key={permission.id} className="bg-white rounded-2xl p-5 border border-gray-100">
            <View className="flex flex-row items-start justify-between mb-3">
              <View className="flex-1">
                <Text className="block text-base font-bold text-gray-800 mb-1">
                  {permission.name}
                </Text>
                <View className="bg-gray-100 px-2 py-1 rounded-lg inline-block mb-2">
                  <Text className="text-xs font-mono text-gray-600">{permission.code}</Text>
                </View>
                <Text className="block text-xs text-gray-600">{permission.description}</Text>
              </View>
              <View className="flex flex-row gap-2">
                <View className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                  <RefreshCw size={14} color="#3B82F6" />
                </View>
              </View>
            </View>
          </View>
        ))}

        {/* 添加权限按钮 */}
        <View
          className="bg-white border-2 border-dashed border-gray-300 rounded-2xl p-6 flex flex-col items-center justify-center"
          style={{ borderStyle: 'dashed' }}
        >
          <Plus size={32} color="#9CA3AF" />
          <Text className="block text-sm font-bold text-gray-500 mt-3">添加新权限</Text>
        </View>
      </View>
    )
  }

  // 渲染用户角色关联
  const renderUserRoles = () => {
    if (userRoles.length === 0) {
      return (
        <View className="flex flex-col items-center justify-center py-16">
          <Users size={48} color="#E5E7EB" />
          <Text className="block text-base text-gray-500 mt-4">暂无用户角色关联</Text>
        </View>
      )
    }

    return (
      <View className="space-y-4 p-4">
        {userRoles.map(userRole => (
          <View key={`${userRole.userId}-${userRole.roleId}`} className="bg-white rounded-2xl p-5 border border-gray-100">
            <View className="flex flex-row items-center justify-between mb-3">
              <View className="flex flex-row items-center">
                <View className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center mr-3">
                  <User size={20} color="#10B981" />
                </View>
                <View>
                  <Text className="block text-base font-bold text-gray-800">{userRole.userName}</Text>
                  <Text className="block text-xs text-gray-500">用户ID: {userRole.userId}</Text>
                </View>
              </View>
              <View className="flex flex-row gap-2">
                <View className="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center">
                  <Trash2 size={14} color="#EF4444" />
                </View>
              </View>
            </View>

            <View className="bg-gray-50 rounded-xl p-4 flex flex-row items-center justify-between">
              <View className="flex flex-row items-center">
                <Shield size={16} color="#10B981" className="mr-2" />
                <Text className="text-sm text-gray-700">角色:</Text>
                <Text className="text-sm font-bold text-gray-800 ml-2">{userRole.roleName}</Text>
              </View>
              <View className="bg-emerald-100 px-3 py-1.5 rounded-lg">
                <Text className="text-xs font-bold text-emerald-600">已分配</Text>
              </View>
            </View>
          </View>
        ))}

        {/* 添加用户角色关联按钮 */}
        <View
          className="bg-white border-2 border-dashed border-gray-300 rounded-2xl p-6 flex flex-col items-center justify-center"
          style={{ borderStyle: 'dashed' }}
        >
          <Plus size={32} color="#9CA3AF" />
          <Text className="block text-sm font-bold text-gray-500 mt-3">分配用户角色</Text>
        </View>
      </View>
    )
  }

  return (
    <View className="flex flex-col h-full bg-gray-50">
      {/* 标题栏 */}
      <View className="bg-white px-6 py-6 border-b border-gray-100">
        <Text className="block text-2xl font-bold text-gray-800 mb-1">权限管理</Text>
        <Text className="block text-sm text-gray-500">角色管理、权限分配、用户角色关联</Text>
      </View>

      {renderTabs()}

      <ScrollView className="flex-1" scrollY>
        {loading ? (
          <View className="flex flex-col items-center justify-center py-16">
            <Text className="block text-sm text-gray-500">加载中...</Text>
          </View>
        ) : (
          <>
            {activeTab === 'roles' && renderRoles()}
            {activeTab === 'permissions' && renderPermissions()}
            {activeTab === 'users' && renderUserRoles()}
          </>
        )}
      </ScrollView>

      {/* 刷新按钮 */}
      <View
        style={{
          position: 'fixed',
          bottom: 80,
          right: 20,
          zIndex: 100
        }}
      >
        <View
          className="w-14 h-14 bg-white rounded-full shadow-lg flex items-center justify-center border border-gray-100"
          style={{
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
          }}
          onClick={() => {
            if (activeTab === 'roles') loadRoles()
            if (activeTab === 'permissions') loadPermissions()
            if (activeTab === 'users') loadUserRoles()
          }}
        >
          <RefreshCw size={24} color="#10B981" />
        </View>
      </View>
    </View>
  )
}

export default RolesPage
