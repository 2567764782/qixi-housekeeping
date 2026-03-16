import Taro from '@tarojs/taro'
import { View, Text, ScrollView } from '@tarojs/components'
import { Phone, Clock, MapPin } from 'lucide-react-taro'
import './index.css'

const ContactPage = () => {
  const handleCall = () => {
    Taro.makePhoneCall({
      phoneNumber: '400-888-9999',
      fail: () => {
        Taro.showToast({ title: '拨打失败', icon: 'none' })
      }
    })
  }

  const contactInfo = [
    {
      icon: <Phone size={24} color="#10B981" />,
      title: '客服电话',
      content: '400-888-9999',
      action: handleCall,
      actionText: '拨打'
    },
    {
      icon: <Clock size={24} color="#3B82F6" />,
      title: '服务时间',
      content: '每日 08:00 - 22:00',
      action: undefined,
      actionText: undefined
    },
    {
      icon: <MapPin size={24} color="#F59E0B" />,
      title: '服务区域',
      content: '全市范围均可上门服务',
      action: undefined,
      actionText: undefined
    }
  ]

  return (
    <View className="min-h-screen bg-gray-50">
      <ScrollView scrollY className="pb-8">
        {/* 顶部Banner */}
        <View className="bg-gradient-to-br from-emerald-500 to-emerald-600 px-6 py-10">
          <Text className="block text-2xl font-bold text-white text-center">联系我们</Text>
          <Text className="block text-sm text-white/80 text-center mt-2">如有任何问题，请随时联系我们</Text>
        </View>

        {/* 联系方式列表 */}
        <View className="px-4 -mt-4">
          <View className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {contactInfo.map((item, index) => (
              <View
                key={index}
                className={`flex flex-row items-center px-5 py-5 ${index !== contactInfo.length - 1 ? 'border-b border-gray-50' : ''}`}
                onClick={item.action}
              >
                <View className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center mr-4">
                  {item.icon}
                </View>
                <View className="flex-1">
                  <Text className="block text-sm text-gray-500">{item.title}</Text>
                  <Text className="block text-base font-medium text-gray-800 mt-1">{item.content}</Text>
                </View>
                {item.action && (
                  <View className="bg-emerald-500 text-white px-4 py-2 rounded-lg">
                    <Text className="text-sm font-medium">{item.actionText}</Text>
                  </View>
                )}
              </View>
            ))}
          </View>
        </View>

        {/* 服务区域说明 */}
        <View className="px-4 mt-4">
          <View className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <Text className="block text-base font-semibold text-gray-800 mb-3">服务区域</Text>
            <Text className="block text-sm text-gray-600 leading-relaxed">
              柒玺家政服务覆盖全市范围，包括但不限于：
            </Text>
            <View className="mt-3 flex flex-row flex-wrap gap-2">
              {['朝阳区', '海淀区', '东城区', '西城区', '丰台区', '石景山区', '通州区', '大兴区'].map((area, index) => (
                <View key={index} className="bg-gray-100 rounded-full px-3 py-1">
                  <Text className="block text-sm text-gray-600">{area}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* 温馨提示 */}
        <View className="px-4 mt-4">
          <View className="bg-emerald-50 rounded-2xl p-5">
            <Text className="block text-base font-semibold text-gray-800 mb-3">温馨提示</Text>
            <View className="flex flex-col gap-2">
              <Text className="block text-sm text-gray-600 leading-relaxed">
                1. 预约服务请提前1-2天联系客服
              </Text>
              <Text className="block text-sm text-gray-600 leading-relaxed">
                2. 如需取消或改期，请提前4小时通知
              </Text>
              <Text className="block text-sm text-gray-600 leading-relaxed">
                3. 服务过程中如有问题，可随时拨打客服电话
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  )
}

export default ContactPage
