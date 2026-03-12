import { View, Text, ScrollView } from '@tarojs/components'
import { useLoad } from '@tarojs/taro'
import { Phone, MapPin, Mail, User } from 'lucide-react-taro'
import './index.css'

const MyCardPage = () => {
  useLoad(() => {
    // 页面加载初始化
  })

  return (
    <View className="flex flex-col h-full bg-gray-50">
      <ScrollView className="flex-1" scrollY>
        {/* 标题栏 */}
        <View className="bg-white px-6 py-6 border-b border-gray-100">
          <Text className="block text-2xl font-bold text-gray-800">我的名片</Text>
          <Text className="block text-sm text-gray-500">展示个人信息</Text>
        </View>

        {/* 名片区域 */}
        <View className="px-4 py-6">
          <View
            className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl p-6 shadow-lg"
            style={{
              boxShadow: '0 10px 30px rgba(59, 130, 246, 0.3)'
            }}
          >
            {/* 头像和名称 */}
            <View className="flex flex-row items-center mb-6">
              <View className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center mr-4">
                <User size={40} color="#fff" />
              </View>
              <View>
                <Text className="block text-xl font-bold text-white mb-1">张三</Text>
                <Text className="block text-sm text-blue-50">高级保洁师</Text>
              </View>
            </View>

            {/* 联系方式 */}
            <View className="space-y-4">
              <View className="flex flex-row items-center">
                <Phone size={18} color="#fff" className="mr-3" />
                <Text className="block text-base text-white">13800138000</Text>
              </View>
              <View className="flex flex-row items-center">
                <Mail size={18} color="#fff" className="mr-3" />
                <Text className="block text-base text-white">zhangsan@example.com</Text>
              </View>
              <View className="flex flex-row items-start">
                <MapPin size={18} color="#fff" className="mr-3 mt-0.5" />
                <Text className="block text-base text-white flex-1">北京市朝阳区建国路88号</Text>
              </View>
            </View>

            {/* 服务标签 */}
            <View className="mt-6 pt-4 border-t border-white/20">
              <Text className="block text-xs text-blue-50 mb-3 font-semibold uppercase tracking-wide">
                服务项目
              </Text>
              <View className="flex flex-row flex-wrap gap-2">
                <View className="bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full">
                  <Text className="block text-xs text-white">日常保洁</Text>
                </View>
                <View className="bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full">
                  <Text className="block text-xs text-white">深度清洁</Text>
                </View>
                <View className="bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full">
                  <Text className="block text-xs text-white">家电清洗</Text>
                </View>
              </View>
            </View>
          </View>

          {/* 服务统计 */}
          <View className="mt-6 bg-white rounded-2xl p-4 border border-gray-100">
            <View className="flex flex-row justify-around">
              <View className="flex flex-col items-center">
                <Text className="block text-2xl font-bold text-blue-600 mb-1">1,234</Text>
                <Text className="block text-xs text-gray-500">服务次数</Text>
              </View>
              <View className="flex flex-col items-center">
                <Text className="block text-2xl font-bold text-green-600 mb-1">4.9</Text>
                <Text className="block text-xs text-gray-500">服务评分</Text>
              </View>
              <View className="flex flex-col items-center">
                <Text className="block text-2xl font-bold text-purple-600 mb-1">98%</Text>
                <Text className="block text-xs text-gray-500">好评率</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  )
}

export default MyCardPage
