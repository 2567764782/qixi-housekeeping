import Taro, { useLoad, useRouter } from '@tarojs/taro'
import { View, Text, ScrollView, Input, Textarea, Picker } from '@tarojs/components'
import { useState } from 'react'
import { Network } from '@/network'
import { Calendar, MapPin, MessageSquare, Check } from 'lucide-react-taro'
import './index.css'

const BookingPage = () => {
  const router = useRouter()
  const [serviceName, setServiceName] = useState('')
  const [serviceId, setServiceId] = useState('')
  const [address, setAddress] = useState('')
  const [phone, setPhone] = useState('')
  const [appointmentDate, setAppointmentDate] = useState('')
  const [appointmentTime, setAppointmentTime] = useState('')
  const [remark, setRemark] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [dateSelected, setDateSelected] = useState(false)

  useLoad(() => {
    const { name, id } = router.params
    if (name) setServiceName(name)
    if (id) setServiceId(id)
    // 设置默认日期为今天
    const today = new Date()
    const year = today.getFullYear()
    const month = String(today.getMonth() + 1).padStart(2, '0')
    const day = String(today.getDate()).padStart(2, '0')
    setAppointmentDate(`${year}-${month}-${day}`)
    setDateSelected(true)
  })

  // 时间选项
  const timeOptions = [
    { value: '09:00-11:00', label: '上午 09:00-11:00' },
    { value: '11:00-13:00', label: '中午 11:00-13:00' },
    { value: '13:00-15:00', label: '下午 13:00-15:00' },
    { value: '15:00-17:00', label: '下午 15:00-17:00' },
    { value: '17:00-19:00', label: '傍晚 17:00-19:00' },
    { value: '19:00-21:00', label: '晚上 19:00-21:00' }
  ]

  // 提交预约
  const handleSubmit = async () => {
    if (!address) {
      alert('请输入服务地址')
      return
    }
    if (!phone) {
      alert('请输入联系电话')
      return
    }
    if (!appointmentDate) {
      alert('请选择预约日期')
      return
    }
    if (!appointmentTime) {
      alert('请选择预约时间')
      return
    }

    try {
      setSubmitting(true)
      const res = await Network.request({
        url: '/api/orders',
        method: 'POST',
        data: {
          userId: 'demo-user-001',
          serviceId,
          serviceName,
          address,
          phone,
          appointmentDate,
          appointmentTime,
          remark
        }
      })
      console.log('Order created:', res.data)
      alert('预约成功！')
      Taro.switchTab({ url: '/pages/orders/index' })
    } catch (error) {
      console.error('Failed to create order:', error)
      alert('预约失败，请重试')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <View className="flex flex-col h-full bg-gray-50">
      <ScrollView className="flex-1" scrollY>
        {/* 服务信息卡片 - 多层渐变 + 装饰 */}
        <View className="relative overflow-hidden bg-gradient-to-br from-emerald-600 via-emerald-500 to-teal-500 p-6 pt-8">
          {/* 背景装饰 */}
          <View className="absolute top-[-40px] right-[-40px] w-32 h-32 bg-white/10 rounded-full blur-3xl" />
          <View className="absolute bottom-[-20px] left-[-20px] w-24 h-24 bg-white/10 rounded-full blur-2xl" />

          <View className="relative">
            <View className="flex flex-row items-center mb-3">
              <View className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mr-3">
                <Check size={20} color="#fff" />
              </View>
              <Text className="block text-sm text-emerald-100 font-medium">预约服务</Text>
            </View>
            <Text className="block text-2xl font-bold text-white leading-tight">
              {serviceName}
            </Text>
          </View>
        </View>

        <View className="px-4 py-6 space-y-4">
          {/* 联系信息卡片 - 玻璃态 */}
          <View
            className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-sm border border-gray-100 p-6"
            style={{
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.02)'
            }}
          >
            <View className="flex flex-row items-center mb-5">
              <View className="w-11 h-11 bg-emerald-100 rounded-2xl flex items-center justify-center mr-3">
                <MapPin size={22} color="#10B981" />
              </View>
              <Text className="block text-lg font-bold text-gray-800">联系信息</Text>
            </View>

            <View className="space-y-4">
              <View>
                <Text className="block text-sm text-gray-500 mb-2.5 font-medium">服务地址</Text>
                <View
                  className="bg-gray-50 rounded-2xl px-4 py-3.5 border border-gray-100"
                  style={{
                    boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.03)'
                  }}
                >
                  <Input
                    className="w-full bg-transparent text-base"
                    placeholder="请输入详细地址"
                    value={address}
                    onInput={(e: any) => setAddress(e.detail.value)}
                  />
                </View>
              </View>

              <View>
                <Text className="block text-sm text-gray-500 mb-2.5 font-medium">联系电话</Text>
                <View
                  className="bg-gray-50 rounded-2xl px-4 py-3.5 border border-gray-100"
                  style={{
                    boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.03)'
                  }}
                >
                  <Input
                    className="w-full bg-transparent text-base"
                    placeholder="请输入手机号码"
                    type="number"
                    value={phone}
                    onInput={(e: any) => setPhone(e.detail.value)}
                    maxlength={11}
                  />
                </View>
              </View>
            </View>
          </View>

          {/* 预约时间卡片 - 玻璃态 */}
          <View
            className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-sm border border-gray-100 p-6"
            style={{
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.02)'
            }}
          >
            <View className="flex flex-row items-center mb-5">
              <View className="w-11 h-11 bg-emerald-100 rounded-2xl flex items-center justify-center mr-3">
                <Calendar size={22} color="#10B981" />
              </View>
              <Text className="block text-lg font-bold text-gray-800">预约时间</Text>
            </View>

            <View className="space-y-4">
              <View>
                <Text className="block text-sm text-gray-500 mb-2.5 font-medium">选择日期</Text>
                <View
                  className="bg-gray-50 rounded-2xl px-4 py-3.5 border border-gray-100"
                  style={{
                    boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.03)'
                  }}
                >
                  <Picker
                    mode="date"
                    value={appointmentDate}
                    onChange={(e: any) => setAppointmentDate(e.detail.value)}
                  >
                    <View className="flex flex-row items-center justify-between">
                      <Text className={`block text-base ${dateSelected ? 'text-gray-800' : 'text-gray-400'}`}>
                        {dateSelected ? appointmentDate : '请选择日期'}
                      </Text>
                      <Text className="block text-gray-400 text-lg ml-2">›</Text>
                    </View>
                  </Picker>
                </View>
              </View>

              <View>
                <Text className="block text-sm text-gray-500 mb-3.5 font-medium">选择时间段</Text>
                <View className="grid grid-cols-2 gap-3">
                  {timeOptions.map(time => (
                    <View
                      key={time.value}
                      className={`px-4 py-3.5 rounded-2xl text-center transition-all duration-200 ${
                        appointmentTime === time.value
                          ? 'bg-emerald-500 shadow-md'
                          : 'bg-white border border-gray-200'
                      }`}
                      onClick={() => setAppointmentTime(time.value)}
                      style={appointmentTime === time.value ? {
                        boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
                      } : {}}
                    >
                      <Text
                        className={`block text-sm font-semibold ${
                          appointmentTime === time.value ? 'text-white' : 'text-gray-700'
                        }`}
                      >
                        {time.label}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            </View>
          </View>

          {/* 备注卡片 - 玻璃态 */}
          <View
            className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-sm border border-gray-100 p-6"
            style={{
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.02)'
            }}
          >
            <View className="flex flex-row items-center mb-5">
              <View className="w-11 h-11 bg-emerald-100 rounded-2xl flex items-center justify-center mr-3">
                <MessageSquare size={22} color="#10B981" />
              </View>
              <Text className="block text-lg font-bold text-gray-800">备注（可选）</Text>
            </View>
            <View
              className="bg-gray-50 rounded-2xl p-4 border border-gray-100"
              style={{
                boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.03)'
              }}
            >
              <Textarea
                className="w-full bg-transparent text-base"
                style={{ minHeight: '120px' }}
                placeholder="请输入备注信息，如特殊要求等..."
                value={remark}
                onInput={(e: any) => setRemark(e.detail.value)}
                maxlength={500}
              />
              <View className="text-right mt-2.5">
                <Text className="block text-xs text-gray-400 font-medium">
                  {remark.length}/500
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* 底部留白 */}
        <View className="h-32" />
      </ScrollView>

      {/* 固定底部按钮 - 悬浮效果 */}
      <View
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          display: 'flex',
          flexDirection: 'row',
          padding: '16px 20px',
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(10px)',
          borderTop: '1px solid rgba(229, 231, 235, 0.5)',
          zIndex: 100,
          paddingBottom: 'calc(16px + env(safe-area-inset-bottom))'
        }}
      >
        <View className="flex-1">
          <button
            className="w-full bg-gradient-to-r from-emerald-600 to-emerald-500 text-white rounded-2xl py-4 text-base font-bold shadow-lg transition-all active:scale-[0.98]"
            style={{
              boxShadow: '0 4px 12px rgba(16, 185, 129, 0.35), 0 2px 4px rgba(16, 185, 129, 0.15)'
            }}
            onClick={handleSubmit}
            disabled={submitting}
          >
            {submitting ? '提交中...' : '确认预约'}
          </button>
        </View>
      </View>
    </View>
  )
}

export default BookingPage
