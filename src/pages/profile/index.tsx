import { View, Text } from '@tarojs/components'
import { useLoad } from '@tarojs/taro'
import { User } from 'lucide-react-taro'
import './index.css'

const ProfilePage = () => {
  useLoad(() => {
    console.log('Profile page loaded')
  })

  return (
    <View className="flex flex-col h-full bg-gray-50">
      <View className="flex-1 flex flex-col items-center justify-center">
        <View className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
          <User size={48} color="#10B981" />
        </View>
        <Text className="block text-lg font-semibold">用户中心</Text>
        <Text className="block text-sm text-gray-400 mt-2">请登录查看更多信息</Text>
      </View>
    </View>
  )
}

export default ProfilePage
