import Taro, { useLoad } from '@tarojs/taro'
import { View, Text, ScrollView, Switch, Image as TaroImage } from '@tarojs/components'
import { useState } from 'react'
import { Network } from '@/network'
import { Image, FileText, Bell, Plus, Pencil, Trash2, ArrowLeft } from 'lucide-react-taro'
import './index.css'

interface Banner {
  id: string
  title: string
  image_url: string
  link_url: string
  sort_order: number
  status: string
}

interface Announcement {
  id: string
  title: string
  content: string
  type: string
  status: string
  created_at: string
}

interface ServiceContent {
  id: string
  title: string
  content: string
  category: string
  sort_order: number
  status: string
}

type TabType = 'banner' | 'announcement' | 'service'

const ContentManagePage = () => {
  const [activeTab, setActiveTab] = useState<TabType>('banner')
  
  const [banners, setBanners] = useState<Banner[]>([])
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [services, setServices] = useState<ServiceContent[]>([])
  
  useLoad(() => {
    loadData()
  })

  const loadData = async () => {
    try {
      // 并行加载所有数据
      const [bannerRes, announcementRes, serviceRes] = await Promise.all([
        Network.request({ url: '/api/admin/banners', method: 'GET' }),
        Network.request({ url: '/api/admin/announcements', method: 'GET' }),
        Network.request({ url: '/api/admin/service-contents', method: 'GET' })
      ])

      if (bannerRes.statusCode === 200 && bannerRes.data?.data) {
        setBanners(bannerRes.data.data)
      }
      if (announcementRes.statusCode === 200 && announcementRes.data?.data) {
        setAnnouncements(announcementRes.data.data)
      }
      if (serviceRes.statusCode === 200 && serviceRes.data?.data) {
        setServices(serviceRes.data.data)
      }
    } catch (error) {
      // 模拟数据
      setBanners([
        { id: '1', title: '春节大促', image_url: '', link_url: '/pages/index/index', sort_order: 1, status: 'active' },
        { id: '2', title: '新用户专享', image_url: '', link_url: '/pages/index/index', sort_order: 2, status: 'active' }
      ])
      setAnnouncements([
        { id: '1', title: '平台升级公告', content: '系统将于本周六凌晨升级', type: 'system', status: 'active', created_at: '2024-01-01' },
        { id: '2', title: '服务范围扩展', content: '现已支持更多区域服务', type: 'notice', status: 'active', created_at: '2024-01-02' }
      ])
      setServices([
        { id: '1', title: '日常保洁服务说明', content: '日常保洁服务包含...', category: 'cleaning', sort_order: 1, status: 'active' },
        { id: '2', title: '家电清洗流程', content: '专业家电清洗...', category: 'appliance', sort_order: 2, status: 'active' }
      ])
    }
  }

  const handleToggleStatus = async (type: TabType, id: string, newStatus: boolean) => {
    const urlMap = {
      banner: `/api/admin/banners/${id}/status`,
      announcement: `/api/admin/announcements/${id}/status`,
      service: `/api/admin/service-contents/${id}/status`
    }

    try {
      const res = await Network.request({
        url: urlMap[type],
        method: 'PUT',
        data: { status: newStatus ? 'active' : 'inactive' }
      })

      if (res.statusCode === 200) {
        Taro.showToast({ title: '状态已更新', icon: 'success' })
        loadData()
      }
    } catch (error) {
      Taro.showToast({ title: '操作失败', icon: 'none' })
    }
  }

  const handleDelete = async (type: TabType, id: string) => {
    const confirm = await Taro.showModal({
      title: '确认删除',
      content: '删除后无法恢复，确定要删除吗？'
    })

    if (confirm.confirm) {
      const urlMap = {
        banner: `/api/admin/banners/${id}`,
        announcement: `/api/admin/announcements/${id}`,
        service: `/api/admin/service-contents/${id}`
      }

      try {
        const res = await Network.request({
          url: urlMap[type],
          method: 'DELETE'
        })

        if (res.statusCode === 200) {
          Taro.showToast({ title: '删除成功', icon: 'success' })
          loadData()
        }
      } catch (error) {
        Taro.showToast({ title: '删除失败', icon: 'none' })
      }
    }
  }

  const renderBannerList = () => (
    <ScrollView scrollY className="list-container">
      {banners.map(banner => (
        <View key={banner.id} className="content-card">
          <View className="banner-image">
            {banner.image_url ? (
              <TaroImage src={banner.image_url} mode="aspectFill" style={{ width: '100%', height: '100%' }} />
            ) : (
              <View className="banner-placeholder">
                <Image size={32} color="#ccc" />
                <Text className="placeholder-text">暂无图片</Text>
              </View>
            )}
          </View>
          
          <View className="content-body">
            <Text className="content-title">{banner.title}</Text>
            <Text className="content-meta">排序: {banner.sort_order} | 跳转: {banner.link_url || '无'}</Text>
          </View>

          <View className="content-footer">
            <View className="switch-wrap">
              <Text className="switch-label">启用</Text>
              <Switch 
                checked={banner.status === 'active'}
                color="#F85659"
                onChange={e => handleToggleStatus('banner', banner.id, e.detail.value)}
              />
            </View>
            <View className="action-btns">
              <View className="action-btn" onClick={() => { /* TODO: implement edit */ }}>
                <Pencil size={16} color="#F85659" />
              </View>
              <View className="action-btn" onClick={() => handleDelete('banner', banner.id)}>
                <Trash2 size={16} color="#EF4444" />
              </View>
            </View>
          </View>
        </View>
      ))}

      {banners.length === 0 && (
        <View className="empty-state">
          <Image size={48} color="#ddd" />
          <Text className="empty-text">暂无轮播图</Text>
        </View>
      )}
    </ScrollView>
  )

  const renderAnnouncementList = () => (
    <ScrollView scrollY className="list-container">
      {announcements.map(item => (
        <View key={item.id} className="content-card">
          <View className="content-header">
            <View className="type-tag">
              <Text className="type-tag-text">{item.type === 'system' ? '系统' : '通知'}</Text>
            </View>
            <Text className="content-time">{item.created_at?.split('T')[0]}</Text>
          </View>

          <View className="content-body">
            <Text className="content-title">{item.title}</Text>
            <Text className="content-desc">{item.content}</Text>
          </View>

          <View className="content-footer">
            <View className="switch-wrap">
              <Text className="switch-label">启用</Text>
              <Switch 
                checked={item.status === 'active'}
                color="#F85659"
                onChange={e => handleToggleStatus('announcement', item.id, e.detail.value)}
              />
            </View>
            <View className="action-btns">
              <View className="action-btn" onClick={() => { /* TODO: implement edit */ }}>
                <Pencil size={16} color="#F85659" />
              </View>
              <View className="action-btn" onClick={() => handleDelete('announcement', item.id)}>
                <Trash2 size={16} color="#EF4444" />
              </View>
            </View>
          </View>
        </View>
      ))}

      {announcements.length === 0 && (
        <View className="empty-state">
          <Bell size={48} color="#ddd" />
          <Text className="empty-text">暂无公告</Text>
        </View>
      )}
    </ScrollView>
  )

  const renderServiceList = () => (
    <ScrollView scrollY className="list-container">
      {services.map(item => (
        <View key={item.id} className="content-card">
          <View className="content-header">
            <View className="category-tag">
              <Text className="category-tag-text">
                {item.category === 'cleaning' ? '保洁' : item.category === 'appliance' ? '家电' : '其他'}
              </Text>
            </View>
            <Text className="content-meta">排序: {item.sort_order}</Text>
          </View>

          <View className="content-body">
            <Text className="content-title">{item.title}</Text>
            <Text className="content-desc">{item.content}</Text>
          </View>

          <View className="content-footer">
            <View className="switch-wrap">
              <Text className="switch-label">启用</Text>
              <Switch 
                checked={item.status === 'active'}
                color="#F85659"
                onChange={e => handleToggleStatus('service', item.id, e.detail.value)}
              />
            </View>
            <View className="action-btns">
              <View className="action-btn" onClick={() => { /* TODO: implement edit */ }}>
                <Pencil size={16} color="#F85659" />
              </View>
              <View className="action-btn" onClick={() => handleDelete('service', item.id)}>
                <Trash2 size={16} color="#EF4444" />
              </View>
            </View>
          </View>
        </View>
      ))}

      {services.length === 0 && (
        <View className="empty-state">
          <FileText size={48} color="#ddd" />
          <Text className="empty-text">暂无服务内容</Text>
        </View>
      )}
    </ScrollView>
  )

  return (
    <View className="page-container">
      {/* 头部 */}
      <View className="page-header">
        <View onClick={() => Taro.navigateBack()}>
          <ArrowLeft size={24} color="#2E2E30" />
        </View>
        <Text className="page-title">内容管理</Text>
        <View className="header-action" onClick={() => { /* TODO: implement create */ }}>
          <Plus size={24} color="#F85659" />
        </View>
      </View>

      {/* Tab切换 */}
      <View className="tab-bar">
        <View 
          className={`tab-item ${activeTab === 'banner' ? 'active' : ''}`}
          onClick={() => setActiveTab('banner')}
        >
          <Image size={18} color={activeTab === 'banner' ? '#F85659' : '#999'} />
          <Text className="tab-text">轮播图</Text>
        </View>
        <View 
          className={`tab-item ${activeTab === 'announcement' ? 'active' : ''}`}
          onClick={() => setActiveTab('announcement')}
        >
          <Bell size={18} color={activeTab === 'announcement' ? '#F85659' : '#999'} />
          <Text className="tab-text">公告</Text>
        </View>
        <View 
          className={`tab-item ${activeTab === 'service' ? 'active' : ''}`}
          onClick={() => setActiveTab('service')}
        >
          <FileText size={18} color={activeTab === 'service' ? '#F85659' : '#999'} />
          <Text className="tab-text">服务内容</Text>
        </View>
      </View>

      {/* 内容区域 */}
      {activeTab === 'banner' && renderBannerList()}
      {activeTab === 'announcement' && renderAnnouncementList()}
      {activeTab === 'service' && renderServiceList()}
    </View>
  )
}

export default ContentManagePage
