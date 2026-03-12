import { useLoad } from '@tarojs/taro'
import { View, Text, ScrollView, Input } from '@tarojs/components'
import { useState } from 'react'
import { Network } from '@/network'
import { CreditCard, Search, RefreshCw, Info, Circle } from 'lucide-react-taro'
import './index.css'

interface Payment {
  orderId: string
  description: string
  amount: number
  status: string
  transactionId?: string
  payTime?: string
}

const PaymentPage = () => {
  useLoad(() => {
    loadPaymentOrders()
  })

  const [activeTab, setActiveTab] = useState<'create' | 'query' | 'refund'>('create')
  const [loading, setLoading] = useState(false)

  // 创建支付订单
  const [createFormData, setCreateFormData] = useState({
    orderId: '',
    description: '',
    amount: '',
    openid: ''
  })

  // 查询支付订单
  const [queryOrderId, setQueryOrderId] = useState('')
  const [paymentInfo, setPaymentInfo] = useState<Payment | null>(null)

  // 申请退款
  const [refundFormData, setRefundFormData] = useState({
    orderId: '',
    transactionId: '',
    refundAmount: '',
    totalAmount: ''
  })

  // 加载支付订单列表（可以从本地存储或后端获取）
  const loadPaymentOrders = async () => {
    // 这里可以加载历史支付订单
  }

  // 创建支付订单
  const handleCreatePayment = async () => {
    if (!createFormData.orderId || !createFormData.amount) {
      alert('请填写订单ID和金额')
      return
    }

    try {
      setLoading(true)
      const res = await Network.request({
        url: '/api/payment/create',
        method: 'POST',
        data: {
          orderId: createFormData.orderId,
          description: createFormData.description || '服务支付',
          amount: parseFloat(createFormData.amount),
          openid: createFormData.openid || ''
        }
      })

      alert('支付订单创建成功！')
      console.log('Payment created:', res.data)

      // 清空表单
      setCreateFormData({
        orderId: '',
        description: '',
        amount: '',
        openid: ''
      })
    } catch (error) {
      console.error('Failed to create payment:', error)
      alert('创建支付订单失败')
    } finally {
      setLoading(false)
    }
  }

  // 查询支付订单
  const handleQueryPayment = async () => {
    if (!queryOrderId) {
      alert('请输入订单ID')
      return
    }

    try {
      setLoading(true)
      const res = await Network.request({
        url: `/api/payment/query?orderId=${queryOrderId}`,
        method: 'GET'
      })

      setPaymentInfo(res.data || null)
    } catch (error) {
      console.error('Failed to query payment:', error)
      alert('查询支付订单失败')
    } finally {
      setLoading(false)
    }
  }

  // 申请退款
  const handleCreateRefund = async () => {
    if (!refundFormData.orderId || !refundFormData.refundAmount) {
      alert('请填写订单ID和退款金额')
      return
    }

    try {
      setLoading(true)
      const res = await Network.request({
        url: '/api/payment/refund',
        method: 'POST',
        data: {
          orderId: refundFormData.orderId,
          transactionId: refundFormData.transactionId || '',
          refundAmount: parseFloat(refundFormData.refundAmount),
          totalAmount: parseFloat(refundFormData.totalAmount) || parseFloat(refundFormData.refundAmount)
        }
      })

      alert('退款申请成功！')
      console.log('Refund created:', res.data)

      // 清空表单
      setRefundFormData({
        orderId: '',
        transactionId: '',
        refundAmount: '',
        totalAmount: ''
      })
    } catch (error) {
      console.error('Failed to create refund:', error)
      alert('申请退款失败')
    } finally {
      setLoading(false)
    }
  }

  // 获取支付状态信息
  const getPaymentStatusInfo = (status: string) => {
    const statusMap: Record<
      string,
      { text: string; icon: React.ReactNode; color: string; bgColor: string }
    > = {
      pending: {
        text: '待支付',
        icon: <Circle size={16} color="#F59E0B" strokeWidth={2} />,
        color: '#F59E0B',
        bgColor: 'bg-amber-50'
      },
      paid: {
        text: '已支付',
        icon: <Circle size={16} color="#10B981" strokeWidth={3} />,
        color: '#10B981',
        bgColor: 'bg-emerald-50'
      },
      refunded: {
        text: '已退款',
        icon: <Info size={16} color="#3B82F6" />,
        color: '#3B82F6',
        bgColor: 'bg-blue-50'
      },
      failed: {
        text: '支付失败',
        icon: <Circle size={16} color="#EF4444" strokeWidth={2} />,
        color: '#EF4444',
        bgColor: 'bg-red-50'
      }
    }

    return (
      statusMap[status] || {
        text: status,
        icon: <Circle size={16} color="#9CA3AF" strokeWidth={2} />,
        color: '#9CA3AF',
        bgColor: 'bg-gray-50'
      }
    )
  }

  // 渲染标签栏
  const renderTabs = () => {
    const tabs = [
      { key: 'create', label: '创建支付', icon: <CreditCard size={16} /> },
      { key: 'query', label: '查询订单', icon: <Search size={16} /> },
      { key: 'refund', label: '申请退款', icon: <RefreshCw size={16} /> }
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
              onClick={() => setActiveTab(tab.key as any)}
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

  // 渲染创建支付表单
  const renderCreateForm = () => {
    return (
      <View className="space-y-4 p-4">
        <View className="bg-white rounded-2xl p-6 border border-gray-100">
          <View className="flex flex-row items-center mb-6">
            <CreditCard size={24} color="#10B981" className="mr-3" />
            <Text className="block text-xl font-bold text-gray-800">创建支付订单</Text>
          </View>

          {/* 订单ID */}
          <View className="mb-5">
            <Text className="block text-sm font-bold text-gray-800 mb-2">订单ID *</Text>
            <View className="bg-gray-50 rounded-xl px-4 py-3">
              <Input
                className="w-full bg-transparent"
                placeholder="请输入订单ID"
                value={createFormData.orderId}
                onInput={e => setCreateFormData({ ...createFormData, orderId: e.detail.value })}
              />
            </View>
          </View>

          {/* 描述 */}
          <View className="mb-5">
            <Text className="block text-sm font-bold text-gray-800 mb-2">订单描述</Text>
            <View className="bg-gray-50 rounded-xl px-4 py-3">
              <Input
                className="w-full bg-transparent"
                placeholder="请输入订单描述"
                value={createFormData.description}
                onInput={e => setCreateFormData({ ...createFormData, description: e.detail.value })}
              />
            </View>
          </View>

          {/* 金额 */}
          <View className="mb-5">
            <Text className="block text-sm font-bold text-gray-800 mb-2">支付金额 (元) *</Text>
            <View className="bg-gray-50 rounded-xl px-4 py-3">
              <Input
                className="w-full bg-transparent"
                type="number"
                placeholder="请输入金额"
                value={createFormData.amount}
                onInput={e => setCreateFormData({ ...createFormData, amount: e.detail.value })}
              />
            </View>
          </View>

          {/* OpenID */}
          <View className="mb-6">
            <Text className="block text-sm font-bold text-gray-800 mb-2">用户 OpenID</Text>
            <View className="bg-gray-50 rounded-xl px-4 py-3">
              <Input
                className="w-full bg-transparent"
                placeholder="请输入 OpenID"
                value={createFormData.openid}
                onInput={e => setCreateFormData({ ...createFormData, openid: e.detail.value })}
              />
            </View>
          </View>

          {/* 提交按钮 */}
          <View
            className="bg-gradient-to-r from-emerald-600 to-emerald-500 rounded-2xl py-4 px-6 text-center"
            style={{
              boxShadow: '0 4px 12px rgba(16, 185, 129, 0.25)'
            }}
            onClick={handleCreatePayment}
          >
            <Text className="block text-base font-bold text-white">
              {loading ? '处理中...' : '创建支付订单'}
            </Text>
          </View>
        </View>

        {/* 提示信息 */}
        <View className="bg-amber-50 rounded-2xl p-5 border border-amber-200">
          <View className="flex flex-row items-start">
            <Info size={20} color="#F59E0B" className="mr-3 flex-shrink-0 mt-0.5" />
            <View>
              <Text className="block text-sm font-bold text-amber-800 mb-1">温馨提示</Text>
              <Text className="block text-xs text-amber-700 leading-relaxed">
                创建支付订单后，用户将通过微信小程序完成支付。支付成功后，系统会自动更新订单状态。
              </Text>
            </View>
          </View>
        </View>
      </View>
    )
  }

  // 渲染查询支付表单
  const renderQueryForm = () => {
    return (
      <View className="space-y-4 p-4">
        <View className="bg-white rounded-2xl p-6 border border-gray-100">
          <View className="flex flex-row items-center mb-6">
            <Search size={24} color="#10B981" className="mr-3" />
            <Text className="block text-xl font-bold text-gray-800">查询支付订单</Text>
          </View>

          {/* 订单ID输入 */}
          <View className="mb-5">
            <Text className="block text-sm font-bold text-gray-800 mb-2">订单ID *</Text>
            <View className="bg-gray-50 rounded-xl px-4 py-3 flex flex-row items-center">
              <Input
                className="w-full bg-transparent flex-1"
                placeholder="请输入订单ID"
                value={queryOrderId}
                onInput={e => setQueryOrderId(e.detail.value)}
              />
              <View
                className="bg-emerald-600 px-4 py-2 rounded-xl ml-3"
                onClick={handleQueryPayment}
              >
                <Text className="block text-sm font-bold text-white">查询</Text>
              </View>
            </View>
          </View>

          {/* 支付信息展示 */}
          {paymentInfo && (
            <View className="mt-6 pt-6 border-t border-gray-100">
              <Text className="block text-base font-bold text-gray-800 mb-4">支付信息</Text>

              {/* 状态 */}
              <View className="flex flex-row items-center mb-4">
                <Text className="block text-sm text-gray-600 w-24">支付状态</Text>
                <View
                  className={`${getPaymentStatusInfo(paymentInfo.status).bgColor} px-3 py-1.5 rounded-xl flex flex-row items-center gap-2`}
                >
                  {getPaymentStatusInfo(paymentInfo.status).icon}
                  <Text
                    className="text-xs font-bold"
                    style={{ color: getPaymentStatusInfo(paymentInfo.status).color }}
                  >
                    {getPaymentStatusInfo(paymentInfo.status).text}
                  </Text>
                </View>
              </View>

              {/* 订单ID */}
              <View className="flex flex-row items-center mb-4">
                <Text className="block text-sm text-gray-600 w-24">订单ID</Text>
                <Text className="block text-sm font-bold text-gray-800">{paymentInfo.orderId}</Text>
              </View>

              {/* 描述 */}
              <View className="flex flex-row items-center mb-4">
                <Text className="block text-sm text-gray-600 w-24">订单描述</Text>
                <Text className="block text-sm text-gray-800">{paymentInfo.description}</Text>
              </View>

              {/* 金额 */}
              <View className="flex flex-row items-center mb-4">
                <Text className="block text-sm text-gray-600 w-24">支付金额</Text>
                <Text className="block text-lg font-bold text-emerald-600">
                  ¥{paymentInfo.amount}
                </Text>
              </View>

              {/* 交易ID */}
              {paymentInfo.transactionId && (
                <View className="flex flex-row items-center mb-4">
                  <Text className="block text-sm text-gray-600 w-24">交易ID</Text>
                  <Text className="block text-sm text-gray-800">{paymentInfo.transactionId}</Text>
                </View>
              )}

              {/* 支付时间 */}
              {paymentInfo.payTime && (
                <View className="flex flex-row items-center">
                  <Text className="block text-sm text-gray-600 w-24">支付时间</Text>
                  <Text className="block text-sm text-gray-800">{paymentInfo.payTime}</Text>
                </View>
              )}
            </View>
          )}
        </View>
      </View>
    )
  }

  // 渲染退款表单
  const renderRefundForm = () => {
    return (
      <View className="space-y-4 p-4">
        <View className="bg-white rounded-2xl p-6 border border-gray-100">
          <View className="flex flex-row items-center mb-6">
            <RefreshCw size={24} color="#10B981" className="mr-3" />
            <Text className="block text-xl font-bold text-gray-800">申请退款</Text>
          </View>

          {/* 订单ID */}
          <View className="mb-5">
            <Text className="block text-sm font-bold text-gray-800 mb-2">订单ID *</Text>
            <View className="bg-gray-50 rounded-xl px-4 py-3">
              <Input
                className="w-full bg-transparent"
                placeholder="请输入订单ID"
                value={refundFormData.orderId}
                onInput={e => setRefundFormData({ ...refundFormData, orderId: e.detail.value })}
              />
            </View>
          </View>

          {/* 交易ID */}
          <View className="mb-5">
            <Text className="block text-sm font-bold text-gray-800 mb-2">交易ID</Text>
            <View className="bg-gray-50 rounded-xl px-4 py-3">
              <Input
                className="w-full bg-transparent"
                placeholder="请输入交易ID（可选）"
                value={refundFormData.transactionId}
                onInput={e => setRefundFormData({ ...refundFormData, transactionId: e.detail.value })}
              />
            </View>
          </View>

          {/* 退款金额 */}
          <View className="mb-5">
            <Text className="block text-sm font-bold text-gray-800 mb-2">退款金额 (元) *</Text>
            <View className="bg-gray-50 rounded-xl px-4 py-3">
              <Input
                className="w-full bg-transparent"
                type="number"
                placeholder="请输入退款金额"
                value={refundFormData.refundAmount}
                onInput={e => setRefundFormData({ ...refundFormData, refundAmount: e.detail.value })}
              />
            </View>
          </View>

          {/* 总金额 */}
          <View className="mb-6">
            <Text className="block text-sm font-bold text-gray-800 mb-2">订单总金额 (元)</Text>
            <View className="bg-gray-50 rounded-xl px-4 py-3">
              <Input
                className="w-full bg-transparent"
                type="number"
                placeholder="请输入订单总金额"
                value={refundFormData.totalAmount}
                onInput={e => setRefundFormData({ ...refundFormData, totalAmount: e.detail.value })}
              />
            </View>
          </View>

          {/* 提交按钮 */}
          <View
            className="bg-gradient-to-r from-emerald-600 to-emerald-500 rounded-2xl py-4 px-6 text-center"
            style={{
              boxShadow: '0 4px 12px rgba(16, 185, 129, 0.25)'
            }}
            onClick={handleCreateRefund}
          >
            <Text className="block text-base font-bold text-white">
              {loading ? '处理中...' : '申请退款'}
            </Text>
          </View>
        </View>

        {/* 提示信息 */}
        <View className="bg-amber-50 rounded-2xl p-5 border border-amber-200">
          <View className="flex flex-row items-start">
            <Info size={20} color="#F59E0B" className="mr-3 flex-shrink-0 mt-0.5" />
            <View>
              <Text className="block text-sm font-bold text-amber-800 mb-1">退款须知</Text>
              <Text className="block text-xs text-amber-700 leading-relaxed">
                1. 退款金额不能超过订单总金额
                2. 退款将在1-3个工作日内原路返回到用户账户
                3. 部分退款需要提供交易ID
              </Text>
            </View>
          </View>
        </View>
      </View>
    )
  }

  return (
    <View className="flex flex-col h-full bg-gray-50">
      {/* 标题栏 */}
      <View className="bg-white px-6 py-6 border-b border-gray-100">
        <Text className="block text-2xl font-bold text-gray-800 mb-1">支付管理</Text>
        <Text className="block text-sm text-gray-500">创建支付订单、查询状态、申请退款</Text>
      </View>

      {renderTabs()}

      <ScrollView className="flex-1" scrollY>
        {activeTab === 'create' && renderCreateForm()}
        {activeTab === 'query' && renderQueryForm()}
        {activeTab === 'refund' && renderRefundForm()}
      </ScrollView>
    </View>
  )
}

export default PaymentPage
