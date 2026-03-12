import { View, Text, ScrollView } from '@tarojs/components'
import { useLoad } from '@tarojs/taro'
import { Calendar, Info, TriangleAlert, CircleCheck } from 'lucide-react-taro'
import './index.css'

interface Notification {
  id: string
  title: string
  content: string
  type: 'info' | 'warning' | 'success'
  date: string
  time: string
}

const ActivityNotificationsPage = () => {
  useLoad(() => {
    // 页面加载初始化
  })

  const notifications: Notification[] = [
    {
      id: '1',
      title: '活动开始提醒',
      content: '春季大扫除优惠活动将于明天开始，请提前做好准备',
      type: 'info',
      date: '2024-03-19',
      time: '18:00'
    },
    {
      id: '2',
      title: '报名成功通知',
      content: '您已成功报名"高端保洁技能培训"，请按时参加',
      type: 'success',
      date: '2024-03-15',
      time: '10:30'
    },
    {
      id: '3',
      title: '活动变更提醒',
      content: '服务体验分享会地点已变更，请注意查看详情',
      type: 'warning',
      date: '2024-03-10',
      time: '14:00'
    },
    {
      id: '4',
      title: '新活动上线',
      content: '家政服务技能大赛开始报名，快来参加吧！',
      type: 'info',
      date: '2024-03-08',
      time: '09:00'
    }
  ]

  const getTypeInfo = (type: string) => {
    const typeMap: Record<string, { icon: React.ReactNode; bg: string; border: string }> = {
      info: {
        icon: <Info size={18} color="#3B82F6" />,
        bg: 'bg-blue-50',
        border: 'border-blue-200'
      },
      warning: {
        icon: <TriangleAlert size={18} color="#F59E0B" />,
        bg: 'bg-amber-50',
        border: 'border-amber-200'
      },
      success: {
        icon: <CircleCheck size={18} color="#10B981" />,
        bg: 'bg-emerald-50',
        border: 'border-emerald-200'
      }
    }
    return typeMap[type] || typeMap.info
  }

  return (
    <View className="flex flex-col h-full bg-gray-50">
      <ScrollView className="flex-1" scrollY>
        {/* 标题栏 */}
        <View className="bg-white px-6 py-6 border-b border-gray-100">
          <Text className="block text-2xl font-bold text-gray-800">活动通知</Text>
          <Text className="block text-sm text-gray-500">查看最新活动消息</Text>
        </View>

        {/* 通知列表 */}
        <View className="px-4 py-6 space-y-4">
          {notifications.map((notification) => {
            const typeInfo = getTypeInfo(notification.type)
            return (
              <View
                key={notification.id}
                className={`bg-white rounded-2xl shadow-sm border ${typeInfo.border} overflow-hidden`}
                style={{
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)'
                }}
              >
                <View className="p-4">
                  {/* 标题栏 */}
                  <View className="flex flex-row items-start mb-3">
                    <View className={`w-10 h-10 ${typeInfo.bg} rounded-xl flex items-center justify-center mr-3 flex-shrink-0`}>
                      {typeInfo.icon}
                    </View>
                    <View className="flex-1">
                      <Text className="block text-base font-bold text-gray-800 mb-1">
                        {notification.title}
                      </Text>
                      <View className="flex flex-row items-center">
                        <Calendar size={12} color="#9CA3AF" className="mr-1" />
                        <Text className="block text-xs text-gray-500">
                          {notification.date} {notification.time}
                        </Text>
                      </View>
                    </View>
                  </View>

                  {/* 内容 */}
                  <Text className="block text-sm text-gray-600 leading-relaxed">
                    {notification.content}
                  </Text>
                </View>
              </View>
            )
          })}
        </View>
      </ScrollView>
    </View>
  )
}

export default ActivityNotificationsPage
