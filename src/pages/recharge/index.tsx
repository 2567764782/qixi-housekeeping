import Taro, { useLoad } from '@tarojs/taro'
import { View, Text, ScrollView, Input } from '@tarojs/components'
import { useState } from 'react'
import { Network } from '@/network'
import { Wallet, Plus, Check, Info, ArrowLeft } from 'lucide-react-taro'
import './index.css'

const RechargePage = () => {
  const [balance, setBalance] = useState(0)
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null)
  const [customAmount, setCustomAmount] = useState('')
  const [loading, setLoading] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<'wechat' | 'alipay'>('wechat')

  useLoad(() => {
    loadBalance()
  })

  const loadBalance = async () => {
    try {
      const token = Taro.getStorageSync('token')
      if (!token) return

      const res = await Network.request({
        url: '/api/payment/balance',
        method: 'GET'
      })

      if (res.statusCode === 200 && res.data?.data) {
        setBalance(res.data.data.balance || 0)
      }
    } catch (error) {
      console.error('加载余额失败:', error)
    }
  }

  const rechargeAmounts = [50, 100, 200, 500, 1000, 2000]

  const handleRecharge = async () => {
    const amount = selectedAmount || parseFloat(customAmount)
    if (!amount || amount < 10) {
      Taro.showToast({ title: '最低充值10元', icon: 'none' })
      return
    }

    const token = Taro.getStorageSync('token')
    if (!token) {
      Taro.showToast({ title: '请先登录', icon: 'none' })
      setTimeout(() => {
        Taro.navigateTo({ url: '/pages/login/index' })
      }, 1500)
      return
    }

    setLoading(true)

    try {
      const res = await Network.request({
        url: '/api/payment/recharge',
        method: 'POST',
        data: {
          amount,
          paymentMethod
        }
      })

      if (res.statusCode === 200 && res.data?.code === 200) {
        Taro.showToast({ title: '充值成功', icon: 'success' })
        setBalance(balance + amount)
        setSelectedAmount(null)
        setCustomAmount('')
      } else {
        throw new Error(res.data?.msg || '充值失败')
      }
    } catch (error: any) {
      Taro.showToast({ title: error.message || '充值失败', icon: 'none' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <View className="min-h-screen" style={{ backgroundColor: '#f5f5f5' }}>
      {/* 头部 */}
      <View className="bg-white px-4 py-3 flex flex-row items-center" style={{ borderBottom: '1px solid #EDEDED' }}>
        <View onClick={() => Taro.navigateBack()}>
          <ArrowLeft size={24} color="#2E2E30" />
        </View>
        <Text className="flex-1 text-center text-lg font-bold" style={{ color: '#2E2E30' }}>
          余额充值
        </Text>
        <View className="w-6" />
      </View>

      <ScrollView scrollY className="h-screen">
        {/* 余额卡片 */}
        <View className="m-4 rounded-2xl p-6" style={{ background: 'linear-gradient(135deg, #F85659 0%, #FF8A8A 100%)' }}>
          <View className="flex flex-row items-center mb-4">
            <Wallet size={32} color="#fff" />
            <Text className="ml-2 text-white text-lg">账户余额</Text>
          </View>
          <Text className="text-white text-4xl font-bold">¥{balance.toFixed(2)}</Text>
          <Text className="text-white text-xs mt-2" style={{ opacity: 0.8 }}>
            充值后可用于支付订单
          </Text>
        </View>

        {/* 充值金额选择 */}
        <View className="mx-4 mb-4 bg-white rounded-2xl p-4">
          <Text className="block text-base font-semibold mb-4" style={{ color: '#2E2E30' }}>
            选择充值金额
          </Text>
          
          <View className="grid grid-cols-3 gap-3">
            {rechargeAmounts.map(amount => (
              <View
                key={amount}
                className={`recharge-item ${selectedAmount === amount ? 'selected' : ''}`}
                onClick={() => {
                  setSelectedAmount(amount)
                  setCustomAmount('')
                }}
              >
                <Text className="text-lg font-bold" style={{ color: selectedAmount === amount ? '#F85659' : '#2E2E30' }}>
                  ¥{amount}
                </Text>
                {selectedAmount === amount && (
                  <View className="check-icon">
                    <Check size={14} color="#fff" />
                  </View>
                )}
              </View>
            ))}
          </View>

          {/* 自定义金额 */}
          <View className="mt-4">
            <Text className="block text-sm mb-2" style={{ color: '#B3B3B3' }}>其他金额</Text>
            <View className="custom-amount-input">
              <Text className="text-lg font-bold" style={{ color: '#2E2E30' }}>¥</Text>
              <Input
                className="flex-1 text-lg font-bold"
                type="number"
                placeholder="请输入充值金额"
                value={customAmount}
                onInput={(e) => {
                  setCustomAmount(e.detail.value)
                  setSelectedAmount(null)
                }}
              />
            </View>
          </View>
        </View>

        {/* 支付方式选择 */}
        <View className="mx-4 mb-4 bg-white rounded-2xl p-4">
          <Text className="block text-base font-semibold mb-4" style={{ color: '#2E2E30' }}>
            选择支付方式
          </Text>
          
          <View className="payment-method-list">
            {/* 微信支付 */}
            <View
              className={`payment-method-item ${paymentMethod === 'wechat' ? 'selected' : ''}`}
              onClick={() => setPaymentMethod('wechat')}
            >
              <View className="payment-icon wechat">
                <Wallet size={24} color="#fff" />
              </View>
              <View className="flex-1">
                <Text className="text-sm font-medium" style={{ color: '#2E2E30' }}>微信支付</Text>
                <Text className="text-xs" style={{ color: '#B3B3B3' }}>推荐使用</Text>
              </View>
              <View className={`radio-circle ${paymentMethod === 'wechat' ? 'checked' : ''}`} />
            </View>

            {/* 支付宝支付 */}
            <View
              className={`payment-method-item ${paymentMethod === 'alipay' ? 'selected' : ''}`}
              onClick={() => setPaymentMethod('alipay')}
            >
              <View className="payment-icon alipay">
                <Wallet size={24} color="#fff" />
              </View>
              <View className="flex-1">
                <Text className="text-sm font-medium" style={{ color: '#2E2E30' }}>支付宝支付</Text>
                <Text className="text-xs" style={{ color: '#B3B3B3' }}>快捷支付</Text>
              </View>
              <View className={`radio-circle ${paymentMethod === 'alipay' ? 'checked' : ''}`} />
            </View>
          </View>
        </View>

        {/* 充值说明 */}
        <View className="mx-4 mb-4 bg-white rounded-2xl p-4">
          <View className="flex flex-row items-center mb-3">
            <Info size={16} color="#F85659" />
            <Text className="ml-2 text-sm font-semibold" style={{ color: '#2E2E30' }}>充值说明</Text>
          </View>
          <Text className="block text-xs leading-6" style={{ color: '#B3B3B3' }}>
            • 充值金额最低10元起{'\n'}
            • 充值成功后余额实时到账{'\n'}
            • 余额可用于支付所有订单{'\n'}
            • 余额提现需联系客服处理
          </Text>
        </View>

        {/* 充值按钮 */}
        <View className="mx-4 mb-8">
          <View
            className="recharge-btn"
            style={{ backgroundColor: loading ? '#ccc' : '#F85659' }}
            onClick={loading ? undefined : handleRecharge}
          >
            <Plus size={20} color="#fff" />
            <Text className="text-white font-medium ml-2">
              {loading ? '充值中...' : '立即充值'}
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  )
}

export default RechargePage
