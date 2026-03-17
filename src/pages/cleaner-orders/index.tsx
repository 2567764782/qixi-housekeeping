import Taro, { useLoad, useDidShow } from '@tarojs/taro'
import { View, Text, ScrollView } from '@tarojs/components'
import { useState } from 'react'
import { Network } from '@/network'
import { ArrowLeft, MapPin, Clock, Phone, Star, Power } from 'lucide-react-taro'
import './index.css'

interface Order {
  id: string
  service_name: string
  address: string
  contact_name: string
  contact_phone: string
  appointment_date: string
  appointment_time: string
  price: number
  duration_hours?: number
  area_size?: number
  remark?: string
  created_at: string
}

interface CleanerProfile {
  id: number
  name: string
  phone: string
  is_online: boolean
  is_verified: boolean
  rating: number
  completed_orders: number
  status: string
}

const CleanerOrdersPage = () => {
  const [isOnline, setIsOnline] = useState(false)
  const [cleanerProfile, setCleanerProfile] = useState<CleanerProfile | null>(null)
  const [availableOrders, setAvailableOrders] = useState<Order[]>([])
  const [myOrders, setMyOrders] = useState<Order[]>([])
  const [activeTab, setActiveTab] = useState<'available' | 'my'>('available')
  const [stats, setStats] = useState({
    totalOrders: 0,
    rating: 0,
    todayOrders: 0,
    monthEarnings: 0
  })

  useLoad(() => {
    loadData()
  })

  useDidShow(() => {
    loadData()
  })

  const loadData = async () => {
    await Promise.all([
      loadCleanerProfile(),
      loadStats()
    ])
  }

  const loadCleanerProfile = async () => {
    try {
      const res = await Network.request({
        url: '/api/cleaner-platform/profile',
        method: 'GET'
      })
      
      if (res.statusCode === 200 && res.data?.data) {
        setCleanerProfile(res.data.data)
        setIsOnline(res.data.data.is_online)
        
        // 如果已审核，加载订单
        if (res.data.data.is_verified) {
          loadAvailableOrders()
          loadMyOrders()
        }
      }
    } catch (error) {
      console.error('获取阿姨信息失败:', error)
      // 使用模拟数据
      setCleanerProfile({
        id: 1,
        name: '王阿姨',
        phone: '138****8888',
        is_online: false,
        is_verified: true,
        rating: 4.8,
        completed_orders: 128,
        status: 'verified'
      })
      loadMockOrders()
    }
  }

  const loadStats = async () => {
    try {
      const res = await Network.request({
        url: '/api/cleaner-platform/stats',
        method: 'GET'
      })
      
      if (res.statusCode === 200 && res.data?.data) {
        setStats(res.data.data)
      }
    } catch (error) {
      console.error('获取统计失败:', error)
    }
  }

  const loadAvailableOrders = async () => {
    try {
      const res = await Network.request({
        url: '/api/cleaner-platform/available-orders',
        method: 'GET'
      })
      
      if (res.statusCode === 200 && res.data?.data) {
        setAvailableOrders(res.data.data.list || [])
      }
    } catch (error) {
      console.error('获取可接订单失败:', error)
    }
  }

  const loadMyOrders = async () => {
    try {
      const res = await Network.request({
        url: '/api/cleaner-platform/my-orders',
        method: 'GET'
      })
      
      if (res.statusCode === 200 && res.data?.data) {
        setMyOrders(res.data.data.list || [])
      }
    } catch (error) {
      console.error('获取我的订单失败:', error)
    }
  }

  const loadMockOrders = () => {
    const mockOrders: Order[] = [
      {
        id: '1',
        service_name: '日常保洁',
        address: '北京市朝阳区望京SOHO T1',
        contact_name: '张先生',
        contact_phone: '138****8888',
        appointment_date: '2024-03-20',
        appointment_time: '09:00-11:00',
        price: 100,
        duration_hours: 2,
        remark: '家里有宠物，请注意',
        created_at: '2024-03-18 14:30'
      },
      {
        id: '2',
        service_name: '深度保洁',
        address: '北京市海淀区中关村软件园',
        contact_name: '李女士',
        contact_phone: '139****9999',
        appointment_date: '2024-03-20',
        appointment_time: '14:00-18:00',
        price: 400,
        duration_hours: 4,
        created_at: '2024-03-18 16:00'
      },
      {
        id: '3',
        service_name: '家电清洗',
        address: '北京市朝阳区三元桥甲1号',
        contact_name: '王先生',
        contact_phone: '137****7777',
        appointment_date: '2024-03-21',
        appointment_time: '10:00-12:00',
        price: 200,
        created_at: '2024-03-18 18:20'
      }
    ]
    setAvailableOrders(mockOrders)
  }

  const toggleOnline = async () => {
    try {
      const res = await Network.request({
        url: '/api/cleaner-platform/online-status',
        method: 'PUT',
        data: { isOnline: !isOnline }
      })
      
      if (res.statusCode === 200) {
        setIsOnline(!isOnline)
        Taro.showToast({ title: isOnline ? '已下线' : '已上线', icon: 'success' })
        if (!isOnline) {
          loadAvailableOrders()
        }
      }
    } catch (error) {
      console.error('切换状态失败:', error)
      setIsOnline(!isOnline)
      Taro.showToast({ title: isOnline ? '已下线' : '已上线', icon: 'success' })
    }
  }

  const handleAcceptOrder = async (orderId: string) => {
    try {
      const res = await Network.request({
        url: '/api/cleaner-platform/accept-order',
        method: 'POST',
        data: { orderId }
      })
      
      if (res.statusCode === 200) {
        Taro.showToast({ title: '接单成功', icon: 'success' })
        loadAvailableOrders()
        loadMyOrders()
        setActiveTab('my')
      } else {
        Taro.showToast({ title: res.data?.msg || '接单失败', icon: 'none' })
      }
    } catch (error) {
      console.error('接单失败:', error)
      Taro.showToast({ title: '接单失败，请重试', icon: 'none' })
    }
  }

  const handleCallPhone = (phone: string) => {
    Taro.makePhoneCall({
      phoneNumber: phone.replace(/\*+/g, '0'),
      fail: () => Taro.showToast({ title: '拨打失败', icon: 'none' })
    })
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: '#F38F00',
      matched: '#007CFF',
      in_progress: '#9B40D8',
      completed: '#5DC801'
    }
    return colors[status] || '#999'
  }

  const getStatusText = (status: string) => {
    const texts: Record<string, string> = {
      pending: '待上门',
      matched: '已接单',
      in_progress: '服务中',
      completed: '已完成'
    }
    return texts[status] || status
  }

  // 未审核状态
  if (cleanerProfile && !cleanerProfile.is_verified) {
    return (
      <View className="min-h-screen flex flex-col items-center justify-center" style={{ backgroundColor: '#f5f5f5' }}>
        <View className="w-20 h-20 rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: '#FFF7ED' }}>
          <Clock size={40} color="#F38F00" />
        </View>
        <Text className="text-lg font-semibold mb-2" style={{ color: '#2E2E30' }}>审核中</Text>
        <Text className="text-sm text-center px-8" style={{ color: '#B3B3B3' }}>
          您的入驻申请正在审核中，请耐心等待
        </Text>
      </View>
    )
  }

  // 未入驻状态
  if (!cleanerProfile) {
    return (
      <View className="min-h-screen flex flex-col items-center justify-center px-8" style={{ backgroundColor: '#f5f5f5' }}>
        <Text className="text-lg font-semibold mb-2" style={{ color: '#2E2E30' }}>您还不是服务人员</Text>
        <Text className="text-sm text-center mb-6" style={{ color: '#B3B3B3' }}>
          成为服务人员，开启接单之旅
        </Text>
        <View
          className="px-8 py-3 rounded-xl"
          style={{ backgroundColor: '#F85659' }}
          onClick={() => Taro.navigateTo({ url: '/pages/cleaner-apply/index' })}
        >
          <Text className="text-white font-medium">立即入驻</Text>
        </View>
      </View>
    )
  }

  return (
    <View className="min-h-screen" style={{ backgroundColor: '#f5f5f5' }}>
      {/* 头部 */}
      <View className="bg-white px-4 py-3 flex flex-row items-center" style={{ borderBottom: '1px solid #EDEDED' }}>
        <View onClick={() => Taro.navigateBack()}>
          <ArrowLeft size={24} color="#2E2E30" />
        </View>
        <Text className="flex-1 text-center text-lg font-bold" style={{ color: '#2E2E30' }}>
          阿姨接单
        </Text>
        <View className="flex flex-row items-center" onClick={toggleOnline}>
          <Power size={18} color={isOnline ? '#5DC801' : '#B3B3B3'} />
          <Text className="ml-1 text-sm" style={{ color: isOnline ? '#5DC801' : '#B3B3B3' }}>
            {isOnline ? '在线' : '离线'}
          </Text>
        </View>
      </View>

      {/* 统计卡片 */}
      <View className="px-4 py-4">
        <View className="bg-white rounded-2xl p-4" style={{ border: '1px solid #EDEDED' }}>
          <View className="flex flex-row items-center justify-between">
            <View className="flex flex-col items-center flex-1">
              <Text className="text-2xl font-bold" style={{ color: '#F85659' }}>{stats.todayOrders}</Text>
              <Text className="text-xs mt-1" style={{ color: '#B3B3B3' }}>今日订单</Text>
            </View>
            <View className="flex flex-col items-center flex-1">
              <View className="flex flex-row items-center">
                <Star size={16} color="#F38F00" />
                <Text className="text-2xl font-bold ml-1" style={{ color: '#2E2E30' }}>{stats.rating || cleanerProfile?.rating || 0}</Text>
              </View>
              <Text className="text-xs mt-1" style={{ color: '#B3B3B3' }}>服务评分</Text>
            </View>
            <View className="flex flex-col items-center flex-1">
              <Text className="text-2xl font-bold" style={{ color: '#2E2E30' }}>{stats.totalOrders || cleanerProfile?.completed_orders || 0}</Text>
              <Text className="text-xs mt-1" style={{ color: '#B3B3B3' }}>总订单</Text>
            </View>
            <View className="flex flex-col items-center flex-1">
              <Text className="text-2xl font-bold" style={{ color: '#5DC801' }}>¥{stats.monthEarnings || 0}</Text>
              <Text className="text-xs mt-1" style={{ color: '#B3B3B3' }}>本月收入</Text>
            </View>
          </View>
        </View>
      </View>

      {/* 订单标签 */}
      <View className="px-4 flex flex-row gap-3 mb-4">
        <View
          className="flex-1 py-3 rounded-xl text-center"
          style={{ backgroundColor: activeTab === 'available' ? '#F85659' : '#fff', border: activeTab === 'available' ? 'none' : '1px solid #EDEDED' }}
          onClick={() => setActiveTab('available')}
        >
          <Text style={{ color: activeTab === 'available' ? '#fff' : '#2E2E30' }}>可接订单</Text>
        </View>
        <View
          className="flex-1 py-3 rounded-xl text-center"
          style={{ backgroundColor: activeTab === 'my' ? '#F85659' : '#fff', border: activeTab === 'my' ? 'none' : '1px solid #EDEDED' }}
          onClick={() => setActiveTab('my')}
        >
          <Text style={{ color: activeTab === 'my' ? '#fff' : '#2E2E30' }}>我的订单</Text>
        </View>
      </View>

      {/* 订单列表 */}
      <ScrollView scrollY className="px-4" style={{ height: 'calc(100vh - 280px)' }}>
        {!isOnline && activeTab === 'available' ? (
          <View className="flex flex-col items-center justify-center py-20">
            <Power size={48} color="#EDEDED" />
            <Text className="block text-sm mt-4" style={{ color: '#B3B3B3' }}>点击右上角上线后可接单</Text>
          </View>
        ) : (
          <View className="flex flex-col gap-3">
            {(activeTab === 'available' ? availableOrders : myOrders).map(order => (
              <View
                key={order.id}
                className="bg-white rounded-2xl p-4"
                style={{ border: '1px solid #EDEDED' }}
              >
                {/* 头部 */}
                <View className="flex flex-row items-center justify-between mb-3">
                  <Text className="font-semibold" style={{ color: '#2E2E30' }}>{order.service_name}</Text>
                  {'status' in order && (
                    <View 
                      className="px-2 py-1 rounded-full"
                      style={{ backgroundColor: `${getStatusColor((order as any).status)}20` }}
                    >
                      <Text className="text-xs" style={{ color: getStatusColor((order as any).status) }}>
                        {getStatusText((order as any).status)}
                      </Text>
                    </View>
                  )}
                </View>

                {/* 详情 */}
                <View className="flex flex-col gap-2 mb-3">
                  <View className="flex flex-row items-center">
                    <MapPin size={14} color="#B3B3B3" />
                    <Text className="text-sm ml-2" style={{ color: '#666' }}>{order.address}</Text>
                  </View>
                  <View className="flex flex-row items-center">
                    <Clock size={14} color="#B3B3B3" />
                    <Text className="text-sm ml-2" style={{ color: '#666' }}>
                      {order.appointment_date} {order.appointment_time}
                    </Text>
                  </View>
                </View>

                {/* 价格 */}
                <View className="flex flex-row items-center justify-between pt-3" style={{ borderTop: '1px solid #EDEDED' }}>
                  <View className="flex flex-row items-center">
                    <Text className="text-lg font-bold" style={{ color: '#F85659' }}>¥{order.price}</Text>
                    {order.duration_hours && (
                      <Text className="text-xs ml-2" style={{ color: '#B3B3B3' }}>{order.duration_hours}小时</Text>
                    )}
                  </View>
                  
                  {activeTab === 'available' ? (
                    <View
                      className="px-4 py-2 rounded-xl"
                      style={{ backgroundColor: '#F85659' }}
                      onClick={() => handleAcceptOrder(order.id)}
                    >
                      <Text className="text-white text-sm">接单</Text>
                    </View>
                  ) : (
                    <View className="flex flex-row gap-2">
                      <View
                        className="px-4 py-2 rounded-xl"
                        style={{ backgroundColor: '#007CFF' }}
                        onClick={() => handleCallPhone(order.contact_phone)}
                      >
                        <Phone size={16} color="#fff" />
                      </View>
                    </View>
                  )}
                </View>
              </View>
            ))}
            
            {(activeTab === 'available' ? availableOrders : myOrders).length === 0 && (
              <View className="flex flex-col items-center justify-center py-20">
                <Text className="text-sm" style={{ color: '#B3B3B3' }}>
                  {activeTab === 'available' ? '暂无可接订单' : '暂无订单记录'}
                </Text>
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </View>
  )
}

export default CleanerOrdersPage
