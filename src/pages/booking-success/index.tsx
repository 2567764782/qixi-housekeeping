import { useState } from 'react'
import { View, Text, ScrollView } from '@tarojs/components'
import Taro, { useLoad } from '@tarojs/taro'
import { CircleCheck, Clock, MapPin, Phone, Calendar, Info } from 'lucide-react-taro'
import './index.css'

interface BookingSuccessProps {
  serviceName?: string
  date?: string
  time?: string
  address?: string
  staffName?: string
  staffPhone?: string
  orderId?: string
}

const BookingSuccessPage = () => {
  const [bookingInfo, setBookingInfo] = useState<BookingSuccessProps>({})

  useLoad(() => {
    console.log('Booking success page loaded')
    // 从路由参数获取预约信息
    const router = Taro.getCurrentInstance().router
    const params = router?.params || {}

    setBookingInfo({
      serviceName: params.serviceName || '日常保洁',
      date: params.date || '2024-01-20',
      time: params.time || '14:00',
      address: params.address || '北京市朝阳区建国路88号',
      staffName: params.staffName || '张师傅',
      staffPhone: params.staffPhone || '138****8888',
      orderId: params.orderId || 'ORD202401200001'
    })
  })

  const handleViewOrder = () => {
    Taro.switchTab({ url: '/pages/orders/index' })
  }

  const handleGoHome = () => {
    Taro.switchTab({ url: '/pages/index/index' })
  }

  const handleContactStaff = () => {
    if (bookingInfo.staffPhone) {
      Taro.makePhoneCall({
        phoneNumber: bookingInfo.staffPhone
      })
    }
  }

  return (
    <View className="flex flex-col h-full bg-gray-50">
      <ScrollView className="flex-1" scrollY>
        {/* 顶部成功横幅 */}
        <View
          className="relative overflow-hidden bg-gradient-to-r from-emerald-600 to-emerald-400 px-6 py-6"
          style={{
            boxShadow: '0 2px 12px rgba(16, 185, 129, 0.3)'
          }}
        >
          <View className="flex flex-row items-center">
            {/* 对勾图标容器 */}
            <View
              className="w-14 h-14 bg-emerald-500/50 rounded-2xl flex items-center justify-center mr-4"
              style={{
                backdropFilter: 'blur(10px)',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
              }}
            >
              <CircleCheck size={32} color="#fff" />
            </View>

            {/* 成功信息 */}
            <View className="flex-1">
              <Text className="block text-xl font-bold text-white mb-1">
                预约服务
              </Text>
              <Text className="block text-base text-emerald-50">
                {bookingInfo.serviceName || '日常保洁'}
              </Text>
            </View>
          </View>
        </View>

        {/* 预约详情卡片 */}
        <View className="px-4 py-6 space-y-4">
          {/* 预约信息 */}
          <View
            className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6"
            style={{
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.02)'
            }}
          >
            <View className="flex flex-row items-center justify-between mb-5">
              <Text className="block text-lg font-bold text-gray-800">预约信息</Text>
              <Text className="block text-sm text-emerald-600 font-medium">待服务</Text>
            </View>

            <View className="space-y-4">
              {/* 订单号 */}
              <View className="flex flex-row items-center">
                <View className="w-10 h-10 bg-emerald-50 rounded-2xl flex items-center justify-center mr-4 flex-shrink-0">
                  <Phone size={20} color="#10B981" />
                </View>
                <View className="flex-1">
                  <Text className="block text-sm text-gray-500 mb-1">订单编号</Text>
                  <Text className="block text-base font-semibold text-gray-800">
                    {bookingInfo.orderId}
                  </Text>
                </View>
              </View>

              {/* 预约日期 */}
              <View className="flex flex-row items-center">
                <View className="w-10 h-10 bg-blue-50 rounded-2xl flex items-center justify-center mr-4 flex-shrink-0">
                  <Calendar size={20} color="#3B82F6" />
                </View>
                <View className="flex-1">
                  <Text className="block text-sm text-gray-500 mb-1">预约日期</Text>
                  <Text className="block text-base font-semibold text-gray-800">
                    {bookingInfo.date}
                  </Text>
                </View>
              </View>

              {/* 预约时间 */}
              <View className="flex flex-row items-center">
                <View className="w-10 h-10 bg-orange-50 rounded-2xl flex items-center justify-center mr-4 flex-shrink-0">
                  <Clock size={20} color="#F97316" />
                </View>
                <View className="flex-1">
                  <Text className="block text-sm text-gray-500 mb-1">预约时间</Text>
                  <Text className="block text-base font-semibold text-gray-800">
                    {bookingInfo.time}
                  </Text>
                </View>
              </View>

              {/* 服务地址 */}
              <View className="flex flex-row items-center">
                <View className="w-10 h-10 bg-purple-50 rounded-2xl flex items-center justify-center mr-4 flex-shrink-0">
                  <MapPin size={20} color="#8B5CF6" />
                </View>
                <View className="flex-1">
                  <Text className="block text-sm text-gray-500 mb-1">服务地址</Text>
                  <Text className="block text-base font-semibold text-gray-800">
                    {bookingInfo.address}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* 服务人员信息 */}
          {bookingInfo.staffName && (
            <View
              className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6"
              style={{
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.02)'
              }}
            >
              <Text className="block text-lg font-bold text-gray-800 mb-4">服务人员</Text>

              <View className="flex flex-row items-center">
                {/* 头像 */}
                <View
                  className="w-14 h-14 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-2xl flex items-center justify-center mr-4 flex-shrink-0"
                  style={{
                    boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
                  }}
                >
                  <Text className="block text-xl font-bold text-white">
                    {bookingInfo.staffName.charAt(0)}
                  </Text>
                </View>

                <View className="flex-1">
                  <Text className="block text-base font-semibold text-gray-800 mb-1">
                    {bookingInfo.staffName}
                  </Text>
                  <Text className="block text-sm text-gray-500">
                    资深服务人员
                  </Text>
                </View>

                <View
                  className="px-4 py-2 bg-emerald-50 rounded-xl"
                  onClick={handleContactStaff}
                >
                  <View className="flex flex-row items-center">
                    <Phone size={16} color="#10B981" className="mr-2" />
                    <Text className="block text-sm font-semibold text-emerald-600">
                      联系
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          )}

          {/* 温馨提示 */}
          <View
            className="bg-amber-50 rounded-3xl border border-amber-200 p-5"
          >
            <View className="flex flex-row items-start">
              <View className="mr-3 flex-shrink-0 mt-0.5">
                <Info size={20} color="#F97316" />
              </View>
              <View className="flex-1">
                <Text className="block text-base font-semibold text-amber-800 mb-2">
                  温馨提示
                </Text>
                <Text className="block text-sm text-amber-700 leading-relaxed">
                  1. 请保持服务现场整洁，确保服务人员能够顺利开展工作{'\n'}
                  2. 服务人员会提前15分钟与您联系，请保持手机畅通{'\n'}
                  3. 如需修改预约时间，请提前24小时联系我们
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* 底部操作按钮 */}
        <View className="px-4 py-6 pb-12">
          <View className="flex flex-row gap-3">
            <View className="flex-1">
              <View
                className="w-full py-4 bg-emerald-500 rounded-2xl text-center"
                onClick={handleViewOrder}
                style={{
                  boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
                }}
              >
                <Text className="block text-base font-bold text-white">查看订单</Text>
              </View>
            </View>
            <View className="flex-1">
              <View
                className="w-full py-4 bg-white border-2 border-gray-200 rounded-2xl text-center"
                onClick={handleGoHome}
              >
                <Text className="block text-base font-semibold text-gray-700">返回首页</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  )
}

export default BookingSuccessPage
