import { View, Text, ScrollView } from '@tarojs/components'
import Taro, { useLoad } from '@tarojs/taro'
import { useState } from 'react'
import { Gift, Check, ChevronRight, Clock, Percent, Star } from 'lucide-react-taro'
import { Network } from '@/network'
import './index.css'

interface SubscriptionPlan {
  id: string
  name: string
  price: number
  originalPrice: number
  duration: number
  durationUnit: string
  discount: number
  benefits: string[]
  type: string
}

const SubscriptionPage = () => {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([])
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
        // 只取按月和季度的套餐
        const subscriptionPlans = res.data.data.filter(
          (p: SubscriptionPlan) => p.type === 'monthly' || p.type === 'quarterly'
        )
        setPlans(subscriptionPlans)
      }
    } catch (error) {
      console.error('加载套餐失败:', error)
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
        },
      ])
    }
  }

  const handlePurchase = async (plan: SubscriptionPlan) => {
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

  return (
    <View className="min-h-screen" style={{ backgroundColor: '#f5f5f5' }}>
      {/* 顶部Banner */}
      <View className="sub-banner">
        <View className="sub-banner-bg" />
        <View className="sub-banner-content">
          <Gift size={48} color="#fff" />
          <Text className="sub-banner-title">按月/季度服务</Text>
          <Text className="sub-banner-desc">灵活选择 · 超值优惠</Text>
        </View>
      </View>

      <ScrollView scrollY className="sub-content-scroll">
        {/* 特点说明 */}
        <View className="features-section">
          <View className="feature-item">
            <View className="feature-icon">
              <Percent size={20} color="#F97316" />
            </View>
            <Text className="feature-name">专属折扣</Text>
          </View>
          <View className="feature-item">
            <View className="feature-icon">
              <Clock size={20} color="#F97316" />
            </View>
            <Text className="feature-name">灵活周期</Text>
          </View>
          <View className="feature-item">
            <View className="feature-icon">
              <Star size={20} color="#F97316" />
            </View>
            <Text className="feature-name">优先服务</Text>
          </View>
        </View>

        {/* 套餐选择 */}
        <View className="sub-plans-section">
          {plans.map(plan => (
            <View key={plan.id} className="sub-plan-card">
              <View className="sub-plan-header">
                <View className="sub-plan-title-area">
                  <Text className="sub-plan-name">{plan.name}</Text>
                  <Text className="sub-plan-discount">享受{plan.discount * 10}折优惠</Text>
                </View>
                <View className="sub-plan-price-area">
                  <Text className="sub-price-current">¥{plan.price}</Text>
                  <Text className="sub-price-original">¥{plan.originalPrice}</Text>
                </View>
              </View>

              <View className="sub-plan-benefits">
                {plan.benefits.map((benefit, idx) => (
                  <View key={idx} className="sub-benefit-item">
                    <Check size={16} color="#10B981" />
                    <Text className="sub-benefit-text">{benefit}</Text>
                  </View>
                ))}
              </View>

              <View 
                className="sub-plan-btn"
                onClick={() => handlePurchase(plan)}
              >
                <Text className="sub-btn-text">
                  {selectedPlan === plan.id ? '处理中...' : '立即开通'}
                </Text>
                <ChevronRight size={18} color="#fff" />
              </View>
            </View>
          ))}
        </View>

        {/* 对比说明 */}
        <View className="compare-section">
          <Text className="compare-title">套餐对比</Text>
          <View className="compare-table">
            <View className="compare-row header">
              <Text className="compare-cell">权益</Text>
              <Text className="compare-cell">按月</Text>
              <Text className="compare-cell">季度</Text>
            </View>
            <View className="compare-row">
              <Text className="compare-cell">服务折扣</Text>
              <Text className="compare-cell">9折</Text>
              <Text className="compare-cell highlight">85折</Text>
            </View>
            <View className="compare-row">
              <Text className="compare-cell">专属客服</Text>
              <Text className="compare-cell">✓</Text>
              <Text className="compare-cell">✓</Text>
            </View>
            <View className="compare-row">
              <Text className="compare-cell">优先预约</Text>
              <Text className="compare-cell">✓</Text>
              <Text className="compare-cell">✓</Text>
            </View>
            <View className="compare-row">
              <Text className="compare-cell">免费评估</Text>
              <Text className="compare-cell">-</Text>
              <Text className="compare-cell highlight">✓</Text>
            </View>
          </View>
        </View>

        {/* 底部说明 */}
        <View className="sub-notice">
          <Text className="sub-notice-text">• 会员权益自开通之日起生效</Text>
          <Text className="sub-notice-text">• 到期后自动失效，可续费</Text>
          <Text className="sub-notice-text">• 如有疑问请联系客服：400-888-9999</Text>
        </View>
      </ScrollView>
    </View>
  )
}

export default SubscriptionPage
