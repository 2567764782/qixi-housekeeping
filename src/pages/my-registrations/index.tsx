import { View, Text, ScrollView, Image } from '@tarojs/components'
import { useLoad } from '@tarojs/taro'
import { Calendar, MapPin, Clock, CircleCheck, Circle, Clock as ClockIcon } from 'lucide-react-taro'
import './index.css'

interface Registration {
  id: string
  title: string
  date: string
  time: string
  location: string
  status: 'confirmed' | 'pending' | 'cancelled'
  image: string
}

const MyRegistrationsPage = () => {
  useLoad(() => {
    // 页面加载初始化
  })

  const registrations: Registration[] = [
    {
      id: '1',
      title: '春季大扫除优惠活动',
      date: '2024-03-20',
      time: '09:00-18:00',
      location: '北京市朝阳区建国路88号',
      status: 'confirmed',
      image: 'https://images.unsplash.com/photo-1581578731117-104f2a4d43e2?w=400'
    },
    {
      id: '2',
      title: '高端保洁技能培训',
      date: '2024-03-25',
      time: '14:00-17:00',
      location: '北京市海淀区中关村大街1号',
      status: 'pending',
      image: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=400'
    },
    {
      id: '3',
      title: '服务体验分享会',
      date: '2024-03-10',
      time: '10:00-12:00',
      location: '北京市东城区王府井大街1号',
      status: 'cancelled',
      image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=400'
    }
  ]

  const getStatusInfo = (status: string) => {
    const statusMap: Record<string, { text: string; icon: React.ReactNode; bg: string; color: string }> = {
      confirmed: {
        text: '已确认',
        icon: <CircleCheck size={14} color="#10B981" />,
        bg: 'bg-green-50',
        color: '#10B981'
      },
      pending: {
        text: '待审核',
        icon: <ClockIcon size={14} color="#F59E0B" />,
        bg: 'bg-amber-50',
        color: '#F59E0B'
      },
      cancelled: {
        text: '已取消',
        icon: <Circle size={14} color="#9CA3AF" />,
        bg: 'bg-gray-50',
        color: '#9CA3AF'
      }
    }
    return statusMap[status] || statusMap.pending
  }

  return (
    <View className="flex flex-col h-full bg-gray-50">
      <ScrollView className="flex-1" scrollY>
        {/* 标题栏 */}
        <View className="bg-white px-6 py-6 border-b border-gray-100">
          <Text className="block text-2xl font-bold text-gray-800">我的报名</Text>
          <Text className="block text-sm text-gray-500">查看已报名的活动</Text>
        </View>

        {/* 报名列表 */}
        <View className="px-4 py-6 space-y-4">
          {registrations.map((registration) => {
            const statusInfo = getStatusInfo(registration.status)
            return (
              <View
                key={registration.id}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
                style={{
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)'
                }}
              >
                {/* 活动图片 */}
                <Image
                  src={registration.image}
                  className="w-full h-40 object-cover"
                  mode="aspectFill"
                />

                {/* 活动信息 */}
                <View className="p-4">
                  {/* 标题和状态 */}
                  <View className="flex flex-row items-start justify-between mb-3">
                    <Text className="block text-lg font-bold text-gray-800 flex-1 mr-2">
                      {registration.title}
                    </Text>
                    <View
                      className={`${statusInfo.bg} border border-${statusInfo.color.replace('#', '')}/20 px-2.5 py-1 rounded-lg flex items-center gap-1`}
                    >
                      {statusInfo.icon}
                      <Text
                        className="block text-xs font-bold"
                        style={{ color: statusInfo.color }}
                      >
                        {statusInfo.text}
                      </Text>
                    </View>
                  </View>

                  {/* 时间和地点 */}
                  <View className="space-y-2">
                    <View className="flex flex-row items-center">
                      <Calendar size={14} color="#9CA3AF" className="mr-2" />
                      <Text className="block text-sm text-gray-600">{registration.date}</Text>
                      <Clock size={14} color="#9CA3AF" className="ml-3 mr-2" />
                      <Text className="block text-sm text-gray-600">{registration.time}</Text>
                    </View>
                    <View className="flex flex-row items-start">
                      <MapPin size={14} color="#9CA3AF" className="mr-2 mt-0.5" />
                      <Text className="block text-sm text-gray-600 flex-1">{registration.location}</Text>
                    </View>
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

export default MyRegistrationsPage
