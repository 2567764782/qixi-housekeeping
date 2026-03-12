import { View, Text, ScrollView, Image } from '@tarojs/components'
import { useLoad } from '@tarojs/taro'
import { Calendar, Clock, MapPin, Users, ChevronRight, Star } from 'lucide-react-taro'
import './index.css'

interface Activity {
  id: string
  title: string
  date: string
  time: string
  location: string
  participants: number
  maxParticipants: number
  status: 'upcoming' | 'ongoing' | 'ended'
  image: string
  rating?: number
}

const RecentActivitiesPage = () => {
  useLoad(() => {
    // 页面加载初始化
  })

  const activities: Activity[] = [
    {
      id: '1',
      title: '春季大扫除优惠活动',
      date: '2024-03-20',
      time: '09:00-18:00',
      location: '北京市朝阳区建国路88号',
      participants: 45,
      maxParticipants: 50,
      status: 'upcoming',
      image: 'https://images.unsplash.com/photo-1581578731117-104f2a4d43e2?w=400',
      rating: 4.8
    },
    {
      id: '2',
      title: '高端保洁技能培训',
      date: '2024-03-25',
      time: '14:00-17:00',
      location: '北京市海淀区中关村大街1号',
      participants: 30,
      maxParticipants: 40,
      status: 'upcoming',
      image: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=400'
    },
    {
      id: '3',
      title: '服务体验分享会',
      date: '2024-03-15',
      time: '10:00-12:00',
      location: '北京市东城区王府井大街1号',
      participants: 60,
      maxParticipants: 60,
      status: 'ended',
      image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=400',
      rating: 4.9
    }
  ]

  const getStatusInfo = (status: string) => {
    const statusMap: Record<string, { text: string; bg: string; color: string }> = {
      upcoming: { text: '即将开始', bg: 'bg-blue-50', color: '#3B82F6' },
      ongoing: { text: '进行中', bg: 'bg-green-50', color: '#10B981' },
      ended: { text: '已结束', bg: 'bg-gray-50', color: '#9CA3AF' }
    }
    return statusMap[status] || statusMap.upcoming
  }

  return (
    <View className="flex flex-col h-full bg-gray-50">
      <ScrollView className="flex-1" scrollY>
        {/* 标题栏 */}
        <View className="bg-white px-6 py-6 border-b border-gray-100">
          <Text className="block text-2xl font-bold text-gray-800">近期活动</Text>
          <Text className="block text-sm text-gray-500">查看和参与各种活动</Text>
        </View>

        {/* 活动列表 */}
        <View className="px-4 py-6 space-y-4">
          {activities.map((activity) => {
            const statusInfo = getStatusInfo(activity.status)
            return (
              <View
                key={activity.id}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
                style={{
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)'
                }}
              >
                {/* 活动图片 */}
                <Image
                  src={activity.image}
                  className="w-full h-40 object-cover"
                  mode="aspectFill"
                />

                {/* 活动信息 */}
                <View className="p-4">
                  {/* 标题和状态 */}
                  <View className="flex flex-row items-start justify-between mb-3">
                    <Text className="block text-lg font-bold text-gray-800 flex-1 mr-2">
                      {activity.title}
                    </Text>
                    <View
                      className={`${statusInfo.bg} px-2.5 py-1 rounded-lg`}
                    >
                      <Text
                        className="block text-xs font-bold"
                        style={{ color: statusInfo.color }}
                      >
                        {statusInfo.text}
                      </Text>
                    </View>
                  </View>

                  {/* 时间和地点 */}
                  <View className="space-y-2 mb-3">
                    <View className="flex flex-row items-center">
                      <Calendar size={14} color="#9CA3AF" className="mr-2" />
                      <Text className="block text-sm text-gray-600">{activity.date}</Text>
                      <Clock size={14} color="#9CA3AF" className="ml-3 mr-2" />
                      <Text className="block text-sm text-gray-600">{activity.time}</Text>
                    </View>
                    <View className="flex flex-row items-start">
                      <MapPin size={14} color="#9CA3AF" className="mr-2 mt-0.5" />
                      <Text className="block text-sm text-gray-600 flex-1">{activity.location}</Text>
                    </View>
                  </View>

                  {/* 参与人数和评分 */}
                  <View className="flex flex-row items-center justify-between pt-3 border-t border-gray-100">
                    <View className="flex flex-row items-center">
                      <Users size={14} color="#9CA3AF" className="mr-1.5" />
                      <Text className="block text-sm text-gray-600">
                        {activity.participants}/{activity.maxParticipants}
                      </Text>
                    </View>
                    {activity.rating && (
                      <View className="flex flex-row items-center">
                        <Star size={14} color="#FBBF24" className="mr-1" />
                        <Text className="block text-sm text-gray-600">{activity.rating}</Text>
                      </View>
                    )}
                    <ChevronRight size={20} color="#9CA3AF" />
                  </View>
                </View>
              </View>
            )
          })}
        </View>
      </ScrollView>
    </View>
  )
}

export default RecentActivitiesPage
