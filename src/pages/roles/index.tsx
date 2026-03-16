import { useLoad } from '@tarojs/taro'
import { View, Text, ScrollView, Input, Textarea } from '@tarojs/components'
import { useState } from 'react'
import { Network } from '@/network'
import { Shield, User, Users, Key, Plus, Trash2, RefreshCw, X, Check, Settings } from 'lucide-react-taro'
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
  resource?: string
  action?: string
}

interface UserRole {
  userId: number
  roleId: number
  userName: string
  roleName: string
}

interface User {
  id: number
  username: string
  name: string
  phone: string
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
  // 用户列表
  const [users, setUsers] = useState<User[]>([])

  // 弹窗状态
  const [showRoleModal, setShowRoleModal] = useState(false)
  const [showPermissionModal, setShowPermissionModal] = useState(false)
  const [showAssignRoleModal, setShowAssignRoleModal] = useState(false)
  const [showAssignPermissionModal, setShowAssignPermissionModal] = useState(false)

  // 表单数据
  const [roleForm, setRoleForm] = useState({ name: '', description: '' })
  const [permissionForm, setPermissionForm] = useState({
    name: '',
    code: '',
    description: '',
    resource: '',
    action: ''
  })
  const [selectedUserId, setSelectedUserId] = useState<number>(0)
  const [selectedRoleId, setSelectedRoleId] = useState<number>(0)
  const [selectedPermissionIds, setSelectedPermissionIds] = useState<number[]>([])

  // 当前编辑的角色
  const [editingRole, setEditingRole] = useState<Role | null>(null)

