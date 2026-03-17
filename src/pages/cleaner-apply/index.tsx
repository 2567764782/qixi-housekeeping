import Taro from '@tarojs/taro'
import { View, Text, Input, Textarea, ScrollView, Button } from '@tarojs/components'
import { useState } from 'react'
import { Network } from '@/network'
import { ArrowLeft, Check, User, Phone, MapPin, FileText } from 'lucide-react-taro'
import './index.css'

interface ServiceType {
  id: string
  name: string
  selected: boolean
}

const CleanerApplyPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    gender: 'female',
    age: '',
    idCard: '',
    address: '',
    introduction: '',
    experienceYears: ''
  })

  const [serviceTypes, setServiceTypes] = useState<ServiceType[]>([
    { id: 'daily', name: '日常保洁', selected: false },
    { id: 'deep', name: '深度保洁', selected: false },
    { id: 'newhouse', name: '新居开荒', selected: false },
    { id: 'appliance', name: '家电清洗', selected: false },
    { id: 'organize', name: '收纳整理', selected: false }
  ])

  const [loading, setLoading] = useState(false)

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const toggleServiceType = (id: string) => {
    setServiceTypes(prev =>
      prev.map(item =>
        item.id === id ? { ...item, selected: !item.selected } : item
      )
    )
  }

  const handleSubmit = async () => {
    // 验证必填字段
    if (!formData.name.trim()) {
      Taro.showToast({ title: '请输入姓名', icon: 'none' })
      return
    }
    if (!formData.phone.trim()) {
      Taro.showToast({ title: '请输入手机号', icon: 'none' })
      return
    }
    if (!/^1[3-9]\d{9}$/.test(formData.phone)) {
      Taro.showToast({ title: '手机号格式不正确', icon: 'none' })
      return
    }
    
    const selectedServices = serviceTypes.filter(s => s.selected)
    if (selectedServices.length === 0) {
      Taro.showToast({ title: '请至少选择一项服务类型', icon: 'none' })
      return
    }

    setLoading(true)
    try {
      const res = await Network.request({
        url: '/api/cleaner-platform/apply',
        method: 'POST',
        data: {
          name: formData.name,
          phone: formData.phone,
          gender: formData.gender,
          age: formData.age ? parseInt(formData.age, 10) : undefined,
          idCard: formData.idCard,
          address: formData.address,
          introduction: formData.introduction,
          experienceYears: formData.experienceYears ? parseInt(formData.experienceYears, 10) : 0,
          serviceTypes: selectedServices.map(s => s.name)
        }
      })

      if (res.statusCode === 200) {
        Taro.showToast({ title: '申请已提交', icon: 'success' })
        setTimeout(() => {
          Taro.navigateBack()
        }, 1500)
      } else {
        Taro.showToast({ title: res.data?.msg || '提交失败', icon: 'none' })
      }
    } catch (error) {
      console.error('提交申请失败:', error)
      Taro.showToast({ title: '提交失败，请重试', icon: 'none' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <View className="min-h-screen" style={{ backgroundColor: '#f5f5f5' }}>
      {/* 头部 */}
      <View className="bg-white px-4 py-3 flex flex-row items-center" style={{ borderBottom: '1px solid #EDEDED' }}>
        <View onClick={() => Taro.navigateBack()}>
          <ArrowLeft size={24} color="#2E2E30" />
        </View>
        <Text className="flex-1 text-center text-lg font-bold" style={{ color: '#2E2E30' }}>
          阿姨入驻申请
        </Text>
        <View className="w-6" />
      </View>

      <ScrollView scrollY className="px-4 py-4" style={{ height: 'calc(100vh - 60px)' }}>
        {/* 基本信息 */}
        <View className="bg-white rounded-2xl p-4 mb-4" style={{ border: '1px solid #EDEDED' }}>
          <Text className="block text-base font-semibold mb-4" style={{ color: '#2E2E30' }}>基本信息</Text>
          
          {/* 姓名 */}
          <View className="mb-4">
            <Text className="block text-sm mb-2" style={{ color: '#B3B3B3' }}>姓名 *</Text>
            <View className="flex flex-row items-center rounded-xl px-4 py-3" style={{ backgroundColor: '#f5f5f5' }}>
              <User size={18} color="#B3B3B3" />
              <Input
                className="flex-1 ml-2 text-sm"
                style={{ color: '#2E2E30' }}
                placeholder="请输入真实姓名"
                value={formData.name}
                onInput={(e) => handleInputChange('name', e.detail.value)}
              />
            </View>
          </View>

          {/* 手机号 */}
          <View className="mb-4">
            <Text className="block text-sm mb-2" style={{ color: '#B3B3B3' }}>手机号 *</Text>
            <View className="flex flex-row items-center rounded-xl px-4 py-3" style={{ backgroundColor: '#f5f5f5' }}>
              <Phone size={18} color="#B3B3B3" />
              <Input
                className="flex-1 ml-2 text-sm"
                style={{ color: '#2E2E30' }}
                type="number"
                placeholder="请输入手机号"
                maxlength={11}
                value={formData.phone}
                onInput={(e) => handleInputChange('phone', e.detail.value)}
              />
            </View>
          </View>

          {/* 性别 */}
          <View className="mb-4">
            <Text className="block text-sm mb-2" style={{ color: '#B3B3B3' }}>性别</Text>
            <View className="flex flex-row gap-3">
              {[
                { key: 'female', label: '女' },
                { key: 'male', label: '男' }
              ].map(item => (
                <View
                  key={item.key}
                  className="flex-1 flex flex-row items-center justify-center rounded-xl py-3"
                  style={{
                    backgroundColor: formData.gender === item.key ? '#FFF7F7' : '#f5f5f5',
                    border: formData.gender === item.key ? '1px solid #F85659' : '1px solid transparent'
                  }}
                  onClick={() => handleInputChange('gender', item.key)}
                >
                  <Text style={{ color: formData.gender === item.key ? '#F85659' : '#2E2E30' }}>
                    {item.label}
                  </Text>
                  {formData.gender === item.key && (
                    <Check size={16} color="#F85659" className="ml-1" />
                  )}
                </View>
              ))}
            </View>
          </View>

          {/* 年龄 */}
          <View className="mb-4">
            <Text className="block text-sm mb-2" style={{ color: '#B3B3B3' }}>年龄</Text>
            <View className="flex flex-row items-center rounded-xl px-4 py-3" style={{ backgroundColor: '#f5f5f5' }}>
              <Input
                className="flex-1 text-sm"
                style={{ color: '#2E2E30' }}
                type="number"
                placeholder="请输入年龄"
                value={formData.age}
                onInput={(e) => handleInputChange('age', e.detail.value)}
              />
            </View>
          </View>

          {/* 身份证 */}
          <View className="mb-4">
            <Text className="block text-sm mb-2" style={{ color: '#B3B3B3' }}>身份证号</Text>
            <View className="flex flex-row items-center rounded-xl px-4 py-3" style={{ backgroundColor: '#f5f5f5' }}>
              <FileText size={18} color="#B3B3B3" />
              <Input
                className="flex-1 ml-2 text-sm"
                style={{ color: '#2E2E30' }}
                placeholder="请输入身份证号"
                maxlength={18}
                value={formData.idCard}
                onInput={(e) => handleInputChange('idCard', e.detail.value)}
              />
            </View>
          </View>
        </View>

        {/* 服务类型 */}
        <View className="bg-white rounded-2xl p-4 mb-4" style={{ border: '1px solid #EDEDED' }}>
          <Text className="block text-base font-semibold mb-4" style={{ color: '#2E2E30' }}>服务类型 *</Text>
          <View className="flex flex-row flex-wrap gap-2">
            {serviceTypes.map(item => (
              <View
                key={item.id}
                className="px-4 py-2 rounded-full"
                style={{
                  backgroundColor: item.selected ? '#F85659' : '#f5f5f5',
                  border: item.selected ? 'none' : '1px solid #EDEDED'
                }}
                onClick={() => toggleServiceType(item.id)}
              >
                <Text style={{ color: item.selected ? '#fff' : '#2E2E30', fontSize: '14px' }}>
                  {item.name}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* 工作经验 */}
        <View className="bg-white rounded-2xl p-4 mb-4" style={{ border: '1px solid #EDEDED' }}>
          <Text className="block text-base font-semibold mb-4" style={{ color: '#2E2E30' }}>工作经验</Text>
          
          <View className="mb-4">
            <Text className="block text-sm mb-2" style={{ color: '#B3B3B3' }}>从业年限</Text>
            <View className="flex flex-row items-center rounded-xl px-4 py-3" style={{ backgroundColor: '#f5f5f5' }}>
              <Input
                className="flex-1 text-sm"
                style={{ color: '#2E2E30' }}
                type="number"
                placeholder="请输入从业年限"
                value={formData.experienceYears}
                onInput={(e) => handleInputChange('experienceYears', e.detail.value)}
              />
              <Text className="text-sm" style={{ color: '#B3B3B3' }}>年</Text>
            </View>
          </View>

          <View>
            <Text className="block text-sm mb-2" style={{ color: '#B3B3B3' }}>个人简介</Text>
            <View className="rounded-xl p-3" style={{ backgroundColor: '#f5f5f5' }}>
              <Textarea
                style={{ width: '100%', minHeight: '80px', color: '#2E2E30', fontSize: '14px', backgroundColor: 'transparent' }}
                placeholder="请介绍一下您的工作经历和特长..."
                maxlength={200}
                value={formData.introduction}
                onInput={(e) => handleInputChange('introduction', e.detail.value)}
              />
            </View>
          </View>
        </View>

        {/* 服务地址 */}
        <View className="bg-white rounded-2xl p-4 mb-4" style={{ border: '1px solid #EDEDED' }}>
          <Text className="block text-base font-semibold mb-4" style={{ color: '#2E2E30' }}>服务区域</Text>
          <View className="flex flex-row items-center rounded-xl px-4 py-3" style={{ backgroundColor: '#f5f5f5' }}>
            <MapPin size={18} color="#B3B3B3" />
            <Input
              className="flex-1 ml-2 text-sm"
              style={{ color: '#2E2E30' }}
              placeholder="请输入您常驻的服务区域"
              value={formData.address}
              onInput={(e) => handleInputChange('address', e.detail.value)}
            />
          </View>
        </View>

        {/* 提交按钮 */}
        <View className="mt-4 mb-8">
          <Button
            className="w-full py-4 rounded-xl text-white font-medium"
            style={{ backgroundColor: loading ? '#ccc' : '#F85659' }}
            disabled={loading}
            onClick={handleSubmit}
          >
            {loading ? '提交中...' : '提交申请'}
          </Button>
        </View>
      </ScrollView>
    </View>
  )
}

export default CleanerApplyPage
