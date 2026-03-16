import Taro, { useLoad, useRouter } from '@tarojs/taro'
import { View, Text, ScrollView, Input, Textarea, Picker } from '@tarojs/components'
import { useState } from 'react'
import { Network } from '@/network'
import { Calendar, MapPin, MessageSquare, Check, Sparkles, ChevronRight, Star } from 'lucide-react-taro'
import './index.css'

// 服务类型定义
interface ServiceType {
  id: string
  name: string
  description: string
  icon: string
  price: string
  category: 'cleaning' | 'renovation'
}

const BookingPage = () => {
  const router = useRouter()
  const [serviceName, setServiceName] = useState('')
  const [serviceId, setServiceId] = useState('')
  const [showServiceList, setShowServiceList] = useState(false)
  const [services, setServices] = useState<ServiceType[]>([])
  const [loading, setLoading] = useState(false)
  
  // 第一步：联系信息
  const [address, setAddress] = useState('')
  const [phone, setPhone] = useState('')
  const [verifyCode, setVerifyCode] = useState('')
  const [sendingCode, setSendingCode] = useState(false)
  const [countdown, setCountdown] = useState(0)
  
  // 登录状态
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [loggingIn, setLoggingIn] = useState(false)
  
  // 第二步：预约信息
  const [appointmentDate, setAppointmentDate] = useState('')
  const [appointmentTime, setAppointmentTime] = useState('')
  const [remark, setRemark] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [dateSelected, setDateSelected] = useState(false)

  useLoad(() => {
    const { name, id } = router.params
    
    // 如果没有服务参数，加载服务列表
    if (!name) {
      setShowServiceList(true)
      loadServices()
    } else {
      setServiceName(decodeURIComponent(name))
      if (id) setServiceId(id)
    }
    
    // 检查是否已登录
    const token = Taro.getStorageSync('token')
    const savedPhone = Taro.getStorageSync('userPhone')
    if (token && savedPhone) {
      setIsLoggedIn(true)
      setPhone(savedPhone)
      // 设置默认日期为今天
      const today = new Date()
      const year = today.getFullYear()
      const month = String(today.getMonth() + 1).padStart(2, '0')
      const day = String(today.getDate()).padStart(2, '0')
      setAppointmentDate(`${year}-${month}-${day}`)
      setDateSelected(true)
    }
  })

  // 加载服务列表
  const loadServices = async () => {
    try {
      setLoading(true)
      const res = await Network.request({
        url: '/api/services',
        method: 'GET'
      })
      
      if (res.statusCode === 200 && res.data) {
        const servicesData = res.data?.services || res.data || []
        setServices(servicesData)
      } else {
        getMockServices()
      }
    } catch (error) {
      console.error('Failed to load services:', error)
      getMockServices()
    } finally {
      setLoading(false)
    }
  }

  // 使用模拟服务数据
  const getMockServices = () => {
    const mockServices: ServiceType[] = [
      {
        id: '1',
        name: '日常保洁',
        description: '家庭日常清洁，包括厨房、卫生间、客厅等',
        icon: 'Sparkles',
        price: '88元/次',
        category: 'cleaning'
      },
      {
        id: '2',
        name: '深度保洁',
        description: '全面深度清洁，彻底清除污渍和死角',
        icon: 'Sparkles',
        price: '258元/次',
        category: 'cleaning'
      },
      {
        id: '3',
        name: '厨房改造',
        description: '橱柜更换、水电改造、瓷砖翻新',
        icon: 'Sparkles',
        price: '起价5000元',
        category: 'renovation'
      },
      {
        id: '4',
        name: '卫生间改造',
        description: '卫浴设施更换、防水处理、空间优化',
        icon: 'Sparkles',
        price: '起价8000元',
        category: 'renovation'
      }
    ]
    setServices(mockServices)
  }

  // 选择服务
  const handleSelectService = (service: ServiceType) => {
    setServiceName(service.name)
    setServiceId(service.id)
    setShowServiceList(false)
  }

  // 时间选项
  const timeOptions = [
    { value: '09:00-11:00', label: '上午 09:00-11:00' },
    { value: '11:00-13:00', label: '中午 11:00-13:00' },
    { value: '13:00-15:00', label: '下午 13:00-15:00' },
    { value: '15:00-17:00', label: '下午 15:00-17:00' },
    { value: '17:00-19:00', label: '傍晚 17:00-19:00' },
    { value: '19:00-21:00', label: '晚上 19:00-21:00' }
  ]

  // 发送验证码
  const handleSendCode = async () => {
    if (!phone || phone.length !== 11) {
      Taro.showToast({ title: '请输入正确的手机号', icon: 'none' })
      return
    }

    try {
      setSendingCode(true)
      const res = await Network.request({
        url: '/api/auth/send-code',
        method: 'POST',
        data: { phone }
      })
      
      console.log('📤 发送验证码响应:', res)
      
      if (res.statusCode === 200) {
        Taro.showToast({ title: '验证码已发送', icon: 'success' })
        // 开始倒计时
        setCountdown(60)
        const timer = setInterval(() => {
          setCountdown(prev => {
            if (prev <= 1) {
              clearInterval(timer)
              return 0
            }
            return prev - 1
          })
        }, 1000)
      } else {
        Taro.showToast({ title: '发送失败，请重试', icon: 'none' })
      }
    } catch (error) {
      console.error('Failed to send code:', error)
      // 开发环境模拟发送成功
      Taro.showToast({ title: '验证码已发送（模拟）', icon: 'success' })
      setCountdown(60)
      const timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(timer)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    } finally {
      setSendingCode(false)
    }
  }

  // 验证码登录
  const handleLogin = async () => {
    if (!address) {
      Taro.showToast({ title: '请输入服务地址', icon: 'none' })
      return
    }
    if (!phone || phone.length !== 11) {
      Taro.showToast({ title: '请输入正确的手机号', icon: 'none' })
      return
    }
    if (!verifyCode || verifyCode.length !== 6) {
      Taro.showToast({ title: '请输入6位验证码', icon: 'none' })
      return
    }

    try {
      setLoggingIn(true)
      const res = await Network.request({
        url: '/api/auth/login',
        method: 'POST',
        data: { phone, code: verifyCode }
      })
      
      console.log('🔐 登录响应:', res)
      
      if (res.statusCode === 200 && res.data) {
        // 保存登录信息
        Taro.setStorageSync('token', res.data.token || 'demo-token')
        Taro.setStorageSync('userPhone', phone)
        
        setIsLoggedIn(true)
        
        // 设置默认日期
        const today = new Date()
        const year = today.getFullYear()
        const month = String(today.getMonth() + 1).padStart(2, '0')
        const day = String(today.getDate()).padStart(2, '0')
        setAppointmentDate(`${year}-${month}-${day}`)
        setDateSelected(true)
        
        Taro.showToast({ title: '登录成功', icon: 'success' })
      } else {
        Taro.showToast({ title: '验证码错误', icon: 'none' })
      }
    } catch (error) {
      console.error('Failed to login:', error)
      // 开发环境模拟登录成功
      Taro.setStorageSync('token', 'demo-token')
      Taro.setStorageSync('userPhone', phone)
      setIsLoggedIn(true)
      
      const today = new Date()
      const year = today.getFullYear()
      const month = String(today.getMonth() + 1).padStart(2, '0')
      const day = String(today.getDate()).padStart(2, '0')
      setAppointmentDate(`${year}-${month}-${day}`)
      setDateSelected(true)
      
      Taro.showToast({ title: '登录成功（模拟）', icon: 'success' })
    } finally {
      setLoggingIn(false)
    }
  }

  // 提交预约
  const handleSubmit = async () => {
    if (!appointmentDate) {
      Taro.showToast({ title: '请选择预约日期', icon: 'none' })
      return
    }
    if (!appointmentTime) {
      Taro.showToast({ title: '请选择预约时间', icon: 'none' })
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
      
      console.log('📝 提交预约响应:', res)
      
      if (res.statusCode === 200 || res.statusCode === 201) {
        Taro.showToast({ title: '预约成功！', icon: 'success' })
        setTimeout(() => {
          Taro.switchTab({ url: '/pages/orders/index' })
        }, 1500)
      } else {
        Taro.showToast({ title: '预约失败，请重试', icon: 'none' })
      }
    } catch (error) {
      console.error('Failed to create order:', error)
      Taro.showToast({ title: '预约失败，请重试', icon: 'none' })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <View className="flex flex-col h-full bg-gray-50">
      {/* 服务选择界面 */}
      {showServiceList ? (
        <ScrollView className="flex-1" scrollY>
          <View className="bg-gradient-to-br from-emerald-600 via-emerald-500 to-teal-500 p-6 pt-8">
            <View className="absolute top-[-40px] right-[-40px] w-32 h-32 bg-white/10 rounded-full blur-3xl" />
            <Text className="block text-2xl font-bold text-white leading-tight">选择服务</Text>
            <Text className="block text-sm text-emerald-100 mt-2">请选择您需要的服务类型</Text>
          </View>

          <View className="px-4 py-6">
            {loading ? (
              <View className="flex flex-col items-center justify-center py-12">
                <Text className="block text-sm text-gray-500">加载中...</Text>
              </View>
            ) : (
              <View className="space-y-3">
                {services.map((service) => (
                  <View
                    key={service.id}
                    className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm flex flex-row items-center"
                    onClick={() => handleSelectService(service)}
                  >
                    <View className="w-16 h-16 bg-emerald-500 rounded-2xl flex items-center justify-center mr-4 shadow-sm">
                      <Sparkles size={32} color="#fff" />
                    </View>
                    <View className="flex-1">
                      <Text className="block text-base font-bold text-gray-800 mb-1">
                        {service.name}
                      </Text>
                      <Text className="block text-sm text-gray-500 mb-2 line-clamp-1">
                        {service.description}
                      </Text>
                      <View className="flex flex-row items-center">
                        <Text className="block text-sm font-bold text-emerald-600">
                          {service.price}
                        </Text>
                        <View className="flex flex-row items-center ml-3">
                          <Star size={12} color="#F59E0B" />
                          <Text className="block text-xs text-gray-500 ml-1">4.9</Text>
                        </View>
                      </View>
                    </View>
                    <ChevronRight size={20} color="#D1D5DB" />
                  </View>
                ))}
              </View>
            )}
          </View>
        </ScrollView>
      ) : (
        <>
          <ScrollView className="flex-1" scrollY>
            {/* 服务信息卡片 */}
            <View className="relative overflow-hidden bg-gradient-to-br from-emerald-600 via-emerald-500 to-teal-500 p-6 pt-8">
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
              {/* 第一步：联系信息 */}
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
                    disabled={isLoggedIn}
                  />
                </View>
              </View>

              {/* 验证码输入 - 仅未登录时显示 */}
              {!isLoggedIn && (
                <View>
                  <Text className="block text-sm text-gray-500 mb-2.5 font-medium">验证码</Text>
                  <View className="flex flex-row gap-3">
                    <View
                      className="flex-1 bg-gray-50 rounded-2xl px-4 py-3.5 border border-gray-100"
                      style={{
                        boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.03)'
                      }}
                    >
                      <Input
                        className="w-full bg-transparent text-base"
                        placeholder="请输入6位验证码"
                        type="number"
                        value={verifyCode}
                        onInput={(e: any) => setVerifyCode(e.detail.value)}
                        maxlength={6}
                      />
                    </View>
                    <View
                      className={`px-4 py-3.5 rounded-2xl border border-gray-100 ${
                        countdown > 0 || sendingCode ? 'bg-gray-100' : 'bg-emerald-500'
                      }`}
                      onClick={countdown === 0 && !sendingCode ? handleSendCode : undefined}
                    >
                      <Text
                        className={`block text-sm font-medium ${
                          countdown > 0 || sendingCode ? 'text-gray-400' : 'text-white'
                        }`}
                      >
                        {sendingCode ? '发送中...' : countdown > 0 ? `${countdown}s` : '获取验证码'}
                      </Text>
                    </View>
                  </View>
                </View>
              )}
            </View>
          </View>

          {/* 第二步：预约时间 - 仅登录后显示 */}
          {isLoggedIn && (
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
          )}

          {/* 第三步：备注 - 仅登录后显示 */}
          {isLoggedIn && (
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
          )}
        </View>

        {/* 底部留白 */}
        <View className="h-32" />
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
          padding: '16px 20px',
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(10px)',
          borderTop: '1px solid rgba(229, 231, 235, 0.5)',
          zIndex: 100,
          paddingBottom: 'calc(16px + env(safe-area-inset-bottom))'
        }}
      >
        <View className="flex-1">
          {!isLoggedIn ? (
            <button
              className="w-full bg-gradient-to-r from-emerald-600 to-emerald-500 text-white rounded-2xl py-4 text-base font-bold shadow-lg transition-all active:scale-[0.98]"
              style={{
                boxShadow: '0 4px 12px rgba(16, 185, 129, 0.35), 0 2px 4px rgba(16, 185, 129, 0.15)'
              }}
              onClick={handleLogin}
              disabled={loggingIn}
            >
              {loggingIn ? '登录中...' : '验证并继续'}
            </button>
          ) : (
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
          )}
        </View>
      </View>
        </>
      )}
    </View>
  )
}

export default BookingPage
