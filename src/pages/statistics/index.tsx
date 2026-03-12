import { useLoad } from '@tarojs/taro'
import { View, Text, ScrollView } from '@tarojs/components'
import { useState } from 'react'
import { Network } from '@/network'
import { Activity, Users, DollarSign, Calendar, RefreshCw, Award } from 'lucide-react-taro'
import './index.css'

interface DashboardStats {
  totalOrders: number
  totalRevenue: number
  activeCleaners: number
  todayOrders: number
}

interface OrderStats {
  pending: number
  confirmed: number
  inProgress: number
  completed: number
  cancelled: number
  total: number
}

interface CleanerStats {
  cleaner: {
    id: number
    name: string
    rating: number
    completed_orders: number
  }
  stats: {
    totalOrders: number
    completedOrders: number
    inProgressOrders: number
    cancelledOrders: number
    acceptanceRate: number
    completionRate: number
    avgResponseTime: number
    avgServiceDuration: number
  }
  totalScore: number
  rank: number
}

interface RevenueStats {
  totalRevenue: number
  dailyRevenue: Record<string, number>
  cleanerRevenue: Record<number, number>
  totalOrders: number
  avgOrderValue: number
}

const StatisticsPage = () => {
  useLoad(() => {
    loadDashboardData()
  })

  const [activeTab, setActiveTab] = useState<'dashboard' | 'orders' | 'cleaners' | 'revenue'>('dashboard')
  const [loading, setLoading] = useState(false)

  // 仪表板数据
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null)
  // 订单统计
  const [orderStats, setOrderStats] = useState<OrderStats | null>(null)
  // 保洁员排名
  const [cleanerRankings, setCleanerRankings] = useState<CleanerStats[]>([])
  // 收入统计
  const [revenueStats, setRevenueStats] = useState<RevenueStats | null>(null)

  // 加载仪表板数据
  const loadDashboardData = async () => {
    try {
      setLoading(true)
      const res = await Network.request({
        url: '/api/statistics/dashboard',
        method: 'GET'
      })
      setDashboardStats(res.data || null)
    } catch (error) {
      console.error('Failed to load dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  // 加载订单统计
  const loadOrderStats = async () => {
    try {
      setLoading(true)
      const res = await Network.request({
        url: '/api/statistics/orders',
        method: 'GET'
      })
      setOrderStats(res.data || null)
    } catch (error) {
      console.error('Failed to load order stats:', error)
    } finally {
      setLoading(false)
    }
  }

  // 加载保洁员排名
  const loadCleanerRankings = async () => {
    try {
      setLoading(true)
      const res = await Network.request({
        url: '/api/statistics/cleaners/rankings',
        method: 'GET'
      })
      setCleanerRankings(res.data || [])
    } catch (error) {
      console.error('Failed to load cleaner rankings:', error)
    } finally {
      setLoading(false)
    }
  }

  // 加载收入统计
  const loadRevenueStats = async () => {
    try {
      setLoading(true)
      const res = await Network.request({
        url: '/api/statistics/revenue',
        method: 'GET'
      })
      setRevenueStats(res.data || null)
    } catch (error) {
      console.error('Failed to load revenue stats:', error)
    } finally {
      setLoading(false)
    }
  }

  // 切换标签页
  const handleTabChange = (tab: 'dashboard' | 'orders' | 'cleaners' | 'revenue') => {
    setActiveTab(tab)
    switch (tab) {
      case 'dashboard':
        loadDashboardData()
        break
      case 'orders':
        loadOrderStats()
        break
      case 'cleaners':
        loadCleanerRankings()
        break
      case 'revenue':
        loadRevenueStats()
        break
    }
  }

  // 渲染标签栏
  const renderTabs = () => {
    const tabs = [
      { key: 'dashboard', label: '仪表板', icon: <Activity size={16} /> },
      { key: 'orders', label: '订单统计', icon: <Activity size={16} /> },
      { key: 'cleaners', label: '保洁员排名', icon: <Users size={16} /> },
      { key: 'revenue', label: '收入统计', icon: <DollarSign size={16} /> }
    ]

    return (
      <View className="bg-white px-4 py-4 border-b border-gray-100">
        <View className="flex flex-row gap-2">
          {tabs.map(tab => (
            <View
              key={tab.key}
              className={`flex-1 rounded-2xl py-3 px-4 flex flex-row items-center justify-center gap-2 border ${
                activeTab === tab.key
                  ? 'bg-emerald-600 border-emerald-600'
                  : 'bg-white border-gray-200'
              }`}
              onClick={() => handleTabChange(tab.key as any)}
            >
              <View style={{ color: activeTab === tab.key ? '#fff' : '#6B7280' }}>
                {tab.icon}
              </View>
              <Text
                className="text-sm font-bold"
                style={{ color: activeTab === tab.key ? '#fff' : '#6B7280' }}
              >
                {tab.label}
              </Text>
            </View>
          ))}
        </View>
      </View>
    )
  }

  // 渲染仪表板
  const renderDashboard = () => {
    if (!dashboardStats) {
      return (
        <View className="flex flex-col items-center justify-center py-16">
          <Text className="block text-sm text-gray-500">暂无数据</Text>
        </View>
      )
    }

    return (
      <View className="space-y-4 p-4">
        {/* 核心指标卡片 */}
        <View className="grid grid-cols-2 gap-4">
          <View className="bg-emerald-50 rounded-2xl p-4">
            <View className="flex flex-row items-center mb-2">
              <Activity size={20} color="#10B981" className="mr-2" />
              <Text className="block text-xs text-gray-600">总订单数</Text>
            </View>
            <Text className="block text-2xl font-bold text-emerald-600">
              {dashboardStats.totalOrders}
            </Text>
          </View>
          <View className="bg-blue-50 rounded-2xl p-4">
            <View className="flex flex-row items-center mb-2">
              <DollarSign size={20} color="#3B82F6" className="mr-2" />
              <Text className="block text-xs text-gray-600">总收入</Text>
            </View>
            <Text className="block text-2xl font-bold text-blue-600">
              ¥{dashboardStats.totalRevenue}
            </Text>
          </View>
          <View className="bg-purple-50 rounded-2xl p-4">
            <View className="flex flex-row items-center mb-2">
              <Users size={20} color="#8B5CF6" className="mr-2" />
              <Text className="block text-xs text-gray-600">活跃保洁员</Text>
            </View>
            <Text className="block text-2xl font-bold text-purple-600">
              {dashboardStats.activeCleaners}
            </Text>
          </View>
          <View className="bg-amber-50 rounded-2xl p-4">
            <View className="flex flex-row items-center mb-2">
              <Calendar size={20} color="#F59E0B" className="mr-2" />
              <Text className="block text-xs text-gray-600">今日订单</Text>
            </View>
            <Text className="block text-2xl font-bold text-amber-600">
              {dashboardStats.todayOrders}
            </Text>
          </View>
        </View>
      </View>
    )
  }

  // 渲染订单统计
  const renderOrderStats = () => {
    if (!orderStats) {
      return (
        <View className="flex flex-col items-center justify-center py-16">
          <Text className="block text-sm text-gray-500">暂无数据</Text>
        </View>
      )
    }

    const statusMap = [
      { key: 'pending', label: '待确认', color: 'bg-amber-500', textColor: 'text-amber-600' },
      { key: 'confirmed', label: '已确认', color: 'bg-blue-500', textColor: 'text-blue-600' },
      { key: 'inProgress', label: '进行中', color: 'bg-purple-500', textColor: 'text-purple-600' },
      { key: 'completed', label: '已完成', color: 'bg-emerald-500', textColor: 'text-emerald-600' },
      { key: 'cancelled', label: '已取消', color: 'bg-gray-500', textColor: 'text-gray-600' }
    ]

    return (
      <View className="space-y-4 p-4">
        {/* 状态卡片 */}
        <View className="grid grid-cols-2 gap-4">
          {statusMap.map(status => (
            <View key={status.key} className="bg-white rounded-2xl p-4 border border-gray-100">
              <View className="flex flex-row items-center justify-between mb-2">
                <Text className="block text-xs text-gray-600">{status.label}</Text>
                <View className={`w-3 h-3 rounded-full ${status.color}`} />
              </View>
              <Text className={`block text-2xl font-bold ${status.textColor}`}>
                {orderStats[status.key as keyof OrderStats] as number}
              </Text>
            </View>
          ))}
        </View>

        {/* 总计 */}
        <View className="bg-white rounded-2xl p-6 border border-gray-100">
          <Text className="block text-sm text-gray-600 mb-2">总订单数</Text>
          <Text className="block text-4xl font-bold text-gray-800">{orderStats.total}</Text>
        </View>
      </View>
    )
  }

  // 渲染保洁员排名
  const renderCleanerRankings = () => {
    if (cleanerRankings.length === 0) {
      return (
        <View className="flex flex-col items-center justify-center py-16">
          <Text className="block text-sm text-gray-500">暂无数据</Text>
        </View>
      )
    }

    const getRankColor = (rank: number) => {
      if (rank === 1) return '#FFD700' // 金色
      if (rank === 2) return '#C0C0C0' // 银色
      if (rank === 3) return '#CD7F32' // 铜色
      return '#10B981'
    }

    return (
      <View className="space-y-4 p-4">
        {cleanerRankings.map(item => (
          <View
            key={item.cleaner.id}
            className="bg-white rounded-2xl p-5 border border-gray-100"
          >
            {/* 排名和基本信息 */}
            <View className="flex flex-row items-center mb-4">
              <View
                className="w-10 h-10 rounded-full flex items-center justify-center mr-3"
                style={{ backgroundColor: getRankColor(item.rank) }}
              >
                <Award size={18} color="#fff" />
              </View>
              <View className="flex-1">
                <Text className="block text-lg font-bold text-gray-800">
                  #{item.rank} {item.cleaner.name}
                </Text>
                <Text className="block text-xs text-gray-500 mt-1">
                  评分: {item.cleaner.rating.toFixed(1)} | 已完成: {item.cleaner.completed_orders}
                </Text>
              </View>
              <View className="bg-emerald-50 px-4 py-2 rounded-xl">
                <Text className="block text-xl font-bold text-emerald-600">
                  {item.totalScore.toFixed(1)}
                </Text>
                <Text className="block text-xs text-gray-500">综合得分</Text>
              </View>
            </View>

            {/* 详细统计 */}
            <View className="grid grid-cols-4 gap-2">
              <View className="bg-gray-50 rounded-xl p-3">
                <Text className="block text-xl font-bold text-gray-800">
                  {item.stats.totalOrders}
                </Text>
                <Text className="block text-xs text-gray-500">总订单</Text>
              </View>
              <View className="bg-emerald-50 rounded-xl p-3">
                <Text className="block text-xl font-bold text-emerald-600">
                  {item.stats.completedOrders}
                </Text>
                <Text className="block text-xs text-gray-500">已完成</Text>
              </View>
              <View className="bg-blue-50 rounded-xl p-3">
                <Text className="block text-xl font-bold text-blue-600">
                  {(item.stats.acceptanceRate * 100).toFixed(0)}%
                </Text>
                <Text className="block text-xs text-gray-500">接单率</Text>
              </View>
              <View className="bg-purple-50 rounded-xl p-3">
                <Text className="block text-xl font-bold text-purple-600">
                  {(item.stats.completionRate * 100).toFixed(0)}%
                </Text>
                <Text className="block text-xs text-gray-500">完成率</Text>
              </View>
            </View>
          </View>
        ))}
      </View>
    )
  }

  // 渲染收入统计
  const renderRevenueStats = () => {
    if (!revenueStats) {
      return (
        <View className="flex flex-col items-center justify-center py-16">
          <Text className="block text-sm text-gray-500">暂无数据</Text>
        </View>
      )
    }

    const dailyEntries = Object.entries(revenueStats.dailyRevenue).sort((a, b) => a[0].localeCompare(b[0]))

    return (
      <View className="space-y-4 p-4">
        {/* 核心指标 */}
        <View className="grid grid-cols-2 gap-4">
          <View className="bg-emerald-50 rounded-2xl p-4">
            <Text className="block text-xs text-gray-600 mb-2">总收入</Text>
            <Text className="block text-2xl font-bold text-emerald-600">
              ¥{revenueStats.totalRevenue}
            </Text>
          </View>
          <View className="bg-blue-50 rounded-2xl p-4">
            <Text className="block text-xs text-gray-600 mb-2">平均订单金额</Text>
            <Text className="block text-2xl font-bold text-blue-600">
              ¥{revenueStats.avgOrderValue.toFixed(2)}
            </Text>
          </View>
        </View>

        {/* 每日收入趋势 */}
        <View className="bg-white rounded-2xl p-5 border border-gray-100">
          <Text className="block text-base font-bold text-gray-800 mb-4">每日收入趋势</Text>
          {dailyEntries.length === 0 ? (
            <Text className="block text-sm text-gray-500">暂无数据</Text>
          ) : (
            <View className="space-y-3">
              {dailyEntries.slice(-7).map(([date, revenue]) => (
                <View key={date} className="flex flex-row items-center">
                  <Text className="block text-xs text-gray-600 w-24">{date}</Text>
                  <View className="flex-1 mx-3 bg-gray-100 rounded-full h-4 overflow-hidden">
                    <View
                      className="h-full bg-emerald-500 rounded-full"
                      style={{
                        width: `${Math.min((revenue / Math.max(...Object.values(revenueStats.dailyRevenue))) * 100, 100)}%`
                      }}
                    />
                  </View>
                  <Text className="block text-xs font-bold text-gray-800 w-20 text-right">
                    ¥{revenue}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* 总订单数 */}
        <View className="bg-white rounded-2xl p-5 border border-gray-100">
          <Text className="block text-sm text-gray-600 mb-2">总订单数</Text>
          <Text className="block text-4xl font-bold text-gray-800">{revenueStats.totalOrders}</Text>
        </View>
      </View>
    )
  }

  return (
    <View className="flex flex-col h-full bg-gray-50">
      {/* 标题栏 */}
      <View className="bg-white px-6 py-6 border-b border-gray-100">
        <Text className="block text-2xl font-bold text-gray-800 mb-1">数据统计</Text>
        <Text className="block text-sm text-gray-500">查看业务数据和绩效分析</Text>
      </View>

      {renderTabs()}

      <ScrollView className="flex-1" scrollY>
        {loading ? (
          <View className="flex flex-col items-center justify-center py-16">
            <Text className="block text-sm text-gray-500">加载中...</Text>
          </View>
        ) : (
          <>
            {activeTab === 'dashboard' && renderDashboard()}
            {activeTab === 'orders' && renderOrderStats()}
            {activeTab === 'cleaners' && renderCleanerRankings()}
            {activeTab === 'revenue' && renderRevenueStats()}
          </>
        )}
      </ScrollView>

      {/* 刷新按钮 */}
      <View
        style={{
          position: 'fixed',
          bottom: 80,
          right: 20,
          zIndex: 100
        }}
      >
        <View
          className="w-14 h-14 bg-white rounded-full shadow-lg flex items-center justify-center border border-gray-100"
          style={{
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
          }}
          onClick={() => {
            if (activeTab === 'dashboard') loadDashboardData()
            if (activeTab === 'orders') loadOrderStats()
            if (activeTab === 'cleaners') loadCleanerRankings()
            if (activeTab === 'revenue') loadRevenueStats()
          }}
        >
          <RefreshCw size={24} color="#10B981" />
        </View>
      </View>
    </View>
  )
}

export default StatisticsPage
