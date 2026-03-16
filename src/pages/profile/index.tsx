import Taro, { useLoad, useDidShow } from '@tarojs/taro'
import { View, Text, ScrollView, Button } from '@tarojs/components'
import { useState } from 'react'
import { User, FileText, Phone, Info, Shield, ChevronRight, FileCheck } from 'lucide-react-taro'
import { Network } from '@/network'
import './index.css'

interface UserInfo {
  nickname: string
  phone: string
  avatar?: string
}

const ProfilePage = () => {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null)
  const [orderStats, setOrderStats] = useState({ total: 0, pending: 0, completed: 0 })

  useLoad(() => {
    loadUserInfo()
  })

  useDidShow(() => {
    loadUserInfo()
    loadOrderStats()
  })

  const loadUserInfo = () => {
    const saved = Taro.getStorageSync('userInfo')
    if (saved) {
      setUserInfo(saved)
    }
  }

  const loadOrderStats = async () => {
    try {
      const res = await Network.request({
        url: '/api/orders/user/current/stats',
        method: 'GET'
      })
      
      if (res.statusCode === 200 && res.data) {
        setOrderStats(res.data)
      }
    } catch (error) {
      console.error('加载订单统计失败:', error)
      // 使用默认值
    }
  }

  const handleLogin = () => {
    Taro.getUserProfile({
      desc: '获取用户信息',
      success: (res) => {
        const info = {
          nickname: res.userInfo.nickName,
          avatar: res.userInfo.avatarUrl,
          phone: ''
        }
        setUserInfo(info)
        Taro.setStorageSync('userInfo', info)
      },
      fail: () => {
        Taro.showToast({ title: '授权失败', icon: 'none' })
      }
    })
  }

  const menuItems = [
    {
      icon: <FileText size={20} color="#10B981" />,
      title: '我的预约',
      desc: '查看预约记录',
      action: () => Taro.switchTab({ url: '/pages/orders/index' })
    },
    {
      icon: <Phone size={20} color="#3B82F6" />,
      title: '联系我们',
      desc: '客服热线：400-888-9999',
      action: () => Taro.navigateTo({ url: '/pages/contact/index' })
    },
    {
      icon: <Info size={20} color="#F59E0B" />,
      title: '关于我们',
      desc: '了解柒玺家政',
      action: () => Taro.navigateTo({ url: '/pages/about/index' })
    }
  ]

  const agreementItems = [
    {
      icon: <Shield size={18} color="#6B7280" />,
      title: '隐私政策',
      action: () => Taro.navigateTo({ url: '/pages/privacy/index' })
    },
    {
      icon: <FileCheck size={18} color="#6B7280" />,
      title: '用户协议',
      action: () => Taro.navigateTo({ url: '/pages/terms/index' })
    }
  ]

  return (
    <View className="min-h-screen bg-gray-50">
      <ScrollView scrollY className="pb-8">
        {/* 用户信息卡片 */}
        <View className="bg-gradient-to-br from-emerald-500 to-emerald-600 px-5 py-8">
          {userInfo ? (
            <View className="flex flex-row items-center">
              <View className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center overflow-hidden">
                {userInfo.avatar ? (
                  <View className="w-full h-full bg-white/30 flex items-center justify-center">
                    <User size={32} color="#fff" />
                  </View>
                ) : (
                  <User size={32} color="#fff" />
                )}
              </View>
              <View className="ml-4 flex-1">
                <Text className="block text-xl font-bold text-white">{userInfo.nickname || '用户'}</Text>
                <Text className="block text-sm text-white/80 mt-1">{userInfo.phone || '未绑定手机号'}</Text>
              </View>
            </View>
          ) : (
            <View className="flex flex-col items-center">
              <View className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                <User size={32} color="#fff" />
              </View>
              <Button 
                className="mt-4 bg-white text-emerald-600 px-6 py-2 rounded-full text-sm font-medium"
                onClick={handleLogin}
              >
                微信登录
              </Button>
            </View>
          )}
        </View>

        {/* 订单统计 */}
        <View className="bg-white mx-4 -mt-4 rounded-2xl shadow-sm border border-gray-100 p-4">
          <View className="flex flex-row">
            <View className="flex-1 text-center">
              <Text className="block text-2xl font-bold text-gray-800">{orderStats.total}</Text>
              <Text className="block text-xs text-gray-500 mt-1">全部预约</Text>
            </View>
            <View className="flex-1 text-center border-l border-gray-100">
              <Text className="block text-2xl font-bold text-orange-500">{orderStats.pending}</Text>
              <Text className="block text-xs text-gray-500 mt-1">待上门</Text>
            </View>
            <View className="flex-1 text-center border-l border-gray-100">
              <Text className="block text-2xl font-bold text-emerald-500">{orderStats.completed}</Text>
              <Text className="block text-xs text-gray-500 mt-1">已完成</Text>
            </View>
          </View>
        </View>

        {/* 功能菜单 */}
        <View className="px-4 mt-4">
          <View className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {menuItems.map((item, index) => (
              <View
                key={index}
                className={`flex flex-row items-center px-4 py-4 ${index !== menuItems.length - 1 ? 'border-b border-gray-50' : ''}`}
                onClick={item.action}
              >
                <View className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center mr-3">
                  {item.icon}
                </View>
                <View className="flex-1">
                  <Text className="block text-base font-medium text-gray-800">{item.title}</Text>
                  <Text className="block text-xs text-gray-400 mt-0.5">{item.desc}</Text>
                </View>
                <ChevronRight size={18} color="#D1D5DB" />
              </View>
            ))}
          </View>
        </View>

        {/* 协议入口 */}
        <View className="px-4 mt-4">
          <View className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {agreementItems.map((item, index) => (
              <View
                key={index}
                className={`flex flex-row items-center px-4 py-3 ${index !== agreementItems.length - 1 ? 'border-b border-gray-50' : ''}`}
                onClick={item.action}
              >
                {item.icon}
                <Text className="block text-sm text-gray-600 ml-3 flex-1">{item.title}</Text>
                <ChevronRight size={16} color="#D1D5DB" />
              </View>
            ))}
          </View>
        </View>

        {/* 客服信息 */}
        <View className="px-4 mt-4">
          <View className="bg-emerald-50 rounded-2xl p-4">
            <View className="flex flex-row items-center justify-between">
              <View>
                <Text className="block text-sm font-medium text-gray-800">客服热线</Text>
                <Text className="block text-lg font-bold text-emerald-600 mt-1">400-888-9999</Text>
                <Text className="block text-xs text-gray-500 mt-1">服务时间：08:00-22:00</Text>
              </View>
              <View 
                className="bg-emerald-500 text-white px-4 py-2 rounded-xl"
                onClick={() => Taro.makePhoneCall({ phoneNumber: '400-888-9999' })}
              >
                <Text className="text-sm font-medium">拨打电话</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  )
}

export default ProfilePage
