import Taro, { useLoad, useDidShow } from '@tarojs/taro'
import { View, Text, ScrollView, Button } from '@tarojs/components'
import { useState } from 'react'
import { User, FileText, Phone, Info, Shield, ChevronRight, FileCheck, Briefcase, Star, Settings } from 'lucide-react-taro'
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

  const serviceMenuItems = [
    {
      icon: <FileText size={20} color="#F85659" />,
      title: '我的预约',
      desc: '查看预约记录',
      action: () => Taro.switchTab({ url: '/pages/orders/index' })
    },
    {
      icon: <Star size={20} color="#F38F00" />,
      title: '我的评价',
      desc: '查看历史评价',
      action: () => Taro.showToast({ title: '功能开发中', icon: 'none' })
    },
    {
      icon: <Briefcase size={20} color="#9B40D8" />,
      title: '阿姨入驻',
      desc: '成为服务人员',
      action: () => Taro.navigateTo({ url: '/pages/cleaner-apply/index' })
    },
    {
      icon: <Phone size={20} color="#007CFF" />,
      title: '联系我们',
      desc: '客服热线：400-888-9999',
      action: () => Taro.navigateTo({ url: '/pages/contact/index' })
    }
  ]

  const otherMenuItems = [
    {
      icon: <Info size={18} color="#666" />,
      title: '关于我们',
      action: () => Taro.navigateTo({ url: '/pages/about/index' })
    },
    {
      icon: <Settings size={18} color="#666" />,
      title: '设置',
      action: () => Taro.navigateTo({ url: '/pages/settings/index' })
    }
  ]

  const agreementItems = [
    {
      icon: <Shield size={18} color="#B3B3B3" />,
      title: '隐私政策',
      action: () => Taro.navigateTo({ url: '/pages/privacy/index' })
    },
    {
      icon: <FileCheck size={18} color="#B3B3B3" />,
      title: '用户协议',
      action: () => Taro.navigateTo({ url: '/pages/terms/index' })
    }
  ]

  return (
    <View className="min-h-screen" style={{ backgroundColor: '#f5f5f5' }}>
      <ScrollView scrollY className="pb-8">
        {/* 用户信息卡片 */}
        <View className="px-5 py-8" style={{ background: 'linear-gradient(135deg, #F85659 0%, #FF8A8A 100%)' }}>
          {userInfo ? (
            <View className="flex flex-row items-center">
              <View className="w-16 h-16 rounded-full flex items-center justify-center overflow-hidden" style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}>
                {userInfo.avatar ? (
                  <View className="w-full h-full flex items-center justify-center" style={{ backgroundColor: 'rgba(255,255,255,0.3)' }}>
                    <User size={32} color="#fff" />
                  </View>
                ) : (
                  <User size={32} color="#fff" />
                )}
              </View>
              <View className="ml-4 flex-1">
                <Text className="block text-xl font-bold text-white">{userInfo.nickname || '用户'}</Text>
                <Text className="block text-sm mt-1" style={{ color: 'rgba(255,255,255,0.8)' }}>{userInfo.phone || '未绑定手机号'}</Text>
              </View>
              <View 
                className="px-3 py-1 rounded-full"
                style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
                onClick={() => Taro.navigateTo({ url: '/pages/settings/index' })}
              >
                <Text className="text-white text-sm">编辑</Text>
              </View>
            </View>
          ) : (
            <View className="flex flex-col items-center">
              <View className="w-16 h-16 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}>
                <User size={32} color="#fff" />
              </View>
              <Button 
                className="mt-4 px-6 py-2 rounded-full text-sm font-medium"
                style={{ backgroundColor: '#fff', color: '#F85659' }}
                onClick={handleLogin}
              >
                微信登录
              </Button>
            </View>
          )}
        </View>

        {/* 订单统计 */}
        <View className="bg-white mx-4 -mt-4 rounded-2xl p-4" style={{ border: '1px solid #EDEDED' }}>
          <View className="flex flex-row">
            <View className="flex-1 text-center">
              <Text className="block text-2xl font-bold" style={{ color: '#2E2E30' }}>{orderStats.total}</Text>
              <Text className="block text-xs mt-1" style={{ color: '#B3B3B3' }}>全部预约</Text>
            </View>
            <View className="flex-1 text-center" style={{ borderLeft: '1px solid #EDEDED' }}>
              <Text className="block text-2xl font-bold" style={{ color: '#F38F00' }}>{orderStats.pending}</Text>
              <Text className="block text-xs mt-1" style={{ color: '#B3B3B3' }}>待上门</Text>
            </View>
            <View className="flex-1 text-center" style={{ borderLeft: '1px solid #EDEDED' }}>
              <Text className="block text-2xl font-bold" style={{ color: '#5DC801' }}>{orderStats.completed}</Text>
              <Text className="block text-xs mt-1" style={{ color: '#B3B3B3' }}>已完成</Text>
            </View>
          </View>
        </View>

        {/* 功能菜单 */}
        <View className="px-4 mt-4">
          <Text className="block text-sm font-medium mb-2" style={{ color: '#B3B3B3' }}>我的服务</Text>
          <View className="bg-white rounded-2xl" style={{ border: '1px solid #EDEDED' }}>
            {serviceMenuItems.map((item, index) => (
              <View
                key={index}
                className="flex flex-row items-center px-4 py-4"
                style={{ borderBottom: index !== serviceMenuItems.length - 1 ? '1px solid #EDEDED' : 'none' }}
                onClick={item.action}
              >
                <View className="w-10 h-10 rounded-xl flex items-center justify-center mr-3" style={{ backgroundColor: '#f5f5f5' }}>
                  {item.icon}
                </View>
                <View className="flex-1">
                  <Text className="block text-base font-medium" style={{ color: '#2E2E30' }}>{item.title}</Text>
                  <Text className="block text-xs mt-0.5" style={{ color: '#B3B3B3' }}>{item.desc}</Text>
                </View>
                <ChevronRight size={18} color="#B3B3B3" />
              </View>
            ))}
          </View>
        </View>

        {/* 其他菜单 */}
        <View className="px-4 mt-4">
          <Text className="block text-sm font-medium mb-2" style={{ color: '#B3B3B3' }}>其他</Text>
          <View className="bg-white rounded-2xl" style={{ border: '1px solid #EDEDED' }}>
            {otherMenuItems.map((item, index) => (
              <View
                key={index}
                className="flex flex-row items-center px-4 py-3"
                style={{ borderBottom: index !== otherMenuItems.length - 1 ? '1px solid #EDEDED' : 'none' }}
                onClick={item.action}
              >
                {item.icon}
                <Text className="block text-sm ml-3 flex-1" style={{ color: '#2E2E30' }}>{item.title}</Text>
                <ChevronRight size={16} color="#B3B3B3" />
              </View>
            ))}
          </View>
        </View>

        {/* 协议入口 */}
        <View className="px-4 mt-4">
          <View className="bg-white rounded-2xl" style={{ border: '1px solid #EDEDED' }}>
            {agreementItems.map((item, index) => (
              <View
                key={index}
                className="flex flex-row items-center px-4 py-3"
                style={{ borderBottom: index !== agreementItems.length - 1 ? '1px solid #EDEDED' : 'none' }}
                onClick={item.action}
              >
                {item.icon}
                <Text className="block text-sm ml-3 flex-1" style={{ color: '#666' }}>{item.title}</Text>
                <ChevronRight size={16} color="#B3B3B3" />
              </View>
            ))}
          </View>
        </View>

        {/* 客服信息 */}
        <View className="px-4 mt-4">
          <View className="rounded-2xl p-4" style={{ backgroundColor: '#FFF7F7' }}>
            <View className="flex flex-row items-center justify-between">
              <View>
                <Text className="block text-sm font-medium" style={{ color: '#2E2E30' }}>客服热线</Text>
                <Text className="block text-lg font-bold mt-1" style={{ color: '#F85659' }}>400-888-9999</Text>
                <Text className="block text-xs mt-1" style={{ color: '#B3B3B3' }}>服务时间：08:00-22:00</Text>
              </View>
              <View 
                className="px-4 py-2 rounded-xl"
                style={{ backgroundColor: '#F85659' }}
                onClick={() => Taro.makePhoneCall({ phoneNumber: '400-888-9999' })}
              >
                <Text className="text-sm font-medium text-white">拨打电话</Text>
              </View>
            </View>
          </View>
        </View>

        {/* 阿姨端入口 */}
        <View className="px-4 mt-4 mb-8">
          <View 
            className="rounded-2xl p-4 flex flex-row items-center justify-between"
            style={{ backgroundColor: '#FAF5FF' }}
            onClick={() => Taro.navigateTo({ url: '/pages/cleaner-orders/index' })}
          >
            <View className="flex flex-row items-center">
              <View className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#9B40D8' }}>
                <Briefcase size={24} color="#fff" />
              </View>
              <View className="ml-3">
                <Text className="block text-base font-medium" style={{ color: '#2E2E30' }}>我是阿姨</Text>
                <Text className="block text-xs" style={{ color: '#9B40D8' }}>点击进入接单端</Text>
              </View>
            </View>
            <ChevronRight size={20} color="#9B40D8" />
          </View>
        </View>
      </ScrollView>
    </View>
  )
}

export default ProfilePage
