import Taro, { useLoad } from '@tarojs/taro'
import { View, Text, ScrollView } from '@tarojs/components'
import { User, MapPin, Settings, FileText, Award, ChevronRight, QrCode, TrendingUp, CreditCard, MessageSquare, Shield, Headphones } from 'lucide-react-taro'
import './index.css'

const ProfilePage = () => {
  useLoad(() => {
    // 页面加载初始化
  })

  // 用户功能分组
  const userMenuItems = [
    {
      icon: <FileText size={20} color="#10B981" />,
      title: '我的订单',
      action: () => {
        Taro.switchTab({ url: '/pages/orders/index' })
      }
    },
    {
      icon: <MapPin size={20} color="#10B981" />,
      title: '地址管理',
      action: () => {
        Taro.showToast({ title: '地址管理功能开发中', icon: 'none' })
      }
    },
    {
      icon: <CreditCard size={20} color="#10B981" />,
      title: '我的名片',
      action: () => {
        Taro.navigateTo({ url: '/pages/my-card/index' })
      }
    }
  ]

  // 服务功能分组
  const serviceMenuItems = [
    {
      icon: <Headphones size={20} color="#3B82F6" />,
      title: '在线客服',
      action: () => {
        Taro.navigateTo({ url: '/pages/customer-service/index' })
      }
    },
    {
      icon: <MessageSquare size={20} color="#3B82F6" />,
      title: '消息通知',
      action: () => {
        Taro.navigateTo({ url: '/pages/activity-notifications/index' })
      }
    },
    {
      icon: <QrCode size={20} color="#3B82F6" />,
      title: '扫码入群',
      action: () => {
        Taro.navigateTo({ url: '/pages/qrcode/index' })
      }
    }
  ]

  // 管理功能分组
  const adminMenuItems = [
    {
      icon: <Settings size={20} color="#F59E0B" />,
      title: '订单管理',
      action: () => {
        Taro.navigateTo({ url: '/pages/admin/index' })
      }
    },
    {
      icon: <TrendingUp size={20} color="#F59E0B" />,
      title: '数据统计',
      action: () => {
        Taro.navigateTo({ url: '/pages/statistics/index' })
      }
    },
    {
      icon: <Shield size={20} color="#F59E0B" />,
      title: '权限管理',
      action: () => {
        Taro.navigateTo({ url: '/pages/roles/index' })
      }
    }
  ]

  // 其他功能分组
  const otherMenuItems = [
    {
      icon: <Award size={20} color="#8B5CF6" />,
      title: '会员中心',
      action: () => {
        Taro.showToast({ title: '会员中心功能开发中', icon: 'none' })
      }
    },
    {
      icon: <User size={20} color="#8B5CF6" />,
      title: '帮助中心',
      action: () => {
        Taro.showToast({ title: '帮助中心功能开发中', icon: 'none' })
      }
    },
    {
      icon: <Settings size={20} color="#8B5CF6" />,
      title: '设置',
      action: () => {
        Taro.navigateTo({ url: '/pages/settings/index' })
      }
    }
  ]

  // 渲染菜单项
  const renderMenuItem = (item: any, index: number, lastIndex: number) => (
    <View
      key={index}
      className={`flex flex-row items-center px-5 py-4 ${
        index !== lastIndex ? 'border-b border-gray-50' : ''
      }`}
      onClick={item.action}
    >
      <View className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center mr-3">
        {item.icon}
      </View>
      <View className="flex-1">
        <Text className="block text-base font-medium text-gray-800">
          {item.title}
        </Text>
      </View>
      <ChevronRight size={18} color="#D1D5DB" />
    </View>
  )

  return (
    <View className="flex flex-col h-full bg-gray-50">
      <ScrollView className="flex-1" scrollY>
        {/* 用户信息头部 */}
        <View className="bg-white px-5 py-6 border-b border-gray-100">
          <View className="flex flex-row items-center">
            {/* 头像 */}
            <View className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mr-4">
              <User size={32} color="#10B981" />
            </View>

            {/* 用户信息 */}
            <View className="flex-1">
              <Text className="block text-xl font-bold text-gray-800 mb-1">
                欢迎您
              </Text>
              <Text className="block text-sm text-gray-500">
                享受专业家居服务
              </Text>
            </View>

            {/* 统计数据 */}
            <View className="flex flex-row items-center">
              <View className="bg-emerald-50 px-3 py-1.5 rounded-xl">
                <Text className="block text-lg font-bold text-emerald-600">0</Text>
              </View>
            </View>
          </View>

          {/* 快捷统计 */}
          <View className="flex flex-row mt-5 pt-5 border-t border-gray-50">
            <View className="flex-1 text-center">
              <Text className="block text-xl font-bold text-gray-800 mb-1">0</Text>
              <Text className="block text-xs text-gray-500">全部订单</Text>
            </View>
            <View className="flex-1 text-center">
              <Text className="block text-xl font-bold text-gray-800 mb-1">0</Text>
              <Text className="block text-xs text-gray-500">待服务</Text>
            </View>
            <View className="flex-1 text-center">
              <Text className="block text-xl font-bold text-gray-800 mb-1">0</Text>
              <Text className="block text-xs text-gray-500">已完成</Text>
            </View>
          </View>
        </View>

        <View className="px-4 py-5 space-y-4">
          {/* 用户功能 */}
          <View className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {renderMenuItem(userMenuItems[0], 0, 2)}
            {renderMenuItem(userMenuItems[1], 1, 2)}
            {renderMenuItem(userMenuItems[2], 2, 2)}
          </View>

          {/* 服务功能 */}
          <View className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {renderMenuItem(serviceMenuItems[0], 0, 2)}
            {renderMenuItem(serviceMenuItems[1], 1, 2)}
            {renderMenuItem(serviceMenuItems[2], 2, 2)}
          </View>

          {/* 管理功能 */}
          <View className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {renderMenuItem(adminMenuItems[0], 0, 2)}
            {renderMenuItem(adminMenuItems[1], 1, 2)}
            {renderMenuItem(adminMenuItems[2], 2, 2)}
          </View>

          {/* 其他功能 */}
          <View className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {renderMenuItem(otherMenuItems[0], 0, 2)}
            {renderMenuItem(otherMenuItems[1], 1, 2)}
            {renderMenuItem(otherMenuItems[2], 2, 2)}
          </View>
        </View>
      </ScrollView>
    </View>
  )
}

export default ProfilePage
