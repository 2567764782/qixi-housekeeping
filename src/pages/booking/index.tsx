import Taro, { useLoad, useRouter } from '@tarojs/taro'
import { View, Text, ScrollView, Input, Textarea, Picker } from '@tarojs/components'
import { useState } from 'react'
import { Network } from '@/network'
import { Calendar, MapPin, MessageSquare } from 'lucide-react-taro'
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
      <ScrollView className="flex-1 px-4 py-4" scrollY>
        {/* 服务信息卡片 */}
        <View className="bg-gradient-to-br from-emerald-500 to-emerald-400 rounded-2xl p-5 mb-4 shadow-md">
          <Text className="block text-sm text-emerald-100 mb-1">预约服务</Text>
          <Text className="block text-xl font-bold text-white">{serviceName}</Text>
        </View>

        {/* 联系信息 */}
        <View className="bg-white rounded-2xl shadow-sm p-5 mb-4">
          <View className="flex flex-row items-center mb-4">
            <MapPin size={20} color="#10B981" className="mr-2" />
            <Text className="block text-base font-semibold text-gray-800">联系信息</Text>
          </View>

          <View className="mb-4">
            <Text className="block text-sm text-gray-500 mb-2">服务地址</Text>
            <View className="bg-gray-50 rounded-xl px-4 py-3">
              <Input
                className="w-full bg-transparent text-base"
                placeholder="请输入详细地址"
                value={address}
                onInput={(e: any) => setAddress(e.detail.value)}
              />
            </View>
          </View>

          <View>
            <Text className="block text-sm text-gray-500 mb-2">联系电话</Text>
            <View className="bg-gray-50 rounded-xl px-4 py-3">
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

        {/* 预约时间 */}
        <View className="bg-white rounded-2xl shadow-sm p-5 mb-4">
          <View className="flex flex-row items-center mb-4">
            <Calendar size={20} color="#10B981" className="mr-2" />
            <Text className="block text-base font-semibold text-gray-800">预约时间</Text>
          </View>

          <View className="mb-4">
            <Text className="block text-sm text-gray-500 mb-2">选择日期</Text>
            <View className="bg-gray-50 rounded-xl px-4 py-3">
              <Picker
                mode="date"
                value={appointmentDate}
                onChange={(e: any) => setAppointmentDate(e.detail.value)}
              >
                <View className="flex flex-row items-center">
                  <Text className={`block flex-1 text-base ${dateSelected ? 'text-gray-800' : 'text-gray-400'}`}>
                    {dateSelected ? appointmentDate : '请选择日期'}
                  </Text>
                  <Text className="block text-gray-400 text-sm ml-2">›</Text>
                </View>
              </Picker>
            </View>
          </View>

          <View>
            <Text className="block text-sm text-gray-500 mb-3">选择时间段</Text>
            <View className="grid grid-cols-2 gap-3">
              {timeOptions.map(time => (
                <View
                  key={time.value}
                  className={`px-4 py-3 rounded-xl text-center transition-all ${
                    appointmentTime === time.value
                      ? 'bg-emerald-500 shadow-md'
                      : 'bg-gray-100'
                  }`}
                  onClick={() => setAppointmentTime(time.value)}
                >
                  <Text
                    className={`block text-sm font-medium ${
                      appointmentTime === time.value ? 'text-white' : 'text-gray-600'
                    }`}
                  >
                    {time.label}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* 备注 */}
        <View className="bg-white rounded-2xl shadow-sm p-5 mb-4">
          <View className="flex flex-row items-center mb-4">
            <MessageSquare size={20} color="#10B981" className="mr-2" />
            <Text className="block text-base font-semibold text-gray-800">备注（可选）</Text>
          </View>
          <View className="bg-gray-50 rounded-2xl p-4">
            <Textarea
              className="w-full bg-transparent text-base"
              style={{ minHeight: '120px' }}
              placeholder="请输入备注信息，如特殊要求等..."
              value={remark}
              onInput={(e: any) => setRemark(e.detail.value)}
              maxlength={500}
            />
            <View className="text-right mt-2">
              <Text className="block text-xs text-gray-400">
                {remark.length}/500
              </Text>
            </View>
          </View>
        </View>

        {/* 底部留白，避免被固定按钮遮挡 */}
        <View className="h-24" />
      </ScrollView>

      {/* 固定底部按钮 */}
      <View
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          display: 'flex',
          flexDirection: 'row',
          gap: '12px',
          padding: '12px 16px',
          backgroundColor: '#fff',
          borderTop: '1px solid #e5e7eb',
          zIndex: 100,
          paddingBottom: 'calc(12px + env(safe-area-inset-bottom))'
        }}
      >
        <View className="flex-1">
          <button
            className="w-full bg-gradient-to-r from-emerald-500 to-emerald-400 text-white rounded-xl py-4 text-base font-bold shadow-lg active:shadow-md transition-shadow"
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
