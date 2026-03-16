import Taro from '@tarojs/taro'
import { View, Text, ScrollView } from '@tarojs/components'
import { Sparkles, Shield, Award, Users } from 'lucide-react-taro'
import './index.css'

const AboutPage = () => {
  const features = [
    {
      icon: <Sparkles size={24} color="#10B981" />,
      title: '专业服务',
      desc: '经验丰富的服务团队'
    },
    {
      icon: <Shield size={24} color="#3B82F6" />,
      title: '品质保障',
      desc: '不满意免费返工'
    },
    {
      icon: <Award size={24} color="#F59E0B" />,
      title: '透明定价',
      desc: '价格公开透明无隐形消费'
    },
    {
      icon: <Users size={24} color="#8B5CF6" />,
      title: '贴心服务',
      desc: '24小时客服在线'
    }
  ]

  return (
    <View className="min-h-screen bg-gray-50">
      <ScrollView scrollY className="pb-8">
        {/* 顶部Logo区域 */}
        <View className="bg-white px-6 py-10 text-center">
          <View className="w-20 h-20 bg-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Sparkles size={40} color="#fff" />
          </View>
          <Text className="block text-2xl font-bold text-gray-800">柒玺家政</Text>
          <Text className="block text-sm text-gray-500 mt-2">专业、便捷、可信赖的家政服务</Text>
          <Text className="block text-xs text-gray-400 mt-1">版本 1.0.0</Text>
        </View>

        {/* 服务介绍 */}
        <View className="px-4 mt-4">
          <View className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <Text className="block text-base font-semibold text-gray-800 mb-3">关于我们</Text>
            <Text className="block text-sm text-gray-600 leading-relaxed">
              柒玺家政是一家专业的家政服务公司，致力于为用户提供高品质的家庭保洁、家电清洗、新居开荒、收纳整理等一站式家政服务。
            </Text>
            <Text className="block text-sm text-gray-600 leading-relaxed mt-3">
              我们拥有经验丰富的专业服务团队，使用环保清洁用品，严格执行标准化服务流程，确保每一次服务都让客户满意。
            </Text>
          </View>
        </View>

        {/* 服务特色 */}
        <View className="px-4 mt-4">
          <View className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <Text className="block text-base font-semibold text-gray-800 mb-4">服务特色</Text>
            <View className="flex flex-row flex-wrap">
              {features.map((item, index) => (
                <View key={index} className="w-1/2 flex flex-col items-center mb-4">
                  <View className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center mb-2">
                    {item.icon}
                  </View>
                  <Text className="block text-sm font-medium text-gray-800">{item.title}</Text>
                  <Text className="block text-xs text-gray-500 mt-1">{item.desc}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* 服务项目 */}
        <View className="px-4 mt-4">
          <View className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <Text className="block text-base font-semibold text-gray-800 mb-3">服务项目</Text>
            <View className="flex flex-col gap-2">
              <View className="flex flex-row items-center">
                <View className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-3" />
                <Text className="block text-sm text-gray-600">日常保洁 - 地面清洁、桌面整理、卫生间清洁等</Text>
              </View>
              <View className="flex flex-row items-center">
                <View className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-3" />
                <Text className="block text-sm text-gray-600">深度保洁 - 全屋深度清洁、除菌消毒、边角处理</Text>
              </View>
              <View className="flex flex-row items-center">
                <View className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-3" />
                <Text className="block text-sm text-gray-600">新居开荒 - 装修后全面清洁、玻璃清洗</Text>
              </View>
              <View className="flex flex-row items-center">
                <View className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-3" />
                <Text className="block text-sm text-gray-600">家电清洗 - 空调、油烟机、洗衣机清洗</Text>
              </View>
              <View className="flex flex-row items-center">
                <View className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-3" />
                <Text className="block text-sm text-gray-600">收纳整理 - 衣柜整理、空间规划</Text>
              </View>
            </View>
          </View>
        </View>

        {/* 客服信息 */}
        <View className="px-4 mt-4">
          <View className="bg-emerald-50 rounded-2xl p-4">
            <View className="flex flex-row items-center justify-between">
              <View>
                <Text className="block text-sm font-medium text-gray-800">客服热线</Text>
                <Text className="block text-lg font-bold text-emerald-600 mt-1">400-888-9999</Text>
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

export default AboutPage