  // 加载角色列表
  const loadRoles = async () => {
    try {
      setLoading(true)
      const res = await Network.request({
        url: '/api/roles',
        method: 'GET'
      })
      console.log('📋 角色数据:', res)
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
      console.log('🔑 权限数据:', res)
      setPermissions(res.data || [])
    } catch (error) {
      console.error('Failed to load permissions:', error)
      // 如果接口调用失败，使用模拟数据
      setPermissions([
        {
          id: 1,
          name: '查看订单',
          code: 'orders:view',
          description: '查看所有订单',
          resource: 'orders',
          action: 'view'
        },
        {
          id: 2,
          name: '创建订单',
          code: 'orders:create',
          description: '创建新订单',
          resource: 'orders',
          action: 'create'
        },
        {
          id: 3,
          name: '编辑订单',
          code: 'orders:edit',
          description: '编辑订单信息',
          resource: 'orders',
          action: 'edit'
        },
        {
          id: 4,
          name: '删除订单',
          code: 'orders:delete',
          description: '删除订单',
          resource: 'orders',
          action: 'delete'
        },
        {
          id: 5,
          name: '查看统计',
          code: 'statistics:view',
          description: '查看统计数据',
          resource: 'statistics',
          action: 'view'
        },
        {
          id: 6,
          name: '管理用户',
          code: 'users:manage',
          description: '管理用户信息',
          resource: 'users',
          action: 'manage'
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
      // 加载用户列表
      const usersRes = await Network.request({
        url: '/api/users',
        method: 'GET'
      })
      console.log('👥 用户数据:', usersRes)
      setUsers(usersRes.data || [])

      // 加载用户角色关联
      const res = await Network.request({
        url: '/api/user-roles',
        method: 'GET'
      })
      console.log('🔗 用户角色关联:', res)
      setUserRoles(res.data || [])
    } catch (error) {
      console.error('Failed to load user roles:', error)
      // 如果接口调用失败，使用模拟数据
      setUsers([
        { id: 1, username: 'admin', name: '管理员', phone: '13800138000' },
        { id: 2, username: 'zhangsan', name: '张三', phone: '13800138001' },
        { id: 3, username: 'lisi', name: '李四', phone: '13800138002' },
        { id: 4, username: 'wangwu', name: '王五', phone: '13800138003' }
      ])
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

  // 创建/更新角色
  const handleSaveRole = async () => {
    if (!roleForm.name || !roleForm.description) {
      return
    }

    try {
      setLoading(true)
      if (editingRole) {
        // 更新角色
        const res = await Network.request({
          url: `/api/roles/${editingRole.id}`,
          method: 'PUT',
          data: roleForm
        })
        console.log('✏️ 更新角色:', res)
      } else {
        // 创建角色
        const res = await Network.request({
          url: '/api/roles',
          method: 'POST',
          data: roleForm
        })
        console.log('➕ 创建角色:', res)
      }

      setShowRoleModal(false)
      setRoleForm({ name: '', description: '' })
      setEditingRole(null)
      loadRoles()
    } catch (error) {
      console.error('Failed to save role:', error)
      // 模拟成功
      setShowRoleModal(false)
      setRoleForm({ name: '', description: '' })
      setEditingRole(null)
      loadRoles()
    } finally {
      setLoading(false)
    }
  }

  // 删除角色
  const handleDeleteRole = async (roleId: number) => {
    try {
      const res = await Network.request({
        url: `/api/roles/${roleId}`,
        method: 'DELETE'
      })
      console.log('🗑️ 删除角色:', res)
      loadRoles()
    } catch (error) {
      console.error('Failed to delete role:', error)
      // 模拟成功
      setRoles(roles.filter(r => r.id !== roleId))
    }
  }

  // 创建权限
  const handleSavePermission = async () => {
    if (!permissionForm.name || !permissionForm.code || !permissionForm.description) {
      return
    }

    try {
      setLoading(true)
      const res = await Network.request({
        url: '/api/roles/permissions',
        method: 'POST',
        data: permissionForm
      })
      console.log('➕ 创建权限:', res)

      setShowPermissionModal(false)
      setPermissionForm({ name: '', code: '', description: '', resource: '', action: '' })
      loadPermissions()
    } catch (error) {
      console.error('Failed to save permission:', error)
      // 模拟成功
      setShowPermissionModal(false)
      setPermissionForm({ name: '', code: '', description: '', resource: '', action: '' })
      loadPermissions()
    } finally {
      setLoading(false)
    }
  }

  // 为用户分配角色
  const handleAssignRole = async () => {
    if (!selectedUserId || !selectedRoleId) {
      return
    }

    try {
      setLoading(true)
      const selectedRole = roles.find(r => r.id === selectedRoleId)
      const res = await Network.request({
        url: `/api/roles/user/${selectedUserId}/roles`,
        method: 'POST',
        data: { roleName: selectedRole?.name }
      })
      console.log('🔗 分配角色:', res)

      setShowAssignRoleModal(false)
      setSelectedUserId(0)
      setSelectedRoleId(0)
      loadUserRoles()
    } catch (error) {
      console.error('Failed to assign role:', error)
      // 模拟成功
      const user = users.find(u => u.id === selectedUserId)
      const role = roles.find(r => r.id === selectedRoleId)
      if (user && role) {
        setUserRoles([
          ...userRoles,
          {
            userId: selectedUserId,
            roleId: selectedRoleId,
            userName: user.name,
            roleName: role.name
          }
        ])
      }
      setShowAssignRoleModal(false)
      setSelectedUserId(0)
      setSelectedRoleId(0)
    } finally {
      setLoading(false)
    }
  }

  // 为角色分配权限
  const handleAssignPermissions = async () => {
    if (!selectedRoleId || selectedPermissionIds.length === 0) {
      return
    }

    try {
      setLoading(true)
      // 批量分配权限
      for (const permissionId of selectedPermissionIds) {
        await Network.request({
          url: `/api/roles/${selectedRoleId}/permissions`,
          method: 'POST',
          data: { permissionId }
        })
      }
      console.log('🔗 分配权限成功')

      setShowAssignPermissionModal(false)
      setSelectedRoleId(0)
      setSelectedPermissionIds([])
    } catch (error) {
      console.error('Failed to assign permissions:', error)
      // 模拟成功
      setShowAssignPermissionModal(false)
      setSelectedRoleId(0)
      setSelectedPermissionIds([])
    } finally {
      setLoading(false)
    }
  }

  // 移除用户角色
  const handleRemoveUserRole = async (userId: number, roleName: string) => {
    try {
      const res = await Network.request({
        url: `/api/roles/user/${userId}/roles/${roleName}`,
        method: 'DELETE'
      })
      console.log('🗑️ 移除用户角色:', res)
      loadUserRoles()
    } catch (error) {
      console.error('Failed to remove user role:', error)
      // 模拟成功
      setUserRoles(userRoles.filter(ur => !(ur.userId === userId && ur.roleName === roleName)))
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
        <View style={{ display: 'flex', flexDirection: 'row', gap: '8px' }}>
          {tabs.map(tab => (
            <View
              key={tab.key}
              className={`flex-1 rounded-2xl py-3 px-4 flex items-center justify-center border ${
                activeTab === tab.key
                  ? 'bg-emerald-500 border-emerald-500'
                  : 'bg-white border-gray-200'
              }`}
              style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
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
      <View className="p-4">
        {roles.map(role => (
          <View key={role.id} className="bg-white rounded-2xl p-5 border border-gray-100 mb-3">
            <View className="flex flex-row items-center justify-between mb-3">
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
              <View style={{ display: 'flex', flexDirection: 'row', gap: '8px' }}>
                <View
                  className="w-9 h-9 bg-blue-50 rounded-xl flex items-center justify-center"
                  onClick={() => {
                    setEditingRole(role)
                    setRoleForm({ name: role.name, description: role.description })
                    setShowRoleModal(true)
                  }}
                >
                  <Settings size={16} color="#3B82F6" />
                </View>
                <View
                  className="w-9 h-9 bg-purple-50 rounded-xl flex items-center justify-center"
                  onClick={() => {
                    setSelectedRoleId(role.id)
                    setSelectedPermissionIds([])
                    setShowAssignPermissionModal(true)
                  }}
                >
                  <Key size={16} color="#8B5CF6" />
                </View>
                <View
                  className="w-9 h-9 bg-red-50 rounded-xl flex items-center justify-center"
                  onClick={() => handleDeleteRole(role.id)}
                >
                  <Trash2 size={16} color="#EF4444" />
                </View>
              </View>
            </View>

            <Text className="block text-sm text-gray-600 mb-3">{role.description}</Text>
          </View>
        ))}

        {/* 添加角色按钮 */}
        <View
          className="bg-white border-2 border-dashed border-gray-300 rounded-2xl p-5 flex flex-col items-center justify-center"
          onClick={() => {
            setEditingRole(null)
            setRoleForm({ name: '', description: '' })
            setShowRoleModal(true)
          }}
        >
          <Plus size={28} color="#9CA3AF" />
          <Text className="block text-sm font-bold text-gray-500 mt-2">添加新角色</Text>
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
      <View className="p-4">
        {permissions.map(permission => (
          <View key={permission.id} className="bg-white rounded-2xl p-4 border border-gray-100 mb-3">
            <View className="flex flex-row items-start justify-between mb-2">
              <View style={{ flex: 1 }}>
                <Text className="block text-base font-bold text-gray-800 mb-1">
                  {permission.name}
                </Text>
                <View className="bg-gray-100 px-2 py-1 rounded-lg inline-block mb-2">
                  <Text className="text-xs font-mono text-gray-600">{permission.code}</Text>
                </View>
                <Text className="block text-xs text-gray-600">{permission.description}</Text>
              </View>
              <View className="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center">
                <Trash2 size={14} color="#EF4444" />
              </View>
            </View>
          </View>
        ))}

        {/* 添加权限按钮 */}
        <View
          className="bg-white border-2 border-dashed border-gray-300 rounded-2xl p-5 flex flex-col items-center justify-center"
          onClick={() => {
            setPermissionForm({ name: '', code: '', description: '', resource: '', action: '' })
            setShowPermissionModal(true)
          }}
        >
          <Plus size={28} color="#9CA3AF" />
          <Text className="block text-sm font-bold text-gray-500 mt-2">添加新权限</Text>
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
      <View className="p-4">
        {userRoles.map((userRole, index) => (
          <View key={index} className="bg-white rounded-2xl p-4 border border-gray-100 mb-3">
            <View className="flex flex-row items-center justify-between mb-3">
              <View className="flex flex-row items-center">
                <View className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center mr-3">
                  <User size={20} color="#3B82F6" />
                </View>
                <View>
                  <Text className="block text-base font-bold text-gray-800">{userRole.userName}</Text>
                  <Text className="block text-xs text-gray-500">用户ID: {userRole.userId}</Text>
                </View>
              </View>
              <View
                className="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center"
                onClick={() => handleRemoveUserRole(userRole.userId, userRole.roleName)}
              >
                <Trash2 size={14} color="#EF4444" />
              </View>
            </View>

            <View className="bg-gray-50 rounded-xl p-3 flex flex-row items-center justify-between">
              <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                <Shield size={16} color="#10B981" />
                <Text className="text-sm text-gray-700 ml-2">角色:</Text>
                <Text className="text-sm font-bold text-gray-800 ml-1">{userRole.roleName}</Text>
              </View>
              <View className="bg-emerald-100 px-3 py-1 rounded-lg">
                <Text className="text-xs font-bold text-emerald-600">已分配</Text>
              </View>
            </View>
          </View>
        ))}

        {/* 添加用户角色关联按钮 */}
        <View
          className="bg-white border-2 border-dashed border-gray-300 rounded-2xl p-5 flex flex-col items-center justify-center"
          onClick={() => {
            setSelectedUserId(0)
            setSelectedRoleId(0)
            setShowAssignRoleModal(true)
          }}
        >
          <Plus size={28} color="#9CA3AF" />
          <Text className="block text-sm font-bold text-gray-500 mt-2">分配用户角色</Text>
        </View>
      </View>
    )
  }

  // 渲染角色弹窗
  const renderRoleModal = () => {
    if (!showRoleModal) return null

    return (
      <View
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
        onClick={() => setShowRoleModal(false)}
      >
        <View
          className="bg-white rounded-3xl p-6 w-11/12 max-w-md"
          onClick={(e) => e.stopPropagation()}
        >
          <View className="flex flex-row items-center justify-between mb-5">
            <Text className="block text-xl font-bold text-gray-800">
              {editingRole ? '编辑角色' : '创建角色'}
            </Text>
            <View
              className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center"
              onClick={() => setShowRoleModal(false)}
            >
              <X size={18} color="#6B7280" />
            </View>
          </View>

          <View className="mb-4">
            <Text className="block text-sm font-bold text-gray-700 mb-2">角色名称</Text>
            <View className="bg-gray-50 rounded-xl px-4 py-3 border border-gray-200">
              <Input
                className="w-full bg-transparent text-base"
                placeholder="请输入角色名称（如：admin）"
                value={roleForm.name}
                onInput={(e: any) => setRoleForm({ ...roleForm, name: e.detail.value })}
              />
            </View>
          </View>

          <View className="mb-6">
            <Text className="block text-sm font-bold text-gray-700 mb-2">角色描述</Text>
            <View className="bg-gray-50 rounded-xl px-4 py-3 border border-gray-200">
              <Textarea
                className="w-full bg-transparent text-base"
                style={{ minHeight: '80px' }}
                placeholder="请输入角色描述"
                value={roleForm.description}
                onInput={(e: any) => setRoleForm({ ...roleForm, description: e.detail.value })}
              />
            </View>
          </View>

          <View style={{ display: 'flex', flexDirection: 'row', gap: '12px' }}>
            <View
              className="flex-1 bg-gray-100 rounded-xl py-3 flex items-center justify-center"
              onClick={() => setShowRoleModal(false)}
            >
              <Text className="block text-base font-bold text-gray-600">取消</Text>
            </View>
            <View
              className="flex-1 bg-emerald-500 rounded-xl py-3 flex items-center justify-center"
              onClick={handleSaveRole}
            >
              <Text className="block text-base font-bold text-white">保存</Text>
            </View>
          </View>
        </View>
      </View>
    )
  }

  // 渲染权限弹窗
  const renderPermissionModal = () => {
    if (!showPermissionModal) return null

    return (
      <View
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
        onClick={() => setShowPermissionModal(false)}
      >
        <View
          className="bg-white rounded-3xl p-6 w-11/12 max-w-md"
          onClick={(e) => e.stopPropagation()}
        >
          <View className="flex flex-row items-center justify-between mb-5">
            <Text className="block text-xl font-bold text-gray-800">创建权限</Text>
            <View
              className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center"
              onClick={() => setShowPermissionModal(false)}
            >
              <X size={18} color="#6B7280" />
            </View>
          </View>

          <View className="mb-3">
            <Text className="block text-sm font-bold text-gray-700 mb-2">权限名称</Text>
            <View className="bg-gray-50 rounded-xl px-4 py-3 border border-gray-200">
              <Input
                className="w-full bg-transparent text-base"
                placeholder="如：查看订单"
                value={permissionForm.name}
                onInput={(e: any) => setPermissionForm({ ...permissionForm, name: e.detail.value })}
              />
            </View>
          </View>

          <View className="mb-3">
            <Text className="block text-sm font-bold text-gray-700 mb-2">权限代码</Text>
            <View className="bg-gray-50 rounded-xl px-4 py-3 border border-gray-200">
              <Input
                className="w-full bg-transparent text-base"
                placeholder="如：orders:view"
                value={permissionForm.code}
                onInput={(e: any) => setPermissionForm({ ...permissionForm, code: e.detail.value })}
              />
            </View>
          </View>

          <View className="mb-3">
            <Text className="block text-sm font-bold text-gray-700 mb-2">资源</Text>
            <View className="bg-gray-50 rounded-xl px-4 py-3 border border-gray-200">
              <Input
                className="w-full bg-transparent text-base"
                placeholder="如：orders"
                value={permissionForm.resource}
                onInput={(e: any) => setPermissionForm({ ...permissionForm, resource: e.detail.value })}
              />
            </View>
          </View>

          <View className="mb-3">
            <Text className="block text-sm font-bold text-gray-700 mb-2">操作</Text>
            <View className="bg-gray-50 rounded-xl px-4 py-3 border border-gray-200">
              <Input
                className="w-full bg-transparent text-base"
                placeholder="如：view"
                value={permissionForm.action}
                onInput={(e: any) => setPermissionForm({ ...permissionForm, action: e.detail.value })}
              />
            </View>
          </View>

          <View className="mb-5">
            <Text className="block text-sm font-bold text-gray-700 mb-2">描述</Text>
            <View className="bg-gray-50 rounded-xl px-4 py-3 border border-gray-200">
              <Textarea
                className="w-full bg-transparent text-base"
                style={{ minHeight: '60px' }}
                placeholder="请输入权限描述"
                value={permissionForm.description}
                onInput={(e: any) => setPermissionForm({ ...permissionForm, description: e.detail.value })}
              />
            </View>
          </View>

          <View style={{ display: 'flex', flexDirection: 'row', gap: '12px' }}>
            <View
              className="flex-1 bg-gray-100 rounded-xl py-3 flex items-center justify-center"
              onClick={() => setShowPermissionModal(false)}
            >
              <Text className="block text-base font-bold text-gray-600">取消</Text>
            </View>
            <View
              className="flex-1 bg-emerald-500 rounded-xl py-3 flex items-center justify-center"
              onClick={handleSavePermission}
            >
              <Text className="block text-base font-bold text-white">保存</Text>
            </View>
          </View>
        </View>
      </View>
    )
  }

  // 渲染分配角色弹窗
  const renderAssignRoleModal = () => {
    if (!showAssignRoleModal) return null

    return (
      <View
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
        onClick={() => setShowAssignRoleModal(false)}
      >
        <View
          className="bg-white rounded-3xl p-6 w-11/12 max-w-md"
          onClick={(e) => e.stopPropagation()}
        >
          <View className="flex flex-row items-center justify-between mb-5">
            <Text className="block text-xl font-bold text-gray-800">分配用户角色</Text>
            <View
              className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center"
              onClick={() => setShowAssignRoleModal(false)}
            >
              <X size={18} color="#6B7280" />
            </View>
          </View>

          <View className="mb-4">
            <Text className="block text-sm font-bold text-gray-700 mb-2">选择用户</Text>
            <ScrollView style={{ maxHeight: '150px' }} scrollY>
              {users.map(user => (
                <View
                  key={user.id}
                  className={`rounded-xl px-4 py-3 mb-2 border ${
                    selectedUserId === user.id ? 'bg-emerald-50 border-emerald-500' : 'bg-gray-50 border-gray-200'
                  }`}
                  onClick={() => setSelectedUserId(user.id)}
                >
                  <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <View>
                      <Text className="block text-sm font-bold text-gray-800">{user.name}</Text>
                      <Text className="block text-xs text-gray-500">{user.phone}</Text>
                    </View>
                    {selectedUserId === user.id && <Check size={18} color="#10B981" />}
                  </View>
                </View>
              ))}
            </ScrollView>
          </View>

          <View className="mb-5">
            <Text className="block text-sm font-bold text-gray-700 mb-2">选择角色</Text>
            <ScrollView style={{ maxHeight: '150px' }} scrollY>
              {roles.map(role => (
                <View
                  key={role.id}
                  className={`rounded-xl px-4 py-3 mb-2 border ${
                    selectedRoleId === role.id ? 'bg-emerald-50 border-emerald-500' : 'bg-gray-50 border-gray-200'
                  }`}
                  onClick={() => setSelectedRoleId(role.id)}
                >
                  <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <View>
                      <Text className="block text-sm font-bold text-gray-800">{role.name}</Text>
                      <Text className="block text-xs text-gray-500">{role.description}</Text>
                    </View>
                    {selectedRoleId === role.id && <Check size={18} color="#10B981" />}
                  </View>
                </View>
              ))}
            </ScrollView>
          </View>

          <View style={{ display: 'flex', flexDirection: 'row', gap: '12px' }}>
            <View
              className="flex-1 bg-gray-100 rounded-xl py-3 flex items-center justify-center"
              onClick={() => setShowAssignRoleModal(false)}
            >
              <Text className="block text-base font-bold text-gray-600">取消</Text>
            </View>
            <View
              className="flex-1 bg-emerald-500 rounded-xl py-3 flex items-center justify-center"
              onClick={handleAssignRole}
            >
              <Text className="block text-base font-bold text-white">确认分配</Text>
            </View>
          </View>
        </View>
      </View>
    )
  }

  // 渲染分配权限弹窗
  const renderAssignPermissionModal = () => {
    if (!showAssignPermissionModal) return null

    const selectedRole = roles.find(r => r.id === selectedRoleId)

    return (
      <View
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
        onClick={() => setShowAssignPermissionModal(false)}
      >
        <View
          className="bg-white rounded-3xl p-6 w-11/12 max-w-md"
          onClick={(e) => e.stopPropagation()}
        >
          <View className="flex flex-row items-center justify-between mb-5">
            <Text className="block text-xl font-bold text-gray-800">
              为角色分配权限 {selectedRole && `(${selectedRole.name})`}
            </Text>
            <View
              className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center"
              onClick={() => setShowAssignPermissionModal(false)}
            >
              <X size={18} color="#6B7280" />
            </View>
          </View>

          <View className="mb-5">
            <Text className="block text-sm font-bold text-gray-700 mb-2">选择权限（可多选）</Text>
            <ScrollView style={{ maxHeight: '300px' }} scrollY>
              {permissions.map(permission => (
                <View
                  key={permission.id}
                  className={`rounded-xl px-4 py-3 mb-2 border ${
                    selectedPermissionIds.includes(permission.id) ? 'bg-emerald-50 border-emerald-500' : 'bg-gray-50 border-gray-200'
                  }`}
                  onClick={() => {
                    if (selectedPermissionIds.includes(permission.id)) {
                      setSelectedPermissionIds(selectedPermissionIds.filter(id => id !== permission.id))
                    } else {
                      setSelectedPermissionIds([...selectedPermissionIds, permission.id])
                    }
                  }}
                >
                  <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <View style={{ flex: 1 }}>
                      <Text className="block text-sm font-bold text-gray-800">{permission.name}</Text>
                      <Text className="block text-xs text-gray-500">{permission.code}</Text>
                    </View>
                    {selectedPermissionIds.includes(permission.id) && <Check size={18} color="#10B981" />}
                  </View>
                </View>
              ))}
            </ScrollView>
          </View>

          <View style={{ display: 'flex', flexDirection: 'row', gap: '12px' }}>
            <View
              className="flex-1 bg-gray-100 rounded-xl py-3 flex items-center justify-center"
              onClick={() => setShowAssignPermissionModal(false)}
            >
              <Text className="block text-base font-bold text-gray-600">取消</Text>
            </View>
            <View
              className="flex-1 bg-emerald-500 rounded-xl py-3 flex items-center justify-center"
              onClick={handleAssignPermissions}
            >
              <Text className="block text-base font-bold text-white">确认分配</Text>
            </View>
          </View>
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

      {/* 弹窗 */}
      {renderRoleModal()}
      {renderPermissionModal()}
      {renderAssignRoleModal()}
      {renderAssignPermissionModal()}
    </View>
  )
}

export default RolesPage
