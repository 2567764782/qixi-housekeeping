import Taro, { useLoad, useRouter } from '@tarojs/taro'
import { View, Text, ScrollView } from '@tarojs/components'
import { useState } from 'react'
import { Network } from '@/network'
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

  useLoad(() => {
    const { name, id } = router.params
    if (name) setServiceName(name)
    if (id) setServiceId(id)
  })

  // 时间选项
  const timeOptions = [
    '09:00-11:00',
    '11:00-13:00',
    '13:00-15:00',
    '15:00-17:00',
    '17:00-19:00',
    '19:00-21:00'
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
        <View className="bg-white rounded-xl shadow-sm p-4 mb-4">
          <Text className="block text-lg font-semibold mb-2">服务信息</Text>
          <Text className="block text-base text-gray-700">{serviceName}</Text>
        </View>

        <View className="bg-white rounded-xl shadow-sm p-4 mb-4">
          <Text className="block text-lg font-semibold mb-4">联系信息</Text>
          <View className="bg-gray-50 rounded-xl px-4 py-3 mb-4">
            <input
              className="w-full bg-transparent"
              placeholder="服务地址"
              value={address}
              onInput={(e: any) => setAddress(e.detail.value)}
            />
          </View>
          <View className="bg-gray-50 rounded-xl px-4 py-3">
            <input
              className="w-full bg-transparent"
              placeholder="联系电话"
              type="tel"
              value={phone}
              onInput={(e: any) => setPhone(e.detail.value)}
            />
          </View>
        </View>

        <View className="bg-white rounded-xl shadow-sm p-4 mb-4">
          <Text className="block text-lg font-semibold mb-4">预约时间</Text>
          <View className="bg-gray-50 rounded-xl px-4 py-3 mb-4">
            <input
              className="w-full bg-transparent"
              type="date"
              value={appointmentDate}
              onInput={(e: any) => setAppointmentDate(e.detail.value)}
            />
          </View>
          <Text className="block text-sm text-gray-500 mb-3">选择时间段</Text>
          <View className="flex flex-wrap gap-2">
            {timeOptions.map(time => (
              <View
                key={time}
                className={`px-4 py-2 rounded-lg ${
                  appointmentTime === time
                    ? 'bg-emerald-500 text-white'
                    : 'bg-gray-100 text-gray-600'
                }`}
                onClick={() => setAppointmentTime(time)}
              >
                <Text className="block text-sm">{time}</Text>
              </View>
            ))}
          </View>
        </View>

        <View className="bg-white rounded-xl shadow-sm p-4 mb-4">
          <Text className="block text-lg font-semibold mb-4">备注（可选）</Text>
          <View className="bg-gray-50 rounded-2xl p-4">
            <textarea
              style={{ width: '100%', minHeight: '100px', backgroundColor: 'transparent' }}
              placeholder="请输入备注信息..."
              value={remark}
              onInput={(e: any) => setRemark(e.detail.value)}
              maxLength={500}
            />
          </View>
        </View>
      </ScrollView>

      <View
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          display: 'flex',
          flexDirection: 'row',
          gap: '12px',
          padding: '12px',
          backgroundColor: '#fff',
          borderTop: '1px solid #e5e5e5',
          zIndex: 100
        }}
      >
        <View className="flex-1">
          <button
            className="w-full bg-emerald-500 text-white rounded-lg py-3 text-base font-semibold"
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
