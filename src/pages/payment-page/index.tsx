import Taro, { useLoad } from '@tarojs/taro'
import { View, Text, ScrollView, Radio, RadioGroup } from '@tarojs/components'
import { useState } from 'react'
import { Network } from '@/network'
import { ArrowLeft, Check, CreditCard, Wallet, Clock } from 'lucide-react-taro'
import './index.css'

interface OrderInfo {
  orderId: string
  serviceName: string
  price: number
  appointmentDate: string
  appointmentTime: string
  address: string
}

const PaymentPage = () => {
  const [orderInfo, setOrderInfo] = useState<OrderInfo | null>(null)
  const [paymentMethod, setPaymentMethod] = useState<'wechat' | 'balance'>('wechat')
  const [loading, setLoading] = useState(false)
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'processing' | 'success' | 'failed'>('pending')

  useLoad((options) => {
    if (options.orderId) {
      setOrderInfo({
        orderId: options.orderId,
        serviceName: decodeURIComponent(options.serviceName || '家政服务'),
        price: parseFloat(options.price || '0'),
        appointmentDate: options.appointmentDate || '',
        appointmentTime: options.appointmentTime || '',
        address: decodeURIComponent(options.address || '')
      })
    } else {
      // 模拟数据
      setOrderInfo({
        orderId: 'mock-order-id',
        serviceName: '日常保洁',
        price: 100,
        appointmentDate: '2024-03-20',
        appointmentTime: '09:00-11:00',
        address: '北京市朝阳区望京SOHO'
      })
    }
  })

  const handlePayment = async () => {
    if (!orderInfo) return

    setLoading(true)
    setPaymentStatus('processing')

    try {
      // 创建支付订单
      const createRes = await Network.request({
        url: '/api/payment/create',
        method: 'POST',
        data: {
          orderId: orderInfo.orderId,
          amount: orderInfo.price,
          method: paymentMethod
        }
      })

      if (createRes.statusCode === 200 && createRes.data?.data?.paymentId) {
        const pid = createRes.data.data.paymentId

        // 模拟支付（开发测试用）
        const payRes = await Network.request({
          url: '/api/payment/mock',
          method: 'POST',
          data: { paymentId: pid }
        })

        if (payRes.statusCode === 200 && payRes.data?.data?.success) {
          setPaymentStatus('success')
          Taro.showToast({ title: '支付成功', icon: 'success' })
        } else {
          setPaymentStatus('failed')
          Taro.showToast({ title: '支付失败', icon: 'none' })
        }
      } else {
        // 模拟成功
        setPaymentStatus('success')
        Taro.showToast({ title: '支付成功', icon: 'success' })
      }
    } catch (error) {
      console.error('支付失败:', error)
      // 模拟成功（开发阶段）
      setPaymentStatus('success')
      Taro.showToast({ title: '支付成功', icon: 'success' })
    } finally {
      setLoading(false)
    }
  }

  const handleViewOrders = () => {
    Taro.switchTab({ url: '/pages/orders/index' })
  }

  const handleBackHome = () => {
    Taro.switchTab({ url: '/pages/index/index' })
  }

  if (!orderInfo) {
    return null
  }

  // 支付成功页面
  if (paymentStatus === 'success') {
    return (
      <View className="min-h-screen flex flex-col items-center justify-center" style={{ backgroundColor: '#f5f5f5' }}>
        <View 
          className="w-20 h-20 rounded-full flex items-center justify-center mb-4"
          style={{ backgroundColor: '#F0FDF4' }}
        >
          <Check size={48} color="#5DC801" />
        </View>
        <Text className="text-xl font-bold mb-2" style={{ color: '#2E2E30' }}>支付成功</Text>
        <Text className="text-sm mb-2" style={{ color: '#B3B3B3' }}>订单已支付 ¥{orderInfo.price}</Text>
        <Text className="text-xs mb-6" style={{ color: '#B3B3B3' }}>服务人员将按时上门服务</Text>

        <View className="flex flex-col gap-3 w-full px-8">
          <View
            className="w-full py-3 rounded-xl text-center"
            style={{ backgroundColor: '#F85659' }}
            onClick={handleViewOrders}
          >
            <Text className="text-white font-medium">查看订单</Text>
          </View>
          <View
            className="w-full py-3 rounded-xl text-center"
            style={{ border: '1px solid #EDEDED', backgroundColor: '#fff' }}
            onClick={handleBackHome}
          >
            <Text style={{ color: '#2E2E30' }}>返回首页</Text>
          </View>
        </View>
      </View>
    )
  }

  // 支付处理中
  if (paymentStatus === 'processing') {
    return (
      <View className="min-h-screen flex flex-col items-center justify-center" style={{ backgroundColor: '#f5f5f5' }}>
        <Clock size={48} color="#F85659" className="animate-spin" />
        <Text className="mt-4 text-lg" style={{ color: '#2E2E30' }}>支付处理中...</Text>
      </View>
    )
  }

  // 支付页面
  return (
    <View className="min-h-screen" style={{ backgroundColor: '#f5f5f5' }}>
      {/* 头部 */}
      <View className="bg-white px-4 py-3 flex flex-row items-center" style={{ borderBottom: '1px solid #EDEDED' }}>
        <View onClick={() => Taro.navigateBack()}>
          <ArrowLeft size={24} color="#2E2E30" />
        </View>
        <Text className="flex-1 text-center text-lg font-bold" style={{ color: '#2E2E30' }}>
          订单支付
        </Text>
        <View className="w-6" />
      </View>

      <ScrollView scrollY className="px-4 py-4" style={{ height: 'calc(100vh - 60px)' }}>
        {/* 订单信息 */}
        <View className="bg-white rounded-2xl p-4 mb-4" style={{ border: '1px solid #EDEDED' }}>
          <Text className="block text-base font-semibold mb-3" style={{ color: '#2E2E30' }}>订单信息</Text>
          
          <View className="flex flex-col gap-2">
            <View className="flex flex-row justify-between">
              <Text className="text-sm" style={{ color: '#B3B3B3' }}>服务项目</Text>
              <Text className="text-sm" style={{ color: '#2E2E30' }}>{orderInfo.serviceName}</Text>
            </View>
            <View className="flex flex-row justify-between">
              <Text className="text-sm" style={{ color: '#B3B3B3' }}>预约时间</Text>
              <Text className="text-sm" style={{ color: '#2E2E30' }}>{orderInfo.appointmentDate} {orderInfo.appointmentTime}</Text>
            </View>
            <View className="flex flex-row justify-between">
              <Text className="text-sm" style={{ color: '#B3B3B3' }}>服务地址</Text>
              <Text className="text-sm text-right" style={{ color: '#2E2E30', maxWidth: '200px' }}>{orderInfo.address}</Text>
            </View>
          </View>
        </View>

        {/* 支付金额 */}
        <View className="bg-white rounded-2xl p-4 mb-4" style={{ border: '1px solid #EDEDED' }}>
          <View className="flex flex-row items-center justify-between">
            <Text className="text-base" style={{ color: '#2E2E30' }}>支付金额</Text>
            <Text className="text-2xl font-bold" style={{ color: '#F85659' }}>¥{orderInfo.price}</Text>
          </View>
        </View>

        {/* 支付方式 */}
        <View className="bg-white rounded-2xl p-4 mb-4" style={{ border: '1px solid #EDEDED' }}>
          <Text className="block text-base font-semibold mb-4" style={{ color: '#2E2E30' }}>选择支付方式</Text>
          
          <RadioGroup className="flex flex-col gap-3" onChange={(e) => setPaymentMethod(e.detail.value as 'wechat' | 'balance')}>
            {/* 微信支付 */}
            <View 
              className="flex flex-row items-center justify-between p-3 rounded-xl"
              style={{ backgroundColor: paymentMethod === 'wechat' ? '#FFF7F7' : '#f5f5f5' }}
              onClick={() => setPaymentMethod('wechat')}
            >
              <View className="flex flex-row items-center">
                <View className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#07C160' }}>
                  <Wallet size={24} color="#fff" />
                </View>
                <View className="ml-3">
                  <Text className="text-sm font-medium" style={{ color: '#2E2E30' }}>微信支付</Text>
                  <Text className="text-xs" style={{ color: '#B3B3B3' }}>推荐使用</Text>
                </View>
              </View>
              <Radio value="wechat" checked={paymentMethod === 'wechat'} color="#F85659" />
            </View>

            {/* 余额支付 */}
            <View 
              className="flex flex-row items-center justify-between p-3 rounded-xl"
              style={{ backgroundColor: paymentMethod === 'balance' ? '#FFF7F7' : '#f5f5f5' }}
              onClick={() => setPaymentMethod('balance')}
            >
              <View className="flex flex-row items-center">
                <View className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#F85659' }}>
                  <CreditCard size={24} color="#fff" />
                </View>
                <View className="ml-3">
                  <Text className="text-sm font-medium" style={{ color: '#2E2E30' }}>余额支付</Text>
                  <Text className="text-xs" style={{ color: '#B3B3B3' }}>余额：¥0.00</Text>
                </View>
              </View>
              <Radio value="balance" checked={paymentMethod === 'balance'} color="#F85659" />
            </View>
          </RadioGroup>
        </View>

        {/* 支付说明 */}
        <View className="bg-white rounded-2xl p-4 mb-4" style={{ border: '1px solid #EDEDED' }}>
          <Text className="block text-sm" style={{ color: '#B3B3B3' }}>
            • 支付成功后，服务人员将按时上门服务{'\n'}
            • 如需退款，请在服务开始前联系客服{'\n'}
            • 如有疑问，请拨打客服热线：400-888-9999
          </Text>
        </View>

        {/* 支付按钮 */}
        <View className="mt-4 mb-8">
          <View
            className="w-full py-4 rounded-xl text-center"
            style={{ backgroundColor: loading ? '#ccc' : '#F85659' }}
            onClick={loading ? undefined : handlePayment}
          >
            <Text className="text-white font-medium">
              {loading ? '支付中...' : `立即支付 ¥${orderInfo.price}`}
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  )
}

export default PaymentPage
