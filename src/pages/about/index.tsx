import { View, Text, ScrollView } from '@tarojs/components'
import { Sparkles, Award, Users, Heart, Phone, MapPin, Mail } from 'lucide-react-taro'
import './index.css'

const AboutPage = () => {
  return (
    <View className="flex flex-col h-full bg-gray-50">
      <ScrollView className="flex-1" scrollY>
        {/* 顶部 Banner */}
        <View className="relative overflow-hidden bg-gradient-to-br from-emerald-600 via-emerald-500 to-teal-500 pt-16 pb-20 px-6">
          {/* 背景装饰 */}
          <View className="absolute top-[-60px] right-[-60px] w-48 h-48 bg-white/10 rounded-full blur-3xl" />
          <View className="absolute bottom-[-40px] left-[-40px] w-40 h-40 bg-white/10 rounded-full blur-2xl" />

          <View className="relative z-10 text-center">
            <View className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center mx-auto mb-4">
              <Sparkles size={40} color="#fff" />
            </View>

            <Text className="block text-3xl font-bold text-white mb-3">
              保洁服务
            </Text>

            <Text className="block text-base text-emerald-100 leading-relaxed">
              专业 · 高效 · 可靠
            </Text>
          </View>
        </View>

        {/* 内容卡片 */}
        <View className="px-4 py-6 space-y-4 -mt-12 relative z-10">
          {/* 公司简介 */}
          <View
            className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-sm border border-gray-100 p-6"
            style={{
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.02)'
            }}
          >
            <Text className="block text-lg font-bold text-gray-800 mb-4">公司简介</Text>
            <Text className="block text-base text-gray-600 leading-relaxed mb-3">
              保洁服务是一家专业的家居服务提供商，致力于为用户提供优质的保洁和局部改造服务。
            </Text>
            <Text className="block text-base text-gray-600 leading-relaxed">
              我们拥有经验丰富的专业团队，采用先进的清洁设备和环保材料，为每一位客户提供放心、舒心的服务体验。
            </Text>
          </View>

          {/* 核心价值观 */}
          <View
            className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-sm border border-gray-100 p-6"
            style={{
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.02)'
            }}
          >
            <Text className="block text-lg font-bold text-gray-800 mb-4">核心价值观</Text>
            <View className="space-y-4">
              <View className="flex flex-row items-start">
                <View className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center mr-4 flex-shrink-0">
                  <Award size={24} color="#10B981" />
                </View>
                <View className="flex-1">
                  <Text className="block text-base font-bold text-gray-800 mb-1">专业品质</Text>
                  <Text className="block text-sm text-gray-600 leading-relaxed">
                    每一位服务人员都经过专业培训，确保服务质量
                  </Text>
                </View>
              </View>

              <View className="flex flex-row items-start">
                <View className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center mr-4 flex-shrink-0">
                  <Users size={24} color="#10B981" />
                </View>
                <View className="flex-1">
                  <Text className="block text-base font-bold text-gray-800 mb-1">用户至上</Text>
                  <Text className="block text-sm text-gray-600 leading-relaxed">
                    以客户需求为中心，提供个性化服务方案
                  </Text>
                </View>
              </View>

              <View className="flex flex-row items-start">
                <View className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center mr-4 flex-shrink-0">
                  <Heart size={24} color="#10B981" />
                </View>
                <View className="flex-1">
                  <Text className="block text-base font-bold text-gray-800 mb-1">诚信服务</Text>
                  <Text className="block text-sm text-gray-600 leading-relaxed">
                    透明定价，无隐形消费，让客户放心
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* 服务数据 */}
          <View
            className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-sm border border-gray-100 p-6"
            style={{
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.02)'
            }}
          >
            <Text className="block text-lg font-bold text-gray-800 mb-4">服务数据</Text>
            <View className="grid grid-cols-2 gap-4">
              <View className="bg-emerald-50 rounded-2xl p-4 text-center">
                <Text className="block text-3xl font-bold text-emerald-600 mb-1">1000+</Text>
                <Text className="block text-sm text-gray-600">服务客户</Text>
              </View>
              <View className="bg-emerald-50 rounded-2xl p-4 text-center">
                <Text className="block text-3xl font-bold text-emerald-600 mb-1">98%</Text>
                <Text className="block text-sm text-gray-600">好评率</Text>
              </View>
              <View className="bg-emerald-50 rounded-2xl p-4 text-center">
                <Text className="block text-3xl font-bold text-emerald-600 mb-1">50+</Text>
                <Text className="block text-sm text-gray-600">专业团队</Text>
              </View>
              <View className="bg-emerald-50 rounded-2xl p-4 text-center">
                <Text className="block text-3xl font-bold text-emerald-600 mb-1">24h</Text>
                <Text className="block text-sm text-gray-600">快速响应</Text>
              </View>
            </View>
          </View>

          {/* 联系我们 */}
          <View
            className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-sm border border-gray-100 p-6"
            style={{
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.02)'
            }}
          >
            <Text className="block text-lg font-bold text-gray-800 mb-4">联系我们</Text>
            <View className="space-y-4">
              <View className="flex flex-row items-center">
                <View className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center mr-3">
                  <Phone size={20} color="#10B981" />
                </View>
                <View className="flex-1">
                  <Text className="block text-xs text-gray-500 mb-1">客服电话</Text>
                  <Text className="block text-base font-semibold text-gray-800">400-888-8888</Text>
                </View>
              </View>

              <View className="flex flex-row items-center">
                <View className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center mr-3">
                  <MapPin size={20} color="#10B981" />
                </View>
                <View className="flex-1">
                  <Text className="block text-xs text-gray-500 mb-1">公司地址</Text>
                  <Text className="block text-base font-semibold text-gray-800">北京市朝阳区xxx大厦</Text>
                </View>
              </View>

              <View className="flex flex-row items-center">
                <View className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center mr-3">
                  <Mail size={20} color="#10B981" />
                </View>
                <View className="flex-1">
                  <Text className="block text-xs text-gray-500 mb-1">电子邮箱</Text>
                  <Text className="block text-base font-semibold text-gray-800">service@example.com</Text>
                </View>
              </View>
            </View>
          </View>

          {/* 底部留白 */}
          <View className="h-8" />
        </View>
      </ScrollView>
    </View>
  )
}

export default AboutPage
