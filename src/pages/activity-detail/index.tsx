import Taro, { useLoad } from '@tarojs/taro'
import { View, Text, ScrollView, Image, Button } from '@tarojs/components'
import { Calendar, MapPin, Users, Info, Phone, Share2, ArrowLeft } from 'lucide-react-taro'
import './index.css'

const ActivityDetailPage = () => {
  useLoad(() => {
    // 页面加载初始化
  })

  const handleBack = () => {
    Taro.navigateBack()
  }

  const handleShare = () => {
    Taro.showShareMenu({
      withShareTicket: true
    })
  }

  return (
    <View className="flex flex-col h-full bg-gray-50">
      <ScrollView className="flex-1" scrollY>
        {/* 顶部图片 */}
        <Image
          src="https://images.unsplash.com/photo-1581578731117-104f2a4d43e2?w=800"
          className="w-full h-56 object-cover"
          mode="aspectFill"
        />

        {/* 返回和分享按钮 */}
        <View className="absolute top-4 left-4 right-4 flex flex-row justify-between z-10">
          <View
            className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md"
            onClick={handleBack}
          >
            <ArrowLeft size={20} color="#374151" />
          </View>
          <View
            className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md"
            onClick={handleShare}
          >
            <Share2 size={20} color="#374151" />
          </View>
        </View>

        {/* 活动信息卡片 */}
        <View className="bg-white rounded-t-3xl -mt-6 relative z-0 px-6 py-6 border border-gray-100">
          {/* 标题 */}
          <Text className="block text-2xl font-bold text-gray-800 mb-4">
            春季大扫除优惠活动
          </Text>

          {/* 时间地点 */}
          <View className="space-y-3 mb-6">
            <View className="flex flex-row items-start">
              <View className="w-9 h-9 bg-blue-50 rounded-xl flex items-center justify-center mr-3 flex-shrink-0 mt-0.5">
                <Calendar size={18} color="#3B82F6" />
              </View>
              <View className="flex-1">
                <Text className="block text-xs text-gray-500 mb-1 font-medium uppercase tracking-wide">
                  活动时间
                </Text>
                <Text className="block text-base text-gray-800 font-medium">
                  2024年3月20日 09:00-18:00
                </Text>
              </View>
            </View>

            <View className="flex flex-row items-start">
              <View className="w-9 h-9 bg-green-50 rounded-xl flex items-center justify-center mr-3 flex-shrink-0 mt-0.5">
                <MapPin size={18} color="#10B981" />
              </View>
              <View className="flex-1">
                <Text className="block text-xs text-gray-500 mb-1 font-medium uppercase tracking-wide">
                  活动地点
                </Text>
                <Text className="block text-base text-gray-800 font-medium leading-relaxed">
                  北京市朝阳区建国路88号
                </Text>
              </View>
            </View>

            <View className="flex flex-row items-start">
              <View className="w-9 h-9 bg-purple-50 rounded-xl flex items-center justify-center mr-3 flex-shrink-0 mt-0.5">
                <Users size={18} color="#8B5CF6" />
              </View>
              <View className="flex-1">
                <Text className="block text-xs text-gray-500 mb-1 font-medium uppercase tracking-wide">
                  参与人数
                </Text>
                <Text className="block text-base text-gray-800 font-medium">
                  45/50 人
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* 活动详情 */}
        <View className="px-4 py-6">
          <View className="bg-white rounded-2xl p-6 border border-gray-100">
            <View className="flex flex-row items-center mb-4">
              <Info size={20} color="#10B981" className="mr-2" />
              <Text className="block text-lg font-bold text-gray-800">活动详情</Text>
            </View>
            <Text className="block text-sm text-gray-600 leading-relaxed">
              春季大扫除优惠活动即将开始！本次活动提供全方位的保洁服务，包括日常保洁、深度清洁、家电清洗等多种服务。参与者可享受7折优惠，更有精美礼品等你来拿！
            </Text>
            <Text className="block text-sm text-gray-600 leading-relaxed mt-3">
              活动亮点：
            </Text>
            <Text className="block text-sm text-gray-600 leading-relaxed mt-1">
              • 专业保洁团队全程服务
            </Text>
            <Text className="block text-sm text-gray-600 leading-relaxed">
              • 环保清洁材料，安全放心
            </Text>
            <Text className="block text-sm text-gray-600 leading-relaxed">
              • 参与抽奖活动，赢取大礼包
            </Text>
          </View>
        </View>

        {/* 联系方式 */}
        <View className="px-4 pb-8">
          <View className="bg-white rounded-2xl p-6 border border-gray-100">
            <View className="flex flex-row items-center mb-4">
              <Phone size={20} color="#10B981" className="mr-2" />
              <Text className="block text-lg font-bold text-gray-800">联系方式</Text>
            </View>
            <Text className="block text-sm text-gray-600 mb-2">
              如有疑问，请联系活动组织者
            </Text>
            <Text className="block text-base text-blue-600 font-medium">
              联系电话：13800138000
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* 底部按钮 */}
      <View className="bg-white px-6 py-4 border-t border-gray-100">
        <Button
          className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold py-4 rounded-2xl"
          onClick={() => Taro.showToast({ title: '报名成功', icon: 'success' })}
        >
          立即报名
        </Button>
      </View>
    </View>
  )
}

export default ActivityDetailPage
