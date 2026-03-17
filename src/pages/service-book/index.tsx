import Taro from '@tarojs/taro'
import { View, Text, ScrollView, Picker, Input } from '@tarojs/components'
import { useState, useEffect } from 'react'
import { Calendar, Clock, MapPin, Phone, User, FileText, ChevronRight, Check } from 'lucide-react-taro'
import { Network } from '@/network'
import './index.css'

interface BookingData {
  type: string
  itemId: string
  name: string
  price: string
  unit: string
  duration: string
}

const ServiceBookPage = () => {
  const [bookingData, setBookingData] = useState<BookingData>({
    type: '',
    itemId: '',
    name: '',
    price: '',
    unit: '',
    duration: ''
  })

  // 表单数据
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    date: '',
    time: '',
    remark: ''
  })

  // 日期选择器
  const [dateIndex, setDateIndex] = useState<number>(0)
  const [dates] = useState<string[]>(() => {
    const result: string[] = []
    const today = new Date()
    for (let i = 0; i < 7; i++) {
      const date = new Date(today)
      date.setDate(today.getDate() + i)
      const weekday = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'][date.getDay()]
      if (i === 0) {
        result.push(`今天 (${date.getMonth() + 1}/${date.getDate()})`)
      } else if (i === 1) {
        result.push(`明天 (${date.getMonth() + 1}/${date.getDate()})`)
      } else {
        result.push(`${weekday} (${date.getMonth() + 1}/${date.getDate()})`)
      }
    }
    return result
  })

  // 时间段选择器
  const [timeIndex, setTimeIndex] = useState<number>(0)
  const [times] = useState<string[]>([
    '08:00-10:00',
    '09:00-11:00',
    '10:00-12:00',
    '14:00-16:00',
    '15:00-17:00',
    '16:00-18:00',
    '18:00-20:00'
  ])

  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // 获取路由参数
    const instance = Taro.getCurrentInstance()
    const params = instance.router?.params
    
    if (params) {
      setBookingData({
        type: params.type || '',
        itemId: params.itemId || '',
        name: decodeURIComponent(params.name || ''),
        price: params.price || '',
        unit: decodeURIComponent(params.unit || ''),
        duration: decodeURIComponent(params.duration || '')
      })
      
      // 设置页面标题
      Taro.setNavigationBarTitle({ title: '预约服务' })
    }
  }, [])

  // 日期选择
  const handleDateChange = (e) => {
    const index = e.detail.value
    setDateIndex(index)
    setFormData({ ...formData, date: dates[index] })
  }

  // 时间选择
  const handleTimeChange = (e) => {
    const index = e.detail.value
    setTimeIndex(index)
    setFormData({ ...formData, time: times[index] })
  }

  // 提交预约
  const handleSubmit = async () => {
    // 表单验证
    if (!formData.name.trim()) {
      Taro.showToast({ title: '请输入联系人姓名', icon: 'none' })
      return
    }
    if (!formData.phone.trim()) {
      Taro.showToast({ title: '请输入联系电话', icon: 'none' })
      return
    }
    if (!/^1[3-9]\d{9}$/.test(formData.phone)) {
      Taro.showToast({ title: '请输入正确的手机号', icon: 'none' })
      return
    }
    if (!formData.address.trim()) {
      Taro.showToast({ title: '请输入服务地址', icon: 'none' })
      return
    }
    if (!formData.date) {
      Taro.showToast({ title: '请选择服务日期', icon: 'none' })
      return
    }
    if (!formData.time) {
      Taro.showToast({ title: '请选择服务时间', icon: 'none' })
      return
    }

    setLoading(true)
    try {
      // 调用后端预约接口
      const res = await Network.request({
        url: '/api/orders',
        method: 'POST',
        data: {
          service_type: bookingData.type,
          service_item_id: bookingData.itemId,
          service_name: bookingData.name,
          price: bookingData.price,
          unit: bookingData.unit,
          duration: bookingData.duration,
          contact_name: formData.name,
          contact_phone: formData.phone,
          address: formData.address,
          service_date: formData.date,
          service_time: formData.time,
          remark: formData.remark
        }
      })

      if (res.statusCode === 200 || res.statusCode === 201) {
        Taro.showModal({
          title: '预约成功',
          content: '您的预约已提交，工作人员将尽快与您联系确认',
          showCancel: false,
          success: () => {
            // 跳转到预约列表
            Taro.switchTab({ url: '/pages/orders/index' })
          }
        })
      } else {
        throw new Error('预约失败')
      }
    } catch (error) {
      console.error('预约失败:', error)
      Taro.showToast({ title: '预约失败，请重试', icon: 'none' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <View className="min-h-screen bg-gray-50">
      <ScrollView scrollY className="book-scroll-wrapper">
        {/* 服务信息卡片 */}
        <View className="bg-white mx-4 mt-4 rounded-xl overflow-hidden shadow-sm">
          <View className="p-4 border-b border-gray-100">
            <Text className="block text-lg font-bold text-gray-900">{bookingData.name}</Text>
          </View>
          <View className="flex flex-row justify-between items-center p-4">
            <View className="flex flex-row items-center">
              <Clock size={16} color="#999" />
              <Text className="text-sm text-gray-600 ml-1">{bookingData.duration}</Text>
            </View>
            <View className="flex flex-row items-baseline">
              <Text className="text-xl font-bold text-red-500">¥{bookingData.price}</Text>
              <Text className="text-sm text-gray-400 ml-1">/{bookingData.unit}</Text>
            </View>
          </View>
        </View>

        {/* 预约表单 */}
        <View className="bg-white mx-4 mt-4 rounded-xl overflow-hidden shadow-sm">
          <View className="p-4 border-b border-gray-100">
            <Text className="text-base font-semibold text-gray-900">预约信息</Text>
          </View>

          {/* 联系人 */}
          <View className="flex flex-row items-center px-4 py-3 border-b border-gray-50">
            <View className="w-6 flex-shrink-0">
              <User size={18} color="#F85659" />
            </View>
            <Text className="text-sm text-gray-600 w-20">联系人</Text>
            <Input
              className="flex-1 text-sm text-right"
              placeholder="请输入联系人姓名"
              value={formData.name}
              onInput={(e) => setFormData({ ...formData, name: e.detail.value })}
            />
          </View>

          {/* 电话 */}
          <View className="flex flex-row items-center px-4 py-3 border-b border-gray-50">
            <View className="w-6 flex-shrink-0">
              <Phone size={18} color="#F85659" />
            </View>
            <Text className="text-sm text-gray-600 w-20">联系电话</Text>
            <Input
              className="flex-1 text-sm text-right"
              type="number"
              placeholder="请输入手机号"
              maxlength={11}
              value={formData.phone}
              onInput={(e) => setFormData({ ...formData, phone: e.detail.value })}
            />
          </View>

          {/* 地址 */}
          <View className="flex flex-row items-center px-4 py-3 border-b border-gray-50">
            <View className="w-6 flex-shrink-0">
              <MapPin size={18} color="#F85659" />
            </View>
            <Text className="text-sm text-gray-600 w-20">服务地址</Text>
            <Input
              className="flex-1 text-sm text-right"
              placeholder="请输入详细地址"
              value={formData.address}
              onInput={(e) => setFormData({ ...formData, address: e.detail.value })}
            />
          </View>

          {/* 日期 */}
          <View className="flex flex-row items-center px-4 py-3 border-b border-gray-50">
            <View className="w-6 flex-shrink-0">
              <Calendar size={18} color="#F85659" />
            </View>
            <Text className="text-sm text-gray-600 w-20">服务日期</Text>
            <Picker mode="selector" range={dates} value={dateIndex} onChange={handleDateChange}>
              <View className="flex flex-row items-center justify-end flex-1">
                <Text className={`text-sm ${formData.date ? 'text-gray-900' : 'text-gray-400'}`}>
                  {formData.date || '请选择日期'}
                </Text>
                <ChevronRight size={16} color="#ccc" className="ml-1" />
              </View>
            </Picker>
          </View>

          {/* 时间 */}
          <View className="flex flex-row items-center px-4 py-3 border-b border-gray-50">
            <View className="w-6 flex-shrink-0">
              <Clock size={18} color="#F85659" />
            </View>
            <Text className="text-sm text-gray-600 w-20">服务时间</Text>
            <Picker mode="selector" range={times} value={timeIndex} onChange={handleTimeChange}>
              <View className="flex flex-row items-center justify-end flex-1">
                <Text className={`text-sm ${formData.time ? 'text-gray-900' : 'text-gray-400'}`}>
                  {formData.time || '请选择时间'}
                </Text>
                <ChevronRight size={16} color="#ccc" className="ml-1" />
              </View>
            </Picker>
          </View>

          {/* 备注 */}
          <View className="flex flex-row px-4 py-3">
            <View className="w-6 flex-shrink-0">
              <FileText size={18} color="#F85659" />
            </View>
            <Text className="text-sm text-gray-600 w-20">备注</Text>
            <Input
              className="flex-1 text-sm text-right"
              placeholder="请输入备注信息（选填）"
              value={formData.remark}
              onInput={(e) => setFormData({ ...formData, remark: e.detail.value })}
            />
          </View>
        </View>

        {/* 服务说明 */}
        <View className="bg-white mx-4 mt-4 mb-32 rounded-xl overflow-hidden shadow-sm">
          <View className="p-4 border-b border-gray-100">
            <Text className="text-base font-semibold text-gray-900">服务说明</Text>
          </View>
          <View className="p-4">
            <View className="flex flex-row items-start mb-2">
              <Check size={14} color="#10B981" />
              <Text className="text-xs text-gray-600 ml-2">专业培训上岗，服务有保障</Text>
            </View>
            <View className="flex flex-row items-start mb-2">
              <Check size={14} color="#10B981" />
              <Text className="text-xs text-gray-600 ml-2">自带专业工具，无需额外准备</Text>
            </View>
            <View className="flex flex-row items-start mb-2">
              <Check size={14} color="#10B981" />
              <Text className="text-xs text-gray-600 ml-2">服务不满意可申请售后</Text>
            </View>
            <View className="flex flex-row items-start">
              <Check size={14} color="#10B981" />
              <Text className="text-xs text-gray-600 ml-2">如有疑问请联系客服：400-123-4567</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* 底部提交按钮 */}
      <View className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-4 py-3 z-50">
        <View className="flex flex-row items-center justify-between">
          <View className="flex flex-row items-baseline">
            <Text className="text-sm text-gray-600">合计：</Text>
            <Text className="text-xl font-bold text-red-500">¥{bookingData.price}</Text>
          </View>
          <View
            className={`px-8 py-2.5 rounded-full ${loading ? 'bg-gray-300' : 'bg-red-500'}`}
            onClick={() => !loading && handleSubmit()}
          >
            <Text className="text-base font-medium text-white">
              {loading ? '提交中...' : '立即预约'}
            </Text>
          </View>
        </View>
      </View>
    </View>
  )
}

export default ServiceBookPage
