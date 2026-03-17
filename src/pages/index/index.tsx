import Taro, { useLoad, usePullDownRefresh } from '@tarojs/taro'
import { View, Text, ScrollView, Swiper, SwiperItem, Image } from '@tarojs/components'
import { 
  Sparkles, House, Tv, LayoutGrid, Phone, 
  Gift, Wallet, Star, Crown, Wind, Sofa, Droplets, Percent
} from 'lucide-react-taro'
import { useState } from 'react'
// import { Network } from '@/network' // 热点新闻已隐藏
import './index.css'

// 轮播图类型
interface BannerItem {
  id: string
  image: string
  title: string
  subtitle: string
  bgGradient: string
}

// 功能入口类型
interface FunctionItem {
  id: string
  name: string
  icon: string
  color: string
  bgColor: string
}

// 推荐服务类型
interface RecommendService {
  id: string
  name: string
  desc: string
  price: string
  unit: string
  icon: string
  bgColor: string
  iconColor: string
}

// 热点新闻类型 - 已隐藏
// interface NewsItem {
//   id: string
//   title: string
//   summary: string
//   content?: string
//   source: string
//   source_url?: string
//   category: string
//   is_hot: boolean
//   view_count: number
//   publish_time: string
//   created_at: string
// }

const IndexPage = () => {
  useLoad(() => {
    console.log('🏠 首页加载')
    // loadHotNews() // 已隐藏热点新闻
  })

  // 轮播图数据
  const [banners] = useState<BannerItem[]>([
    { 
      id: '1', 
      image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&h=400&fit=crop',
      title: '享品质生活',
      subtitle: '选柒玺家政',
      bgGradient: 'linear-gradient(135deg, #F85659 0%, #FF8A8A 100%)'
    },
    { 
      id: '2', 
      image: 'https://images.unsplash.com/photo-1628177142898-93e36e4e3a50?w=800&h=400&fit=crop',
      title: '专业家政服务',
      subtitle: '品质生活从家开始',
      bgGradient: 'linear-gradient(135deg, #10B981 0%, #34D399 100%)'
    },
    { 
      id: '3', 
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=400&fit=crop',
      title: '新居开荒首选',
      subtitle: '让您的新家焕然一新',
      bgGradient: 'linear-gradient(135deg, #007CFF 0%, #60A5FA 100%)'
    }
  ])

  // 当前轮播索引
  const [currentBanner, setCurrentBanner] = useState(0)

  // 热点新闻数据 - 已隐藏
  // const [hotNews, setHotNews] = useState<NewsItem[]>([])
  // const [newsCategories] = useState([
  //   { key: '', name: '全部' },
  //   { key: 'industry', name: '行业' },
  //   { key: 'market', name: '市场' },
  //   { key: 'tech', name: '技术' }
  // ])
  // const [activeNewsCategory, setActiveNewsCategory] = useState('')
  
  // 新闻弹窗状态 - 已隐藏
  // const [showNewsModal, setShowNewsModal] = useState(false)
  // const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null)
  // const [newsLoading, setNewsLoading] = useState(false)

  // 加载热点新闻 - 已隐藏
  // const loadHotNews = async (isRefresh = false) => { ... }

  // 新闻分类切换 - 已隐藏
  // const handleNewsCategoryChange = ...

  // 新闻点击 - 已隐藏
  // const handleNewsClick = ...

  // 生成模拟新闻内容 - 已隐藏
  // const generateMockContent = ...

  // 关闭新闻弹窗 - 已隐藏
  // const closeNewsModal = ...

  // 分享新闻 - 已隐藏
  // const handleShareNews = ...

  // 查看更多新闻 - 已隐藏
  // const handleViewMoreNews = ...

  // 格式化时间 - 已隐藏
  // const formatNewsTime = ...

  // 生成模拟新闻内容 - 已隐藏
  // const generateMockContent = ...

  // 关闭新闻弹窗 - 已隐藏
  // const closeNewsModal = ...

  // 分享新闻 - 已隐藏
  // const handleShareNews = ...

  // 查看更多新闻 - 已隐藏
  // const handleViewMoreNews = ...

  // 下拉刷新 - 已禁用热点新闻刷新
  usePullDownRefresh(() => {
    // loadHotNews(true)
    Taro.stopPullDownRefresh()
  })

  // 格式化时间 - 已隐藏
  // const formatNewsTime = ...

  // 8个功能入口
  const [functionItems] = useState<FunctionItem[]>([
    { id: '1', name: '保洁服务', icon: 'Sparkles', color: '#F85659', bgColor: '#FFF5F5' },
    { id: '2', name: '家电清洗', icon: 'Tv', color: '#007CFF', bgColor: '#F0F7FF' },
    { id: '3', name: '新居开荒', icon: 'House', color: '#10B981', bgColor: '#F0FDF4' },
    { id: '4', name: '收纳整理', icon: 'LayoutGrid', color: '#9B40D8', bgColor: '#FAF5FF' },
    { id: '5', name: '最新活动', icon: 'Gift', color: '#F38F00', bgColor: '#FFF7ED' },
    { id: '6', name: '分享推荐', icon: 'Star', color: '#EC4899', bgColor: '#FDF2F8' },
    { id: '7', name: '我的钱包', icon: 'Wallet', color: '#14B8A6', bgColor: '#F0FDFA' },
    { id: '8', name: '我的积分', icon: 'Percent', color: '#8B5CF6', bgColor: '#F5F3FF' }
  ])

  // 推荐服务
  const [recommendServices] = useState<RecommendService[]>([
    { id: '1', name: '日常保洁', desc: '专业清洁，焕然一新', price: '50', unit: '元/时', icon: 'Sparkles', bgColor: '#F0F7FF', iconColor: '#007CFF' },
    { id: '2', name: '洗沙发', desc: '深层清洁，去除污渍', price: '120', unit: '元/次', icon: 'Sofa', bgColor: '#FFF5F5', iconColor: '#F85659' },
    { id: '3', name: '空调清洗', desc: '专业清洗，健康呼吸', price: '80', unit: '元/台', icon: 'Wind', bgColor: '#F0FDF4', iconColor: '#10B981' },
    { id: '4', name: '深度保洁', desc: '全面清洁，不留死角', price: '100', unit: '元/时', icon: 'Droplets', bgColor: '#FAF5FF', iconColor: '#9B40D8' }
  ])

  // 获取功能图标
  const getFunctionIcon = (iconName: string, color: string) => {
    const iconMap: Record<string, React.ReactNode> = {
      Sparkles: <Sparkles size={24} color={color} />,
      Tv: <Tv size={24} color={color} />,
      House: <House size={24} color={color} />,
      LayoutGrid: <LayoutGrid size={24} color={color} />,
      Gift: <Gift size={24} color={color} />,
      Star: <Star size={24} color={color} />,
      Wallet: <Wallet size={24} color={color} />,
      Percent: <Percent size={24} color={color} />
    }
    return iconMap[iconName] || <Sparkles size={24} color={color} />
  }

  // 获取推荐服务图标
  const getServiceIcon = (iconName: string, color: string) => {
    const iconMap: Record<string, React.ReactNode> = {
      Sparkles: <Sparkles size={32} color={color} />,
      Wind: <Wind size={32} color={color} />,
      Sofa: <Sofa size={32} color={color} />,
      Droplets: <Droplets size={32} color={color} />
    }
    return iconMap[iconName] || <Sparkles size={32} color={color} />
  }

  // 拨打客服电话
  const handleCallService = () => {
    Taro.makePhoneCall({
      phoneNumber: '400-888-9999',
      fail: () => {
        Taro.showToast({ title: '拨打失败', icon: 'none' })
      }
    })
  }

  // 功能入口点击
  const handleFunctionClick = (item: FunctionItem) => {
    if (item.id === '1') {
      // 保洁服务 -> 二级选择页
      Taro.navigateTo({ url: '/pages/service-select/index?type=cleaning' })
    } else if (item.id === '2') {
      // 家电清洗 -> 二级选择页
      Taro.navigateTo({ url: '/pages/service-select/index?type=appliance' })
    } else if (item.id === '3') {
      // 新居开荒 -> 二级选择页
      Taro.navigateTo({ url: '/pages/service-select/index?type=newhouse' })
    } else if (item.id === '4') {
      // 收纳整理 -> 二级选择页
      Taro.navigateTo({ url: '/pages/service-select/index?type=organize' })
    } else if (item.id === '5') {
      // 最新活动 -> 二级页面
      Taro.navigateTo({ url: '/pages/activities/index' })
    } else if (item.id === '6') {
      // 分享推荐 -> 二级页面
      Taro.navigateTo({ url: '/pages/referral/index' })
    } else if (item.id === '7') {
      // 我的钱包 -> 二级页面（充值功能）
      Taro.navigateTo({ url: '/pages/wallet/index' })
    } else if (item.id === '8') {
      // 我的积分 -> 二级页面
      Taro.navigateTo({ url: '/pages/points/index' })
    }
  }

  // 推荐服务点击
  const handleServiceClick = (service: RecommendService) => {
    Taro.navigateTo({ url: `/pages/service-detail/index?id=${service.id}` })
  }

  return (
    <View className="min-h-screen" style={{ backgroundColor: '#f5f5f5' }}>
      <ScrollView scrollY className="h-screen">
        {/* 轮播横幅区 */}
        <View className="banner-wrapper">
          <Swiper
            className="banner-swiper"
            indicatorDots={false}
            autoplay
            interval={4000}
            duration={500}
            onChange={(e) => setCurrentBanner(e.detail.current)}
          >
            {banners.map(banner => (
              <SwiperItem key={banner.id}>
                <View className="banner-container" style={{ background: banner.bgGradient }}>
                  <Image 
                    className="banner-image"
                    src={banner.image}
                    mode="aspectFill"
                  />
                  <View className="banner-overlay" />
                  <View className="banner-content">
                    <View className="banner-text">
                      <Text className="banner-title">{banner.title}</Text>
                      <Text className="banner-subtitle">{banner.subtitle}</Text>
                    </View>
                    <View className="banner-decoration">
                      <Sparkles size={60} color="rgba(255,255,255,0.3)" />
                    </View>
                  </View>
                </View>
              </SwiperItem>
            ))}
          </Swiper>
          {/* 轮播指示器 */}
          <View className="banner-dots">
            {banners.map((_, index) => (
              <View key={index} className={`dot ${index === currentBanner ? 'active' : ''}`} />
            ))}
          </View>
        </View>

        {/* 功能图标导航区 - 2行4列 */}
        <View className="function-grid">
          {functionItems.map(item => (
            <View 
              key={item.id} 
              className="function-item"
              onClick={() => handleFunctionClick(item)}
            >
              <View 
                className="function-icon"
                style={{ backgroundColor: item.bgColor }}
              >
                {getFunctionIcon(item.icon, item.color)}
              </View>
              <Text className="function-name">{item.name}</Text>
            </View>
          ))}
        </View>

        {/* 热点新闻区域 - 已隐藏 */}
        {/* <View className="hot-news-section">
          <View className="hot-news-header">
            <View className="hot-news-title-wrap">
              <View className="hot-news-icon">
                <Flame size={18} color="#F85659" />
              </View>
              <Text className="hot-news-title">热点新闻</Text>
            </View>
            <View className="view-more-btn" onClick={handleViewMoreNews}>
              <Text className="view-more-text">查看更多</Text>
              <ChevronRight size={14} color="#999" />
            </View>
          </View>

          <ScrollView scrollX className="news-category-scroll">
            <View className="news-category-list">
              {newsCategories.map(cat => (
                <View
                  key={cat.key}
                  className={`news-category-item ${activeNewsCategory === cat.key ? 'active' : ''}`}
                  onClick={() => handleNewsCategoryChange(cat.key)}
                >
                  <Text className="news-category-text">{cat.name}</Text>
                </View>
              ))}
            </View>
          </ScrollView>

          {activeNewsCategory === '' && hotNews.length >= 2 ? (
            <View className="news-swiper-wrapper">
              <Swiper 
                className="news-swiper"
                autoplay={hotNews.length >= 3}
                circular={hotNews.length >= 3}
                interval={4000}
                duration={500}
                previousMargin="24rpx"
                nextMargin="24rpx"
              >
                {hotNews.map((news, index) => (
                  <SwiperItem key={news.id}>
                    <View 
                      className="news-swiper-card"
                      onClick={() => handleNewsClick(news)}
                    >
                      <View className="news-swiper-rank">
                        <Text className={`rank-badge ${index < 3 ? 'top' : ''}`}>{index + 1}</Text>
                      </View>
                      <View className="news-swiper-content">
                        {news.is_hot && (
                          <View className="news-swiper-hot">
                            <Flame size={12} color="#fff" />
                            <Text className="hot-label">热门</Text>
                          </View>
                        )}
                        <Text className="news-swiper-title">{news.title}</Text>
                        <Text className="news-swiper-summary">{news.summary}</Text>
                        <View className="news-swiper-meta">
                          <Text className="news-swiper-source">{news.source}</Text>
                          <View className="news-swiper-stats">
                            <View className="stat-item">
                              <Clock size={12} color="#999" />
                              <Text className="stat-text">{formatNewsTime(news.publish_time || news.created_at)}</Text>
                            </View>
                            <View className="stat-item">
                              <Eye size={12} color="#999" />
                              <Text className="stat-text">{news.view_count || 0}</Text>
                            </View>
                          </View>
                        </View>
                      </View>
                    </View>
                  </SwiperItem>
                ))}
              </Swiper>
              <View className="news-swiper-dots">
                {hotNews.map((_, idx) => (
                  <View key={idx} className="news-swiper-dot" />
                ))}
              </View>
            </View>
          ) : (
            <View className="hot-news-list">
              {hotNews.map((news, index) => (
                <View 
                  key={news.id} 
                  className={`hot-news-card ${index === 0 ? 'first' : ''}`}
                  onClick={() => handleNewsClick(news)}
                >
                  <View className="news-card-left">
                    {news.is_hot && (
                      <View className="hot-tag">
                        <Flame size={10} color="#fff" />
                        <Text className="hot-tag-text">热</Text>
                      </View>
                    )}
                    <View className="news-rank">
                      <Text className={`rank-num ${index < 3 ? 'top' : ''}`}>{index + 1}</Text>
                    </View>
                  </View>
                  <View className="news-card-content">
                    <Text className="news-card-title">{news.title}</Text>
                    <View className="news-card-meta">
                      <Text className="news-card-source">{news.source}</Text>
                      <View className="news-meta-item">
                        <Clock size={10} color="#999" />
                        <Text className="news-meta-text">{formatNewsTime(news.publish_time || news.created_at)}</Text>
                      </View>
                      <View className="news-meta-item">
                        <Eye size={10} color="#999" />
                        <Text className="news-meta-text">{news.view_count || 0}</Text>
                      </View>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          )}

          {hotNews.length === 0 && (
            <View className="news-empty">
              <Newspaper size={32} color="#ddd" />
              <Text className="news-empty-text">暂无热点新闻</Text>
            </View>
          )}
        </View> */}

        {/* 推荐服务展示区 - 固定网格布局 */}
        <View className="recommend-section">
          <View className="recommend-header">
            <View className="recommend-icon">
              <Star size={16} color="#10B981" />
            </View>
            <Text className="recommend-title">推荐服务</Text>
          </View>
          
          <View className="recommend-grid">
            {recommendServices.map(service => (
              <View 
                key={service.id}
                className="recommend-card"
                style={{ backgroundColor: service.bgColor }}
                onClick={() => handleServiceClick(service)}
              >
                <View className="recommend-card-icon">
                  {getServiceIcon(service.icon, service.iconColor)}
                </View>
                <Text className="recommend-card-name">{service.name}</Text>
                <Text className="recommend-card-desc">{service.desc}</Text>
                <View className="recommend-card-price">
                  <Text className="price-value" style={{ color: service.iconColor }}>¥{service.price}</Text>
                  <Text className="price-unit">/{service.unit}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* 会员服务推广区 - 一排三列布局 */}
        <View className="promotion-section">
          <View className="promotion-header">
            <View className="promotion-header-icon">
              <Crown size={16} color="#F85659" />
            </View>
            <Text className="promotion-header-title">会员专享</Text>
          </View>
          <View className="promotion-grid">
            <View 
              className="promotion-card member-card"
              onClick={() => Taro.navigateTo({ url: '/pages/membership/index' })}
            >
              <View className="card-header">
                <Crown size={18} color="#FFD700" />
                <Text className="card-title">成为会员</Text>
              </View>
              <Text className="card-desc">9折优惠等你来购</Text>
              <View className="card-icon">
                <Crown size={28} color="rgba(255,255,255,0.3)" />
              </View>
            </View>
            <View 
              className="promotion-card month-card"
              onClick={() => Taro.navigateTo({ url: '/pages/subscription/index' })}
            >
              <View className="card-header">
                <Gift size={18} color="#FFD700" />
                <Text className="card-title">按月/季度</Text>
              </View>
              <Text className="card-desc">享受所有优惠制度</Text>
              <View className="card-icon">
                <Gift size={28} color="rgba(255,255,255,0.3)" />
              </View>
            </View>
            <View 
              className="promotion-card year-card"
              onClick={() => Taro.navigateTo({ url: '/pages/annual/index' })}
            >
              <View className="card-header">
                <Star size={18} color="#FFD700" />
                <Text className="card-title">包年付费</Text>
              </View>
              <Text className="card-desc">享受史诗级优惠</Text>
              <View className="card-icon">
                <Star size={28} color="rgba(255,255,255,0.3)" />
              </View>
            </View>
          </View>
        </View>

        {/* 底部客服信息 */}
        <View className="service-section">
          <View className="service-info">
            <View className="service-text">
              <Text className="service-title">需要帮助？</Text>
              <Text className="service-phone">客服热线：400-888-9999</Text>
              <Text className="service-time">服务时间：08:00-22:00</Text>
            </View>
            <View className="service-btn" onClick={handleCallService}>
              <Phone size={16} color="#fff" />
              <Text className="service-btn-text">立即咨询</Text>
            </View>
          </View>
        </View>

        {/* 底部安全提示 */}
        <View className="footer-section">
          <View className="footer-content">
            <View className="footer-icon">
              <Sparkles size={12} color="#F85659" />
            </View>
            <Text className="footer-text">柒玺家政 · 专业可靠 · 品质保障</Text>
          </View>
        </View>
      </ScrollView>

      {/* 新闻详情弹窗 - 已隐藏 */}
      {/* {showNewsModal && selectedNews && (
        ...
      )} */}
    </View>
  )
}

export default IndexPage
