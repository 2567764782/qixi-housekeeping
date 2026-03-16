import Taro from '@tarojs/taro'
import { View, Text, ScrollView, Switch } from '@tarojs/components'
import { 
  User, Bell, Shield, Trash2, Info, ChevronRight, 
  LogOut, Moon, Globe, FileText, Lock
} from 'lucide-react-taro'
import { useState } from 'react'
import './index.css'

const SettingsPage = () => {
  // 设置状态
  const [notificationEnabled, setNotificationEnabled] = useState(true)
  const [darkMode, setDarkMode] = useState(false)

  // 用户信息
  const userInfo = Taro.getStorageSync('userInfo') || {
    nickname: '用户',
    phone: '138****8888'
  }

  // 修改昵称
  const handleEditNickname = () => {
    Taro.showModal({
      title: '修改昵称',
      editable: true,
      placeholderText: '请输入新昵称',
      success: (res) => {
        if (res.confirm && res.content) {
          const newUserInfo = { ...userInfo, nickname: res.content }
          Taro.setStorageSync('userInfo', newUserInfo)
          Taro.showToast({ title: '修改成功', icon: 'success' })
        }
      }
    })
  }

  // 修改密码
  const handleChangePassword = () => {
    Taro.navigateTo({ url: '/pages/auth/index?mode=change' })
  }

  // 切换通知开关
  const handleNotificationChange = (value: boolean) => {
    setNotificationEnabled(value)
    if (value) {
      Taro.requestSubscribeMessage({
        tmplIds: ['模板ID'], // 实际使用时需要填写真实的模板ID
        success: () => {
          Taro.showToast({ title: '已开启通知', icon: 'success' })
        },
        fail: () => {
          setNotificationEnabled(false)
          Taro.showToast({ title: '开启失败', icon: 'none' })
        }
      })
    } else {
      Taro.showToast({ title: '已关闭通知', icon: 'success' })
    }
  }

  // 清除缓存
  const handleClearCache = () => {
    Taro.showModal({
      title: '确认清除',
      content: '确定要清除所有缓存数据吗？',
      success: (res) => {
        if (res.confirm) {
          // 清除缓存但保留登录信息
          const token = Taro.getStorageSync('token')
          const savedUserInfo = Taro.getStorageSync('userInfo')
          
          Taro.clearStorageSync()
          
          // 恢复登录信息
          if (token) Taro.setStorageSync('token', token)
          if (savedUserInfo) Taro.setStorageSync('userInfo', savedUserInfo)
          
          Taro.showToast({ title: '清除成功', icon: 'success' })
        }
      }
    })
  }

  // 关于我们
  const handleAbout = () => {
    Taro.navigateTo({ url: '/pages/about/index' })
  }

  // 服务条款
  const handleTerms = () => {
    Taro.navigateTo({ url: '/pages/terms/index' })
  }

  // 隐私政策
  const handlePrivacy = () => {
    Taro.navigateTo({ url: '/pages/privacy/index' })
  }

  // 帮助中心
  const handleHelp = () => {
    Taro.showModal({
      title: '帮助中心',
      content: '如有问题，请联系客服：\n电话：400-888-8888\n工作时间：9:00-18:00',
      showCancel: false
    })
  }

  // 退出登录
  const handleLogout = () => {
    Taro.showModal({
      title: '确认退出',
      content: '确定要退出登录吗？',
      success: (res) => {
        if (res.confirm) {
          // 清除登录信息
          Taro.removeStorageSync('token')
          Taro.removeStorageSync('userInfo')
          
          Taro.showToast({ title: '已退出登录', icon: 'success' })
          
          // 跳转到登录页
          setTimeout(() => {
            Taro.reLaunch({ url: '/pages/login/index' })
          }, 1500)
        }
      }
    })
  }

  // 渲染设置项
  const renderSettingItem = (
    icon: React.ReactNode,
    title: string,
    action?: () => void,
    rightContent?: React.ReactNode
  ) => (
    <View
      className="flex flex-row items-center px-5 py-4 bg-white border-b border-gray-50"
      onClick={action}
    >
      <View className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center mr-3">
        {icon}
      </View>
      <View className="flex-1">
        <Text className="block text-base font-medium text-gray-800">{title}</Text>
      </View>
      {rightContent || <ChevronRight size={18} color="#D1D5DB" />}
    </View>
  )

  return (
    <View className="flex flex-col h-full bg-gray-50">
      <ScrollView className="flex-1" scrollY>
        {/* 用户信息卡片 */}
        <View className="bg-white px-5 py-6 mb-4 border-b border-gray-100">
          <View className="flex flex-row items-center">
            <View className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mr-4">
              <User size={32} color="#10B981" />
            </View>
            <View className="flex-1">
              <Text className="block text-xl font-bold text-gray-800 mb-1">
                {userInfo.nickname || '用户'}
              </Text>
              <Text className="block text-sm text-gray-500">
                {userInfo.phone || '未绑定手机'}
              </Text>
            </View>
            <View 
              className="px-4 py-2 bg-emerald-50 rounded-xl"
              onClick={handleEditNickname}
            >
              <Text className="block text-sm text-emerald-600 font-medium">编辑</Text>
            </View>
          </View>
        </View>

        {/* 账号与安全 */}
        <View className="mb-4">
          <Text className="block px-5 py-3 text-sm font-bold text-gray-500 bg-gray-50">
            账号与安全
          </Text>
          <View className="bg-white">
            {renderSettingItem(
              <Lock size={20} color="#10B981" />,
              '修改密码',
              handleChangePassword
            )}
            {renderSettingItem(
              <Shield size={20} color="#3B82F6" />,
              '账号安全',
              () => Taro.showToast({ title: '功能开发中', icon: 'none' })
            )}
          </View>
        </View>

        {/* 通用设置 */}
        <View className="mb-4">
          <Text className="block px-5 py-3 text-sm font-bold text-gray-500 bg-gray-50">
            通用设置
          </Text>
          <View className="bg-white">
            {renderSettingItem(
              <Bell size={20} color="#F59E0B" />,
              '消息通知',
              undefined,
              <Switch
                checked={notificationEnabled}
                onChange={(e) => handleNotificationChange(e.detail.value)}
                color="#10B981"
              />
            )}
            {renderSettingItem(
              <Moon size={20} color="#8B5CF6" />,
              '深色模式',
              undefined,
              <Switch
                checked={darkMode}
                onChange={(e) => {
                  setDarkMode(e.detail.value)
                  Taro.showToast({ title: '功能开发中', icon: 'none' })
                }}
                color="#10B981"
              />
            )}
            {renderSettingItem(
              <Globe size={20} color="#10B981" />,
              '语言设置',
              () => Taro.showToast({ title: '功能开发中', icon: 'none' })
            )}
          </View>
        </View>

        {/* 其他设置 */}
        <View className="mb-4">
          <Text className="block px-5 py-3 text-sm font-bold text-gray-500 bg-gray-50">
            其他
          </Text>
          <View className="bg-white">
            {renderSettingItem(
              <Trash2 size={20} color="#EF4444" />,
              '清除缓存',
              handleClearCache,
              <Text className="block text-sm text-gray-400">12.5 MB</Text>
            )}
            {renderSettingItem(
              <Info size={20} color="#3B82F6" />,
              '帮助中心',
              handleHelp
            )}
            {renderSettingItem(
              <Info size={20} color="#10B981" />,
              '关于我们',
              handleAbout
            )}
            {renderSettingItem(
              <FileText size={20} color="#6B7280" />,
              '服务条款',
              handleTerms
            )}
            {renderSettingItem(
              <Shield size={20} color="#6B7280" />,
              '隐私政策',
              handlePrivacy
            )}
          </View>
        </View>

        {/* 退出登录按钮 */}
        <View className="px-5 py-6">
          <View
            className="bg-white rounded-2xl py-4 flex items-center justify-center border border-red-100"
            onClick={handleLogout}
          >
            <LogOut size={20} color="#EF4444" />
            <Text className="block text-base text-red-500 font-medium ml-2">
              退出登录
            </Text>
          </View>
        </View>

        {/* 版本信息 */}
        <View className="flex flex-col items-center py-6">
          <Text className="block text-xs text-gray-400 mb-1">保洁服务小程序</Text>
          <Text className="block text-xs text-gray-300">版本 1.0.0</Text>
        </View>
      </ScrollView>
    </View>
  )
}

export default SettingsPage
