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
      console.log('Starting to load orders...')
      const res = await Network.request({
        url: '/api/orders/user/demo-user-001',
        method: 'GET'
      })
      console.log('Orders response:', res)
      console.log('Orders response data:', res.data)
      // 处理不同的响应格式
      let ordersData: Order[] = []
      if (res.data && res.data.data && Array.isArray(res.data.data)) {
        // 如果后端返回 { data: [...] } 格式
        ordersData = res.data.data as Order[]
      } else if (Array.isArray(res.data)) {
        // 如果后端直接返回数组
        ordersData = res.data as Order[]
      }
      console.log('Parsed orders:', ordersData)
      console.log('Orders data type:', typeof ordersData, 'Is array:', Array.isArray(ordersData))
      setOrders(ordersData || [])
    } catch (error) {
      console.error('Failed to load orders:', error)
      console.error('Error details:', JSON.stringify(error, null, 2))
      setOrders([]) // 出错时设置为空数组
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

  return (
    <View className="flex flex-col h-full bg-gray-50">
      <ScrollView className="flex-1" scrollY>
        {/* 标题栏 - 简洁高级 */}
        <View className="bg-white px-6 py-6 border-b border-gray-100">
          <Text className="block text-2xl font-bold text-gray-800 mb-1">我的订单</Text>
          <Text className="block text-sm text-gray-500">查看预约订单状态</Text>
        </View>

        <View className="px-4 py-6">
          {loading ? (
            <View className="flex flex-col items-center justify-center py-20">
              <Text className="block text-sm text-gray-500">加载中...</Text>
            </View>
          ) : orders.length === 0 ? (
            <View className="flex flex-col items-center justify-center py-24">
              <View
                className="w-24 h-24 bg-gray-100 rounded-3xl flex items-center justify-center mb-4"
                style={{
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)'
                }}
              >
                <ClipboardCheck size={48} color="#E5E7EB" />
              </View>
              <Text className="block text-lg font-semibold text-gray-700 mb-2">暂无订单</Text>
              <Text className="block text-sm text-gray-400">快去预约服务吧</Text>
            </View>
          ) : (
            <View className="space-y-4">
              {orders.map(order => {
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
                    <View className="px-6 py-5 space-y-4">
                      <View className="flex flex-row items-start">
                        <View className="w-9 h-9 bg-emerald-50 rounded-xl flex items-center justify-center mr-3 flex-shrink-0 mt-0.5">
                          <Calendar size={18} color="#10B981" />
                        </View>
                        <View className="flex-1">
                          <Text className="block text-xs text-gray-500 mb-1 font-medium uppercase tracking-wide">
                            预约时间
                          </Text>
                          <Text className="block text-base text-gray-800 font-medium">
                            {order.appointment_date}
                          </Text>
                          <Text className="block text-sm text-gray-600 mt-0.5">
                            {order.appointment_time}
                          </Text>
                        </View>
                      </View>

                      <View className="flex flex-row items-start">
                        <View className="w-9 h-9 bg-emerald-50 rounded-xl flex items-center justify-center mr-3 flex-shrink-0 mt-0.5">
                          <MapPin size={18} color="#10B981" />
                        </View>
                        <View className="flex-1">
                          <Text className="block text-xs text-gray-500 mb-1 font-medium uppercase tracking-wide">
                            服务地址
                          </Text>
                          <Text className="block text-base text-gray-800 font-medium leading-relaxed">
                            {order.address}
                          </Text>
                        </View>
                      </View>

                      <View className="flex flex-row items-start">
                        <View className="w-9 h-9 bg-emerald-50 rounded-xl flex items-center justify-center mr-3 flex-shrink-0 mt-0.5">
                          <Phone size={18} color="#10B981" />
                        </View>
                        <View className="flex-1">
                          <Text className="block text-xs text-gray-500 mb-1 font-medium uppercase tracking-wide">
                            联系电话
                          </Text>
                          <Text className="block text-base text-gray-800 font-medium">
                            {order.phone}
                          </Text>
                        </View>
                      </View>

                      {order.remark && (
                        <View className="flex flex-row items-start">
                          <View className="w-9 h-9 bg-emerald-50 rounded-xl flex items-center justify-center mr-3 flex-shrink-0 mt-0.5">
                            <MessageSquare size={18} color="#10B981" />
                          </View>
                          <View className="flex-1">
                            <Text className="block text-xs text-gray-500 mb-1 font-medium uppercase tracking-wide">
                              备注
                            </Text>
                            <Text className="block text-base text-gray-800 font-medium leading-relaxed">
                              {order.remark}
                            </Text>
                          </View>
                        </View>
                      )}
                    </View>

                    {/* 订单底部 */}
                    <View className="px-6 py-4 bg-gray-50/80 border-t border-gray-100">
                      <Text className="block text-xs text-gray-400 font-medium">
                        下单时间：{new Date(order.created_at).toLocaleString('zh-CN')}
                      </Text>
                    </View>
                  </View>
                )
              })}
            </View>
          )}
        </View>

        {/* 底部留白 */}
        <View className="h-8" />
      </ScrollView>
    </View>
  )
}

export default OrdersPage
