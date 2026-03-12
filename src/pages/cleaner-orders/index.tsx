import { useState, useEffect } from 'react'
import { View, Text, ScrollView } from '@tarojs/components'
import Taro, { useLoad } from '@tarojs/taro'
import { Network } from '@/network'
import { Clock, Circle, MapPin, Calendar, User, Phone } from 'lucide-react-taro'
import './index.css'

interface Order {
  id: number
  order_no: string
  customer_name: string
  customer_phone: string
  service_type: string
  service_detail: string
  address: string
  scheduled_time: string
  estimated_duration: number | null
  status: string
  created_at: string
  matched_at: string | null
  accepted_at: string | null
}

export default function CleanerOrders() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('matched') // matched, accepted, in_progress, completed

  useLoad(() => {
    loadOrders()
  })

  const loadOrders = async () => {
    try {
      setLoading(true)
      // 这里模拟保洁员 ID 为 1
      const cleanerId = 1
      const response = await Network.request({
        url: `/api/cleaning-orders/cleaner/${cleanerId}`,
        method: 'GET'
      })

      console.log('Cleaner orders response:', response.data)
      let filteredOrders = response.data.data || []

      // 根据标签筛选订单
      if (activeTab !== 'all') {
        filteredOrders = filteredOrders.filter((order: Order) => order.status === activeTab)
      }

      setOrders(filteredOrders)
    } catch (error) {
      console.error('Failed to load orders:', error)
      Taro.showToast({
        title: '加载失败',
        icon: 'error'
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadOrders()
  }, [activeTab])

  const handleAcceptOrder = async (orderId: number) => {
    try {
      await Network.request({
        url: `/api/cleaning-orders/${orderId}/accept`,
        method: 'POST',
        data: {
          orderId,
          cleanerId: 1
        }
      })

      Taro.showToast({
        title: '接单成功',
        icon: 'success'
      })

      loadOrders()
    } catch (error) {
      console.error('Failed to accept order:', error)
      Taro.showToast({
        title: '操作失败',
        icon: 'error'
      })
    }
  }

  const handleStartOrder = async (orderId: number) => {
    try {
      await Network.request({
        url: `/api/cleaning-orders/${orderId}/start`,
        method: 'POST'
      })

      Taro.showToast({
        title: '已开始服务',
        icon: 'success'
      })

      loadOrders()
    } catch (error) {
      console.error('Failed to start order:', error)
      Taro.showToast({
        title: '操作失败',
        icon: 'error'
      })
    }
  }

  const handleCompleteOrder = async (orderId: number) => {
    try {
      await Network.request({
        url: `/api/cleaning-orders/${orderId}/complete`,
        method: 'POST'
      })

      Taro.showToast({
        title: '服务完成',
        icon: 'success'
      })

      loadOrders()
    } catch (error) {
      console.error('Failed to complete order:', error)
      Taro.showToast({
        title: '操作失败',
        icon: 'error'
      })
    }
  }

  const handleCallCustomer = (phone: string) => {
    Taro.makePhoneCall({
      phoneNumber: phone
    })
  }

  const handleViewLocation = (address: string) => {
    Taro.showModal({
      title: '服务地址',
      content: address,
      showCancel: false
    })
  }

  const getServiceTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      cleaning: '日常保洁',
      car_wash: '汽车清洁',
      deep_cleaning: '深度清洁'
    }
    return labels[type] || type
  }

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      matched: '待接单',
      accepted: '已接单',
      in_progress: '进行中',
      completed: '已完成'
    }
    return labels[status] || status
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      matched: '#F59E0B',
      accepted: '#3B82F6',
      in_progress: '#8B5CF6',
      completed: '#10B981'
    }
    return colors[status] || '#6B7280'
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('zh-CN', {
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <View className="cleaner-orders">
      <View className="header">
        <Text className="header-title">我的订单</Text>
        <View className="tab-bar">
          <View
            className={`tab-item ${activeTab === 'matched' ? 'active' : ''}`}
            onClick={() => setActiveTab('matched')}
          >
            <Circle size={20} color={activeTab === 'matched' ? '#3B82F6' : '#9CA3AF'} />
            <Text className="tab-text">待接单</Text>
          </View>
          <View
            className={`tab-item ${activeTab === 'accepted' ? 'active' : ''}`}
            onClick={() => setActiveTab('accepted')}
          >
            <Circle size={20} color={activeTab === 'accepted' ? '#3B82F6' : '#9CA3AF'} />
            <Text className="tab-text">已接单</Text>
          </View>
          <View
            className={`tab-item ${activeTab === 'in_progress' ? 'active' : ''}`}
            onClick={() => setActiveTab('in_progress')}
          >
            <Circle size={20} color={activeTab === 'in_progress' ? '#3B82F6' : '#9CA3AF'} />
            <Text className="tab-text">进行中</Text>
          </View>
          <View
            className={`tab-item ${activeTab === 'completed' ? 'active' : ''}`}
            onClick={() => setActiveTab('completed')}
          >
            <Circle size={20} color={activeTab === 'completed' ? '#3B82F6' : '#9CA3AF'} />
            <Text className="tab-text">已完成</Text>
          </View>
        </View>
      </View>

      <ScrollView className="order-list" scrollY>
        {loading ? (
          <View className="loading-container">
            <Text className="loading-text">加载中...</Text>
          </View>
        ) : orders.length === 0 ? (
          <View className="empty-container">
            <Clock size={64} color="#D1D5DB" />
            <Text className="empty-text">暂无订单</Text>
          </View>
        ) : (
          orders.map(order => (
            <View key={order.id} className="order-card">
              <View className="order-header">
                <Text className="order-no">{order.order_no}</Text>
                <View
                  className="status-badge"
                  style={{ backgroundColor: getStatusColor(order.status) + '20' }}
                >
                  <Text
                    className="status-text"
                    style={{ color: getStatusColor(order.status) }}
                  >
                    {getStatusLabel(order.status)}
                  </Text>
                </View>
              </View>

              <View className="order-info">
                <View className="info-row">
                  <User size={16} color="#6B7280" />
                  <Text className="info-text">{order.customer_name}</Text>
                </View>

                <View className="info-row">
                  <Calendar size={16} color="#6B7280" />
                  <Text className="info-text">{formatDate(order.scheduled_time)}</Text>
                </View>

                <View className="info-row" onClick={() => handleViewLocation(order.address)}>
                  <MapPin size={16} color="#6B7280" />
                  <Text className="info-text address-text">{order.address}</Text>
                </View>
              </View>

              <View className="order-service">
                <Text className="service-label">服务类型</Text>
                <Text className="service-value">{getServiceTypeLabel(order.service_type)}</Text>
              </View>

              <View className="action-buttons">
                <View
                  className="btn btn-call"
                  onClick={() => handleCallCustomer(order.customer_phone)}
                >
                  <Phone size={18} color="#3B82F6" />
                  <Text className="btn-text">联系客户</Text>
                </View>

                {order.status === 'matched' && (
                  <View
                    className="btn btn-accept"
                    onClick={() => handleAcceptOrder(order.id)}
                  >
                    <Circle size={18} color="#10B981" />
                    <Text className="btn-text">接单</Text>
                  </View>
                )}

                {order.status === 'accepted' && (
                  <View
                    className="btn btn-start"
                    onClick={() => handleStartOrder(order.id)}
                  >
                    <Circle size={18} color="#3B82F6" />
                    <Text className="btn-text">开始服务</Text>
                  </View>
                )}

                {order.status === 'in_progress' && (
                  <View
                    className="btn btn-complete"
                    onClick={() => handleCompleteOrder(order.id)}
                  >
                    <Circle size={18} color="#10B981" />
                    <Text className="btn-text">完成服务</Text>
                  </View>
                )}
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  )
}
