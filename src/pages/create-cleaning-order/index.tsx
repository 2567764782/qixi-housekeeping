import Taro from '@tarojs/taro'
import { View, Text, ScrollView, Input, Picker, Textarea, Button } from '@tarojs/components'
import { ArrowLeft, MapPin, Clock, DollarSign, FileText, Sparkles } from 'lucide-react-taro'
import { useState } from 'react'
import { Network } from '@/network'
import './index.css'

const CreateCleaningOrderPage = () => {
  const [serviceType, setServiceType] = useState('cleaning')
  const [customerName, setCustomerName] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')
  const [serviceDetail, setServiceDetail] = useState('')
  const [address, setAddress] = useState('')
  const [scheduledDate, setScheduledDate] = useState('')
  const [scheduledTime, setScheduledTime] = useState('09:00')
  const [estimatedDuration, setEstimatedDuration] = useState('120')
  const [budgetMin, setBudgetMin] = useState('')
  const [budgetMax, setBudgetMax] = useState('')
  const [specialRequirements, setSpecialRequirements] = useState('')
  const [loading, setLoading] = useState(false)

  const serviceTypes = [
    { value: 'cleaning', label: '日常清洁', icon: <Sparkles size={24} color="#10B981" /> },
    { value: 'car_wash', label: '上门洗车', icon: <DollarSign size={24} color="#10B981" /> },
  ]

  const durations = [
    { label: '60分钟', value: '60' },
    { label: '90分钟', value: '90' },
    { label: '120分钟', value: '120' },
    { label: '180分钟', value: '180' },
    { label: '240分钟', value: '240' },
  ]

  const timeSlots = [
    '09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'
  ]

  const handleSubmit = async () => {
    // 表单验证
    if (!customerName.trim()) {
      Taro.showToast({ title: '请输入您的姓名', icon: 'none' })
      return
    }

    if (!customerPhone.trim()) {
      Taro.showToast({ title: '请输入手机号码', icon: 'none' })
      return
    }

    if (!/^1[3-9]\d{9}$/.test(customerPhone)) {
      Taro.showToast({ title: '请输入正确的手机号码', icon: 'none' })
      return
    }

    if (!serviceDetail.trim()) {
      Taro.showToast({ title: '请输入服务详情', icon: 'none' })
      return
    }

    if (!address.trim()) {
      Taro.showToast({ title: '请输入服务地址', icon: 'none' })
      return
    }

    if (!scheduledDate) {
      Taro.showToast({ title: '请选择预约日期', icon: 'none' })
      return
    }

    try {
      setLoading(true)

      const scheduledTimeISO = `${scheduledDate}T${scheduledTime}:00`

      await Network.request({
        url: '/api/cleaning-orders',
        method: 'POST',
        data: {
          customerId: 1, // 模拟用户ID，实际应从登录状态获取
          customerName,
          customerPhone,
          serviceType,
          serviceDetail,
          address,
          scheduledTime: scheduledTimeISO,
          estimatedDuration: parseInt(estimatedDuration),
          budgetMin: budgetMin ? parseFloat(budgetMin) : null,
          budgetMax: budgetMax ? parseFloat(budgetMax) : null,
          specialRequirements: specialRequirements || null
        }
      })

      Taro.showLoading({ title: '提交中...' })

      setTimeout(() => {
        Taro.hideLoading()
        Taro.showModal({
          title: '提交成功',
          content: '您的订单已提交，我们将尽快人工审核，审核通过后会为您匹配合适的保洁员。',
          showCancel: false,
          success: () => {
            Taro.navigateBack()
          }
        })
      }, 1000)

    } catch (error) {
      console.error('提交订单失败:', error)
      Taro.showToast({
        title: '提交失败，请重试',
        icon: 'none'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDateChange = (e) => {
    setScheduledDate(e.detail.value)
  }

  const handleDurationChange = (e) => {
    setEstimatedDuration(e.detail.value)
  }

  const handleTimeChange = (e) => {
    setScheduledTime(e.detail.value)
  }

  return (
    <View className="create-order-page">
      {/* 导航栏 */}
      <View className="navbar">
        <View
          className="nav-back"
          onClick={() => Taro.navigateBack()}
        >
          <ArrowLeft size={24} color="#333" />
        </View>
        <Text className="nav-title">发布保洁需求</Text>
        <View className="nav-placeholder" />
      </View>

      <ScrollView className="content" scrollY>
        {/* 服务类型选择 */}
        <View className="form-section">
          <Text className="section-title">服务类型</Text>
          <View className="service-types">
            {serviceTypes.map((type) => (
              <View
                key={type.value}
                className={`service-type-item ${serviceType === type.value ? 'active' : ''}`}
                onClick={() => setServiceType(type.value)}
              >
                {type.icon}
                <Text className="service-type-label">{type.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* 联系信息 */}
        <View className="form-section">
          <Text className="section-title">联系信息</Text>

          <View className="form-item">
            <Text className="form-label">姓名 *</Text>
            <Input
              className="form-input"
              placeholder="请输入您的姓名"
              value={customerName}
              onInput={(e) => setCustomerName(e.detail.value)}
            />
          </View>

          <View className="form-item">
            <Text className="form-label">手机号码 *</Text>
            <Input
              className="form-input"
              type="number"
              placeholder="请输入手机号码"
              value={customerPhone}
              onInput={(e) => setCustomerPhone(e.detail.value)}
            />
          </View>
        </View>

        {/* 服务信息 */}
        <View className="form-section">
          <Text className="section-title">服务信息</Text>

          <View className="form-item">
            <Text className="form-label">服务详情 *</Text>
            <Textarea
              className="form-textarea"
              placeholder="请详细描述您的需求，例如：需要打扫3室2厅，重点清洁厨房和卫生间..."
              value={serviceDetail}
              onInput={(e) => setServiceDetail(e.detail.value)}
              maxlength={500}
            />
          </View>

          <View className="form-item">
            <Text className="form-label">服务地址 *</Text>
            <View className="input-wrapper">
              <MapPin size={18} color="#9CA3AF" />
              <Input
                className="form-input"
                placeholder="请输入详细地址"
                value={address}
                onInput={(e) => setAddress(e.detail.value)}
              />
            </View>
          </View>

          <View className="form-item">
            <Text className="form-label">预约日期 *</Text>
            <Picker
              mode="date"
              value={scheduledDate}
              start={new Date().toISOString().split('T')[0]}
              onChange={handleDateChange}
            >
              <View className="picker-wrapper">
                <Clock size={18} color="#9CA3AF" />
                <Text className={scheduledDate ? 'picker-text' : 'picker-placeholder'}>
                  {scheduledDate || '请选择预约日期'}
                </Text>
              </View>
            </Picker>
          </View>

          <View className="form-item">
            <Text className="form-label">预约时间 *</Text>
            <Picker
              mode="selector"
              range={timeSlots}
              value={timeSlots.indexOf(scheduledTime)}
              onChange={handleTimeChange}
            >
              <View className="picker-wrapper">
                <Clock size={18} color="#9CA3AF" />
                <Text className="picker-text">{scheduledTime}</Text>
              </View>
            </Picker>
          </View>

          <View className="form-item">
            <Text className="form-label">预计时长</Text>
            <Picker
              mode="selector"
              range={durations}
              rangeKey="label"
              value={durations.findIndex(d => d.value === estimatedDuration)}
              onChange={handleDurationChange}
            >
              <View className="picker-wrapper">
                <Clock size={18} color="#9CA3AF" />
                <Text className="picker-text">
                  {durations.find(d => d.value === estimatedDuration)?.label}
                </Text>
              </View>
            </Picker>
          </View>
        </View>

        {/* 预算范围 */}
        <View className="form-section">
          <Text className="section-title">预算范围（选填）</Text>

          <View className="budget-row">
            <View className="budget-item">
              <Text className="budget-label">最低预算</Text>
              <View className="budget-input-wrapper">
                <DollarSign size={18} color="#9CA3AF" />
                <Input
                  className="budget-input"
                  type="digit"
                  placeholder="最低"
                  value={budgetMin}
                  onInput={(e) => setBudgetMin(e.detail.value)}
                />
              </View>
            </View>

            <Text className="budget-separator">-</Text>

            <View className="budget-item">
              <Text className="budget-label">最高预算</Text>
              <View className="budget-input-wrapper">
                <DollarSign size={18} color="#9CA3AF" />
                <Input
                  className="budget-input"
                  type="digit"
                  placeholder="最高"
                  value={budgetMax}
                  onInput={(e) => setBudgetMax(e.detail.value)}
                />
              </View>
            </View>
          </View>
        </View>

        {/* 特殊要求 */}
        <View className="form-section">
          <Text className="section-title">特殊要求（选填）</Text>

          <View className="form-item">
            <Textarea
              className="form-textarea"
              placeholder="如有特殊要求，请在此说明（例如：需要自带工具、宠物友好等）"
              value={specialRequirements}
              onInput={(e) => setSpecialRequirements(e.detail.value)}
              maxlength={300}
            />
          </View>
        </View>

        {/* 温馨提示 */}
        <View className="tips-section">
          <View className="tips-header">
            <FileText size={18} color="#F59E0B" />
            <Text className="tips-title">温馨提示</Text>
          </View>
          <View className="tips-content">
            <Text className="tips-text">• 订单提交后，我们会尽快进行人工审核</Text>
            <Text className="tips-text">• 审核通过后，会为您匹配合适的保洁员</Text>
            <Text className="tips-text">• 保洁员接单后，会电话联系您确认</Text>
            <Text className="tips-text">• 请保持电话畅通，以便及时沟通</Text>
          </View>
        </View>
      </ScrollView>

      {/* 底部提交按钮 */}
      <View className="submit-bar">
        <Button
          className="submit-button"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? '提交中...' : '提交订单'}
        </Button>
      </View>
    </View>
  )
}

export default CreateCleaningOrderPage
