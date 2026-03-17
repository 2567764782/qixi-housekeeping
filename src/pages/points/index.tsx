import Taro from '@tarojs/taro'
import { View, Text, ScrollView } from '@tarojs/components'
import { useState, useEffect } from 'react'
import { Star, Gift, Clock, ChevronRight, ArrowUp, ArrowDown } from 'lucide-react-taro'
import { Network } from '@/network'
import './index.css'

interface PointsRecord {
  id: string
  type: 'earn' | 'consume'
  points: number
  balance: number
  desc: string
  created_at: string
}

const PointsPage = () => {
  const [points, setPoints] = useState(0)
  const [records, setRecords] = useState<PointsRecord[]>([])
  // const [loading, setLoading] = useState(true) // TODO: 后端接口完成后启用

  // 积分商品
  const gifts = [
    { id: '1', name: '10元优惠券', points: 500, image: '' },
    { id: '2', name: '20元优惠券', points: 900, image: '' },
    { id: '3', name: '免费保洁1小时', points: 2000, image: '' }
  ]

  useEffect(() => {
    loadPointsData()
  }, [])

  const loadPointsData = async () => {
    try {
      const res = await Network.request({
        url: '/api/points',
        method: 'GET'
      })

      if (res.statusCode === 200 && res.data?.data) {
        setPoints(res.data.data.points || 0)
        setRecords(res.data.data.records || [])
      }
    } catch (error) {
      console.error('加载积分数据失败:', error)
      // 模拟数据
      setPoints(1580)
      setRecords([
        {
          id: '1',
          type: 'earn',
          points: 50,
          balance: 1580,
          desc: '完成日常保洁订单',
          created_at: '2024-01-15 10:30:00'
        },
        {
          id: '2',
          type: 'earn',
          points: 100,
          balance: 1530,
          desc: '新用户注册奖励',
          created_at: '2024-01-10 09:15:00'
        },
        {
          id: '3',
          type: 'consume',
          points: -500,
          balance: 1430,
          desc: '兑换10元优惠券',
          created_at: '2024-01-08 14:20:00'
        }
      ])
    } finally {
      // setLoading(false)
    }
  }

  const handleExchange = (gift: any) => {
    if (points < gift.points) {
      Taro.showToast({ title: '积分不足', icon: 'none' })
      return
    }

    Taro.showModal({
      title: '确认兑换',
      content: `使用${gift.points}积分兑换${gift.name}`,
      success: (res) => {
        if (res.confirm) {
          Taro.showToast({ title: '兑换成功', icon: 'success' })
          // TODO: 调用兑换接口
        }
      }
    })
  }

  return (
    <View className="min-h-screen bg-gray-50">
      <ScrollView scrollY className="points-scroll-wrapper">
        {/* 积分卡片 */}
        <View className="bg-gradient-to-br from-yellow-500 to-orange-400 mx-4 mt-4 rounded-2xl p-6 relative overflow-hidden">
          <View className="absolute top-0 right-0 opacity-10">
            <Star size={100} color="#fff" />
          </View>
          
          <Text className="block text-sm text-white opacity-80 mb-2">我的积分</Text>
          <Text className="text-4xl font-bold text-white mb-4">{points}</Text>
          
          <View className="flex flex-row items-center">
            <Gift size={14} color="#fff" />
            <Text className="text-xs text-white opacity-60 ml-1">积分可兑换优惠券和免费服务</Text>
          </View>
        </View>

        {/* 赚取积分方式 */}
        <View className="bg-white mx-4 mt-4 rounded-xl shadow-sm">
          <View className="p-4 border-b border-gray-100">
            <Text className="text-base font-semibold text-gray-900">如何赚取积分</Text>
          </View>
          <View className="p-4">
            <View className="flex flex-row items-center mb-3">
              <View className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center mr-3">
                <Star size={16} color="#007CFF" />
              </View>
              <View className="flex-1">
                <Text className="text-sm text-gray-900">完成订单</Text>
                <Text className="text-xs text-gray-400">消费1元=1积分</Text>
              </View>
              <Text className="text-sm text-red-500">+1积分/元</Text>
            </View>
            <View className="flex flex-row items-center mb-3">
              <View className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center mr-3">
                <Star size={16} color="#10B981" />
              </View>
              <View className="flex-1">
                <Text className="text-sm text-gray-900">邀请好友</Text>
                <Text className="text-xs text-gray-400">好友完成首单</Text>
              </View>
              <Text className="text-sm text-red-500">+100积分</Text>
            </View>
            <View className="flex flex-row items-center">
              <View className="w-8 h-8 rounded-full bg-yellow-50 flex items-center justify-center mr-3">
                <Star size={16} color="#F59E0B" />
              </View>
              <View className="flex-1">
                <Text className="text-sm text-gray-900">每日签到</Text>
                <Text className="text-xs text-gray-400">连续签到更多奖励</Text>
              </View>
              <Text className="text-sm text-red-500">+5积分/天</Text>
            </View>
          </View>
        </View>

        {/* 积分商城 */}
        <View className="bg-white mx-4 mt-4 rounded-xl shadow-sm">
          <View className="p-4 border-b border-gray-100">
            <Text className="text-base font-semibold text-gray-900">积分兑换</Text>
          </View>
          <View className="p-4">
            {gifts.map(gift => (
              <View
                key={gift.id}
                className="flex flex-row items-center justify-between py-3 border-b border-gray-50 last:border-0"
                onClick={() => handleExchange(gift)}
              >
                <View className="flex flex-row items-center">
                  <View className="w-10 h-10 rounded bg-red-50 flex items-center justify-center mr-3">
                    <Gift size={20} color="#F85659" />
                  </View>
                  <View>
                    <Text className="text-sm text-gray-900">{gift.name}</Text>
                    <Text className="text-xs text-gray-400">{gift.points}积分</Text>
                  </View>
                </View>
                <View className={`px-3 py-1 rounded-full ${points >= gift.points ? 'bg-red-500' : 'bg-gray-300'}`}>
                  <Text className="text-xs text-white">兑换</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* 积分明细 */}
        <View className="bg-white mx-4 mt-4 mb-6 rounded-xl shadow-sm">
          <View className="p-4 border-b border-gray-100">
            <Text className="text-base font-semibold text-gray-900">积分明细</Text>
          </View>
          {records.length > 0 ? (
            records.map(item => (
              <View key={item.id} className="flex flex-row items-center px-4 py-3 border-b border-gray-50">
                <View className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mr-3">
                  {item.type === 'earn' ? (
                    <ArrowUp size={16} color="#10B981" />
                  ) : (
                    <ArrowDown size={16} color="#F85659" />
                  )}
                </View>
                <View className="flex-1">
                  <Text className="block text-sm text-gray-900">{item.desc}</Text>
                  <Text className="block text-xs text-gray-400 mt-1">{item.created_at}</Text>
                </View>
                <Text className={`text-base font-semibold ${item.type === 'earn' ? 'text-green-500' : 'text-gray-900'}`}>
                  {item.type === 'earn' ? '+' : '-'}{Math.abs(item.points)}
                </Text>
              </View>
            ))
          ) : (
            <View className="flex flex-col items-center py-8">
              <Clock size={32} color="#ddd" />
              <Text className="text-sm text-gray-400 mt-2">暂无积分记录</Text>
            </View>
          )}
          
          {/* 查看更多 */}
          <View
            className="flex flex-row items-center justify-center py-3 border-t border-gray-50"
            onClick={() => Taro.showToast({ title: '功能开发中', icon: 'none' })}
          >
            <Text className="text-sm text-gray-500">查看全部记录</Text>
            <ChevronRight size={16} color="#ccc" />
          </View>
        </View>
      </ScrollView>
    </View>
  )
}

export default PointsPage
