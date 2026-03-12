import { View, Text, ScrollView } from '@tarojs/components'
import { useLoad, useDidShow } from '@tarojs/taro'
import { useState } from 'react'
import { Network } from '@/network'
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

  // 获取状态文本
  const getStatusText = (status: string) => {
    const statusMap: Record<string, string> = {
      pending: '待确认',
      confirmed: '已确认',
      completed: '已完成',
      cancelled: '已取消'
    }
    return statusMap[status] || status
  }

  // 获取状态颜色
  const getStatusColor = (status: string) => {
    const colorMap: Record<string, string> = {
      pending: '#F59E0B',
      confirmed: '#3B82F6',
      completed: '#10B981',
      cancelled: '#9CA3AF'
    }
    return colorMap[status] || '#9CA3AF'
  }

  return (
    <View className="flex flex-col h-full bg-gray-50">
      <ScrollView className="flex-1 px-4 py-4" scrollY>
        {loading ? (
          <View className="flex flex-col items-center justify-center py-16">
            <Text className="block text-sm text-gray-500">加载中...</Text>
          </View>
        ) : orders.length === 0 ? (
          <View className="flex flex-col items-center justify-center py-16">
            <Text className="block text-base text-gray-500">暂无订单</Text>
          </View>
        ) : (
          orders.map(order => (
            <View key={order.id} className="bg-white rounded-xl shadow-sm p-4 mb-4">
              <View className="flex flex-row justify-between items-center mb-3">
                <Text className="block text-lg font-semibold">{order.service_name}</Text>
                <Text className="block text-sm" style={{ color: getStatusColor(order.status) }}>
                  {getStatusText(order.status)}
                </Text>
              </View>
              <View className="flex flex-col gap-2 mb-3">
                <View className="flex flex-row">
                  <Text className="block text-sm text-gray-500 w-20 flex-shrink-0">预约时间：</Text>
                  <Text className="block text-sm text-gray-700">
                    {order.appointment_date} {order.appointment_time}
                  </Text>
                </View>
                <View className="flex flex-row">
                  <Text className="block text-sm text-gray-500 w-20 flex-shrink-0">服务地址：</Text>
                  <Text className="block text-sm text-gray-700">{order.address}</Text>
                </View>
                <View className="flex flex-row">
                  <Text className="block text-sm text-gray-500 w-20 flex-shrink-0">联系电话：</Text>
                  <Text className="block text-sm text-gray-700">{order.phone}</Text>
                </View>
                {order.remark && (
                  <View className="flex flex-row">
                    <Text className="block text-sm text-gray-500 w-20 flex-shrink-0">备注：</Text>
                    <Text className="block text-sm text-gray-700">{order.remark}</Text>
                  </View>
                )}
              </View>
              <View className="border-t border-gray-100 pt-3">
                <Text className="block text-xs text-gray-400">
                  下单时间：{new Date(order.created_at).toLocaleString('zh-CN')}
                </Text>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  )
}

export default OrdersPage
