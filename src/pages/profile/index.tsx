import Taro, { useLoad } from '@tarojs/taro'
import { View, Text, ScrollView } from '@tarojs/components'
import { User, Phone, MapPin, Settings, FileText, Award } from 'lucide-react-taro'
import './index.css'

const ProfilePage = () => {
  useLoad(() => {
    console.log('Profile page loaded')
  })

  const menuItems = [
    {
      icon: <FileText size={22} color="#10B981" />,
      title: '我的订单',
      subtitle: '查看预约记录',
      action: () => {
        Taro.switchTab({ url: '/pages/orders/index' })
      }
    },
    {
      icon: <MapPin size={22} color="#10B981" />,
      title: '地址管理',
      subtitle: '管理服务地址',
      action: () => {
        alert('地址管理功能开发中')
      }
    },
    {
      icon: <Phone size={22} color="#10B981" />,
      title: '联系客服',
      subtitle: '在线客服咨询',
      action: () => {
        alert('联系客服功能开发中')
      }
    },
    {
      icon: <Award size={22} color="#10B981" />,
      title: '会员中心',
      subtitle: '查看会员权益',
      action: () => {
        alert('会员中心功能开发中')
      }
    },
    {
      icon: <Settings size={22} color="#10B981" />,
      title: '帮助中心',
      subtitle: '常见问题解答',
      action: () => {
        alert('帮助中心功能开发中')
      }
    },
    {
      icon: <User size={22} color="#10B981" />,
      title: '设置',
      subtitle: '账户设置',
      action: () => {
        alert('设置功能开发中')
      }
    }
  ]

  return (
    <View className="flex flex-col h-full bg-gray-50">
      <ScrollView className="flex-1" scrollY>
        {/* 用户信息卡片 */}
        <View className="bg-gradient-to-br from-emerald-500 via-emerald-400 to-teal-400 pt-12 pb-8 px-6">
          <View className="flex flex-row items-center">
            <View className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mr-4 backdrop-blur-sm">
              <User size={40} color="#fff" />
            </View>
            <View className="flex-1">
              <Text className="block text-2xl font-bold text-white mb-1">用户中心</Text>
              <Text className="block text-sm text-emerald-100 opacity-90">
                享受专业家居服务
              </Text>
            </View>
          </View>

          {/* 统计数据 */}
          <View className="flex flex-row justify-around mt-6 bg-white/10 rounded-2xl py-4 backdrop-blur-sm">
            <View className="text-center">
              <Text className="block text-2xl font-bold text-white">0</Text>
              <Text className="block text-xs text-emerald-100 mt-1">全部订单</Text>
            </View>
            <View className="w-px bg-white/20" />
            <View className="text-center">
              <Text className="block text-2xl font-bold text-white">0</Text>
              <Text className="block text-xs text-emerald-100 mt-1">待服务</Text>
            </View>
            <View className="w-px bg-white/20" />
            <View className="text-center">
              <Text className="block text-2xl font-bold text-white">0</Text>
              <Text className="block text-xs text-emerald-100 mt-1">已完成</Text>
            </View>
          </View>
        </View>

        {/* 功能菜单 */}
        <View className="px-4 py-6">
          <View className="bg-white rounded-2xl shadow-sm overflow-hidden">
            {menuItems.map((item, index) => (
              <View
                key={index}
                className={`flex flex-row items-center px-5 py-4 ${
                  index !== menuItems.length - 1 ? 'border-b border-gray-50' : ''
                }`}
                onClick={item.action}
              >
                <View className="w-11 h-11 bg-emerald-50 rounded-xl flex items-center justify-center mr-4">
                  {item.icon}
                </View>
                <View className="flex-1">
                  <Text className="block text-base font-semibold text-gray-800">
                    {item.title}
                  </Text>
                  <Text className="block text-sm text-gray-500 mt-0.5">
                    {item.subtitle}
                  </Text>
                </View>
                <View className="w-6 h-6 flex items-center justify-center">
                  <Text className="block text-gray-400 text-xl">›</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* 服务优势 */}
        <View className="px-4 pb-6">
          <Text className="block text-base font-semibold text-gray-800 mb-3 px-1">
            服务优势
          </Text>
          <View className="bg-white rounded-2xl shadow-sm p-5">
            <View className="grid grid-cols-3 gap-4">
              <View className="text-center">
                <View className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Award size={24} color="#10B981" />
                </View>
                <Text className="block text-sm font-semibold text-gray-800">
                  专业团队
                </Text>
                <Text className="block text-xs text-gray-500 mt-1">
                  经验丰富
                </Text>
              </View>
              <View className="text-center">
                <View className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Phone size={24} color="#10B981" />
                </View>
                <Text className="block text-sm font-semibold text-gray-800">
                  快速响应
                </Text>
                <Text className="block text-xs text-gray-500 mt-1">
                  及时服务
                </Text>
              </View>
              <View className="text-center">
                <View className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-2">
                  <User size={24} color="#10B981" />
                </View>
                <Text className="block text-sm font-semibold text-gray-800">
                  优质保障
                </Text>
                <Text className="block text-xs text-gray-500 mt-1">
                  品质保证
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* 联系方式 */}
        <View className="px-4 pb-8">
          <View className="bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-2xl p-5 text-center">
            <Text className="block text-base font-semibold text-white mb-2">
              需要帮助？
            </Text>
            <Text className="block text-sm text-emerald-100 mb-3">
              我们的服务团队随时为您服务
            </Text>
            <View className="bg-white/20 rounded-xl py-2.5 px-4 inline-block backdrop-blur-sm">
              <Text className="block text-sm font-semibold text-white">
                400-888-8888
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  )
}

export default ProfilePage
