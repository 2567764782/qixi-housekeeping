import { useState, useEffect } from 'react'
import { View, Text, ScrollView } from '@tarojs/components'
import Taro, { useLoad } from '@tarojs/taro'
import { Network } from '@/network'
import { User, Circle, Star, Phone } from 'lucide-react-taro'
import './index.css'

interface Cleaner {
  id: number
  name: string
  phone: string
  rating: number
  completed_orders: number
  latitude: number | null
  longitude: number | null
  service_types: string[]
  is_online: boolean
  is_verified: boolean
  created_at: string
}

export default function CleanerManagement() {
  const [cleaners, setCleaners] = useState<Cleaner[]>([])
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('all') // all, pending, verified

  useLoad(() => {
    loadCleaners()
  })

  const loadCleaners = async () => {
    try {
      setLoading(true)
      let isVerified: boolean | undefined
      if (activeTab === 'pending') {
        isVerified = false
      } else if (activeTab === 'verified') {
        isVerified = true
      }

      const response = await Network.request({
        url: `/api/cleaners?isVerified=${isVerified}`,
        method: 'GET'
      })

      console.log('Cleaners response:', response.data)
      setCleaners(response.data.data || [])
    } catch (error) {
      console.error('Failed to load cleaners:', error)
      Taro.showToast({
        title: '加载失败',
        icon: 'error'
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadCleaners()
  }, [activeTab])

  const handleVerifyCleaner = async (cleanerId: number, isVerified: boolean) => {
    try {
      await Network.request({
        url: `/api/cleaners/${cleanerId}/verify?adminId=1`,
        method: 'PUT',
        data: {
          isVerified,
          verificationNotes: isVerified ? '审核通过' : '审核拒绝'
        }
      })

      Taro.showToast({
        title: isVerified ? '审核通过' : '已拒绝',
        icon: 'success'
      })

      loadCleaners()
    } catch (error) {
      console.error('Failed to verify cleaner:', error)
      Taro.showToast({
        title: '操作失败',
        icon: 'error'
      })
    }
  }

  const handleToggleOnline = async (cleanerId: number, isOnline: boolean) => {
    try {
      await Network.request({
        url: `/api/cleaners/${cleanerId}/status`,
        method: 'PUT',
        data: { isOnline: !isOnline }
      })

      Taro.showToast({
        title: !isOnline ? '已上线' : '已下线',
        icon: 'success'
      })

      loadCleaners()
    } catch (error) {
      console.error('Failed to toggle online status:', error)
      Taro.showToast({
        title: '操作失败',
        icon: 'error'
      })
    }
  }

  const getServiceTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      cleaning: '日常保洁',
      car_wash: '汽车清洁',
      deep_cleaning: '深度清洁'
    }
    return labels[type] || type
  }

  return (
    <View className="cleaner-management">
      <View className="header">
        <Text className="header-title">保洁员管理</Text>
        <View className="tab-bar">
          <View
            className={`tab-item ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => setActiveTab('all')}
          >
            <Text className="tab-text">全部</Text>
          </View>
          <View
            className={`tab-item ${activeTab === 'pending' ? 'active' : ''}`}
            onClick={() => setActiveTab('pending')}
          >
            <Text className="tab-text">待审核</Text>
          </View>
          <View
            className={`tab-item ${activeTab === 'verified' ? 'active' : ''}`}
            onClick={() => setActiveTab('verified')}
          >
            <Text className="tab-text">已认证</Text>
          </View>
        </View>
      </View>

      <ScrollView className="cleaner-list" scrollY>
        {loading ? (
          <View className="loading-container">
            <Text className="loading-text">加载中...</Text>
          </View>
        ) : cleaners.length === 0 ? (
          <View className="empty-container">
            <User size={64} color="#D1D5DB" />
            <Text className="empty-text">暂无数据</Text>
          </View>
        ) : (
          cleaners.map(cleaner => (
            <View key={cleaner.id} className="cleaner-card">
              <View className="cleaner-header">
                <View className="cleaner-info">
                  <View className="name-row">
                    <Text className="cleaner-name">{cleaner.name}</Text>
                    {cleaner.is_verified ? (
                      <View className="badge badge-verified">
                        <Circle size={14} color="#10B981" />
                        <Text className="badge-text">已认证</Text>
                      </View>
                    ) : (
                      <View className="badge badge-pending">
                        <Circle size={14} color="#F59E0B" />
                        <Text className="badge-text">待审核</Text>
                      </View>
                    )}
                  </View>
                  <View className="phone-row">
                    <Phone size={14} color="#9CA3AF" />
                    <Text className="cleaner-phone">{cleaner.phone}</Text>
                  </View>
                </View>
                <View className="status-toggle" onClick={() => handleToggleOnline(cleaner.id, cleaner.is_online)}>
                  <View className={`status-dot ${cleaner.is_online ? 'online' : 'offline'}`} />
                  <Text className="status-text">
                    {cleaner.is_online ? '在线' : '离线'}
                  </Text>
                </View>
              </View>

              <View className="cleaner-stats">
                <View className="stat-item">
                  <Star size={16} color="#FBBF24" />
                  <Text className="stat-value">{cleaner.rating.toFixed(1)}</Text>
                  <Text className="stat-label">评分</Text>
                </View>
                <View className="stat-divider" />
                <View className="stat-item">
                  <Text className="stat-value">{cleaner.completed_orders}</Text>
                  <Text className="stat-label">完成订单</Text>
                </View>
              </View>

              <View className="service-types">
                {cleaner.service_types.map((type, index) => (
                  <View key={index} className="service-tag">
                    <Text className="service-tag-text">{getServiceTypeLabel(type)}</Text>
                  </View>
                ))}
              </View>

              {!cleaner.is_verified && (
                <View className="action-buttons">
                  <View
                    className="btn btn-reject"
                    onClick={() => handleVerifyCleaner(cleaner.id, false)}
                  >
                    <Text className="btn-text">拒绝</Text>
                  </View>
                  <View
                    className="btn btn-approve"
                    onClick={() => handleVerifyCleaner(cleaner.id, true)}
                  >
                    <Text className="btn-text">通过</Text>
                  </View>
                </View>
              )}
            </View>
          ))
        )}
      </ScrollView>
    </View>
  )
}
