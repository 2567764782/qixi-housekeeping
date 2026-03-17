import Taro, { useLoad, useDidShow } from '@tarojs/taro'
import { View, Text, ScrollView } from '@tarojs/components'
import { useState } from 'react'
import { Network } from '@/network'
import { Ticket, Clock, ArrowLeft, Plus } from 'lucide-react-taro'
import './index.css'

interface Coupon {
  id: string
  name: string
  type: 'fixed' | 'percent'
  value: number
  minAmount: number
  startTime: string
  endTime: string
  description: string
}

interface UserCoupon {
  id: string
  couponId: string
  coupon: Coupon
  status: 'unused' | 'used' | 'expired'
  usedAt?: string
}

const CouponPage = () => {
  const [activeTab, setActiveTab] = useState<'available' | 'used' | 'expired'>('available')
  const [availableCoupons, setAvailableCoupons] = useState<Coupon[]>([])
  const [userCoupons, setUserCoupons] = useState<UserCoupon[]>([])

  useLoad(() => {
    loadData()
  })

  useDidShow(() => {
    loadData()
  })

  const loadData = async () => {
    await Promise.all([loadAvailableCoupons(), loadUserCoupons()])
  }

  const loadAvailableCoupons = async () => {
    try {
      const res = await Network.request({
        url: '/api/payment/coupons/available',
        method: 'GET'
      })

      if (res.statusCode === 200 && res.data?.data) {
        setAvailableCoupons(res.data.data)
      }
    } catch (error) {
      console.error('加载可用优惠券失败:', error)
      // 模拟数据
      setAvailableCoupons([
        {
          id: 'coupon-001',
          name: '新用户专享券',
          type: 'fixed',
          value: 20,
          minAmount: 50,
          startTime: new Date().toISOString(),
          endTime: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          description: '新用户首单立减20元'
        },
        {
          id: 'coupon-002',
          name: '保洁满减券',
          type: 'fixed',
          value: 30,
          minAmount: 100,
          startTime: new Date().toISOString(),
          endTime: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
          description: '保洁服务满100减30'
        },
        {
          id: 'coupon-003',
          name: '会员折扣券',
          type: 'percent',
          value: 0.85,
          minAmount: 0,
          startTime: new Date().toISOString(),
          endTime: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
          description: '会员专享85折优惠'
        }
      ])
    }
  }

  const loadUserCoupons = async () => {
    try {
      const token = Taro.getStorageSync('token')
      if (!token) return

      const res = await Network.request({
        url: '/api/payment/coupons/my',
        method: 'GET'
      })

      if (res.statusCode === 200 && res.data?.data) {
        setUserCoupons(res.data.data)
      }
    } catch (error) {
      console.error('加载我的优惠券失败:', error)
    }
  }

  const handleClaimCoupon = async (couponId: string) => {
    const token = Taro.getStorageSync('token')
    if (!token) {
      Taro.showToast({ title: '请先登录', icon: 'none' })
      setTimeout(() => {
        Taro.navigateTo({ url: '/pages/login/index' })
      }, 1500)
      return
    }

    try {
      const res = await Network.request({
        url: '/api/payment/coupons/claim',
        method: 'POST',
        data: { couponId }
      })

      if (res.statusCode === 200 && res.data?.code === 200) {
        Taro.showToast({ title: '领取成功', icon: 'success' })
        loadData()
      } else {
        throw new Error(res.data?.msg || '领取失败')
      }
    } catch (error: any) {
      Taro.showToast({ title: error.message || '领取失败', icon: 'none' })
    }
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return `${date.getMonth() + 1}.${date.getDate()}`
  }

  const renderCouponValue = (coupon: Coupon) => {
    if (coupon.type === 'percent') {
      return `${(coupon.value * 10).toFixed(1)}折`
    }
    return `¥${coupon.value}`
  }

  const filteredUserCoupons = userCoupons.filter(uc => {
    if (activeTab === 'available') return uc.status === 'unused'
    if (activeTab === 'used') return uc.status === 'used'
    return uc.status === 'expired'
  })

  return (
    <View className="min-h-screen" style={{ backgroundColor: '#f5f5f5' }}>
      {/* 头部 */}
      <View className="bg-white px-4 py-3 flex flex-row items-center" style={{ borderBottom: '1px solid #EDEDED' }}>
        <View onClick={() => Taro.navigateBack()}>
          <ArrowLeft size={24} color="#2E2E30" />
        </View>
        <Text className="flex-1 text-center text-lg font-bold" style={{ color: '#2E2E30' }}>
          优惠券
        </Text>
        <View className="w-6" />
      </View>

      <ScrollView scrollY className="h-screen">
        {/* 可领取优惠券 */}
        <View className="mx-4 mt-4 mb-4">
          <View className="flex flex-row items-center mb-3">
            <Ticket size={20} color="#F85659" />
            <Text className="ml-2 text-base font-semibold" style={{ color: '#2E2E30' }}>
              可领取优惠券
            </Text>
          </View>

          {availableCoupons.map(coupon => (
            <View key={coupon.id} className="coupon-card available">
              <View className="coupon-left">
                <Text className="coupon-value">{renderCouponValue(coupon)}</Text>
                {coupon.minAmount > 0 && (
                  <Text className="coupon-condition">满{coupon.minAmount}可用</Text>
                )}
              </View>
              <View className="coupon-right">
                <Text className="coupon-name">{coupon.name}</Text>
                <Text className="coupon-desc">{coupon.description}</Text>
                <View className="flex flex-row items-center justify-between">
                  <View className="flex flex-row items-center">
                    <Clock size={12} color="#B3B3B3" />
                    <Text className="coupon-time">
                      {formatDate(coupon.startTime)}-{formatDate(coupon.endTime)}
                    </Text>
                  </View>
                  <View 
                    className="claim-btn"
                    onClick={() => handleClaimCoupon(coupon.id)}
                  >
                    <Plus size={14} color="#fff" />
                    <Text className="claim-btn-text">领取</Text>
                  </View>
                </View>
              </View>
            </View>
          ))}

          {availableCoupons.length === 0 && (
            <View className="empty-state">
              <Ticket size={48} color="#ddd" />
              <Text className="empty-text">暂无可领取的优惠券</Text>
            </View>
          )}
        </View>

        {/* 我的优惠券 */}
        <View className="mx-4 mb-4">
          <View className="flex flex-row items-center mb-3">
            <Ticket size={20} color="#F85659" />
            <Text className="ml-2 text-base font-semibold" style={{ color: '#2E2E30' }}>
              我的优惠券
            </Text>
          </View>

          {/* Tab切换 */}
          <View className="flex flex-row gap-2 mb-4">
            {[
              { key: 'available', label: '可使用' },
              { key: 'used', label: '已使用' },
              { key: 'expired', label: '已过期' }
            ].map(tab => (
              <View
                key={tab.key}
                className={`tab-item ${activeTab === tab.key ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.key as any)}
              >
                <Text className="tab-text">{tab.label}</Text>
              </View>
            ))}
          </View>

          {/* 优惠券列表 */}
          {filteredUserCoupons.map(uc => (
            <View key={uc.id} className={`coupon-card my ${uc.status}`}>
              <View className="coupon-left">
                <Text className="coupon-value">{renderCouponValue(uc.coupon)}</Text>
                {uc.coupon.minAmount > 0 && (
                  <Text className="coupon-condition">满{uc.coupon.minAmount}可用</Text>
                )}
              </View>
              <View className="coupon-right">
                <Text className="coupon-name">{uc.coupon.name}</Text>
                <Text className="coupon-desc">{uc.coupon.description}</Text>
                <View className="flex flex-row items-center">
                  <Clock size={12} color="#B3B3B3" />
                  <Text className="coupon-time">
                    {formatDate(uc.coupon.startTime)}-{formatDate(uc.coupon.endTime)}
                  </Text>
                </View>
              </View>
              {uc.status !== 'unused' && (
                <View className="coupon-status">
                  <Text className="status-text">
                    {uc.status === 'used' ? '已使用' : '已过期'}
                  </Text>
                </View>
              )}
            </View>
          ))}

          {filteredUserCoupons.length === 0 && (
            <View className="empty-state">
              <Ticket size={48} color="#ddd" />
              <Text className="empty-text">
                {activeTab === 'available' && '暂无可用优惠券'}
                {activeTab === 'used' && '暂无已使用优惠券'}
                {activeTab === 'expired' && '暂无已过期优惠券'}
              </Text>
            </View>
          )}
        </View>

        {/* 使用说明 */}
        <View className="mx-4 mb-8 bg-white rounded-2xl p-4">
          <Text className="block text-sm font-semibold mb-2" style={{ color: '#2E2E30' }}>
            使用说明
          </Text>
          <Text className="block text-xs leading-6" style={{ color: '#B3B3B3' }}>
            • 优惠券可在支付订单时使用{'\n'}
            • 每张优惠券仅可使用一次{'\n'}
            • 优惠券不可叠加使用{'\n'}
            • 已领取的优惠券请在有效期内使用
          </Text>
        </View>
      </ScrollView>
    </View>
  )
}

export default CouponPage
