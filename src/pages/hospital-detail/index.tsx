import Taro, { useRouter } from '@tarojs/taro'
import { View, Text, Image, ScrollView } from '@tarojs/components'
import { ArrowLeft, MapPin, Phone, Clock, Star, Calendar, ChevronRight, Stethoscope, Users } from 'lucide-react-taro'
import './index.css'

// 医院数据类型
interface Hospital {
  id: string
  name: string
  level: string
  address: string
  phone: string
  image: string
  rating: number
  tags: string[]
  url: string
  departments: string[]
  workingHours: string
  description: string
}

const HospitalDetailPage = () => {
  const router = useRouter()
  const hospitalId = router.params.id || '1'

  // 模拟医院数据（实际应从后端获取）
  const hospitalsData: Record<string, Hospital> = {
    '1': {
      id: '1',
      name: '北京协和医院',
      level: '三级甲等',
      address: '东城区帅府园1号',
      phone: '010-69156699',
      image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&h=400&fit=crop',
      rating: 4.9,
      tags: ['综合医院', '全国百强', '教学医院'],
      url: 'https://www.pumch.cn',
      departments: ['内科', '外科', '妇产科', '儿科', '眼科', '耳鼻喉科', '皮肤科', '神经内科', '心血管内科', '消化内科'],
      workingHours: '周一至周五 8:00-17:00',
      description: '北京协和医院是集医疗、教学、科研于一体的现代化综合性三级甲等医院，是北京协和医学院的临床学院，中国医学科学院的临床医学研究所。'
    },
    '2': {
      id: '2',
      name: '北京大学第一医院',
      level: '三级甲等',
      address: '西城区西什库大街8号',
      phone: '010-83575780',
      image: 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?w=800&h=400&fit=crop',
      rating: 4.8,
      tags: ['综合医院', '教学医院', '百年老院'],
      url: 'https://www.pkufh.com',
      departments: ['内科', '外科', '妇产科', '儿科', '泌尿外科', '心血管内科', '肾病科', '血液科'],
      workingHours: '周一至周五 8:00-17:00',
      description: '北京大学第一医院创建于1915年，是我国最早创办的国立医院，也是中国近代医学史的起点。'
    }
  }

  const hospital = hospitalsData[hospitalId] || hospitalsData['1']

  const handleBack = () => {
    Taro.navigateBack()
  }

  const handleDepartmentClick = (department: string) => {
    Taro.navigateTo({
      url: `/pages/booking-confirm/index?hospitalId=${hospitalId}&department=${department}`
    })
  }

  const handleOfficialBooking = () => {
    Taro.showModal({
      title: '官方挂号平台',
      content: '即将跳转到医院官方挂号平台，实际挂号操作将在官方平台完成。',
      confirmText: '继续',
      cancelText: '取消',
      success: (res) => {
        if (res.confirm) {
          // 复制医院官方挂号链接
          Taro.setClipboardData({
            data: hospital.url,
            success: () => {
              Taro.showModal({
                title: '链接已复制',
                content: '医院官方挂号链接已复制到剪贴板，请按以下步骤操作：\n\n1. 打开手机浏览器\n2. 粘贴链接并访问\n3. 在官方平台完成挂号',
                showCancel: false,
                confirmText: '知道了'
              })
            },
            fail: () => {
              Taro.showToast({
                title: '复制失败，请手动打开',
                icon: 'none',
                duration: 2000
              })
            }
          })
        }
      }
    })
  }

  return (
    <View className="hospital-detail-page">
      {/* 导航栏 */}
      <View className="navbar">
        <View
          className="nav-back"
          onClick={handleBack}
        >
          <ArrowLeft size={24} color="#fff" />
        </View>
        <Text className="nav-title">{hospital.name}</Text>
        <View className="nav-placeholder" />
      </View>

      <ScrollView className="content" scrollY>
        {/* 医院大图 */}
        <View className="hero-section">
          <Image
            className="hero-image"
            src={hospital.image}
            mode="aspectFill"
          />
          <View className="hero-overlay">
            <View className="hospital-badge">
              <Text className="badge-text">{hospital.level}</Text>
            </View>
          </View>
        </View>

        {/* 医院基本信息 */}
        <View className="info-card">
          <View className="hospital-header">
            <Text className="hospital-name">{hospital.name}</Text>
            <View className="rating-wrapper">
              <Star size={16} color="#F59E0B" />
              <Text className="rating-text">{hospital.rating}</Text>
            </View>
          </View>

          <View className="tags-container">
            {hospital.tags.map((tag, index) => (
              <View key={index} className="tag">
                <Text className="tag-text">{tag}</Text>
              </View>
            ))}
          </View>

          <View className="info-item">
            <MapPin size={18} color="#10B981" />
            <Text className="info-text">{hospital.address}</Text>
          </View>

          <View className="info-item">
            <Phone size={18} color="#10B981" />
            <Text className="info-text">{hospital.phone}</Text>
          </View>

          <View className="info-item">
            <Clock size={18} color="#10B981" />
            <Text className="info-text">{hospital.workingHours}</Text>
          </View>

          <Text className="description">{hospital.description}</Text>
        </View>

        {/* 科室列表 */}
        <View className="departments-section">
          <View className="section-header">
            <View className="section-icon-wrapper">
              <Stethoscope size={20} color="#10B981" />
            </View>
            <Text className="section-title">科室列表</Text>
            <Text className="section-count">（{hospital.departments.length}个科室）</Text>
          </View>

          <View className="departments-grid">
            {hospital.departments.map((department, index) => (
              <View
                key={index}
                className="department-card"
                onClick={() => handleDepartmentClick(department)}
              >
                <View className="department-icon-wrapper">
                  <Users size={24} color="#10B981" />
                </View>
                <Text className="department-name">{department}</Text>
                <ChevronRight size={16} color="#9CA3AF" />
              </View>
            ))}
          </View>
        </View>

        {/* 快速挂号 */}
        <View className="quick-booking-section">
          <View className="quick-booking-card">
            <View className="booking-icon-wrapper">
              <Calendar size={32} color="#10B981" />
            </View>
            <View className="booking-info">
              <Text className="booking-title">官方挂号</Text>
              <Text className="booking-subtitle">跳转到医院官方平台</Text>
            </View>
            <View
              className="booking-button"
              onClick={handleOfficialBooking}
            >
              <Text className="booking-button-text">立即挂号</Text>
            </View>
          </View>
        </View>

        {/* 温馨提示 */}
        <View className="tips-section">
          <View className="tips-card">
            <View className="tips-header">
              <Text className="tips-icon">💡</Text>
              <Text className="tips-title">温馨提示</Text>
            </View>
            <Text className="tips-text">
              1. 建议提前1-3天预约挂号
              {'\n'}2. 请携带身份证和医保卡就诊
              {'\n'}3. 如需取消预约，请提前24小时
              {'\n'}4. 如有疑问，可拨打医院电话咨询
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  )
}

export default HospitalDetailPage
