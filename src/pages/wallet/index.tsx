import Taro from '@tarojs/taro'
import { View, Text, ScrollView } from '@tarojs/components'
import { useState, useEffect } from 'react'
import { Wallet, ChevronRight, Clock, ArrowUp, ArrowDown } from 'lucide-react-taro'
import { Network } from '@/network'
import './index.css'

interface Transaction {
  id: string
  type: 'recharge' | 'consume' | 'refund'
  amount: number
  balance: number
  desc: string
  created_at: string
}

const WalletPage = () => {
  const [balance, setBalance] = useState(0)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  // const [loading, setLoading] = useState(true) // TODO: 后端接口完成后启用

  // 充值金额选项
  const rechargeOptions = [
    { amount: 100, bonus: 0 },
    { amount: 200, bonus: 10 },
    { amount: 500, bonus: 50 },
    { amount: 1000, bonus: 150 }
  ]

  useEffect(() => {
    loadWalletData()
  }, [])

  const loadWalletData = async () => {
    try {
      const res = await Network.request({
        url: '/api/wallet',
        method: 'GET'
      })

      if (res.statusCode === 200 && res.data?.data) {
        setBalance(res.data.data.balance || 0)
        setTransactions(res.data.data.transactions || [])
      }
    } catch (error) {
      console.error('加载钱包数据失败:', error)
      // 模拟数据
      setBalance(258.50)
      setTransactions([
        {
          id: '1',
          type: 'recharge',
          amount: 200,
          balance: 258.50,
          desc: '余额充值',
          created_at: '2024-01-15 10:30:00'
        },
        {
          id: '2',
          type: 'consume',
          amount: -50,
          balance: 58.50,
          desc: '日常保洁服务',
          created_at: '2024-01-14 14:20:00'
        },
        {
          id: '3',
          type: 'refund',
          amount: 100,
          balance: 108.50,
          desc: '订单取消退款',
          created_at: '2024-01-10 09:15:00'
        }
      ])
    } finally {
      // setLoading(false)
    }
  }

  const handleRecharge = (amount: number, bonus: number) => {
    Taro.showModal({
      title: '确认充值',
      content: `充值${amount}元${bonus > 0 ? `，赠送${bonus}元` : ''}`,
      success: (res) => {
        if (res.confirm) {
          // 调用支付
          Taro.showToast({ title: '功能开发中', icon: 'none' })
          // TODO: 调用微信支付
        }
      }
    })
  }

  const getTypeIcon = (type: string) => {
    if (type === 'recharge' || type === 'refund') {
      return <ArrowDown size={16} color="#10B981" />
    }
    return <ArrowUp size={16} color="#F85659" />
  }

  return (
    <View className="min-h-screen bg-gray-50">
      <ScrollView scrollY className="wallet-scroll-wrapper">
        {/* 钱包卡片 */}
        <View className="bg-gradient-to-br from-red-500 to-orange-400 mx-4 mt-4 rounded-2xl p-6 relative overflow-hidden">
          <View className="absolute top-0 right-0 opacity-10">
            <Wallet size={100} color="#fff" />
          </View>
          
          <Text className="block text-sm text-white opacity-80 mb-2">账户余额(元)</Text>
          <Text className="text-4xl font-bold text-white mb-4">{balance.toFixed(2)}</Text>
          
          <View className="flex flex-row items-center">
            <Clock size={14} color="#fff" />
            <Text className="text-xs text-white opacity-60 ml-1">余额可用于支付服务费用</Text>
          </View>
        </View>

        {/* 充值选项 */}
        <View className="bg-white mx-4 mt-4 rounded-xl shadow-sm">
          <View className="p-4 border-b border-gray-100">
            <Text className="text-base font-semibold text-gray-900">快速充值</Text>
          </View>
          <View className="grid grid-cols-2 gap-3 p-4">
            {rechargeOptions.map(option => (
              <View
                key={option.amount}
                className="border border-gray-200 rounded-xl p-4 text-center relative overflow-hidden"
                onClick={() => handleRecharge(option.amount, option.bonus)}
              >
                {option.bonus > 0 && (
                  <View className="absolute top-0 right-0 bg-red-500 px-2 py-0.5 rounded-bl">
                    <Text className="text-xs text-white">送{option.bonus}元</Text>
                  </View>
                )}
                <Text className="text-2xl font-bold text-gray-900">{option.amount}</Text>
                <Text className="text-xs text-gray-500">元</Text>
              </View>
            ))}
          </View>
        </View>

        {/* 交易记录 */}
        <View className="bg-white mx-4 mt-4 mb-6 rounded-xl shadow-sm">
          <View className="p-4 border-b border-gray-100">
            <Text className="text-base font-semibold text-gray-900">交易记录</Text>
          </View>
          {transactions.length > 0 ? (
            transactions.map(item => (
              <View key={item.id} className="flex flex-row items-center px-4 py-3 border-b border-gray-50">
                <View className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mr-3">
                  {getTypeIcon(item.type)}
                </View>
                <View className="flex-1">
                  <Text className="block text-sm text-gray-900">{item.desc}</Text>
                  <Text className="block text-xs text-gray-400 mt-1">{item.created_at}</Text>
                </View>
                <Text className={`text-base font-semibold ${item.amount > 0 ? 'text-green-500' : 'text-gray-900'}`}>
                  {item.amount > 0 ? '+' : ''}{item.amount.toFixed(2)}
                </Text>
              </View>
            ))
          ) : (
            <View className="flex flex-col items-center py-8">
              <Clock size={32} color="#ddd" />
              <Text className="text-sm text-gray-400 mt-2">暂无交易记录</Text>
            </View>
          )}
          
          {/* 查看更多 */}
          <View
            className="flex flex-row items-center justify-center py-3 border-t border-gray-50"
            onClick={() => Taro.showToast({ title: '功能开发中', icon: 'none' })}
          >
            <Text className="text-sm text-gray-500">查看全部记录</Text>
            <ChevronRight size={16} color="#ccc" />
          </View>
        </View>
      </ScrollView>
    </View>
  )
}

export default WalletPage
