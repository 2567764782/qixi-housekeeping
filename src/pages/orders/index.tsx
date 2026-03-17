import { View, Text, ScrollView } from '@tarojs/components'
import Taro, { useLoad, useDidShow } from '@tarojs/taro'
import { useState } from 'react'
import { Network } from '@/network'
import { Clock, Check, X, Phone, Calendar, MapPin, Star, CreditCard, MessageSquare, User } from 'lucide-react-taro'
import './index.css'

interface Order {
  id: string
  serviceName: string
  name: string
  phone: string
  address: string
  date: string
  time: string
  price: number
  status: 'pending' | 'matched' | 'in_progress' | 'completed' | 'cancelled'
  paymentStatus?: 'unpaid' | 'paid' | 'refunded'
  remark?: string
  area?: string
  cleanerId?: number
  cleanerName?: string
  createdAt: string
  hasReview?: boolean
}

const OrdersPage = () => {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'in_progress' | 'completed' | 'cancelled'>('all')

  useLoad(() => {
    checkLoginStatus()
  })

  useDidShow(() => {
    checkLoginStatus()
    if (isLoggedIn) {
      loadOrders()
    }
  })

  const checkLoginStatus = () => {
    const token = Taro.getStorageSync('token')
    setIsLoggedIn(!!token)
    
    if (token) {
      loadOrders()
    }
  }

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
        address: '北京市朝阳区望京SOHO T1',
        date: '2024-03-20',
        time: '09:00-11:00',
        price: 100,
        status: 'pending',
        paymentStatus: 'unpaid',
        area: '100',
        createdAt: '2024-03-18 14:30'
      },
      {
        id: '2',
        serviceName: '深度保洁',
        name: '张先生',
        phone: '138****8888',
        address: '北京市海淀区中关村软件园',
        date: '2024-03-15',
        time: '13:00-17:00',
        price: 400,
        status: 'completed',
        paymentStatus: 'paid',
        cleanerId: 1,
        cleanerName: '王阿姨',
        area: '120',
        createdAt: '2024-03-14 10:00',
        hasReview: false
      },
      {
        id: '3',
        serviceName: '家电清洗',
        name: '张先生',
        phone: '138****8888',
        address: '北京市朝阳区三元桥甲1号',
        date: '2024-03-10',
        time: '15:00-17:00',
        price: 200,
        status: 'cancelled',
        paymentStatus: 'refunded',
        remark: '临时有事',
        createdAt: '2024-03-09 16:20'
      },
      {
        id: '4',
        serviceName: '新居开荒',
        name: '张先生',
        phone: '138****8888',
        address: '北京市朝阳区望京新城',
        date: '2024-03-22',
        time: '09:00-18:00',
        price: 800,
        status: 'matched',
        paymentStatus: 'paid',
        cleanerId: 2,
        cleanerName: '李阿姨',
        createdAt: '2024-03-19 09:00'
      }
    ]
    setOrders(mockOrders)
  }

  const getStatusInfo = (status: string) => {
    const statusMap: Record<string, { text: string; color: string; bgColor: string; icon: React.ReactNode }> = {
      pending: { 
        text: '待接单', 
        color: 'text-[#F38F00]', 
        bgColor: 'bg-[#FFF7ED]',
        icon: <Clock size={14} color="#F38F00" />
      },
      matched: { 
        text: '已接单', 
        color: 'text-[#007CFF]', 
        bgColor: 'bg-[#EFF6FF]',
        icon: <Check size={14} color="#007CFF" />
      },
      in_progress: { 
        text: '服务中', 
        color: 'text-[#9B40D8]', 
        bgColor: 'bg-[#FAF5FF]',
        icon: <Clock size={14} color="#9B40D8" />
      },
      completed: { 
        text: '已完成', 
        color: 'text-[#5DC801]', 
        bgColor: 'bg-[#F0FDF4]',
        icon: <Check size={14} color="#5DC801" />
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
      content: `服务：${order.serviceName}\n联系人：${order.name}\n电话：${order.phone}\n地址：${order.address}\n时间：${order.date} ${order.time}\n金额：¥${order.price}\n状态：${getStatusInfo(order.status).text}`,
      showCancel: false
    })
  }

  const handleCallPhone = (phone: string, e: any) => {
    e.stopPropagation()
    Taro.makePhoneCall({
      phoneNumber: phone.replace(/\*+/g, '0'),
      fail: () => {
        Taro.showToast({ title: '拨打失败', icon: 'none' })
      }
    })
  }

  const handlePayment = (order: Order, e: any) => {
    e.stopPropagation()
    Taro.navigateTo({
      url: `/pages/payment-page/index?orderId=${order.id}&serviceName=${encodeURIComponent(order.serviceName)}&price=${order.price}&appointmentDate=${order.date}&appointmentTime=${order.time}&address=${encodeURIComponent(order.address)}`
    })
  }

  const handleReview = (order: Order, e: any) => {
    e.stopPropagation()
    Taro.navigateTo({
      url: `/pages/create-review/index?orderId=${order.id}&serviceName=${encodeURIComponent(order.serviceName)}&cleanerId=${order.cleanerId || 1}&cleanerName=${encodeURIComponent(order.cleanerName || '服务人员')}`
    })
  }

  const handleLogin = () => {
    Taro.navigateTo({ url: '/pages/login/index' })
  }

  // 未登录状态显示
  if (!isLoggedIn) {
    return (
      <View className="min-h-screen flex flex-col items-center justify-center" style={{ backgroundColor: '#f5f5f5' }}>
        <View className="w-20 h-20 rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: '#FFF7F7' }}>
          <User size={40} color="#F85659" />
        </View>
        <Text className="block text-lg font-medium mb-2" style={{ color: '#2E2E30' }}>登录后查看预约</Text>
        <Text className="block text-sm mb-6" style={{ color: '#B3B3B3' }}>登录后可以查看和管理您的预约订单</Text>
        <View 
          className="px-8 py-3 rounded-full"
          style={{ backgroundColor: '#F85659' }}
          onClick={handleLogin}
        >
          <Text className="text-base font-medium text-white">立即登录</Text>
        </View>
      </View>
    )
  }

  return (
    <View className="min-h-screen" style={{ backgroundColor: '#f5f5f5' }}>
      {/* 顶部标签 */}
      <View className="bg-white px-4 py-3">
        <ScrollView scrollX className="flex flex-row gap-2" style={{ whiteSpace: 'nowrap' }}>
          {[
            { key: 'all', label: '全部' },
            { key: 'pending', label: '待接单' },
            { key: 'matched', label: '已接单' },
            { key: 'in_progress', label: '服务中' },
            { key: 'completed', label: '已完成' },
            { key: 'cancelled', label: '已取消' }
          ].map(tab => (
            <View
              key={tab.key}
              className="flex-shrink-0 px-4 py-2 rounded-full"
              style={{
                backgroundColor: activeTab === tab.key ? '#F85659' : '#f5f5f5'
              }}
              onClick={() => setActiveTab(tab.key as typeof activeTab)}
            >
              <Text style={{ color: activeTab === tab.key ? '#fff' : '#2E2E30', fontSize: '14px' }}>
                {tab.label}
              </Text>
            </View>
          ))}
        </ScrollView>
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
              className="mt-4 bg-[#F85659] text-white px-6 py-2 rounded-lg text-sm"
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
                  className="bg-white rounded-2xl p-4"
                  style={{ border: '1px solid #EDEDED' }}
                  onClick={() => handleOrderClick(order)}
                >
                  {/* 头部：服务名称 + 状态 */}
                  <View className="flex flex-row items-center justify-between mb-3">
                    <Text className="block text-base font-semibold" style={{ color: '#2E2E30' }}>{order.serviceName}</Text>
                    <View className={`flex flex-row items-center px-2 py-1 rounded-full ${statusInfo.bgColor}`}>
                      {statusInfo.icon}
                      <Text className={`block text-xs ml-1 ${statusInfo.color}`}>{statusInfo.text}</Text>
                    </View>
                  </View>

                  {/* 预约信息 */}
                  <View className="flex flex-col gap-2 mb-3">
                    <View className="flex flex-row items-center">
                      <Calendar size={14} color="#B3B3B3" />
                      <Text className="block text-sm ml-2" style={{ color: '#666' }}>{order.date} {order.time}</Text>
                    </View>
                    <View className="flex flex-row items-center">
                      <MapPin size={14} color="#B3B3B3" />
                      <Text className="block text-sm ml-2 line-clamp-1" style={{ color: '#666' }}>{order.address}</Text>
                    </View>
                    <View className="flex flex-row items-center justify-between">
                      <View className="flex flex-row items-center">
                        <Phone size={14} color="#B3B3B3" />
                        <Text className="block text-sm ml-2" style={{ color: '#666' }}>{order.phone}</Text>
                      </View>
                      <Text className="text-lg font-bold" style={{ color: '#F85659' }}>¥{order.price}</Text>
                    </View>
                  </View>

                  {/* 底部操作 */}
                  <View className="flex flex-row items-center justify-between pt-3" style={{ borderTop: '1px solid #EDEDED' }}>
                    <Text className="block text-xs" style={{ color: '#B3B3B3' }}>预约时间：{order.createdAt}</Text>
                    
                    <View className="flex flex-row gap-2">
                      {/* 待支付 */}
                      {order.status === 'pending' && order.paymentStatus === 'unpaid' && (
                        <View 
                          className="flex flex-row items-center px-3 py-1 rounded-full"
                          style={{ backgroundColor: '#F85659' }}
                          onClick={(e) => handlePayment(order, e)}
                        >
                          <CreditCard size={14} color="#fff" />
                          <Text className="text-xs text-white ml-1">去支付</Text>
                        </View>
                      )}
                      
                      {/* 已接单 - 联系师傅 */}
                      {(order.status === 'matched' || order.status === 'in_progress') && (
                        <View 
                          className="flex flex-row items-center px-3 py-1 rounded-full"
                          style={{ backgroundColor: '#007CFF' }}
                          onClick={(e) => handleCallPhone(order.phone, e)}
                        >
                          <Phone size={14} color="#fff" />
                          <Text className="text-xs text-white ml-1">联系师傅</Text>
                        </View>
                      )}
                      
                      {/* 已完成 - 评价 */}
                      {order.status === 'completed' && !order.hasReview && (
                        <View 
                          className="flex flex-row items-center px-3 py-1 rounded-full"
                          style={{ backgroundColor: '#F38F00' }}
                          onClick={(e) => handleReview(order, e)}
                        >
                          <Star size={14} color="#fff" />
                          <Text className="text-xs text-white ml-1">去评价</Text>
                        </View>
                      )}
                      
                      {/* 已评价 */}
                      {order.status === 'completed' && order.hasReview && (
                        <View 
                          className="flex flex-row items-center px-3 py-1 rounded-full"
                          style={{ backgroundColor: '#f5f5f5' }}
                        >
                          <MessageSquare size={14} color="#B3B3B3" />
                          <Text className="text-xs ml-1" style={{ color: '#B3B3B3' }}>已评价</Text>
                        </View>
                      )}
                    </View>
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
