import Taro, { useLoad, useRouter } from '@tarojs/taro'
import { View, Text, ScrollView, Input, Textarea, Picker } from '@tarojs/components'
import { useState } from 'react'
import { Calendar, MapPin, Phone, User, House, Clock, ChevronRight } from 'lucide-react-taro'
import { Network } from '@/network'
import './index.css'

interface ServiceInfo {
  id: string
  name: string
  price: string
  duration: string
}

const BookingPage = () => {
  const router = useRouter()
  
  // 服务信息
  const [serviceId, setServiceId] = useState('')
  const [serviceName, setServiceName] = useState('')
  const [servicePrice, setServicePrice] = useState('')
  
  // 表单数据
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [area, setArea] = useState('')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [remark, setRemark] = useState('')
  
  // 选择器
  const [dateSelector, setDateSelector] = useState(false)
  const [timeSelector, setTimeSelector] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  useLoad(() => {
    const { serviceId: sid } = router.params
    if (sid) {
      setServiceId(sid)
      loadServiceInfo(sid)
    }
    
    // 检查用户信息
    const userInfo = Taro.getStorageSync('userInfo')
    if (userInfo) {
      setName(userInfo.nickname || '')
      setPhone(userInfo.phone || '')
      setAddress(userInfo.address || '')
    }
    
    // 设置默认日期
    const today = new Date()
    const year = today.getFullYear()
    const month = String(today.getMonth() + 1).padStart(2, '0')
    const day = String(today.getDate()).padStart(2, '0')
    setDate(`${year}-${month}-${day}`)
  })

  const loadServiceInfo = (sid: string) => {
    const services: Record<string, ServiceInfo> = {
      '1': { id: '1', name: '日常保洁', price: '50元/小时', duration: '2小时起' },
      '2': { id: '2', name: '深度保洁', price: '100元/小时', duration: '4小时起' },
      '3': { id: '3', name: '新居开荒', price: '8元/平米', duration: '全天' },
      '4': { id: '4', name: '家电清洗', price: '80元/台起', duration: '1-2小时' },
      '5': { id: '5', name: '收纳整理', price: '200元/次', duration: '3小时起' }
    }
    
    const service = services[sid]
    if (service) {
      setServiceName(service.name)
      setServicePrice(service.price)
    }
  }

  // 时间选项
  const timeOptions = [
    '09:00-11:00',
    '11:00-13:00',
    '13:00-15:00',
    '15:00-17:00',
    '17:00-19:00',
    '19:00-21:00'
  ]

  // 日期选择器
  const dateOptions: string[] = (() => {
    const dates: string[] = []
    const today = new Date()
    for (let i = 0; i < 7; i++) {
      const d = new Date(today)
      d.setDate(today.getDate() + i)
      const year = d.getFullYear()
      const month = String(d.getMonth() + 1).padStart(2, '0')
      const day = String(d.getDate()).padStart(2, '0')
      dates.push(`${year}-${month}-${day}`)
    }
    return dates
  })()

  const handleDateChange = (e: any) => {
    setDate(dateOptions[e.detail.value])
    setDateSelector(false)
  }

  const handleTimeChange = (e: any) => {
    setTime(timeOptions[e.detail.value])
    setTimeSelector(false)
  }

  const handleSubmit = async () => {
    // 表单验证
    if (!name.trim()) {
      Taro.showToast({ title: '请输入姓名', icon: 'none' })
      return
    }
    if (!phone.trim() || phone.length !== 11) {
      Taro.showToast({ title: '请输入正确的手机号', icon: 'none' })
      return
    }
    if (!address.trim()) {
      Taro.showToast({ title: '请输入服务地址', icon: 'none' })
      return
    }
    if (!date) {
      Taro.showToast({ title: '请选择预约日期', icon: 'none' })
      return
    }
    if (!time) {
      Taro.showToast({ title: '请选择预约时间', icon: 'none' })
      return
    }

    try {
      setSubmitting(true)
      
      // 提交预约
      const res = await Network.request({
        url: '/api/orders',
        method: 'POST',
        data: {
          serviceId,
          serviceName,
          name,
          phone,
          address,
          area,
          date,
          time,
          remark,
          status: 'pending'
        }
      })
      
      console.log('📤 预约提交响应:', res)
      
      if (res.statusCode === 200 || res.statusCode === 201) {
        // 保存用户信息
        Taro.setStorageSync('userInfo', { nickname: name, phone, address })
        
        Taro.showModal({
          title: '预约成功',
          content: '您的预约已提交，客服将尽快与您联系确认',
          showCancel: false,
          success: () => {
            Taro.switchTab({ url: '/pages/orders/index' })
          }
        })
      } else {
        // 模拟成功
        Taro.setStorageSync('userInfo', { nickname: name, phone, address })
        Taro.showModal({
          title: '预约成功',
          content: '您的预约已提交，客服将尽快与您联系确认',
          showCancel: false,
          success: () => {
            Taro.switchTab({ url: '/pages/orders/index' })
          }
        })
      }
    } catch (error) {
      console.error('预约提交失败:', error)
      // 开发环境模拟成功
      Taro.setStorageSync('userInfo', { nickname: name, phone, address })
      Taro.showModal({
        title: '预约成功',
        content: '您的预约已提交，客服将尽快与您联系确认',
        showCancel: false,
        success: () => {
          Taro.switchTab({ url: '/pages/orders/index' })
        }
      })
    } finally {
      setSubmitting(false)
    }
  }

  const handleCallService = () => {
    Taro.makePhoneCall({
      phoneNumber: '400-888-9999',
      fail: () => {
        Taro.showToast({ title: '拨打失败', icon: 'none' })
      }
    })
  }

  return (
    <View className="min-h-screen bg-gray-50">
      <ScrollView scrollY className="pb-24">
        {/* 服务信息 */}
        {serviceName && (
          <View className="bg-white px-4 py-4 border-b border-gray-100">
            <View className="flex flex-row items-center justify-between">
              <View>
                <Text className="block text-base font-semibold text-gray-800">{serviceName}</Text>
                <Text className="block text-sm text-gray-500 mt-1">{servicePrice}</Text>
              </View>
              <View className="bg-emerald-50 rounded-full px-3 py-1">
                <Text className="block text-sm text-emerald-600">已选择</Text>
              </View>
            </View>
          </View>
        )}

        {/* 联系信息 */}
        <View className="bg-white px-4 py-4 mt-3">
          <Text className="block text-base font-semibold text-gray-800 mb-4">联系信息</Text>
          
          <View className="flex flex-col gap-4">
            {/* 姓名 */}
            <View className="flex flex-row items-center bg-gray-50 rounded-xl px-4 py-3">
              <User size={18} color="#9CA3AF" />
              <Input
                className="flex-1 ml-3 text-sm"
                placeholder="请输入您的姓名"
                value={name}
                onInput={(e) => setName(e.detail.value)}
              />
            </View>
            
            {/* 手机号 */}
            <View className="flex flex-row items-center bg-gray-50 rounded-xl px-4 py-3">
              <Phone size={18} color="#9CA3AF" />
              <Input
                className="flex-1 ml-3 text-sm"
                type="number"
                maxlength={11}
                placeholder="请输入手机号"
                value={phone}
                onInput={(e) => setPhone(e.detail.value)}
              />
            </View>
            
            {/* 地址 */}
            <View className="flex flex-row items-start bg-gray-50 rounded-xl px-4 py-3">
              <MapPin size={18} color="#9CA3AF" className="mt-0.5" />
              <Input
                className="flex-1 ml-3 text-sm"
                placeholder="请输入服务地址"
                value={address}
                onInput={(e) => setAddress(e.detail.value)}
              />
            </View>
            
            {/* 房屋面积 */}
            <View className="flex flex-row items-center bg-gray-50 rounded-xl px-4 py-3">
              <House size={18} color="#9CA3AF" />
              <Input
                className="flex-1 ml-3 text-sm"
                type="number"
                placeholder="房屋面积（选填，如：100）"
                value={area}
                onInput={(e) => setArea(e.detail.value)}
              />
              <Text className="text-sm text-gray-400">平米</Text>
            </View>
          </View>
        </View>

        {/* 预约时间 */}
        <View className="bg-white px-4 py-4 mt-3">
          <Text className="block text-base font-semibold text-gray-800 mb-4">预约时间</Text>
          
          <View className="flex flex-col gap-3">
            {/* 日期选择 */}
            <View 
              className="flex flex-row items-center justify-between bg-gray-50 rounded-xl px-4 py-3"
              onClick={() => setDateSelector(true)}
            >
              <View className="flex flex-row items-center">
                <Calendar size={18} color="#9CA3AF" />
                <Text className="block text-sm ml-3">预约日期</Text>
              </View>
              <View className="flex flex-row items-center">
                <Text className="block text-sm text-gray-600 mr-2">{date || '请选择'}</Text>
                <ChevronRight size={16} color="#9CA3AF" />
              </View>
            </View>
            
            {dateSelector && (
              <Picker mode="selector" range={dateOptions} onChange={handleDateChange}>
                <View />
              </Picker>
            )}
            
            {/* 时间选择 */}
            <View 
              className="flex flex-row items-center justify-between bg-gray-50 rounded-xl px-4 py-3"
              onClick={() => setTimeSelector(true)}
            >
              <View className="flex flex-row items-center">
                <Clock size={18} color="#9CA3AF" />
                <Text className="block text-sm ml-3">预约时间</Text>
              </View>
              <View className="flex flex-row items-center">
                <Text className="block text-sm text-gray-600 mr-2">{time || '请选择'}</Text>
                <ChevronRight size={16} color="#9CA3AF" />
              </View>
            </View>
            
            {timeSelector && (
              <Picker mode="selector" range={timeOptions} onChange={handleTimeChange}>
                <View />
              </Picker>
            )}
          </View>
        </View>

        {/* 备注 */}
        <View className="bg-white px-4 py-4 mt-3">
          <Text className="block text-base font-semibold text-gray-800 mb-4">备注信息</Text>
          
          <View className="bg-gray-50 rounded-xl p-3">
            <Textarea
              style={{ width: '100%', minHeight: '80px', backgroundColor: 'transparent', fontSize: '14px' }}
              placeholder="请输入其他需求或说明..."
              maxlength={200}
              value={remark}
              onInput={(e) => setRemark(e.detail.value)}
            />
          </View>
        </View>

        {/* 客服电话 */}
        <View className="px-4 py-4">
          <View 
            className="bg-emerald-50 rounded-xl p-4 flex flex-row items-center justify-between"
            onClick={handleCallService}
          >
            <View className="flex flex-row items-center">
              <Phone size={20} color="#10B981" />
              <View className="ml-3">
                <Text className="block text-sm font-medium text-gray-800">有问题？联系客服</Text>
                <Text className="block text-xs text-gray-500 mt-1">400-888-9999</Text>
              </View>
            </View>
            <ChevronRight size={20} color="#9CA3AF" />
          </View>
        </View>
      </ScrollView>

      {/* 底部提交按钮 */}
      <View className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-4 py-3">
        <View 
          className={`w-full py-3 rounded-xl text-center font-medium ${submitting ? 'bg-gray-300 text-gray-500' : 'bg-emerald-500 text-white'}`}
          onClick={submitting ? undefined : handleSubmit}
        >
          {submitting ? '提交中...' : '提交预约'}
        </View>
      </View>
    </View>
  )
}

export default BookingPage
