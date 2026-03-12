import Taro from '@tarojs/taro'
import { View, Text, Image, Input, ScrollView } from '@tarojs/components'
import { Search, MapPin, Star, ChevronRight, Phone } from 'lucide-react-taro'
import { useState } from 'react'
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
  url: string // 官方挂号网址
  departments: string[]
}

const RegistrationPage = () => {
  const [searchText, setSearchText] = useState('')
  const [selectedTab, setSelectedTab] = useState<'all' | 'grade3' | 'specialist'>('all')

  // 北京主要医院数据
  const hospitals: Hospital[] = [
    {
      id: '1',
      name: '北京协和医院',
      level: '三级甲等',
      address: '东城区帅府园1号',
      phone: '010-69156699',
      image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600&h=400&fit=crop',
      rating: 4.9,
      tags: ['综合医院', '全国百强'],
      url: 'https://www.pumch.cn',
      departments: ['内科', '外科', '妇产科', '儿科', '眼科', '耳鼻喉科', '皮肤科', '神经内科']
    },
    {
      id: '2',
      name: '北京大学第一医院',
      level: '三级甲等',
      address: '西城区西什库大街8号',
      phone: '010-83575780',
      image: 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?w=600&h=400&fit=crop',
      rating: 4.8,
      tags: ['综合医院', '教学医院'],
      url: 'https://www.pkufh.com',
      departments: ['内科', '外科', '妇产科', '儿科', '泌尿外科', '心血管内科']
    },
    {
      id: '3',
      name: '北京天坛医院',
      level: '三级甲等',
      address: '丰台区南四环西路119号',
      phone: '010-59976541',
      image: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=600&h=400&fit=crop',
      rating: 4.8,
      tags: ['神经外科', '特色专科'],
      url: 'https://www.bjtth.org',
      departments: ['神经外科', '神经内科', '内科', '外科', '急诊科', '康复科']
    },
    {
      id: '4',
      name: '北京同仁医院',
      level: '三级甲等',
      address: '东城区东交民巷1号',
      phone: '010-58266699',
      image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=600&h=400&fit=crop',
      rating: 4.7,
      tags: ['眼科', '耳鼻喉科'],
      url: 'https://www.trhos.com',
      departments: ['眼科', '耳鼻喉科', '头颈外科', '内科', '外科']
    },
    {
      id: '5',
      name: '北京儿童医院',
      level: '三级甲等',
      address: '西城区南礼士路56号',
      phone: '010-59616161',
      image: 'https://images.unsplash.com/photo-1504439468489-c8920d796a29?w=600&h=400&fit=crop',
      rating: 4.9,
      tags: ['儿童专科', '全国领先'],
      url: 'https://www.bch.com.cn',
      departments: ['儿科', '新生儿科', '小儿外科', '小儿内科', '儿童保健科']
    },
    {
      id: '6',
      name: '北京301医院',
      level: '三级甲等',
      address: '海淀区复兴路28号',
      phone: '010-68182255',
      image: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=600&h=400&fit=crop',
      rating: 4.8,
      tags: ['综合医院', '军队医院'],
      url: 'https://www.plagh.cn',
      departments: ['内科', '外科', '妇产科', '儿科', '骨科', '心血管外科']
    },
    {
      id: '7',
      name: '北京大学第三医院',
      level: '三级甲等',
      address: '海淀区花园北路49号',
      phone: '010-82266699',
      image: 'https://images.unsplash.com/photo-1551076805-e1869033e561?w=600&h=400&fit=crop',
      rating: 4.8,
      tags: ['运动医学', '生殖医学'],
      url: 'https://www.puh3.com.cn',
      departments: ['运动医学科', '生殖医学中心', '骨科', '妇产科', '儿科']
    },
    {
      id: '8',
      name: '北京口腔医院',
      level: '三级甲等',
      address: '东城区天坛西里4号',
      phone: '010-57099201',
      image: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=600&h=400&fit=crop',
      rating: 4.7,
      tags: ['口腔专科', '特色医院'],
      url: 'https://www.dentist.org.cn',
      departments: ['口腔内科', '口腔外科', '口腔修复科', '正畸科', '儿童口腔科']
    }
  ]

  // 根据搜索和筛选过滤医院
  const filteredHospitals = hospitals.filter(hospital => {
    const matchSearch = hospital.name.includes(searchText) ||
                       hospital.tags.some(tag => tag.includes(searchText))
    const matchTab = selectedTab === 'all' ||
                     (selectedTab === 'grade3' && hospital.level.includes('三级甲等')) ||
                     (selectedTab === 'specialist' && hospital.tags.some(tag => tag.includes('专科')))
    return matchSearch && matchTab
  })

  const handleSearch = (e) => {
    setSearchText(e.detail.value)
  }

  const handleHospitalClick = (hospital: Hospital) => {
    Taro.navigateTo({
      url: `/pages/hospital-detail/index?id=${hospital.id}`
    })
  }

  const handleOfficialBooking = (url: string, e) => {
    e.stopPropagation() // 阻止冒泡，避免触发医院详情
    Taro.showModal({
      title: '官方挂号平台',
      content: '即将跳转到医院官方挂号平台，实际挂号操作将在官方平台完成。',
      confirmText: '继续',
      cancelText: '取消',
      success: (res) => {
        if (res.confirm) {
          // 复制医院官方挂号链接
          Taro.setClipboardData({
            data: url,
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
    <View className="registration-page">
      {/* 搜索栏 */}
      <View className="search-bar">
        <View className="search-input-wrapper">
          <Search size={18} color="#9CA3AF" />
          <Input
            className="search-input"
            placeholder="搜索医院名称"
            value={searchText}
            onInput={handleSearch}
          />
        </View>
      </View>

      {/* 筛选标签 */}
      <ScrollView className="tab-scroll" scrollX>
        <View className="tab-list">
          <View
            className={`tab-item ${selectedTab === 'all' ? 'active' : ''}`}
            onClick={() => setSelectedTab('all')}
          >
            <Text className="tab-text">全部</Text>
          </View>
          <View
            className={`tab-item ${selectedTab === 'grade3' ? 'active' : ''}`}
            onClick={() => setSelectedTab('grade3')}
          >
            <Text className="tab-text">三甲医院</Text>
          </View>
          <View
            className={`tab-item ${selectedTab === 'specialist' ? 'active' : ''}`}
            onClick={() => setSelectedTab('specialist')}
          >
            <Text className="tab-text">特色专科</Text>
          </View>
        </View>
      </ScrollView>

      {/* 医院列表 */}
      <ScrollView className="hospital-list" scrollY>
        <View className="hospital-container">
          {filteredHospitals.map((hospital) => (
            <View
              key={hospital.id}
              className="hospital-card"
              onClick={() => handleHospitalClick(hospital)}
            >
              {/* 医院图片 */}
              <View className="hospital-image-wrapper">
                <Image
                  className="hospital-image"
                  src={hospital.image}
                  mode="aspectFill"
                />
                <View className="hospital-badge">
                  <Text className="badge-text">{hospital.level}</Text>
                </View>
              </View>

              {/* 医院信息 */}
              <View className="hospital-info">
                <View className="hospital-header">
                  <Text className="hospital-name">{hospital.name}</Text>
                  <View className="rating-wrapper">
                    <Star size={14} color="#F59E0B" />
                    <Text className="rating-text">{hospital.rating}</Text>
                  </View>
                </View>

                <View className="hospital-tags">
                  {hospital.tags.slice(0, 2).map((tag, tagIndex) => (
                    <View key={tagIndex} className="tag">
                      <Text className="tag-text">{tag}</Text>
                    </View>
                  ))}
                </View>

                <View className="hospital-location">
                  <MapPin size={14} color="#6B7280" />
                  <Text className="location-text">{hospital.address}</Text>
                </View>

                <View className="hospital-phone">
                  <Phone size={14} color="#6B7280" />
                  <Text className="phone-text">{hospital.phone}</Text>
                </View>

                {/* 快速操作 */}
                <View className="hospital-actions">
                  <View
                    className="action-button official-booking"
                    onClick={(e) => handleOfficialBooking(hospital.url, e)}
                  >
                    <Text className="action-text">官方挂号</Text>
                  </View>
                  <View className="action-button view-departments">
                    <Text className="action-text">查看科室</Text>
                    <ChevronRight size={16} color="#10B981" />
                  </View>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* 底部提示 */}
        <View className="footer-tips">
          <View className="tips-header">
            <Text className="tips-icon">💡</Text>
            <Text className="tips-title">温馨提示</Text>
          </View>
          <View className="tips-content">
            <Text className="tips-text">• 点击&ldquo;官方挂号&rdquo;可跳转到医院官方挂号平台</Text>
            <Text className="tips-text">• 本平台仅提供医院信息和跳转服务</Text>
            <Text className="tips-text">• 实际挂号、预约、缴费均在医院官方平台完成</Text>
            <Text className="tips-text">• 如有疑问，请直接联系医院客服</Text>
          </View>
        </View>

        {/* 免责声明 */}
        <View className="disclaimer-section">
          <Text className="disclaimer-title">免责声明</Text>
          <Text className="disclaimer-text">
            本小程序仅提供医院信息展示和挂号平台跳转服务，不涉及任何实际挂号操作。所有挂号、预约、缴费等行为均通过医院官方平台完成，本平台不对挂号的最终结果承担责任。如需帮助，请直接联系相关医院。
          </Text>
        </View>
      </ScrollView>
    </View>
  )
}

export default RegistrationPage
