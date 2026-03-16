import { View, Text, ScrollView } from '@tarojs/components'
import './index.css'

const TermsPage = () => {
  return (
    <View className="min-h-screen bg-gray-50">
      <ScrollView scrollY className="p-4 pb-8">
        <View className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <Text className="block text-xl font-bold text-gray-800 text-center mb-4">用户协议</Text>
          
          <Text className="block text-sm text-gray-500 mb-4">
            更新日期：2024年3月1日
          </Text>

          <View className="flex flex-col gap-4">
            <View>
              <Text className="block text-base font-semibold text-gray-800 mb-2">一、服务内容</Text>
              <Text className="block text-sm text-gray-600 leading-relaxed">
                柒玺家政小程序提供家庭保洁、家电清洗、新居开荒、收纳整理等家政服务。用户可以通过小程序预约服务、查看订单等。
              </Text>
            </View>

            <View>
              <Text className="block text-base font-semibold text-gray-800 mb-2">二、用户注册</Text>
              <Text className="block text-sm text-gray-600 leading-relaxed">
                用户在使用服务前需要进行注册，提供真实、准确、完整的个人信息。用户应妥善保管账号信息，因账号泄露造成的损失由用户自行承担。
              </Text>
            </View>

            <View>
              <Text className="block text-base font-semibold text-gray-800 mb-2">三、服务预约</Text>
              <Text className="block text-sm text-gray-600 leading-relaxed">
                用户可以自主选择服务项目、预约时间。预约成功后，服务人员将按照预约时间上门服务。如需取消或改期，请提前通知客服。
              </Text>
            </View>

            <View>
              <Text className="block text-base font-semibold text-gray-800 mb-2">四、服务费用</Text>
              <Text className="block text-sm text-gray-600 leading-relaxed">
                服务费用以小程序显示价格为准。服务完成后，用户可选择在线支付或其他方式支付费用。
              </Text>
            </View>

            <View>
              <Text className="block text-base font-semibold text-gray-800 mb-2">五、用户义务</Text>
              <Text className="block text-sm text-gray-600 leading-relaxed">
                用户应提供真实有效的联系方式和地址信息；应为服务人员提供必要的工作条件；应按时支付服务费用。
              </Text>
            </View>

            <View>
              <Text className="block text-base font-semibold text-gray-800 mb-2">六、服务保障</Text>
              <Text className="block text-sm text-gray-600 leading-relaxed">
                我们承诺提供满意的服务。如对服务不满意，可在服务完成后24小时内联系客服，我们将安排免费返工或退款。
              </Text>
            </View>

            <View>
              <Text className="block text-base font-semibold text-gray-800 mb-2">七、免责声明</Text>
              <Text className="block text-sm text-gray-600 leading-relaxed">
                因不可抗力、政府行为、电信网络故障等原因导致服务无法进行的，我们不承担责任。
              </Text>
            </View>

            <View>
              <Text className="block text-base font-semibold text-gray-800 mb-2">八、协议修改</Text>
              <Text className="block text-sm text-gray-600 leading-relaxed">
                我们有权修改本协议。修改后的协议将在小程序内公布，继续使用服务即表示同意修改后的协议。
              </Text>
            </View>

            <View>
              <Text className="block text-base font-semibold text-gray-800 mb-2">九、法律适用</Text>
              <Text className="block text-sm text-gray-600 leading-relaxed">
                本协议适用中华人民共和国法律。如发生争议，双方应协商解决；协商不成的，可向我们所在地法院提起诉讼。
              </Text>
            </View>

            <View>
              <Text className="block text-base font-semibold text-gray-800 mb-2">十、联系我们</Text>
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

export default TermsPage
