import { View, Text, ScrollView } from '@tarojs/components'
import './index.css'

const PrivacyPage = () => {
  return (
    <View className="min-h-screen bg-gray-50">
      <ScrollView scrollY className="p-4 pb-8">
        <View className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <Text className="block text-xl font-bold text-gray-800 text-center mb-4">隐私政策</Text>
          
          <Text className="block text-sm text-gray-500 mb-4">
            更新日期：2024年3月1日
          </Text>

          <View className="flex flex-col gap-4">
            <View>
              <Text className="block text-base font-semibold text-gray-800 mb-2">一、信息收集</Text>
              <Text className="block text-sm text-gray-600 leading-relaxed">
                我们收集的信息包括：您在使用服务时提供的个人信息（如姓名、电话、地址等）、设备信息、位置信息等。这些信息将用于为您提供更好的服务体验。
              </Text>
            </View>

            <View>
              <Text className="block text-base font-semibold text-gray-800 mb-2">二、信息使用</Text>
              <Text className="block text-sm text-gray-600 leading-relaxed">
                我们使用收集的信息用于：处理您的服务预约、改善我们的服务、向您发送服务通知、提供客户支持等。
              </Text>
            </View>

            <View>
              <Text className="block text-base font-semibold text-gray-800 mb-2">三、信息保护</Text>
              <Text className="block text-sm text-gray-600 leading-relaxed">
                我们采取严格的安全措施保护您的个人信息，包括数据加密、访问控制等。未经您的同意，我们不会向第三方披露您的个人信息。
              </Text>
            </View>

            <View>
              <Text className="block text-base font-semibold text-gray-800 mb-2">四、信息存储</Text>
              <Text className="block text-sm text-gray-600 leading-relaxed">
                您的信息将存储于中国境内的服务器，我们会采取合理措施保护信息安全。
              </Text>
            </View>

            <View>
              <Text className="block text-base font-semibold text-gray-800 mb-2">五、您的权利</Text>
              <Text className="block text-sm text-gray-600 leading-relaxed">
                您有权访问、更正、删除您的个人信息。如需行使相关权利，请联系我们的客服。
              </Text>
            </View>

            <View>
              <Text className="block text-base font-semibold text-gray-800 mb-2">六、未成年人保护</Text>
              <Text className="block text-sm text-gray-600 leading-relaxed">
                我们重视未成年人的个人信息保护。如果您是未成年人，请在监护人指导下使用我们的服务。
              </Text>
            </View>

            <View>
              <Text className="block text-base font-semibold text-gray-800 mb-2">七、政策更新</Text>
              <Text className="block text-sm text-gray-600 leading-relaxed">
                我们可能会不时更新本隐私政策。更新后的政策将在小程序内公布，请定期查看。
              </Text>
            </View>

            <View>
              <Text className="block text-base font-semibold text-gray-800 mb-2">八、联系我们</Text>
              <Text className="block text-sm text-gray-600 leading-relaxed">
                如有任何疑问，请联系我们：{'\n'}客服电话：400-888-9999{'\n'}服务时间：08:00-22:00
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  )
}

export default PrivacyPage
