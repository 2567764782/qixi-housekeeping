import { View, Text, ScrollView } from '@tarojs/components'
import Taro, { useLoad, useDidShow } from '@tarojs/taro'
import { useState } from 'react'
import { Network } from '@/network'
import { ClipboardCheck, Clock, Circle, MapPin, Phone, Calendar } from 'lucide-react-taro'
import './index.css'

interface Order {
  id: string
  service_name: string
  address: string
  phone: string
  appointment_date: string
  appointment_time: string
  status: string
  remark?: string
  created_at: string
}

const OrdersPage = () => {
  useLoad(() => {
    loadOrders()
  })

  useDidShow(() => {
    loadOrders()
  })

  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(false)

  // 加载订单列表
  const loadOrders = async () => {
    try {
      setLoading(true)
      const res = await Network.request({
        url: '/api/orders/user/demo-user-001',
        method: 'GET'
      })
      // 处理不同的响应格式
      let ordersData: Order[] = []
      if (res.data && res.data.data && Array.isArray(res.data.data)) {
        // 如果后端返回 { data: [...] } 格式
        ordersData = res.data.data as Order[]
      } else if (Array.isArray(res.data)) {
        // 如果后端直接返回数组
        ordersData = res.data as Order[]
      }
      setOrders(ordersData || [])
    } catch (error) {
      console.error('Failed to load orders:', error)
      setOrders([]) // 出错时设置为空数组
    } finally {
      setLoading(false)
    }
  }

  // 获取状态信息
  const getStatusInfo = (status: string) => {
    const statusMap: Record<
      string,
      { text: string; icon: React.ReactNode; bg: string; color: string }
    > = {
      pending: {
        text: '待确认',
        icon: <Clock size={14} />,
        bg: 'bg-amber-100',
        color: '#F59E0B'
      },
      confirmed: {
        text: '已确认',
        icon: <ClipboardCheck size={14} />,
        bg: 'bg-blue-100',
        color: '#3B82F6'
      },
      completed: {
        text: '已完成',
        icon: <Circle size={14} strokeWidth={3} />,
        bg: 'bg-emerald-100',
        color: '#10B981'
      },
      cancelled: {
        text: '已取消',
        icon: <Circle size={14} strokeWidth={2} />,
        bg: 'bg-gray-100',
        color: '#9CA3AF'
      }
    }
    return (
      statusMap[status] || {
        text: status,
        icon: <Clock size={14} />,
        bg: 'bg-gray-100',
        color: '#9CA3AF'
      }
    )
  }

  return (
    <View className="flex flex-col h-full bg-gray-50">
      <ScrollView className="flex-1" scrollY>
        {/* 标题栏 */}
        <View className="bg-white px-5 py-5 border-b border-gray-100">
          <Text className="block text-2xl font-bold text-gray-800">我的订单</Text>
        </View>

        <View className="px-4 py-5">
          {loading ? (
            <View className="flex flex-col items-center justify-center py-16">
              <Text className="block text-sm text-gray-500">加载中...</Text>
            </View>
          ) : orders.length === 0 ? (
            <View className="bg-white rounded-2xl border border-gray-100 p-8">
              <View className="flex flex-col items-center">
                <View className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
                  <ClipboardCheck size={36} color="#D1D5DB" />
                </View>
                <Text className="block text-base text-gray-700 mb-1 font-medium">暂无订单</Text>
                <Text className="block text-sm text-gray-400">快去预约服务吧</Text>
              </View>
            </View>
          ) : (
            <View className="space-y-3">
              {orders.map(order => {
                const statusInfo = getStatusInfo(order.status)
                return (
                  <View
                    key={order.id}
                    className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
                  >
                    {/* 订单头部 */}
                    <View className="px-5 py-4 border-b border-gray-50">
                      <View className="flex flex-row items-center justify-between">
                        <Text className="block text-base font-bold text-gray-800">
                          {order.service_name}
                        </Text>
                        <View
                          className={`${statusInfo.bg} px-3 py-1.5 rounded-full flex items-center gap-1.5`}
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
                    <View className="px-5 py-4 space-y-3">
                      {/* 预约时间 */}
                      <View className="flex flex-row items-start">
                        <View className="w-8 h-8 bg-emerald-50 rounded-xl flex items-center justify-center mr-3 flex-shrink-0">
                          <Calendar size={16} color="#10B981" />
                        </View>
                        <View className="flex-1">
                          <Text className="block text-xs text-gray-400 mb-1 font-medium">
                            预约时间
                          </Text>
                          <Text className="block text-sm text-gray-800 font-medium">
                            {order.appointment_date}
                          </Text>
                          <Text className="block text-xs text-gray-500 mt-0.5">
                            {order.appointment_time}
                          </Text>
                        </View>
                      </View>

                      {/* 服务地址 */}
                      <View className="flex flex-row items-start">
                        <View className="w-8 h-8 bg-emerald-50 rounded-xl flex items-center justify-center mr-3 flex-shrink-0">
                          <MapPin size={16} color="#10B981" />
                        </View>
                        <View className="flex-1">
                          <Text className="block text-xs text-gray-400 mb-1 font-medium">
                            服务地址
                          </Text>
                          <Text className="block text-sm text-gray-800 font-medium leading-relaxed">
                            {order.address}
                          </Text>
                        </View>
                      </View>

                      {/* 联系电话 */}
                      <View className="flex flex-row items-start">
                        <View className="w-8 h-8 bg-emerald-50 rounded-xl flex items-center justify-center mr-3 flex-shrink-0">
                          <Phone size={16} color="#10B981" />
                        </View>
                        <View className="flex-1">
                          <Text className="block text-xs text-gray-400 mb-1 font-medium">
                            联系电话
                          </Text>
                          <Text className="block text-sm text-gray-800 font-medium">
                            {order.phone}
                          </Text>
                        </View>
                      </View>
                    </View>

                    {/* 底部操作栏 */}
                    <View className="px-5 py-3 bg-gray-50 flex flex-row items-center justify-end gap-3">
                      <View
                        className="bg-white border border-gray-200 px-4 py-2 rounded-xl"
                        onClick={() => Taro.showToast({ title: '联系客服', icon: 'none' })}
                      >
                        <Text className="block text-sm text-gray-600">联系客服</Text>
                      </View>
                      <View
                        className="bg-emerald-500 px-4 py-2 rounded-xl"
                        onClick={() => Taro.showToast({ title: '查看详情', icon: 'none' })}
                      >
                        <Text className="block text-sm text-white font-medium">查看详情</Text>
                      </View>
                    </View>
                  </View>
                )
              })}
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  )
}

export default OrdersPage
