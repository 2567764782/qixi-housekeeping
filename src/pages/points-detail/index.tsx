import Taro from '@tarojs/taro'
import { View, Text, ScrollView } from '@tarojs/components'
import { useState, useEffect } from 'react'
import { ArrowUp, Star, Clock, Gift, Users, ChevronLeft } from 'lucide-react-taro'
import { Network } from '@/network'
import './index.css'

interface PointsRecord {
  id: string
  type: 'earn' | 'consume'
  points: number
  balance: number
  desc: string
  source: string
  created_at: string
}

const PointsDetailPage = () => {
  const [records, setRecords] = useState<PointsRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [hasMore, setHasMore] = useState(true)
  const [page, setPage] = useState(1)
  const [stats, setStats] = useState({
    total_earn: 0,
    total_consume: 0,
    balance: 0
  })

  // 筛选条件
  const [activeTab, setActiveTab] = useState<'all' | 'earn' | 'consume'>('all')

  useEffect(() => {
    loadRecords()
  }, [activeTab])

  const loadRecords = async (isLoadMore = false) => {
    if (!isLoadMore) {
      setLoading(true)
    }

    try {
      const res = await Network.request({
        url: '/api/points/records',
        method: 'GET',
        data: {
          page: isLoadMore ? page + 1 : 1,
          type: activeTab === 'all' ? '' : activeTab,
          limit: 20
        }
      })

      if (res.statusCode === 200 && res.data?.data) {
        const newRecords = res.data.data.records || []
        const newStats = res.data.data.stats || stats
        
        if (isLoadMore) {
          setRecords([...records, ...newRecords])
          setPage(page + 1)
        } else {
          setRecords(newRecords)
          setStats(newStats)
        }
        
        setHasMore(newRecords.length >= 20)
      }
    } catch (error) {
      console.error('加载积分明细失败:', error)
      // 模拟数据
      const mockRecords: PointsRecord[] = [
        {
          id: '1',
          type: 'earn',
          points: 50,
          balance: 1580,
          desc: '完成日常保洁订单',
          source: '订单奖励',
          created_at: '2024-01-15 10:30:00'
        },
        {
          id: '2',
          type: 'earn',
          points: 100,
          balance: 1530,
          desc: '新用户注册奖励',
          source: '注册奖励',
          created_at: '2024-01-14 09:15:00'
        },
        {
          id: '3',
          type: 'earn',
          points: 30,
          balance: 1430,
          desc: '邀请好友注册',
          source: '邀请奖励',
          created_at: '2024-01-13 16:45:00'
        },
        {
          id: '4',
          type: 'earn',
          points: 5,
          balance: 1400,
          desc: '每日签到',
          source: '签到奖励',
          created_at: '2024-01-13 08:00:00'
        },
        {
          id: '5',
          type: 'consume',
          points: -500,
          balance: 1395,
          desc: '兑换10元优惠券',
          source: '积分兑换',
          created_at: '2024-01-12 14:20:00'
        },
        {
          id: '6',
          type: 'earn',
          points: 80,
          balance: 1895,
          desc: '完成深度保洁订单',
          source: '订单奖励',
          created_at: '2024-01-11 15:30:00'
        },
        {
          id: '7',
          type: 'earn',
          points: 20,
          balance: 1815,
          desc: '完成家电清洗订单',
          source: '订单奖励',
          created_at: '2024-01-10 11:00:00'
        },
        {
          id: '8',
          type: 'consume',
          points: -900,
          balance: 1795,
          desc: '兑换20元优惠券',
          source: '积分兑换',
          created_at: '2024-01-09 10:15:00'
        },
        {
          id: '9',
          type: 'earn',
          points: 100,
          balance: 2695,
          desc: '邀请好友首单奖励',
          source: '邀请奖励',
          created_at: '2024-01-08 09:30:00'
        },
        {
          id: '10',
          type: 'earn',
          points: 5,
          balance: 2595,
          desc: '每日签到',
          source: '签到奖励',
          created_at: '2024-01-08 08:00:00'
        }
      ]

      const filteredRecords = activeTab === 'all' 
        ? mockRecords 
        : mockRecords.filter(r => r.type === activeTab)

      setRecords(filteredRecords)
      setStats({
        total_earn: 1680,
        total_consume: 1400,
        balance: 1580
      })
      setHasMore(false)
    } finally {
      setLoading(false)
    }
  }

  // 下拉刷新
  const handleRefresh = async () => {
    setPage(1)
    await loadRecords()
    Taro.stopPullDownRefresh()
  }

  // 加载更多
  const handleLoadMore = () => {
    if (hasMore && !loading) {
      loadRecords(true)
    }
  }

  // 格式化日期
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const time = dateStr.split(' ')[1] || '00:00'
    return `${month}-${day} ${time}`
  }

  // 获取图标
  const getTypeIcon = (type: string, source: string) => {
    if (type === 'earn') {
      if (source.includes('订单')) {
        return <Star size={16} color="#F59E0B" />
      } else if (source.includes('签到')) {
        return <Clock size={16} color="#10B981" />
      } else if (source.includes('邀请')) {
        return <Users size={16} color="#007CFF" />
      }
      return <ArrowUp size={16} color="#10B981" />
    }
    return <Gift size={16} color="#F85659" />
  }

  // 获取来源标签样式
  const getSourceStyle = (source: string) => {
    if (source.includes('订单')) {
      return 'bg-yellow-50 text-yellow-700'
    } else if (source.includes('签到')) {
      return 'bg-green-50 text-green-700'
    } else if (source.includes('邀请')) {
      return 'bg-blue-50 text-blue-700'
    } else if (source.includes('兑换')) {
      return 'bg-red-50 text-red-700'
    }
    return 'bg-gray-50 text-gray-700'
  }

  return (
    <View className="min-h-screen bg-gray-50">
      {/* 顶部统计卡片 */}
      <View className="bg-gradient-to-br from-yellow-500 to-orange-400 px-4 pt-4 pb-6">
        <View className="flex flex-row justify-between items-center mb-4">
          <View className="flex flex-row items-center">
            <Star size={20} color="#fff" />
            <Text className="text-lg font-bold text-white ml-2">积分明细</Text>
          </View>
          <View 
            className="flex flex-row items-center"
            onClick={() => Taro.navigateBack()}
          >
            <ChevronLeft size={20} color="#fff" />
            <Text className="text-sm text-white">返回</Text>
          </View>
        </View>

        {/* 统计数据 */}
        <View className="flex flex-row justify-around">
          <View className="flex flex-col items-center">
            <Text className="text-2xl font-bold text-white">{stats.balance}</Text>
            <Text className="text-xs text-white opacity-80 mt-1">当前积分</Text>
          </View>
          <View className="w-px h-10 bg-white opacity-20" />
          <View className="flex flex-col items-center">
            <Text className="text-2xl font-bold text-white">+{stats.total_earn}</Text>
            <Text className="text-xs text-white opacity-80 mt-1">累计获得</Text>
          </View>
          <View className="w-px h-10 bg-white opacity-20" />
          <View className="flex flex-col items-center">
            <Text className="text-2xl font-bold text-white">-{stats.total_consume}</Text>
            <Text className="text-xs text-white opacity-80 mt-1">累计消费</Text>
          </View>
        </View>
      </View>

      {/* 筛选标签 */}
      <View className="bg-white px-4 py-3 flex flex-row border-b border-gray-100">
        {[
          { key: 'all', name: '全部' },
          { key: 'earn', name: '获得' },
          { key: 'consume', name: '消费' }
        ].map(tab => (
          <View
            key={tab.key}
            className={`mr-4 px-4 py-1.5 rounded-full ${
              activeTab === tab.key 
                ? 'bg-yellow-500' 
                : 'bg-gray-100'
            }`}
            onClick={() => setActiveTab(tab.key as any)}
          >
            <Text className={`text-sm ${
              activeTab === tab.key ? 'text-white' : 'text-gray-600'
            }`}
            >
              {tab.name}
            </Text>
          </View>
        ))}
      </View>

      {/* 明细列表 */}
      <ScrollView 
        scrollY 
        className="points-detail-scroll"
        onScrollToLower={handleLoadMore}
        refresherEnabled
        refresherTriggered={loading}
        onRefresherRefresh={handleRefresh}
      >
        {records.length > 0 ? (
          <View className="px-4 py-3">
            {records.map(record => (
              <View
                key={record.id}
                className="bg-white rounded-xl mb-3 p-4 shadow-sm"
              >
                <View className="flex flex-row items-start">
                  {/* 图标 */}
                  <View className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${
                    record.type === 'earn' ? 'bg-green-50' : 'bg-red-50'
                  }`}
                  >
                    {getTypeIcon(record.type, record.source)}
                  </View>

                  {/* 内容 */}
                  <View className="flex-1">
                    <View className="flex flex-row items-center justify-between mb-1">
                      <Text className="text-base font-medium text-gray-900">{record.desc}</Text>
                      <Text className={`text-lg font-bold ${
                        record.type === 'earn' ? 'text-green-500' : 'text-red-500'
                      }`}
                      >
                        {record.type === 'earn' ? '+' : ''}{record.points}
                      </Text>
                    </View>
                    
                    <View className="flex flex-row items-center justify-between">
                      <View className="flex flex-row items-center">
                        <View className={`px-2 py-0.5 rounded text-xs ${getSourceStyle(record.source)}`}>
                          {record.source}
                        </View>
                      </View>
                      <View className="flex flex-row items-center">
                        <Clock size={12} color="#999" />
                        <Text className="text-xs text-gray-400 ml-1">
                          {formatDate(record.created_at)}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>

                {/* 余额变化 */}
                <View className="flex flex-row items-center justify-end mt-2 pt-2 border-t border-gray-50">
                  <Text className="text-xs text-gray-400">余额变动后：</Text>
                  <Text className="text-sm font-medium text-gray-700 ml-1">{record.balance} 积分</Text>
                </View>
              </View>
            ))}

            {/* 加载更多 */}
            {hasMore && (
              <View className="flex flex-row items-center justify-center py-4">
                <Text className="text-sm text-gray-400">加载更多...</Text>
              </View>
            )}

            {!hasMore && records.length > 0 && (
              <View className="flex flex-row items-center justify-center py-4">
                <Text className="text-sm text-gray-400">没有更多了</Text>
              </View>
            )}
          </View>
        ) : (
          <View className="flex flex-col items-center justify-center py-20">
            <View className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <Clock size={32} color="#ddd" />
            </View>
            <Text className="text-sm text-gray-400">暂无积分记录</Text>
          </View>
        )}
      </ScrollView>
    </View>
  )
}

export default PointsDetailPage
