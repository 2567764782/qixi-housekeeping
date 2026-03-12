import { useState } from 'react'
import { View, Text, ScrollView } from '@tarojs/components'
import Taro, { useLoad } from '@tarojs/taro'
import { Network } from '@/network'
import { Circle, User, Phone, Calendar, MapPin } from 'lucide-react-taro'
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
  special_requirements: string | null
  status: string
  created_at: string
}

export default function OrderReviewManagement() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [showDetail, setShowDetail] = useState(false)

  useLoad(() => {
    loadPendingOrders()
  })

  const loadPendingOrders = async () => {
    try {
      setLoading(true)
      const response = await Network.request({
        url: '/api/cleaning-orders/pending-review',
        method: 'GET'
      })

      console.log('Pending orders response:', response.data)
      setOrders(response.data.data || [])
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

  const handleReviewOrder = async (orderId: number, isApproved: boolean) => {
    try {
      await Network.request({
        url: `/api/cleaning-orders/${orderId}/verify?adminId=1`,
        method: 'POST',
        data: {
          status: isApproved ? 'verified' : 'cancelled',
          verificationNotes: isApproved ? '审核通过' : '审核拒绝'
        }
      })

      Taro.showToast({
        title: isApproved ? '审核通过' : '已拒绝',
        icon: 'success'
      })

      setShowDetail(false)
      loadPendingOrders()
    } catch (error) {
      console.error('Failed to review order:', error)
      Taro.showToast({
        title: '操作失败',
        icon: 'error'
      })
    }
  }

  const showOrderDetail = (order: Order) => {
    setSelectedOrder(order)
    setShowDetail(true)
  }

  const getServiceTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      cleaning: '日常保洁',
      car_wash: '汽车清洁',
      deep_cleaning: '深度清洁'
    }
    return labels[type] || type
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <View className="order-review">
      <View className="header">
        <Text className="header-title">订单审核</Text>
      </View>

      <ScrollView className="order-list" scrollY>
        {loading ? (
          <View className="loading-container">
            <Text className="loading-text">加载中...</Text>
          </View>
        ) : orders.length === 0 ? (
          <View className="empty-container">
            <Circle size={64} color="#D1D5DB" />
            <Text className="empty-text">暂无待审核订单</Text>
          </View>
        ) : (
          orders.map(order => (
            <View key={order.id} className="order-card" onClick={() => showOrderDetail(order)}>
              <View className="order-header">
                <Text className="order-no">{order.order_no}</Text>
                <View className="status-badge">
                  <Text className="status-text">待审核</Text>
                </View>
              </View>

              <View className="order-info">
                <View className="info-row">
                  <User size={16} color="#6B7280" />
                  <Text className="info-text">{order.customer_name}</Text>
                  <Phone size={16} color="#6B7280" />
                  <Text className="info-text">{order.customer_phone}</Text>
                </View>

                <View className="info-row">
                  <Calendar size={16} color="#6B7280" />
                  <Text className="info-text">{formatDate(order.scheduled_time)}</Text>
                </View>

                <View className="info-row">
                  <MapPin size={16} color="#6B7280" />
                  <Text className="info-text">{order.address}</Text>
                </View>
              </View>

              <View className="order-service">
                <Text className="service-label">服务类型</Text>
                <Text className="service-value">{getServiceTypeLabel(order.service_type)}</Text>
              </View>

              <View className="order-time">
                <Text className="time-label">预计时长</Text>
                <Text className="time-value">{order.estimated_duration} 小时</Text>
              </View>
            </View>
          ))
        )}
      </ScrollView>

      {/* 订单详情弹窗 */}
      {showDetail && selectedOrder && (
        <View className="modal-overlay" onClick={() => setShowDetail(false)}>
          <View className="modal-content" onClick={(e) => e.stopPropagation()}>
            <View className="modal-header">
              <Text className="modal-title">订单详情</Text>
            </View>

            <ScrollView className="modal-body" scrollY>
              <View className="detail-section">
                <Text className="section-title">订单信息</Text>
                <View className="detail-row">
                  <Text className="detail-label">订单号</Text>
                  <Text className="detail-value">{selectedOrder.order_no}</Text>
                </View>
                <View className="detail-row">
                  <Text className="detail-label">客户姓名</Text>
                  <Text className="detail-value">{selectedOrder.customer_name}</Text>
                </View>
                <View className="detail-row">
                  <Text className="detail-label">联系电话</Text>
                  <Text className="detail-value">{selectedOrder.customer_phone}</Text>
                </View>
              </View>

              <View className="detail-section">
                <Text className="section-title">服务信息</Text>
                <View className="detail-row">
                  <Text className="detail-label">服务类型</Text>
                  <Text className="detail-value">{getServiceTypeLabel(selectedOrder.service_type)}</Text>
                </View>
                <View className="detail-row">
                  <Text className="detail-label">服务详情</Text>
                  <Text className="detail-value">{selectedOrder.service_detail}</Text>
                </View>
                <View className="detail-row">
                  <Text className="detail-label">预计时长</Text>
                  <Text className="detail-value">{selectedOrder.estimated_duration} 小时</Text>
                </View>
              </View>

              <View className="detail-section">
                <Text className="section-title">预约信息</Text>
                <View className="detail-row">
                  <Text className="detail-label">预约时间</Text>
                  <Text className="detail-value">{formatDate(selectedOrder.scheduled_time)}</Text>
                </View>
                <View className="detail-row">
                  <Text className="detail-label">服务地址</Text>
                  <Text className="detail-value">{selectedOrder.address}</Text>
                </View>
              </View>

              {selectedOrder.special_requirements && (
                <View className="detail-section">
                  <Text className="section-title">特殊要求</Text>
                  <Text className="special-requirements">{selectedOrder.special_requirements}</Text>
                </View>
              )}
            </ScrollView>

            <View className="modal-footer">
              <View
                className="modal-btn btn-reject"
                onClick={() => handleReviewOrder(selectedOrder.id, false)}
              >
                <Circle size={20} color="#EF4444" />
                <Text className="modal-btn-text">拒绝</Text>
              </View>
              <View
                className="modal-btn btn-approve"
                onClick={() => handleReviewOrder(selectedOrder.id, true)}
              >
                <Circle size={20} color="#10B981" />
                <Text className="modal-btn-text">通过</Text>
              </View>
            </View>
          </View>
        </View>
      )}
    </View>
  )
}
