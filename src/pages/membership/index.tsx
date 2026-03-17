import { View, Text, ScrollView } from '@tarojs/components'
import Taro, { useLoad } from '@tarojs/taro'
import { useState } from 'react'
import { Crown, Check, Star, Gift, Shield } from 'lucide-react-taro'
import { Network } from '@/network'
import './index.css'

interface MembershipPlan {
  id: string
  name: string
  type: string
  price: number
  originalPrice: number
  duration: number
  durationUnit: string
  discount: number
  benefits: string[]
  recommended?: boolean
}

const MembershipPage = () => {
  const [plans, setPlans] = useState<MembershipPlan[]>([])
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)

  useLoad(() => {
    loadPlans()
  })

  const loadPlans = async () => {
    try {
      const res = await Network.request({
        url: '/api/membership/plans',
        method: 'GET'
      })

      if (res.statusCode === 200 && res.data?.data) {
        setPlans(res.data.data)
      }
    } catch (error) {
      console.error('加载套餐失败:', error)
      // 使用默认数据
      setPlans([
        {
          id: 'monthly',
          name: '按月会员',
          type: 'monthly',
          price: 29.9,
          originalPrice: 39.9,
          duration: 1,
          durationUnit: '月',
          discount: 0.9,
          benefits: ['全场服务9折优惠', '专属客服通道', '优先预约权'],
        },
        {
          id: 'quarterly',
          name: '季度会员',
          type: 'quarterly',
          price: 79.9,
          originalPrice: 119.7,
          duration: 3,
          durationUnit: '月',
          discount: 0.85,
          benefits: ['全场服务85折优惠', '专属客服通道', '优先预约权', '免费上门评估'],
          recommended: true,
        },
        {
          id: 'yearly',
          name: '年度会员',
          type: 'yearly',
          price: 299.9,
          originalPrice: 478.8,
          duration: 12,
          durationUnit: '月',
          discount: 0.8,
          benefits: ['全场服务8折优惠', '专属客服通道', '优先预约权', '免费上门评估', '生日专属礼品', '新服务免费体验'],
        },
      ])
    }
  }

  const handlePurchase = async (plan: MembershipPlan) => {
    // 检查登录状态
    const token = Taro.getStorageSync('token')
    if (!token) {
      Taro.showToast({ title: '请先登录', icon: 'none' })
      setTimeout(() => {
        Taro.navigateTo({ url: '/pages/login/index' })
      }, 1500)
      return
    }

    setSelectedPlan(plan.id)

    try {
      const res = await Network.request({
        url: '/api/membership/purchase',
        method: 'POST',
        data: {
          type: plan.type,
          duration: 1,
          paymentMethod: 'wechat'
        }
      })

      if (res.statusCode === 200 && res.data?.code === 200) {
        Taro.showToast({ title: '购买成功', icon: 'success' })
        setTimeout(() => {
          Taro.switchTab({ url: '/pages/profile/index' })
        }, 1500)
      } else {
        throw new Error(res.data?.msg || '购买失败')
      }
    } catch (error: any) {
      Taro.showToast({ title: error.message || '购买失败', icon: 'none' })
    } finally {
      setSelectedPlan(null)
    }
  }

  const getPlanIcon = (type: string, color: string) => {
    switch (type) {
      case 'monthly':
        return <Star size={24} color={color} />
      case 'quarterly':
        return <Gift size={24} color={color} />
      case 'yearly':
        return <Crown size={24} color={color} />
      default:
        return <Crown size={24} color={color} />
    }
  }

  const getPlanColor = (type: string) => {
    switch (type) {
      case 'monthly':
        return '#3B82F6'
      case 'quarterly':
        return '#F97316'
      case 'yearly':
        return '#9B40D8'
      default:
        return '#3B82F6'
    }
  }

  return (
    <View className="min-h-screen" style={{ backgroundColor: '#f5f5f5' }}>
      {/* 顶部Banner */}
      <View className="banner">
        <View className="banner-bg">
          <Crown size={80} color="rgba(255,255,255,0.15)" />
        </View>
        <View className="banner-content">
          <Text className="banner-title">成为柒玺会员</Text>
          <Text className="banner-subtitle">专享折扣 · 优先服务 · 贴心权益</Text>
        </View>
      </View>

      <ScrollView scrollY className="content-scroll">
        {/* 会员权益说明 */}
        <View className="benefits-section">
          <View className="section-header">
            <Shield size={18} color="#F85659" />
            <Text className="section-title">会员权益</Text>
          </View>
          <View className="benefits-grid">
            <View className="benefit-item">
              <View className="benefit-icon" style={{ backgroundColor: '#FFF5F5' }}>
                <Star size={20} color="#F85659" />
              </View>
              <Text className="benefit-name">专属折扣</Text>
              <Text className="benefit-desc">服务享折扣优惠</Text>
            </View>
            <View className="benefit-item">
              <View className="benefit-icon" style={{ backgroundColor: '#F0F7FF' }}>
                <Check size={20} color="#007CFF" />
              </View>
              <Text className="benefit-name">优先预约</Text>
              <Text className="benefit-desc">优先安排服务</Text>
            </View>
            <View className="benefit-item">
              <View className="benefit-icon" style={{ backgroundColor: '#FFF7ED' }}>
                <Gift size={20} color="#F97316" />
              </View>
              <Text className="benefit-name">专属礼品</Text>
              <Text className="benefit-desc">生日惊喜好礼</Text>
            </View>
          </View>
        </View>

        {/* 套餐列表 */}
        <View className="plans-section">
          <View className="section-header">
            <Crown size={18} color="#F85659" />
            <Text className="section-title">选择套餐</Text>
          </View>

          {plans.map(plan => {
            const color = getPlanColor(plan.type)
            return (
              <View 
                key={plan.id}
                className={`plan-card ${plan.recommended ? 'recommended' : ''}`}
              >
                {plan.recommended && (
                  <View className="recommend-tag" style={{ backgroundColor: color }}>
                    <Text className="recommend-text">推荐</Text>
                  </View>
                )}
                
                <View className="plan-header">
                  <View className="plan-icon" style={{ backgroundColor: `${color}15` }}>
                    {getPlanIcon(plan.type, color)}
                  </View>
                  <View className="plan-info">
                    <Text className="plan-name">{plan.name}</Text>
                    <Text className="plan-duration">{plan.duration}{plan.durationUnit}</Text>
                  </View>
                  <View className="plan-price">
                    <Text className="price-current" style={{ color }}>¥{plan.price}</Text>
                    <Text className="price-original">¥{plan.originalPrice}</Text>
                  </View>
                </View>

                <View className="plan-benefits">
                  {plan.benefits.map((benefit, index) => (
                    <View key={index} className="benefit-row">
                      <Check size={14} color={color} />
                      <Text className="benefit-text">{benefit}</Text>
                    </View>
                  ))}
                </View>

                <View 
                  className="plan-btn"
                  style={{ backgroundColor: color }}
                  onClick={() => handlePurchase(plan)}
                >
                  {selectedPlan === plan.id ? (
                    <Text className="btn-text">处理中...</Text>
                  ) : (
                    <Text className="btn-text">立即开通</Text>
                  )}
                </View>
              </View>
            )
          })}
        </View>

        {/* 说明 */}
        <View className="notice-section">
          <Text className="notice-title">温馨提示</Text>
          <Text className="notice-text">1. 会员权益自开通之日起生效</Text>
          <Text className="notice-text">2. 会员折扣可与部分活动优惠叠加</Text>
          <Text className="notice-text">3. 如有疑问请联系客服：400-888-9999</Text>
        </View>
      </ScrollView>
    </View>
  )
}

export default MembershipPage
