import { View, Text, ScrollView } from '@tarojs/components'
import Taro, { useLoad, useDidShow } from '@tarojs/taro'
import { useState } from 'react'
import { Network } from '@/network'
import { Clock, Check, X, Phone, Calendar, MapPin } from 'lucide-react-taro'
import './index.css'

interface Order {
  id: string
  serviceName: string
  name: string
  phone: string
  address: string
  date: string
  time: string
  status: 'pending' | 'completed' | 'cancelled'
  remark?: string
  area?: string
  createdAt: string
}

const OrdersPage = () => {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'completed' | 'cancelled'>('all')

  useLoad(() => {
    loadOrders()
  })

  useDidShow(() => {
    loadOrders()
  })

  const loadOrders = async () => {
    try {
      setLoading(true)
      const res = await Network.request({
        url: '/api/orders/user/current',
        method: 'GET'
      })
      
      if (res.statusCode === 200 && res.data) {
        const ordersData = res.data?.data || res.data || []
        setOrders(Array.isArray(ordersData) ? ordersData : [])
      } else {
        // 使用模拟数据
        getMockOrders()
      }
    } catch (error) {
      console.error('加载订单失败:', error)
      getMockOrders()
    } finally {
      setLoading(false)
    }
  }

  const getMockOrders = () => {
    const mockOrders: Order[] = [
      {
        id: '1',
        serviceName: '日常保洁',
        name: '张先生',
        phone: '138****8888',
        address: '北京市朝阳区xxx小区',
        date: '2024-03-20',
        time: '09:00-11:00',
        status: 'pending',
        area: '100',
        createdAt: '2024-03-18 14:30'
      },
      {
        id: '2',
        serviceName: '深度保洁',
        name: '张先生',
        phone: '138****8888',
        address: '北京市朝阳区xxx小区',
        date: '2024-03-15',
        time: '13:00-17:00',
        status: 'completed',
        area: '100',
        createdAt: '2024-03-14 10:00'
      },
      {
        id: '3',
        serviceName: '家电清洗',
        name: '张先生',
        phone: '138****8888',
        address: '北京市朝阳区xxx小区',
        date: '2024-03-10',
        time: '15:00-17:00',
        status: 'cancelled',
        remark: '临时有事',
        createdAt: '2024-03-09 16:20'
      }
    ]
    setOrders(mockOrders)
  }

  const getStatusInfo = (status: string) => {
    const statusMap: Record<string, { text: string; color: string; bgColor: string; icon: React.ReactNode }> = {
      pending: { 
        text: '待上门', 
        color: 'text-orange-600', 
        bgColor: 'bg-orange-100',
        icon: <Clock size={14} color="#EA580C" />
      },
      completed: { 
        text: '已完成', 
        color: 'text-green-600', 
        bgColor: 'bg-green-100',
        icon: <Check size={14} color="#16A34A" />
      },
      cancelled: { 
        text: '已取消', 
        color: 'text-gray-500', 
        bgColor: 'bg-gray-100',
        icon: <X size={14} color="#6B7280" />
      }
    }
    return statusMap[status] || statusMap.pending
  }

  const filteredOrders = orders.filter(order => {
    if (activeTab === 'all') return true
    return order.status === activeTab
  })

  const handleOrderClick = (order: Order) => {
    Taro.showModal({
      title: '订单详情',
      content: `服务：${order.serviceName}\n联系人：${order.name}\n电话：${order.phone}\n地址：${order.address}\n时间：${order.date} ${order.time}\n状态：${getStatusInfo(order.status).text}`,
      showCancel: false
    })
  }

  const handleCallPhone = (phone: string, e: any) => {
    e.stopPropagation()
    // 显示完整手机号让用户拨打
    Taro.makePhoneCall({
      phoneNumber: phone.replace(/\*+/g, '0'), // 模拟完整号码
      fail: () => {
        Taro.showToast({ title: '拨打失败', icon: 'none' })
      }
    })
  }

  return (
    <View className="min-h-screen bg-gray-50">
      {/* 顶部标签 */}
      <View className="bg-white px-4 py-3 flex flex-row gap-2">
        {[
          { key: 'all', label: '全部' },
          { key: 'pending', label: '待上门' },
          { key: 'completed', label: '已完成' },
          { key: 'cancelled', label: '已取消' }
        ].map(tab => (
          <View
            key={tab.key}
            className={`flex-1 py-2 rounded-lg text-center text-sm ${
              activeTab === tab.key 
                ? 'bg-emerald-500 text-white font-medium' 
                : 'bg-gray-100 text-gray-600'
            }`}
            onClick={() => setActiveTab(tab.key as typeof activeTab)}
          >
            {tab.label}
          </View>
        ))}
      </View>

      {/* 订单列表 */}
      <ScrollView scrollY className="px-4 py-4" style={{ height: 'calc(100vh - 120px)' }}>
        {loading ? (
          <View className="flex flex-col items-center justify-center py-20">
            <Text className="block text-sm text-gray-400">加载中...</Text>
          </View>
        ) : filteredOrders.length === 0 ? (
          <View className="flex flex-col items-center justify-center py-20">
            <Text className="block text-base text-gray-400">暂无预约记录</Text>
            <View 
              className="mt-4 bg-emerald-500 text-white px-6 py-2 rounded-lg text-sm"
              onClick={() => Taro.switchTab({ url: '/pages/index/index' })}
            >
              去预约
            </View>
          </View>
        ) : (
          <View className="flex flex-col gap-3">
            {filteredOrders.map(order => {
              const statusInfo = getStatusInfo(order.status)
              return (
                <View
                  key={order.id}
                  className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100"
                  onClick={() => handleOrderClick(order)}
                >
                  {/* 头部：服务名称 + 状态 */}
                  <View className="flex flex-row items-center justify-between mb-3">
                    <Text className="block text-base font-semibold text-gray-800">{order.serviceName}</Text>
                    <View className={`flex flex-row items-center px-2 py-1 rounded-full ${statusInfo.bgColor}`}>
                      {statusInfo.icon}
                      <Text className={`block text-xs ml-1 ${statusInfo.color}`}>{statusInfo.text}</Text>
                    </View>
                  </View>

                  {/* 预约信息 */}
                  <View className="flex flex-col gap-2 mb-3">
                    <View className="flex flex-row items-center">
                      <Calendar size={14} color="#9CA3AF" />
                      <Text className="block text-sm text-gray-500 ml-2">{order.date} {order.time}</Text>
                    </View>
                    <View className="flex flex-row items-center">
                      <MapPin size={14} color="#9CA3AF" />
                      <Text className="block text-sm text-gray-500 ml-2 line-clamp-1">{order.address}</Text>
                    </View>
                    <View className="flex flex-row items-center">
                      <Phone size={14} color="#9CA3AF" />
                      <Text className="block text-sm text-gray-500 ml-2">{order.phone}</Text>
                    </View>
                  </View>

                  {/* 底部：时间 + 操作 */}
                  <View className="flex flex-row items-center justify-between pt-3 border-t border-gray-100">
                    <Text className="block text-xs text-gray-400">预约时间：{order.createdAt}</Text>
                    {order.status === 'pending' && (
                      <View 
                        className="bg-emerald-500 text-white px-3 py-1 rounded-full text-xs"
                        onClick={(e) => handleCallPhone(order.phone, e)}
                      >
                        联系师傅
                      </View>
                    )}
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
