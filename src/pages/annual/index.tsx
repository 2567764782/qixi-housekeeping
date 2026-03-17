import { View, Text, ScrollView } from '@tarojs/components'
import Taro, { useLoad } from '@tarojs/taro'
import { useState } from 'react'
import { Crown, Check, ChevronRight, Shield, Zap, Heart } from 'lucide-react-taro'
import { Network } from '@/network'
import './index.css'

interface AnnualPlan {
  id: string
  name: string
  price: number
  originalPrice: number
  savings: number
  benefits: string[]
  type: string
}

const AnnualPage = () => {
  const [plan, setPlan] = useState<AnnualPlan>({
    id: 'annual',
    name: '包年会员',
    type: 'annual',
    price: 299,
    originalPrice: 478.8,
    savings: 179.8,
    benefits: [
      '全场服务8折优惠',
      '专属客服通道',
      '优先预约权',
      '免费上门评估',
      '生日专属礼遇',
      '积分双倍奖励',
      '节日特惠活动',
      '年度深度保洁1次',
    ],
  })
  const [purchasing, setPurchasing] = useState(false)

  useLoad(() => {
    loadPlan()
  })

  const loadPlan = async () => {
    try {
      const res = await Network.request({
        url: '/api/membership/plans',
        method: 'GET'
      })

      if (res.statusCode === 200 && res.data?.data) {
        const annualPlan = res.data.data.find((p: AnnualPlan) => p.type === 'annual')
        if (annualPlan) {
          setPlan(annualPlan)
        }
      }
    } catch (error) {
      console.error('加载套餐失败:', error)
    }
  }

  const handlePurchase = async () => {
    const token = Taro.getStorageSync('token')
    if (!token) {
      Taro.showToast({ title: '请先登录', icon: 'none' })
      setTimeout(() => {
        Taro.navigateTo({ url: '/pages/login/index' })
      }, 1500)
      return
    }

    setPurchasing(true)

    try {
      const res = await Network.request({
        url: '/api/membership/purchase',
        method: 'POST',
        data: {
          type: 'annual',
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
      setPurchasing(false)
    }
  }

  const features = [
    { icon: Shield, title: '安全保障', desc: '全程保险覆盖' },
    { icon: Zap, title: '极速响应', desc: '2小时上门' },
    { icon: Heart, title: '贴心服务', desc: '满意度保证' },
  ]

  return (
    <View className="min-h-screen" style={{ backgroundColor: '#f5f5f5' }}>
      {/* 顶部Banner */}
      <View className="annual-banner">
        <View className="annual-banner-top">
          <Crown size={56} color="#fff" />
          <Text className="annual-banner-title">尊享年卡会员</Text>
          <Text className="annual-banner-subtitle">VIP专属特权 · 尊贵体验</Text>
        </View>
        
        {/* 价格卡片 */}
        <View className="price-card">
          <View className="price-row">
            <Text className="price-label">限时特惠</Text>
            <Text className="price-value">¥{plan.price}</Text>
            <Text className="price-unit">/年</Text>
          </View>
          <View className="price-original-row">
            <Text className="price-original">原价 ¥{plan.originalPrice}</Text>
            <View className="save-badge">
              <Text className="save-text">省¥{plan.savings}</Text>
            </View>
          </View>
        </View>
      </View>

      <ScrollView scrollY className="annual-content-scroll">
        {/* 核心权益 */}
        <View className="rights-section">
          <Text className="section-title">核心权益</Text>
          <View className="rights-grid">
            {plan.benefits.map((benefit, idx) => (
              <View key={idx} className="right-item">
                <View className="right-check">
                  <Check size={14} color="#fff" />
                </View>
                <Text className="right-text">{benefit}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* 服务保障 */}
        <View className="guarantee-section">
          <Text className="section-title">服务保障</Text>
          <View className="guarantee-grid">
            {features.map((feature, idx) => (
              <View key={idx} className="guarantee-item">
                <View className="guarantee-icon">
                  <feature.icon size={24} color="#F85659" />
                </View>
                <Text className="guarantee-title">{feature.title}</Text>
                <Text className="guarantee-desc">{feature.desc}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* 购买须知 */}
        <View className="notice-section">
          <Text className="section-title">购买须知</Text>
          <View className="notice-list">
            <Text className="notice-item">• 会员权益自开通之日起一年内有效</Text>
            <Text className="notice-item">• 年卡会员尊享8折优惠，部分特价商品除外</Text>
            <Text className="notice-item">• 年度深度保洁服务需提前7天预约</Text>
            <Text className="notice-item">• 生日礼遇将在生日当月自动发放</Text>
            <Text className="notice-item">• 会员权益不可转让、不可退款</Text>
          </View>
        </View>

        {/* 底部购买按钮 */}
        <View className="annual-footer">
          <View className="footer-price">
            <Text className="footer-label">支付金额</Text>
            <Text className="footer-amount">¥{plan.price}</Text>
          </View>
          <View 
            className="footer-btn"
            onClick={handlePurchase}
          >
            <Text className="footer-btn-text">
              {purchasing ? '处理中...' : '立即开通'}
            </Text>
            <ChevronRight size={20} color="#fff" />
          </View>
        </View>
      </ScrollView>
    </View>
  )
}

export default AnnualPage
