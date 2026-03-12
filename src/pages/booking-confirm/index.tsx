import Taro, { useRouter } from '@tarojs/taro'
import { View, Text, ScrollView, Input } from '@tarojs/components'
import { ArrowLeft, Calendar, Clock, User, Check, Info, Building2, Stethoscope, MapPin } from 'lucide-react-taro'
import { useState } from 'react'
import './index.css'

// 时间段类型
interface TimeSlot {
  id: string
  time: string
  status: 'available' | 'full' | 'selected'
}

const BookingConfirmPage = () => {
  const router = useRouter()
  const hospitalId = router.params.hospitalId || '1'
  const department = router.params.department || '内科'

  const [selectedDate, setSelectedDate] = useState(0)
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null)
  const [patientName, setPatientName] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [idCard, setIdCard] = useState('')

  // 模拟医院数据
  const hospitalsData: Record<string, { name: string; address: string }> = {
    '1': { name: '北京协和医院', address: '东城区帅府园1号' },
    '2': { name: '北京大学第一医院', address: '西城区西什库大街8号' }
  }

  const hospital = hospitalsData[hospitalId] || hospitalsData['1']

  // 日期数据（未来7天）
  const dates = Array.from({ length: 7 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() + i)
    const weekDays = ['日', '一', '二', '三', '四', '五', '六']
    return {
      day: date.getDate(),
      week: weekDays[date.getDay()],
      fullDate: `${date.getMonth() + 1}月${date.getDate()}日`
    }
  })

  // 时间段数据
  const timeSlots: TimeSlot[] = [
    { id: '1', time: '08:00-09:00', status: 'full' },
    { id: '2', time: '09:00-10:00', status: 'available' },
    { id: '3', time: '10:00-11:00', status: 'available' },
    { id: '4', time: '11:00-12:00', status: 'available' },
    { id: '5', time: '14:00-15:00', status: 'available' },
    { id: '6', time: '15:00-16:00', status: 'full' },
    { id: '7', time: '16:00-17:00', status: 'available' }
  ]

  const handleBack = () => {
    Taro.navigateBack()
  }

  const handleDateSelect = (index: number) => {
    setSelectedDate(index)
    setSelectedTimeSlot(null) // 切换日期时重置时间段选择
  }

  const handleTimeSlotSelect = (slotId: string) => {
    const slot = timeSlots.find(s => s.id === slotId)
    if (slot && slot.status === 'available') {
      setSelectedTimeSlot(slotId)
    }
  }

  const handleSubmit = () => {
    // 表单验证
    if (!patientName.trim()) {
      Taro.showToast({
        title: '请输入患者姓名',
        icon: 'none'
      })
      return
    }

    if (!phoneNumber.trim()) {
      Taro.showToast({
        title: '请输入手机号码',
        icon: 'none'
      })
      return
    }

    if (!/^1[3-9]\d{9}$/.test(phoneNumber)) {
      Taro.showToast({
        title: '请输入正确的手机号码',
        icon: 'none'
      })
      return
    }

    if (!idCard.trim()) {
      Taro.showToast({
        title: '请输入身份证号',
        icon: 'none'
      })
      return
    }

    if (!selectedTimeSlot) {
      Taro.showToast({
        title: '请选择就诊时间',
        icon: 'none'
      })
      return
    }

    // 显示确认信息
    const selectedDateInfo = dates[selectedDate]
    const selectedSlot = timeSlots.find(s => s.id === selectedTimeSlot)

    Taro.showModal({
      title: '确认预约',
      content: `确认预约：\n医院：${hospital.name}\n科室：${department}\n日期：${selectedDateInfo.fullDate}\n时间：${selectedSlot?.time}\n患者：${patientName}\n电话：${phoneNumber}`,
      confirmText: '确认预约',
      success: (res) => {
        if (res.confirm) {
          // 这里可以调用后端API提交预约
          // 目前显示成功提示
          Taro.showLoading({
            title: '提交中...'
          })

          setTimeout(() => {
            Taro.hideLoading()
            Taro.showToast({
              title: '预约成功',
              icon: 'success',
              duration: 2000
            })

            // 跳转到订单页或返回
            setTimeout(() => {
              Taro.redirectTo({
                url: '/pages/orders/index'
              })
            }, 2000)
          }, 1500)
        }
      }
    })
  }

  return (
    <View className="booking-confirm-page">
      {/* 导航栏 */}
      <View className="navbar">
        <View
          className="nav-back"
          onClick={handleBack}
        >
          <ArrowLeft size={24} color="#333" />
        </View>
        <Text className="nav-title">预约挂号</Text>
        <View className="nav-placeholder" />
      </View>

      <ScrollView className="content" scrollY>
        {/* 医院和科室信息 */}
        <View className="hospital-info-card">
          <View className="info-row">
            <Building2 size={20} color="#10B981" />
            <View className="info-content">
              <Text className="info-label">医院</Text>
              <Text className="info-value">{hospital.name}</Text>
            </View>
          </View>

          <View className="info-row">
            <Stethoscope size={20} color="#10B981" />
            <View className="info-content">
              <Text className="info-label">科室</Text>
              <Text className="info-value">{department}</Text>
            </View>
          </View>

          <View className="info-row">
            <MapPin size={20} color="#10B981" />
            <View className="info-content">
              <Text className="info-label">地址</Text>
              <Text className="info-value">{hospital.address}</Text>
            </View>
          </View>
        </View>

        {/* 选择日期 */}
        <View className="section-card">
          <View className="section-header">
            <Calendar size={20} color="#10B981" />
            <Text className="section-title">选择日期</Text>
          </View>

          <ScrollView className="date-scroll" scrollX>
            <View className="date-list">
              {dates.map((date, index) => (
                <View
                  key={index}
                  className={`date-item ${selectedDate === index ? 'active' : ''}`}
                  onClick={() => handleDateSelect(index)}
                >
                  <Text className="date-week">{date.week === '一' ? '周一' : date.week === '二' ? '周二' : date.week === '三' ? '周三' : date.week === '四' ? '周四' : date.week === '五' ? '周五' : date.week === '六' ? '周六' : '周日'}</Text>
                  <Text className={`date-day ${selectedDate === index ? 'active' : ''}`}>
                    {date.day}
                  </Text>
                </View>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* 选择时间段 */}
        <View className="section-card">
          <View className="section-header">
            <Clock size={20} color="#10B981" />
            <Text className="section-title">选择时间</Text>
          </View>

          <View className="time-slots-grid">
            {timeSlots.map((slot) => (
              <View
                key={slot.id}
                className={`time-slot ${slot.status} ${selectedTimeSlot === slot.id ? 'selected' : ''}`}
                onClick={() => handleTimeSlotSelect(slot.id)}
              >
                {slot.status === 'full' ? (
                  <View className="slot-full">
                    <Info size={16} color="#9CA3AF" />
                    <Text className="slot-time">{slot.time}</Text>
                    <Text className="slot-status">已约满</Text>
                  </View>
                ) : (
                  <View className="slot-available">
                    <Text className="slot-time">{slot.time}</Text>
                    {selectedTimeSlot === slot.id && (
                      <Check size={18} color="#10B981" />
                    )}
                  </View>
                )}
              </View>
            ))}
          </View>
        </View>

        {/* 患者信息 */}
        <View className="section-card">
          <View className="section-header">
            <User size={20} color="#10B981" />
            <Text className="section-title">患者信息</Text>
          </View>

          <View className="form-item">
            <Text className="form-label">患者姓名</Text>
            <Input
              className="form-input"
              placeholder="请输入患者姓名"
              value={patientName}
              onInput={(e) => setPatientName(e.detail.value)}
            />
          </View>

          <View className="form-item">
            <Text className="form-label">手机号码</Text>
            <Input
              className="form-input"
              type="number"
              placeholder="请输入手机号码"
              value={phoneNumber}
              onInput={(e) => setPhoneNumber(e.detail.value)}
            />
          </View>

          <View className="form-item">
            <Text className="form-label">身份证号</Text>
            <Input
              className="form-input"
              placeholder="请输入身份证号"
              value={idCard}
              onInput={(e) => setIdCard(e.detail.value)}
            />
          </View>
        </View>

        {/* 温馨提示 */}
        <View className="tips-card">
          <View className="tips-header">
            <Info size={18} color="#F59E0B" />
            <Text className="tips-title">温馨提示</Text>
          </View>
          <View className="tips-content">
            <Text className="tips-text">• 请确保手机号码畅通，接收预约成功短信</Text>
            <Text className="tips-text">• 就诊时请携带身份证和医保卡</Text>
            <Text className="tips-text">• 如需取消预约，请提前24小时联系医院</Text>
          </View>
        </View>
      </ScrollView>

      {/* 底部提交按钮 */}
      <View className="submit-bar">
        <View className="submit-button" onClick={handleSubmit}>
          <Text className="submit-text">确认预约</Text>
        </View>
      </View>
    </View>
  )
}

export default BookingConfirmPage
