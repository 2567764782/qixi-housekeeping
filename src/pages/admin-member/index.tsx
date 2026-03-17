import Taro, { useLoad } from '@tarojs/taro'
import { View, Text, ScrollView, Input } from '@tarojs/components'
import { useState } from 'react'
import { Network } from '@/network'
import { Users, Crown, Search, SlidersHorizontal, ChevronRight } from 'lucide-react-taro'
import './index.css'

interface Member {
  id: string
  user_id: string
  member_type: string
  start_time: string
  end_time: string
  status: string
  created_at: string
  users: {
    id: string
    nickname: string
    phone: string
    avatar_url: string
  }
}

const MemberManagePage = () => {
  const [members, setMembers] = useState<Member[]>([])
  const [searchKeyword, setSearchKeyword] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'expired'>('all')
  const [showFilter, setShowFilter] = useState(false)

  useLoad(() => {
    loadMembers()
  })

  const loadMembers = async () => {
    try {
      const res = await Network.request({
        url: '/api/admin/members',
        method: 'GET'
      })

      if (res.statusCode === 200 && res.data?.data) {
        setMembers(res.data.data)
      }
    } catch (error) {
      console.error('加载会员列表失败:', error)
      // 模拟数据
      setMembers([
        {
          id: '1',
          user_id: 'u1',
          member_type: 'yearly',
          start_time: '2024-01-01T00:00:00Z',
          end_time: '2024-12-31T23:59:59Z',
          status: 'active',
          created_at: '2024-01-01T00:00:00Z',
          users: {
            id: 'u1',
            nickname: '张三',
            phone: '138****1234',
            avatar_url: ''
          }
        },
        {
          id: '2',
          user_id: 'u2',
          member_type: 'monthly',
          start_time: '2024-06-01T00:00:00Z',
          end_time: '2024-06-30T23:59:59Z',
          status: 'active',
          created_at: '2024-06-01T00:00:00Z',
          users: {
            id: 'u2',
            nickname: '李四',
            phone: '139****5678',
            avatar_url: ''
          }
        },
        {
          id: '3',
          user_id: 'u3',
          member_type: 'quarterly',
          start_time: '2024-03-01T00:00:00Z',
          end_time: '2024-05-31T23:59:59Z',
          status: 'expired',
          created_at: '2024-03-01T00:00:00Z',
          users: {
            id: 'u3',
            nickname: '王五',
            phone: '137****9012',
            avatar_url: ''
          }
        }
      ])
    }
  }

  const handleStatusChange = async (memberId: string, newStatus: string) => {
    try {
      const res = await Network.request({
        url: `/api/admin/members/${memberId}/status`,
        method: 'PUT',
        data: { status: newStatus }
      })

      if (res.statusCode === 200) {
        Taro.showToast({ title: '状态更新成功', icon: 'success' })
        loadMembers()
      }
    } catch (error) {
      Taro.showToast({ title: '操作失败', icon: 'none' })
    }
  }

  const getMemberTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      monthly: '月卡会员',
      quarterly: '季卡会员',
      yearly: '年卡会员'
    }
    return types[type] || type
  }

  const getStatusLabel = (status: string) => {
    const statuses: Record<string, string> = {
      active: '生效中',
      expired: '已过期',
      cancelled: '已取消'
    }
    return statuses[status] || status
  }

  const filteredMembers = members.filter(m => {
    const matchKeyword = 
      m.users?.nickname?.includes(searchKeyword) ||
      m.users?.phone?.includes(searchKeyword)
    const matchStatus = filterStatus === 'all' || m.status === filterStatus
    return matchKeyword && matchStatus
  })

  // 统计数据
  const stats = {
    total: members.length,
    active: members.filter(m => m.status === 'active').length,
    yearly: members.filter(m => m.member_type === 'yearly').length,
    monthly: members.filter(m => m.member_type === 'monthly').length
  }

  return (
    <View className="page-container">
      {/* 头部 */}
      <View className="page-header">
        <Text className="page-title">会员管理</Text>
        <View className="header-action" onClick={() => setShowFilter(!showFilter)}>
          <SlidersHorizontal size={24} color="#F85659" />
        </View>
      </View>

      {/* 搜索栏 */}
      <View className="search-bar">
        <View className="search-input-wrap">
          <Search size={18} color="#999" />
          <Input
            className="search-input"
            placeholder="搜索会员名称/手机号"
            value={searchKeyword}
            onInput={e => setSearchKeyword(e.detail.value)}
          />
        </View>
      </View>

      {/* 统计卡片 */}
      <View className="stats-container">
        <View className="stats-card">
          <View className="stats-icon">
            <Users size={24} color="#F85659" />
          </View>
          <View className="stats-info">
            <Text className="stats-value">{stats.total}</Text>
            <Text className="stats-label">总会员数</Text>
          </View>
        </View>
        <View className="stats-card">
          <View className="stats-icon active">
            <Crown size={24} color="#10B981" />
          </View>
          <View className="stats-info">
            <Text className="stats-value success">{stats.active}</Text>
            <Text className="stats-label">生效中</Text>
          </View>
        </View>
      </View>

      {/* 筛选条件 */}
      {showFilter && (
        <View className="filter-bar">
          <View 
            className={`filter-item ${filterStatus === 'all' ? 'active' : ''}`}
            onClick={() => setFilterStatus('all')}
          >
            <Text className="filter-text">全部</Text>
          </View>
          <View 
            className={`filter-item ${filterStatus === 'active' ? 'active' : ''}`}
            onClick={() => setFilterStatus('active')}
          >
            <Text className="filter-text">生效中</Text>
          </View>
          <View 
            className={`filter-item ${filterStatus === 'expired' ? 'active' : ''}`}
            onClick={() => setFilterStatus('expired')}
          >
            <Text className="filter-text">已过期</Text>
          </View>
        </View>
      )}

      {/* 列表 */}
      <ScrollView scrollY className="list-container">
        {filteredMembers.map(member => (
          <View key={member.id} className="member-card">
            <View className="member-header">
              <View className="member-avatar">
                <Text className="avatar-text">
                  {(member.users?.nickname || '未')[0]}
                </Text>
              </View>
              <View className="member-info">
                <View className="member-name-row">
                  <Text className="member-name">{member.users?.nickname || '未知用户'}</Text>
                  <View className={`member-badge ${member.status}`}>
                    <Text className="member-badge-text">{getStatusLabel(member.status)}</Text>
                  </View>
                </View>
                <Text className="member-phone">{member.users?.phone || '未绑定手机'}</Text>
              </View>
              <ChevronRight size={20} color="#ccc" />
            </View>

            <View className="member-details">
              <View className="detail-row">
                <Text className="detail-label">会员类型</Text>
                <Text className="detail-value">{getMemberTypeLabel(member.member_type)}</Text>
              </View>
              <View className="detail-row">
                <Text className="detail-label">有效期</Text>
                <Text className="detail-value">
                  {member.start_time?.split('T')[0]} ~ {member.end_time?.split('T')[0]}
                </Text>
              </View>
            </View>

            <View className="member-actions">
              {member.status === 'active' && (
                <View 
                  className="action-btn danger"
                  onClick={() => handleStatusChange(member.id, 'cancelled')}
                >
                  <Text className="action-text">取消会员</Text>
                </View>
              )}
              {member.status === 'expired' && (
                <View 
                  className="action-btn primary"
                  onClick={() => handleStatusChange(member.id, 'active')}
                >
                  <Text className="action-text">续费激活</Text>
                </View>
              )}
              <View className="action-btn">
                <Text className="action-text">查看详情</Text>
              </View>
            </View>
          </View>
        ))}

        {filteredMembers.length === 0 && (
          <View className="empty-state">
            <Users size={48} color="#ddd" />
            <Text className="empty-text">暂无会员数据</Text>
          </View>
        )}
      </ScrollView>
    </View>
  )
}

export default MemberManagePage
