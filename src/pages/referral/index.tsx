import Taro from '@tarojs/taro'
import { View, Text, ScrollView, Button } from '@tarojs/components'
import { Share2, Gift, Users, Copy, ChevronRight } from 'lucide-react-taro'
import './index.css'

const ReferralPage = () => {
  const referralCode = 'QIXI2024'
  const referralLink = 'https://qixi.com/invite/QIXI2024'
  const stats = {
    invited: 12,
    reward: 180
  }

  const handleCopyCode = () => {
    Taro.setClipboardData({
      data: referralCode,
      success: () => {
        Taro.showToast({ title: '邀请码已复制', icon: 'success' })
      }
    })
  }

  const handleShare = () => {
    // 小程序分享
    Taro.showShareMenu({
      withShareTicket: true
    })
  }

  const handleInviteFriend = () => {
    // 生成邀请海报或分享
    Taro.showActionSheet({
      itemList: ['发送给微信好友', '生成邀请海报', '复制邀请链接'],
      success: (res) => {
        if (res.tapIndex === 0) {
          handleShare()
        } else if (res.tapIndex === 1) {
          Taro.showToast({ title: '功能开发中', icon: 'none' })
        } else if (res.tapIndex === 2) {
          Taro.setClipboardData({
            data: referralLink,
            success: () => {
              Taro.showToast({ title: '链接已复制', icon: 'success' })
            }
          })
        }
      }
    })
  }

  return (
    <View className="min-h-screen bg-gray-50">
      <ScrollView scrollY className="referral-scroll-wrapper">
        {/* 头部 */}
        <View className="bg-gradient-to-br from-red-500 to-orange-400 px-4 py-8 relative overflow-hidden">
          <View className="absolute top-0 right-0 opacity-10">
            <Share2 size={120} color="#fff" />
          </View>
          
          <Text className="block text-2xl font-bold text-white mb-2">邀请好友</Text>
          <Text className="block text-sm text-white opacity-80 mb-6">邀请好友下单，双方各得20元优惠券</Text>
          
          {/* 邀请码 */}
          <View className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
            <Text className="block text-xs text-white opacity-80 mb-2">我的邀请码</Text>
            <View className="flex flex-row items-center justify-between">
              <Text className="text-2xl font-bold text-white tracking-wider">{referralCode}</Text>
              <View
                className="flex flex-row items-center px-3 py-1.5 bg-white rounded-full"
                onClick={handleCopyCode}
              >
                <Copy size={14} color="#F85659" />
                <Text className="text-sm text-red-500 ml-1">复制</Text>
              </View>
            </View>
          </View>
        </View>

        {/* 邀请统计 */}
        <View className="bg-white mx-4 -mt-4 rounded-xl shadow-sm relative z-10">
          <View className="flex flex-row">
            <View className="flex-1 py-4 border-r border-gray-100">
              <View className="flex flex-col items-center">
                <Users size={20} color="#F85659" />
                <Text className="text-2xl font-bold text-gray-900 mt-1">{stats.invited}</Text>
                <Text className="text-xs text-gray-500">已邀请好友</Text>
              </View>
            </View>
            <View className="flex-1 py-4">
              <View className="flex flex-col items-center">
                <Gift size={20} color="#F85659" />
                <Text className="text-2xl font-bold text-gray-900 mt-1">{stats.reward}</Text>
                <Text className="text-xs text-gray-500">累计奖励(元)</Text>
              </View>
            </View>
          </View>
        </View>

        {/* 邀请规则 */}
        <View className="bg-white mx-4 mt-4 rounded-xl shadow-sm">
          <View className="p-4 border-b border-gray-100">
            <Text className="text-base font-semibold text-gray-900">邀请规则</Text>
          </View>
          <View className="p-4">
            <View className="flex flex-row items-start mb-3">
              <View className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center flex-shrink-0">
                <Text className="text-xs text-white">1</Text>
              </View>
              <Text className="text-sm text-gray-600 ml-3">分享邀请码或链接给好友</Text>
            </View>
            <View className="flex flex-row items-start mb-3">
              <View className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center flex-shrink-0">
                <Text className="text-xs text-white">2</Text>
              </View>
              <Text className="text-sm text-gray-600 ml-3">好友注册并完成首次下单</Text>
            </View>
            <View className="flex flex-row items-start">
              <View className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center flex-shrink-0">
                <Text className="text-xs text-white">3</Text>
              </View>
              <Text className="text-sm text-gray-600 ml-3">双方各获得20元优惠券奖励</Text>
            </View>
          </View>
        </View>

        {/* 奖励明细入口 */}
        <View className="bg-white mx-4 mt-4 rounded-xl shadow-sm">
          <View
            className="flex flex-row items-center justify-between p-4"
            onClick={() => Taro.navigateTo({ url: '/pages/my-registrations/index' })}
          >
            <Text className="text-base text-gray-900">奖励明细</Text>
            <View className="flex flex-row items-center">
              <Text className="text-sm text-gray-500 mr-1">查看全部</Text>
              <ChevronRight size={16} color="#ccc" />
            </View>
          </View>
        </View>
      </ScrollView>

      {/* 底部邀请按钮 */}
      <View className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-4 py-3 z-50">
        <Button
          className="w-full bg-red-500 rounded-full py-3"
          onClick={handleInviteFriend}
        >
          <Text className="text-base font-medium text-white">立即邀请好友</Text>
        </Button>
      </View>
    </View>
  )
}

export default ReferralPage
