import { View, Text, ScrollView } from '@tarojs/components'
import { Shield, Lock, Eye, Database, User, Globe } from 'lucide-react-taro'
import './index.css'

const PrivacyPage = () => {
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
              <Shield size={40} color="#fff" />
            </View>

            <Text className="block text-3xl font-bold text-white mb-3">
              隐私政策
            </Text>

            <Text className="block text-base text-emerald-100">
              我们重视您的隐私保护
            </Text>
          </View>
        </View>

        {/* 内容卡片 */}
        <View className="px-4 py-6 space-y-4 -mt-12 relative z-10">
          {/* 信息收集 */}
          <View
            className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-sm border border-gray-100 p-6"
            style={{
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.02)'
            }}
          >
            <View className="flex flex-row items-center mb-4">
              <Database size={24} color="#10B981" className="mr-2" />
              <Text className="block text-lg font-bold text-gray-800">信息收集</Text>
            </View>

            <View className="space-y-3">
              <View className="flex flex-row items-start">
                <View className="w-2 h-2 bg-emerald-500 rounded-full mr-3 flex-shrink-0 mt-2" />
                <Text className="block flex-1 text-sm text-gray-600 leading-relaxed">
                  <Text className="font-semibold text-gray-800">手机号码：</Text>用于账号注册、身份验证和服务联系
                </Text>
              </View>

              <View className="flex flex-row items-start">
                <View className="w-2 h-2 bg-emerald-500 rounded-full mr-3 flex-shrink-0 mt-2" />
                <Text className="block flex-1 text-sm text-gray-600 leading-relaxed">
                  <Text className="font-semibold text-gray-800">服务地址：</Text>用于安排上门服务
                </Text>
              </View>

              <View className="flex flex-row items-start">
                <View className="w-2 h-2 bg-emerald-500 rounded-full mr-3 flex-shrink-0 mt-2" />
                <Text className="block flex-1 text-sm text-gray-600 leading-relaxed">
                  <Text className="font-semibold text-gray-800">订单信息：</Text>包括预约时间、服务内容等
                </Text>
              </View>

              <View className="flex flex-row items-start">
                <View className="w-2 h-2 bg-emerald-500 rounded-full mr-3 flex-shrink-0 mt-2" />
                <Text className="block flex-1 text-sm text-gray-600 leading-relaxed">
                  <Text className="font-semibold text-gray-800">设备信息：</Text>用于优化服务体验和安全防护
                </Text>
              </View>
            </View>
          </View>

          {/* 信息使用 */}
          <View
            className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-sm border border-gray-100 p-6"
            style={{
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.02)'
            }}
          >
            <View className="flex flex-row items-center mb-4">
              <Eye size={24} color="#10B981" className="mr-2" />
              <Text className="block text-lg font-bold text-gray-800">信息使用</Text>
            </View>

            <View className="space-y-3">
              <View className="flex flex-row items-start">
                <View className="w-2 h-2 bg-emerald-500 rounded-full mr-3 flex-shrink-0 mt-2" />
                <Text className="block flex-1 text-sm text-gray-600 leading-relaxed">
                  提供和改进我们的服务
                </Text>
              </View>

              <View className="flex flex-row items-start">
                <View className="w-2 h-2 bg-emerald-500 rounded-full mr-3 flex-shrink-0 mt-2" />
                <Text className="block flex-1 text-sm text-gray-600 leading-relaxed">
                  处理您的服务请求和订单
                </Text>
              </View>

              <View className="flex flex-row items-start">
                <View className="w-2 h-2 bg-emerald-500 rounded-full mr-3 flex-shrink-0 mt-2" />
                <Text className="block flex-1 text-sm text-gray-600 leading-relaxed">
                  发送服务通知和促销信息
                </Text>
              </View>

              <View className="flex flex-row items-start">
                <View className="w-2 h-2 bg-emerald-500 rounded-full mr-3 flex-shrink-0 mt-2" />
                <Text className="block flex-1 text-sm text-gray-600 leading-relaxed">
                  分析服务数据以优化用户体验
                </Text>
              </View>
            </View>
          </View>

          {/* 信息保护 */}
          <View
            className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-sm border border-gray-100 p-6"
            style={{
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.02)'
            }}
          >
            <View className="flex flex-row items-center mb-4">
              <Lock size={24} color="#10B981" className="mr-2" />
              <Text className="block text-lg font-bold text-gray-800">信息保护</Text>
            </View>

            <View className="space-y-3">
              <View className="flex flex-row items-start">
                <View className="w-2 h-2 bg-emerald-500 rounded-full mr-3 flex-shrink-0 mt-2" />
                <Text className="block flex-1 text-sm text-gray-600 leading-relaxed">
                  采用加密技术保护数据传输安全
                </Text>
              </View>

              <View className="flex flex-row items-start">
                <View className="w-2 h-2 bg-emerald-500 rounded-full mr-3 flex-shrink-0 mt-2" />
                <Text className="block flex-1 text-sm text-gray-600 leading-relaxed">
                  严格控制内部人员访问权限
                </Text>
              </View>

              <View className="flex flex-row items-start">
                <View className="w-2 h-2 bg-emerald-500 rounded-full mr-3 flex-shrink-0 mt-2" />
                <Text className="block flex-1 text-sm text-gray-600 leading-relaxed">
                  定期进行安全审查和漏洞修复
                </Text>
              </View>

              <View className="flex flex-row items-start">
                <View className="w-2 h-2 bg-emerald-500 rounded-full mr-3 flex-shrink-0 mt-2" />
                <Text className="block flex-1 text-sm text-gray-600 leading-relaxed">
                  不会向第三方出售您的个人信息
                </Text>
              </View>
            </View>
          </View>

          {/* 用户权利 */}
          <View
            className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-sm border border-gray-100 p-6"
            style={{
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.02)'
            }}
          >
            <View className="flex flex-row items-center mb-4">
              <User size={24} color="#10B981" className="mr-2" />
              <Text className="block text-lg font-bold text-gray-800">用户权利</Text>
            </View>

            <View className="space-y-3">
              <View className="flex flex-row items-start">
                <View className="w-2 h-2 bg-emerald-500 rounded-full mr-3 flex-shrink-0 mt-2" />
                <Text className="block flex-1 text-sm text-gray-600 leading-relaxed">
                  <Text className="font-semibold text-gray-800">查询权：</Text>您有权查询我们收集的您的个人信息
                </Text>
              </View>

              <View className="flex flex-row items-start">
                <View className="w-2 h-2 bg-emerald-500 rounded-full mr-3 flex-shrink-0 mt-2" />
                <Text className="block flex-1 text-sm text-gray-600 leading-relaxed">
                  <Text className="font-semibold text-gray-800">更正权：</Text>您有权要求更正不准确的信息
                </Text>
              </View>

              <View className="flex flex-row items-start">
                <View className="w-2 h-2 bg-emerald-500 rounded-full mr-3 flex-shrink-0 mt-2" />
                <Text className="block flex-1 text-sm text-gray-600 leading-relaxed">
                  <Text className="font-semibold text-gray-800">删除权：</Text>您有权要求删除您的个人信息
                </Text>
              </View>

              <View className="flex flex-row items-start">
                <View className="w-2 h-2 bg-emerald-500 rounded-full mr-3 flex-shrink-0 mt-2" />
                <Text className="block flex-1 text-sm text-gray-600 leading-relaxed">
                  <Text className="font-semibold text-gray-800">撤回同意：</Text>您有权随时撤回对个人信息处理的同意
                </Text>
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
            <View className="flex flex-row items-center mb-4">
              <Globe size={24} color="#10B981" className="mr-2" />
              <Text className="block text-lg font-bold text-gray-800">联系我们</Text>
            </View>

            <Text className="block text-sm text-gray-600 leading-relaxed">
              如您对本隐私政策有任何疑问、意见或建议，或需要行使您的个人信息权利，请通过以下方式联系我们：
            </Text>

            <View className="mt-4 bg-emerald-50 rounded-2xl p-4">
              <Text className="block text-base font-semibold text-gray-800 mb-1">客服电话</Text>
              <Text className="block text-sm text-emerald-600">400-888-8888</Text>
            </View>
          </View>

          {/* 生效日期 */}
          <View
            className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-sm border border-gray-100 p-6"
            style={{
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.02)'
            }}
          >
            <Text className="block text-base font-bold text-gray-800 mb-3">生效日期</Text>
            <Text className="block text-sm text-gray-600">
              本隐私政策自 2024 年 1 月 1 日起生效
            </Text>
          </View>

          {/* 底部留白 */}
          <View className="h-8" />
        </View>
      </ScrollView>
    </View>
  )
}

export default PrivacyPage
