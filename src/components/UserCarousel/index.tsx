import { useState, useEffect } from 'react'
import { View, Text } from '@tarojs/components'
import { MapPin, Star, Quote } from 'lucide-react-taro'
import './index.css'

interface User {
  id: string
  nickname: string
  city: string
  phone: string
  gender: string
}

interface UserCarouselProps {
  users?: User[]
  interval?: number
}

const UserCarousel = ({ users: propUsers, interval = 3000 }: UserCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [displayUsers, setDisplayUsers] = useState<User[]>(propUsers || [])

  useEffect(() => {
    if (propUsers) {
      setDisplayUsers(propUsers)
    }
  }, [propUsers])

  // 自动轮播
  useEffect(() => {
    if (displayUsers.length === 0) return

    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % displayUsers.length)
    }, interval)

    return () => clearInterval(timer)
  }, [displayUsers.length, interval])

  // 生成虚拟头像
  const getAvatarUrl = (user: User | undefined, index: number) => {
    const colors = [
      'from-emerald-400 to-emerald-600',
      'from-blue-400 to-blue-600',
      'from-purple-400 to-purple-600',
      'from-pink-400 to-pink-600',
      'from-orange-400 to-orange-600',
      'from-cyan-400 to-cyan-600',
      'from-indigo-400 to-indigo-600',
      'from-rose-400 to-rose-600',
    ]
    const colorIndex = index % colors.length
    return { colorClass: colors[colorIndex], initial: user?.nickname?.charAt(0) || '用' }
  }

  // 生成随机评价
  const getRandomReview = (index: number) => {
    const reviews = [
      '服务非常专业，师傅准时到达，打扫得很干净！',
      '预约流程简单快捷，服务态度很好，值得推荐！',
      '上门服务很准时，工作细致，非常满意！',
      '价格透明公道，服务质量超出预期！',
      '客服响应很快，师傅技术过硬，五星好评！',
      '第一次使用，体验很好，会继续使用！',
      '推荐给朋友了，大家都很满意！',
      '效率很高，卫生死角都清理得很干净！',
      '服务人员素质高，工具齐全，专业！',
      '非常棒的体验，下次还会再来！',
    ]
    return reviews[index % reviews.length]
  }

  if (displayUsers.length === 0) {
    return null
  }

  const currentUser = displayUsers[currentIndex]
  const { colorClass, initial } = getAvatarUrl(currentUser, currentIndex)

  return (
    <View className="user-carousel-container">
      <View className="carousel-wrapper">
        {/* 轮播内容 */}
        <View className={`carousel-item carousel-item-${currentIndex}`}>
          <View className="user-info-card">
            {/* 用户头像 */}
            <View className="avatar-container">
              <View
                className={`avatar avatar-gradient bg-gradient-to-br ${colorClass}`}
                style={{
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
                }}
              >
                <Text className="avatar-text">{initial}</Text>
              </View>
              <View className="online-indicator" />
            </View>

            {/* 用户信息 */}
            <View className="user-details">
              <View className="user-header">
                <Text className="user-nickname">{currentUser.nickname || '用户'}</Text>
                <View className="rating-badge">
                  <Star size={12} color="#FBBF24" />
                  <Text className="rating-text">5.0</Text>
                </View>
              </View>

              <View className="location-badge">
                <MapPin size={14} color="#10B981" />
                <Text className="location-text">{currentUser.city || '未知城市'}</Text>
              </View>
            </View>
          </View>

          {/* 用户评价 */}
          <View className="review-section">
            <View className="quote-icon">
              <Quote size={20} color="#10B981" />
            </View>
            <Text className="review-text">
              {getRandomReview(currentIndex)}
            </Text>
          </View>
        </View>

        {/* 指示器 */}
        <View className="carousel-indicators">
          {displayUsers.slice(0, 5).map((_, index) => (
            <View
              key={index}
              className={`indicator ${index === currentIndex ? 'active' : ''}`}
            />
          ))}
        </View>
      </View>
    </View>
  )
}

export default UserCarousel
