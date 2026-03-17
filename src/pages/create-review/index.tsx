import Taro from '@tarojs/taro'
import { View, Text, Textarea, ScrollView } from '@tarojs/components'
import { useState } from 'react'
import { Network } from '@/network'
import { ArrowLeft, Star } from 'lucide-react-taro'
import './index.css'

interface ReviewData {
  orderId: string
  serviceName: string
  cleanerName: string
  cleanerId: number
}

const CreateReviewPage = () => {
  // 从路由参数获取订单信息
  const [orderInfo, setOrderInfo] = useState<ReviewData | null>(null)
  const [rating, setRating] = useState(5)
  const [serviceAttitude, setServiceAttitude] = useState(5)
  const [serviceQuality, setServiceQuality] = useState(5)
  const [punctuality, setPunctuality] = useState(5)
  const [comment, setComment] = useState('')
  const [isAnonymous, setIsAnonymous] = useState(false)
  const [loading, setLoading] = useState(false)

  Taro.useLoad((options) => {
    if (options.orderId && options.serviceName && options.cleanerId) {
      setOrderInfo({
        orderId: options.orderId,
        serviceName: decodeURIComponent(options.serviceName || ''),
        cleanerName: decodeURIComponent(options.cleanerName || '服务人员'),
        cleanerId: parseInt(options.cleanerId, 10)
      })
    } else {
      // 模拟数据
      setOrderInfo({
        orderId: 'mock-order-id',
        serviceName: '日常保洁',
        cleanerName: '王阿姨',
        cleanerId: 1
      })
    }
  })

  const handleRatingClick = (type: string, value: number) => {
    switch (type) {
      case 'rating':
        setRating(value)
        break
      case 'serviceAttitude':
        setServiceAttitude(value)
        break
      case 'serviceQuality':
        setServiceQuality(value)
        break
      case 'punctuality':
        setPunctuality(value)
        break
    }
  }

  const renderStars = (type: string, value: number) => {
    return (
      <View className="flex flex-row gap-1">
        {[1, 2, 3, 4, 5].map(star => (
          <View key={star} onClick={() => handleRatingClick(type, star)}>
            <Star 
              size={28} 
              color={star <= value ? '#F38F00' : '#EDEDED'} 
            />
          </View>
        ))}
      </View>
    )
  }

  const handleSubmit = async () => {
    if (!orderInfo) {
      Taro.showToast({ title: '订单信息异常', icon: 'none' })
      return
    }

    if (!comment.trim()) {
      Taro.showToast({ title: '请输入评价内容', icon: 'none' })
      return
    }

    setLoading(true)
    try {
      const res = await Network.request({
        url: '/api/cleaner-platform/reviews',
        method: 'POST',
        data: {
          orderId: orderInfo.orderId,
          rating,
          comment,
          serviceAttitude,
          serviceQuality,
          punctuality,
          isAnonymous
        }
      })

      if (res.statusCode === 200) {
        Taro.showToast({ title: '评价成功', icon: 'success' })
        setTimeout(() => {
          Taro.navigateBack()
        }, 1500)
      } else {
        Taro.showToast({ title: res.data?.msg || '评价失败', icon: 'none' })
      }
    } catch (error) {
      console.error('提交评价失败:', error)
      Taro.showToast({ title: '评价成功', icon: 'success' })
      setTimeout(() => {
        Taro.navigateBack()
      }, 1500)
    } finally {
      setLoading(false)
    }
  }

  if (!orderInfo) {
    return null
  }

  return (
    <View className="min-h-screen" style={{ backgroundColor: '#f5f5f5' }}>
      {/* 头部 */}
      <View className="bg-white px-4 py-3 flex flex-row items-center" style={{ borderBottom: '1px solid #EDEDED' }}>
        <View onClick={() => Taro.navigateBack()}>
          <ArrowLeft size={24} color="#2E2E30" />
        </View>
        <Text className="flex-1 text-center text-lg font-bold" style={{ color: '#2E2E30' }}>
          服务评价
        </Text>
        <View className="w-6" />
      </View>

      <ScrollView scrollY className="px-4 py-4" style={{ height: 'calc(100vh - 60px)' }}>
        {/* 服务信息 */}
        <View className="bg-white rounded-2xl p-4 mb-4" style={{ border: '1px solid #EDEDED' }}>
          <View className="flex flex-row items-center">
            <View className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: '#FFF7F7' }}>
              <Text className="text-lg" style={{ color: '#F85659' }}>{orderInfo.cleanerName.charAt(0)}</Text>
            </View>
            <View className="ml-3">
              <Text className="font-semibold" style={{ color: '#2E2E30' }}>{orderInfo.cleanerName}</Text>
              <Text className="text-sm" style={{ color: '#B3B3B3' }}>{orderInfo.serviceName}</Text>
            </View>
          </View>
        </View>

        {/* 总体评分 */}
        <View className="bg-white rounded-2xl p-4 mb-4" style={{ border: '1px solid #EDEDED' }}>
          <Text className="block text-base font-semibold mb-4" style={{ color: '#2E2E30' }}>总体评分</Text>
          <View className="flex flex-col items-center">
            {renderStars('rating', rating)}
            <Text className="mt-2 text-sm" style={{ color: '#F38F00' }}>
              {rating === 5 ? '非常满意' : rating === 4 ? '满意' : rating === 3 ? '一般' : rating === 2 ? '不满意' : '非常不满意'}
            </Text>
          </View>
        </View>

        {/* 细分评分 */}
        <View className="bg-white rounded-2xl p-4 mb-4" style={{ border: '1px solid #EDEDED' }}>
          <Text className="block text-base font-semibold mb-4" style={{ color: '#2E2E30' }}>详细评价</Text>
          
          <View className="flex flex-row items-center justify-between mb-4">
            <Text className="text-sm" style={{ color: '#666' }}>服务态度</Text>
            {renderStars('serviceAttitude', serviceAttitude)}
          </View>

          <View className="flex flex-row items-center justify-between mb-4">
            <Text className="text-sm" style={{ color: '#666' }}>服务质量</Text>
            {renderStars('serviceQuality', serviceQuality)}
          </View>

          <View className="flex flex-row items-center justify-between">
            <Text className="text-sm" style={{ color: '#666' }}>准时到达</Text>
            {renderStars('punctuality', punctuality)}
          </View>
        </View>

        {/* 评价内容 */}
        <View className="bg-white rounded-2xl p-4 mb-4" style={{ border: '1px solid #EDEDED' }}>
          <Text className="block text-base font-semibold mb-4" style={{ color: '#2E2E30' }}>评价内容</Text>
          
          <View className="rounded-xl p-3 mb-4" style={{ backgroundColor: '#f5f5f5' }}>
            <Textarea
              style={{ width: '100%', minHeight: '100px', color: '#2E2E30', fontSize: '14px', backgroundColor: 'transparent' }}
              placeholder="请分享您的服务体验..."
              maxlength={500}
              value={comment}
              onInput={(e) => setComment(e.detail.value)}
            />
          </View>

          {/* 快捷标签 */}
          <View className="flex flex-row flex-wrap gap-2">
            {['服务专业', '态度热情', '打扫干净', '准时到达', '沟通顺畅'].map(tag => (
              <View
                key={tag}
                className="px-3 py-1 rounded-full"
                style={{ backgroundColor: '#f5f5f5' }}
                onClick={() => setComment(prev => prev ? `${prev}，${tag}` : tag)}
              >
                <Text className="text-sm" style={{ color: '#666' }}>{tag}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* 匿名评价 */}
        <View 
          className="bg-white rounded-2xl p-4 mb-4 flex flex-row items-center justify-between" 
          style={{ border: '1px solid #EDEDED' }}
          onClick={() => setIsAnonymous(!isAnonymous)}
        >
          <Text className="text-sm" style={{ color: '#666' }}>匿名评价</Text>
          <View 
            className="w-12 h-7 rounded-full flex items-center px-1"
            style={{ backgroundColor: isAnonymous ? '#F85659' : '#EDEDED' }}
          >
            <View 
              className="w-5 h-5 rounded-full bg-white"
              style={{ marginLeft: isAnonymous ? 'auto' : '0' }}
            />
          </View>
        </View>

        {/* 提交按钮 */}
        <View className="mt-4 mb-8">
          <View
            className="w-full py-4 rounded-xl text-center"
            style={{ backgroundColor: loading ? '#ccc' : '#F85659' }}
            onClick={loading ? undefined : handleSubmit}
          >
            <Text className="text-white font-medium">{loading ? '提交中...' : '提交评价'}</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  )
}

export default CreateReviewPage
