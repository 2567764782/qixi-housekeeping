import { View, Text, ScrollView } from '@tarojs/components'
import { useLoad, useDidShow } from '@tarojs/taro'
import { useState } from 'react'
import { Network } from '@/network'
import { ClipboardCheck, Clock, Circle, MapPin, Phone, Calendar, MessageSquare } from 'lucide-react-taro'
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
    console.log('Orders page loaded')
    loadOrders()
  })

  useDidShow(() => {
    console.log('Orders page showed')
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
      { text: string; icon: React.ReactNode; bg: string; color: string }
    > = {
      pending: {
        text: '待确认',
        icon: <Clock size={16} color="#F59E0B" />,
        bg: 'bg-amber-50',
        color: '#F59E0B'
      },
      confirmed: {
        text: '已确认',
        icon: <ClipboardCheck size={16} color="#3B82F6" />,
        bg: 'bg-blue-50',
        color: '#3B82F6'
      },
      completed: {
        text: '已完成',
        icon: <Circle size={16} color="#10B981" strokeWidth={3} />,
        bg: 'bg-emerald-50',
        color: '#10B981'
      },
      cancelled: {
        text: '已取消',
        icon: <Circle size={16} color="#9CA3AF" strokeWidth={2} />,
        bg: 'bg-gray-50',
        color: '#9CA3AF'
      }
    }
    return (
      statusMap[status] || {
        text: status,
        icon: <Clock size={16} color="#9CA3AF" />,
        bg: 'bg-gray-50',
        color: '#9CA3AF'
      }
    )
  }

  return (
    <View className="flex flex-col h-full bg-gray-50">
      {/* 顶部标题栏 */}
      <View className="bg-white px-4 py-4 border-b border-gray-100">
        <Text className="block text-xl font-bold text-gray-800">我的订单</Text>
        <Text className="block text-sm text-gray-500 mt-1">查看预约订单状态</Text>
      </View>

      <ScrollView className="flex-1 px-4 py-4" scrollY>
        {loading ? (
          <View className="flex flex-col items-center justify-center py-20">
            <Text className="block text-sm text-gray-500">加载中...</Text>
          </View>
        ) : orders.length === 0 ? (
          <View className="flex flex-col items-center justify-center py-20">
            <ClipboardCheck size={64} color="#E5E7EB" />
            <Text className="block text-base text-gray-500 mt-4">暂无订单</Text>
            <Text className="block text-sm text-gray-400 mt-2">快去预约服务吧</Text>
          </View>
        ) : (
          <View className="space-y-4 pb-6">
            {orders.map(order => {
              const statusInfo = getStatusInfo(order.status)
              return (
                <View
                  key={order.id}
                  className="bg-white rounded-2xl shadow-sm overflow-hidden"
                >
                  {/* 订单头部 */}
                  <View className="px-5 py-4 border-b border-gray-50">
                    <View className="flex flex-row items-center justify-between">
                      <Text className="block text-lg font-bold text-gray-800">
                        {order.service_name}
                      </Text>
                      <View
                        className={`${statusInfo.bg} px-3 py-1.5 rounded-full flex items-center gap-1.5`}
                      >
                        {statusInfo.icon}
                        <Text
                          className="block text-xs font-semibold"
                          style={{ color: statusInfo.color }}
                        >
                          {statusInfo.text}
                        </Text>
                      </View>
                    </View>
                  </View>

                  {/* 订单详情 */}
                  <View className="px-5 py-4 space-y-3">
                    <View className="flex flex-row items-start">
                      <Calendar size={18} color="#10B981" className="mt-0.5 mr-3" />
                      <View className="flex-1">
                        <Text className="block text-sm text-gray-500 mb-0.5">
                          预约时间
                        </Text>
                        <Text className="block text-base text-gray-800">
                          {order.appointment_date} {order.appointment_time}
                        </Text>
                      </View>
                    </View>

                    <View className="flex flex-row items-start">
                      <MapPin size={18} color="#10B981" className="mt-0.5 mr-3" />
                      <View className="flex-1">
                        <Text className="block text-sm text-gray-500 mb-0.5">
                          服务地址
                        </Text>
                        <Text className="block text-base text-gray-800">
                          {order.address}
                        </Text>
                      </View>
                    </View>

                    <View className="flex flex-row items-start">
                      <Phone size={18} color="#10B981" className="mt-0.5 mr-3" />
                      <View className="flex-1">
                        <Text className="block text-sm text-gray-500 mb-0.5">
                          联系电话
                        </Text>
                        <Text className="block text-base text-gray-800">
                          {order.phone}
                        </Text>
                      </View>
                    </View>

                    {order.remark && (
                      <View className="flex flex-row items-start">
                        <MessageSquare size={18} color="#10B981" className="mt-0.5 mr-3" />
                        <View className="flex-1">
                          <Text className="block text-sm text-gray-500 mb-0.5">
                            备注
                          </Text>
                          <Text className="block text-base text-gray-800">
                            {order.remark}
                          </Text>
                        </View>
                      </View>
                    )}
                  </View>

                  {/* 订单底部 */}
                  <View className="px-5 py-3 bg-gray-50 border-t border-gray-100">
                    <Text className="block text-xs text-gray-400">
                      下单时间：{new Date(order.created_at).toLocaleString('zh-CN')}
                    </Text>
                  </View>
                </View>
              )
            })}
          </View>
        )}
      </ScrollView>
    </View>
  )
}

export default OrdersPage
