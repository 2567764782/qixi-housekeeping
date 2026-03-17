import Taro from '@tarojs/taro'
import { View, Text, ScrollView, Image } from '@tarojs/components'
import { useState, useEffect } from 'react'
import { Gift, Clock, Users, ChevronRight } from 'lucide-react-taro'
import { Network } from '@/network'
import './index.css'

interface Activity {
  id: string
  title: string
  desc: string
  image: string
  start_time: string
  end_time: string
  participants: number
  status: 'ongoing' | 'upcoming' | 'ended'
}

const ActivitiesPage = () => {
  const [activities, setActivities] = useState<Activity[]>([])
  // const [loading, setLoading] = useState(true) // TODO: 后端接口完成后启用

  useEffect(() => {
    loadActivities()
  }, [])

  const loadActivities = async () => {
    try {
      const res = await Network.request({
        url: '/api/activities',
        method: 'GET'
      })

      if (res.statusCode === 200 && res.data?.data) {
        setActivities(res.data.data)
      }
    } catch (error) {
      console.error('加载活动失败:', error)
      // 模拟数据
      setActivities([
        {
          id: '1',
          title: '新用户专享：首单立减20元',
          desc: '新用户首次预约保洁服务，立享20元优惠',
          image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&h=400&fit=crop',
          start_time: '2024-01-01',
          end_time: '2024-12-31',
          participants: 1234,
          status: 'ongoing'
        },
        {
          id: '2',
          title: '春节大扫除特惠活动',
          desc: '预约深度保洁服务，享8折优惠',
          image: 'https://images.unsplash.com/photo-1628177142898-93e36e4e3a50?w=800&h=400&fit=crop',
          start_time: '2024-01-15',
          end_time: '2024-02-15',
          participants: 567,
          status: 'ongoing'
        },
        {
          id: '3',
          title: '家电清洗季卡上线',
          desc: '购买季卡，享受全年家电清洗服务',
          image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=400&fit=crop',
          start_time: '2024-02-01',
          end_time: '2024-03-01',
          participants: 89,
          status: 'upcoming'
        }
      ])
    } finally {
      // setLoading(false)
    }
  }

  const getStatusText = (status: string) => {
    const map: Record<string, { text: string; className: string }> = {
      ongoing: { text: '进行中', className: 'bg-green-500' },
      upcoming: { text: '即将开始', className: 'bg-blue-500' },
      ended: { text: '已结束', className: 'bg-gray-400' }
    }
    return map[status] || { text: '未知', className: 'bg-gray-400' }
  }

  const handleActivityClick = (activity: Activity) => {
    if (activity.status === 'ended') {
      Taro.showToast({ title: '活动已结束', icon: 'none' })
      return
    }
    Taro.navigateTo({
      url: `/pages/activity-detail/index?id=${activity.id}`
    })
  }

  return (
    <View className="min-h-screen bg-gray-50">
      <ScrollView scrollY className="activities-scroll-wrapper">
        {/* 头部 */}
        <View className="bg-gradient-to-r from-red-500 to-red-400 px-4 py-6">
          <View className="flex flex-row items-center mb-2">
            <Gift size={24} color="#fff" />
            <Text className="text-xl font-bold text-white ml-2">最新活动</Text>
          </View>
          <Text className="text-sm text-white opacity-80">精选优惠活动，不容错过</Text>
        </View>

        {/* 活动列表 */}
        <View className="px-4 py-4">
          {activities.map(activity => {
            const statusInfo = getStatusText(activity.status)
            return (
              <View
                key={activity.id}
                className="bg-white rounded-xl overflow-hidden shadow-sm mb-4"
                onClick={() => handleActivityClick(activity)}
              >
                {/* 活动图片 */}
                <View className="relative">
                  <Image
                    className="w-full h-40"
                    src={activity.image}
                    mode="aspectFill"
                  />
                  <View className={`absolute top-3 left-3 px-2 py-1 rounded ${statusInfo.className}`}>
                    <Text className="text-xs text-white">{statusInfo.text}</Text>
                  </View>
                </View>

                {/* 活动信息 */}
                <View className="p-4">
                  <Text className="block text-base font-semibold text-gray-900 mb-2">{activity.title}</Text>
                  <Text className="block text-sm text-gray-500 mb-3">{activity.desc}</Text>
                  
                  <View className="flex flex-row items-center justify-between">
                    <View className="flex flex-row items-center">
                      <Clock size={14} color="#999" />
                      <Text className="text-xs text-gray-400 ml-1">
                        {activity.start_time} 至 {activity.end_time}
                      </Text>
                    </View>
                    <View className="flex flex-row items-center">
                      <Users size={14} color="#999" />
                      <Text className="text-xs text-gray-400 ml-1">{activity.participants}人参与</Text>
                    </View>
                  </View>
                </View>

                {/* 查看详情 */}
                <View className="flex flex-row items-center justify-end px-4 py-3 border-t border-gray-50">
                  <Text className="text-sm text-red-500">查看详情</Text>
                  <ChevronRight size={16} color="#F85659" />
                </View>
              </View>
            )
          })}
        </View>
      </ScrollView>
    </View>
  )
}

export default ActivitiesPage
