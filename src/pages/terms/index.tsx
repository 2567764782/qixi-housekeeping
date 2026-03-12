import { View, Text, ScrollView } from '@tarojs/components'
import { FileText, Shield, Award, Info } from 'lucide-react-taro'
import './index.css'

const TermsPage = () => {
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
              <FileText size={40} color="#fff" />
            </View>

            <Text className="block text-3xl font-bold text-white mb-3">
              服务条款
            </Text>

            <Text className="block text-base text-emerald-100">
              请仔细阅读以下条款
            </Text>
          </View>
        </View>

        {/* 内容卡片 */}
        <View className="px-4 py-6 space-y-4 -mt-12 relative z-10">
          {/* 服务协议 */}
          <View
            className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-sm border border-gray-100 p-6"
            style={{
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.02)'
            }}
          >
            <View className="flex flex-row items-center mb-4">
              <Shield size={24} color="#10B981" className="mr-2" />
              <Text className="block text-lg font-bold text-gray-800">服务协议</Text>
            </View>

            <View className="space-y-4">
              <View className="flex flex-row items-start">
                <View className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0 mt-0.5">
                  <Text className="block text-xs font-bold text-emerald-600">1</Text>
                </View>
                <View className="flex-1">
                  <Text className="block text-base font-semibold text-gray-800 mb-1">服务内容</Text>
                  <Text className="block text-sm text-gray-600 leading-relaxed">
                    本平台提供保洁服务和局部改造服务，用户通过平台预约服务，服务人员按照约定时间上门服务。
                  </Text>
                </View>
              </View>

              <View className="flex flex-row items-start">
                <View className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0 mt-0.5">
                  <Text className="block text-xs font-bold text-emerald-600">2</Text>
                </View>
                <View className="flex-1">
                  <Text className="block text-base font-semibold text-gray-800 mb-1">用户责任</Text>
                  <Text className="block text-sm text-gray-600 leading-relaxed">
                    用户应提供真实有效的联系方式和服务地址，确保服务人员能够顺利上门服务。
                  </Text>
                </View>
              </View>

              <View className="flex flex-row items-start">
                <View className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0 mt-0.5">
                  <Text className="block text-xs font-bold text-emerald-600">3</Text>
                </View>
                <View className="flex-1">
                  <Text className="block text-base font-semibold text-gray-800 mb-1">服务费用</Text>
                  <Text className="block text-sm text-gray-600 leading-relaxed">
                    服务费用按照平台公示的价格收取，如有特殊需求，费用另行协商。
                  </Text>
                </View>
              </View>

              <View className="flex flex-row items-start">
                <View className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0 mt-0.5">
                  <Text className="block text-xs font-bold text-emerald-600">4</Text>
                </View>
                <View className="flex-1">
                  <Text className="block text-base font-semibold text-gray-800 mb-1">取消预约</Text>
                  <Text className="block text-sm text-gray-600 leading-relaxed">
                    用户如需取消预约，请提前 24 小时通知平台，否则将收取相应费用。
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* 用户权益 */}
          <View
            className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-sm border border-gray-100 p-6"
            style={{
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.02)'
            }}
          >
            <View className="flex flex-row items-center mb-4">
              <Award size={24} color="#10B981" className="mr-2" />
              <Text className="block text-lg font-bold text-gray-800">用户权益</Text>
            </View>

            <View className="space-y-3">
              <View className="flex flex-row items-start">
                <Info size={16} color="#10B981" className="mr-3 flex-shrink-0 mt-0.5" />
                <Text className="block flex-1 text-sm text-gray-600 leading-relaxed">
                  享受专业、高效、可靠的家居服务
                </Text>
              </View>

              <View className="flex flex-row items-start">
                <Info size={16} color="#10B981" className="mr-3 flex-shrink-0 mt-0.5" />
                <Text className="block flex-1 text-sm text-gray-600 leading-relaxed">
                  服务不满意可要求重新服务或退款
                </Text>
              </View>

              <View className="flex flex-row items-start">
                <Info size={16} color="#10B981" className="mr-3 flex-shrink-0 mt-0.5" />
                <Text className="block flex-1 text-sm text-gray-600 leading-relaxed">
                  7×24 小时客服支持
                </Text>
              </View>

              <View className="flex flex-row items-start">
                <Info size={16} color="#10B981" className="mr-3 flex-shrink-0 mt-0.5" />
                <Text className="block flex-1 text-sm text-gray-600 leading-relaxed">
                  保护用户隐私，个人信息不泄露
                </Text>
              </View>
            </View>
          </View>

          {/* 免责声明 */}
          <View
            className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-sm border border-gray-100 p-6"
            style={{
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.02)'
            }}
          >
            <View className="flex flex-row items-center mb-4">
              <Shield size={24} color="#F59E0B" className="mr-2" />
              <Text className="block text-lg font-bold text-gray-800">免责声明</Text>
            </View>

            <Text className="block text-sm text-gray-600 leading-relaxed">
              因不可抗力（如自然灾害、政府行为等）导致服务无法正常提供的，本平台不承担违约责任。用户应妥善保管个人财物，平台对服务过程中用户财物丢失、损坏等情况不承担责任，但会协助用户处理。
            </Text>
          </View>

          {/* 协议更新 */}
          <View
            className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-sm border border-gray-100 p-6"
            style={{
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.02)'
            }}
          >
            <Text className="block text-base font-bold text-gray-800 mb-3">协议更新</Text>
            <Text className="block text-sm text-gray-600 leading-relaxed">
              本平台有权根据业务发展需要，随时修改本服务条款。修改后的条款一经公布即代替原条款，恕不另行通知。用户如不同意修改后的条款，可停止使用本平台服务。
            </Text>
          </View>

          {/* 底部留白 */}
          <View className="h-8" />
        </View>
      </ScrollView>
    </View>
  )
}

export default TermsPage
