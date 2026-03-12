import { useLoad } from '@tarojs/taro'
import { View, Text, ScrollView } from '@tarojs/components'
import { useState } from 'react'
import { Network } from '@/network'
import { ClipboardCheck, Clock, Circle, MapPin, Phone, Calendar, RefreshCw, Zap, Users } from 'lucide-react-taro'
import './index.css'

interface Order {
  id: string
  service_name: string
  address: string
  phone: string
  appointment_date: string
  appointment_time: string
  status: string
  staff_id?: string
  assigned_at?: string
  auto_confirmed: boolean
  auto_assigned: boolean
  created_at: string
}

const AdminPage = () => {
  useLoad(() => {
    console.log('Admin page loaded')
    loadOrders()
  })

  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(false)
  const [processing, setProcessing] = useState<string | null>(null)

  // 加载订单列表
  const loadOrders = async () => {
    try {
      setLoading(true)
      const res = await Network.request({
        url: '/api/orders',
        method: 'GET'
      })
      console.log('Orders response:', res.data)
      setOrders(res.data || [])
    } catch (error) {
      console.error('Failed to load orders:', error)
    } finally {
      setLoading(false)
    }
  }

  // 获取状态信息
  const getStatusInfo = (status: string) => {
    const statusMap: Record<
      string,
      { text: string; icon: React.ReactNode; bg: string; color: string; border: string }
    > = {
      pending: {
        text: '待确认',
        icon: <Clock size={14} color="#F59E0B" />,
        bg: 'bg-amber-50',
        color: '#F59E0B',
        border: 'border-amber-200'
      },
      confirmed: {
        text: '已确认',
        icon: <ClipboardCheck size={14} color="#3B82F6" />,
        bg: 'bg-blue-50',
        color: '#3B82F6',
        border: 'border-blue-200'
      },
      completed: {
        text: '已完成',
        icon: <Circle size={14} color="#10B981" strokeWidth={3} />,
        bg: 'bg-emerald-50',
        color: '#10B981',
        border: 'border-emerald-200'
      },
      cancelled: {
        text: '已取消',
        icon: <Circle size={14} color="#9CA3AF" strokeWidth={2} />,
        bg: 'bg-gray-50',
        color: '#9CA3AF',
        border: 'border-gray-200'
      }
    }
    return (
      statusMap[status] || {
        text: status,
        icon: <Clock size={14} color="#9CA3AF" />,
        bg: 'bg-gray-50',
        color: '#9CA3AF',
        border: 'border-gray-200'
      }
    )
  }

  // 自动配置单个订单
  const handleAutoConfigure = async (orderId: string) => {
    try {
      setProcessing(orderId)
      const res = await Network.request({
        url: `/api/orders/${orderId}/auto-configure`,
        method: 'POST'
      })
      console.log('Auto configure response:', res.data)
      alert('自动配置成功！')
      loadOrders()
    } catch (error) {
      console.error('Failed to auto configure:', error)
      alert('自动配置失败')
    } finally {
      setProcessing(null)
    }
  }

  // 批量自动配置
  const handleBatchAutoConfigure = async () => {
    try {
      setProcessing('batch')
      const res = await Network.request({
        url: '/api/orders/batch/auto-configure',
        method: 'POST'
      })
      console.log('Batch auto configure response:', res.data)
      alert(`批量自动配置成功！成功 ${res.data.success} 个，失败 ${res.data.failed} 个`)
      loadOrders()
    } catch (error) {
      console.error('Failed to batch auto configure:', error)
      alert('批量自动配置失败')
    } finally {
      setProcessing(null)
    }
  }

  // 统计信息
  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    confirmed: orders.filter(o => o.status === 'confirmed').length,
    autoConfirmed: orders.filter(o => o.auto_confirmed).length,
    autoAssigned: orders.filter(o => o.auto_assigned).length
  }

  return (
    <View className="flex flex-col h-full bg-gray-50">
      {/* 标题栏 */}
      <View className="bg-white px-6 py-6 border-b border-gray-100">
        <Text className="block text-2xl font-bold text-gray-800 mb-1">订单管理</Text>
        <Text className="block text-sm text-gray-500">自动接单/派单配置</Text>
      </View>

      <ScrollView className="flex-1" scrollY>
        {/* 统计卡片 */}
        <View className="px-4 py-6">
          <View
            className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-sm border border-gray-100 p-6 mb-4"
            style={{
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.02)'
            }}
          >
            <View className="flex flex-row items-center mb-4">
              <Users size={20} color="#10B981" className="mr-2" />
              <Text className="block text-lg font-bold text-gray-800">订单统计</Text>
            </View>
            <View className="grid grid-cols-2 gap-4">
              <View className="bg-emerald-50 rounded-2xl p-4">
                <Text className="block text-2xl font-bold text-emerald-600 mb-1">{stats.total}</Text>
                <Text className="block text-xs text-gray-600">全部订单</Text>
              </View>
              <View className="bg-amber-50 rounded-2xl p-4">
                <Text className="block text-2xl font-bold text-amber-600 mb-1">{stats.pending}</Text>
                <Text className="block text-xs text-gray-600">待确认</Text>
              </View>
              <View className="bg-blue-50 rounded-2xl p-4">
                <Text className="block text-2xl font-bold text-blue-600 mb-1">{stats.confirmed}</Text>
                <Text className="block text-xs text-gray-600">已确认</Text>
              </View>
              <View className="bg-purple-50 rounded-2xl p-4">
                <Text className="block text-2xl font-bold text-purple-600 mb-1">{stats.autoAssigned}</Text>
                <Text className="block text-xs text-gray-600">自动派单</Text>
              </View>
            </View>
          </View>

          {/* 批量操作 */}
          <View
            className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-sm border border-gray-100 p-6 mb-4"
            style={{
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.02)'
            }}
          >
            <View className="flex flex-row items-center mb-4">
              <Zap size={20} color="#10B981" className="mr-2" />
              <Text className="block text-lg font-bold text-gray-800">批量操作</Text>
            </View>
            <View
              className="bg-gradient-to-r from-emerald-600 to-emerald-500 rounded-2xl py-4 px-6 text-center"
              style={{
                boxShadow: '0 4px 12px rgba(16, 185, 129, 0.25)'
              }}
              onClick={handleBatchAutoConfigure}
            >
              <Text className="block text-base font-bold text-white">
                {processing === 'batch' ? '处理中...' : '批量自动配置所有待确认订单'}
              </Text>
            </View>
          </View>

          {/* 订单列表 */}
          <View className="space-y-4">
            <Text className="block text-base font-bold text-gray-800 px-1">
              订单列表 ({orders.length})
            </Text>
            {loading ? (
              <View className="flex flex-col items-center justify-center py-16">
                <Text className="block text-sm text-gray-500">加载中...</Text>
              </View>
            ) : orders.length === 0 ? (
              <View className="flex flex-col items-center justify-center py-16">
                <ClipboardCheck size={48} color="#E5E7EB" />
                <Text className="block text-base text-gray-500 mt-4">暂无订单</Text>
              </View>
            ) : (
              orders.map(order => {
                const statusInfo = getStatusInfo(order.status)
                return (
                  <View
                    key={order.id}
                    className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-sm border border-gray-100 overflow-hidden"
                    style={{
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.02)'
                    }}
                  >
                    {/* 订单头部 */}
                    <View className="px-6 py-5 border-b border-gray-50">
                      <View className="flex flex-row items-center justify-between">
                        <Text className="block text-xl font-bold text-gray-800">
                          {order.service_name}
                        </Text>
                        <View
                          className={`${statusInfo.bg} ${statusInfo.border} border px-3.5 py-2 rounded-2xl flex items-center gap-2`}
                          style={{
                            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.02)'
                          }}
                        >
                          {statusInfo.icon}
                          <Text
                            className="block text-xs font-bold"
                            style={{ color: statusInfo.color }}
                          >
                            {statusInfo.text}
                          </Text>
                        </View>
                      </View>
                    </View>

                    {/* 订单详情 */}
                    <View className="px-6 py-5 space-y-3">
                      <View className="flex flex-row items-start">
                        <View className="w-8 h-8 bg-emerald-50 rounded-xl flex items-center justify-center mr-3 flex-shrink-0 mt-0.5">
                          <Calendar size={16} color="#10B981" />
                        </View>
                        <View className="flex-1">
                          <Text className="block text-xs text-gray-500 mb-1 font-medium uppercase tracking-wide">
                            预约时间
                          </Text>
                          <Text className="block text-sm text-gray-800 font-medium">
                            {order.appointment_date} {order.appointment_time}
                          </Text>
                        </View>
                      </View>

                      <View className="flex flex-row items-start">
                        <View className="w-8 h-8 bg-emerald-50 rounded-xl flex items-center justify-center mr-3 flex-shrink-0 mt-0.5">
                          <MapPin size={16} color="#10B981" />
                        </View>
                        <View className="flex-1">
                          <Text className="block text-xs text-gray-500 mb-1 font-medium uppercase tracking-wide">
                            服务地址
                          </Text>
                          <Text className="block text-sm text-gray-800 font-medium leading-relaxed">
                            {order.address}
                          </Text>
                        </View>
                      </View>

                      <View className="flex flex-row items-start">
                        <View className="w-8 h-8 bg-emerald-50 rounded-xl flex items-center justify-center mr-3 flex-shrink-0 mt-0.5">
                          <Phone size={16} color="#10B981" />
                        </View>
                        <View className="flex-1">
                          <Text className="block text-xs text-gray-500 mb-1 font-medium uppercase tracking-wide">
                            联系电话
                          </Text>
                          <Text className="block text-sm text-gray-800 font-medium">
                            {order.phone}
                          </Text>
                        </View>
                      </View>

                      {/* 自动配置标记 */}
                      {order.auto_confirmed && (
                        <View className="flex flex-row items-center">
                          <View className="w-8 h-8 bg-emerald-100 rounded-xl flex items-center justify-center mr-3 flex-shrink-0">
                            <Zap size={16} color="#10B981" />
                          </View>
                          <View className="flex-1">
                            <Text className="block text-xs text-gray-500 mb-1 font-medium uppercase tracking-wide">
                              自动配置
                            </Text>
                            <Text className="block text-sm text-emerald-600 font-semibold">
                              {order.auto_assigned ? '已自动派单' : '已自动接单'}
                            </Text>
                          </View>
                        </View>
                      )}
                    </View>

                    {/* 操作按钮 */}
                    {order.status === 'pending' && (
                      <View className="px-6 py-4 bg-gray-50/80 border-t border-gray-100">
                        <View
                          className="bg-gradient-to-r from-emerald-600 to-emerald-500 rounded-2xl py-3.5 px-6 text-center"
                          style={{
                            boxShadow: '0 4px 12px rgba(16, 185, 129, 0.25)'
                          }}
                          onClick={() => handleAutoConfigure(order.id)}
                        >
                          <Text className="block text-sm font-bold text-white">
                            {processing === order.id ? '处理中...' : '自动配置订单'}
                          </Text>
                        </View>
                      </View>
                    )}
                  </View>
                )
              })
            )}
          </View>
        </View>

        {/* 底部留白 */}
        <View className="h-8" />
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
          onClick={loadOrders}
        >
          <RefreshCw size={24} color="#10B981" />
        </View>
      </View>
    </View>
  )
}

export default AdminPage
