import { useLoad } from '@tarojs/taro'
import { View, Text, ScrollView } from '@tarojs/components'
import { useState } from 'react'
import { MessageSquare, Send, Bell, MapPin, Clock } from 'lucide-react-taro'
import './index.css'

interface RealtimeMessage {
  type: 'order' | 'location' | 'broadcast' | 'system'
  data: any
  timestamp: string
  id: string
}

interface OrderMessage {
  orderId: string
  status: string
  message: string
  cleanerId?: number
  customerPhone?: string
}

interface LocationMessage {
  userId: number
  orderId: string
  latitude: number
  longitude: number
  address: string
}

interface BroadcastMessage {
  title: string
  content: string
  priority: 'low' | 'medium' | 'high'
}

const RealtimePage = () => {
  useLoad(() => {
    connectSocket()
  })

  const [connected, setConnected] = useState(false)
  const [messages, setMessages] = useState<RealtimeMessage[]>([])
  const [messageInput, setMessageInput] = useState('')

  // 连接 Socket.IO
  const connectSocket = () => {
    try {
      // Socket.IO 客户端连接
      // 注意：在实际使用时，需要根据环境配置正确的 Socket.IO 服务器地址
      const socket = new WebSocket('ws://localhost:3000')

      socket.onopen = () => {
        console.log('WebSocket connected')
        setConnected(true)
        addSystemMessage('已连接到实时通信服务器')
      }

      socket.onmessage = event => {
        const message = JSON.parse(event.data)
        handleMessage(message)
      }

      socket.onclose = () => {
        console.log('WebSocket disconnected')
        setConnected(false)
        addSystemMessage('与实时通信服务器断开连接')
      }

      socket.onerror = error => {
        console.error('WebSocket error:', error)
        addSystemMessage('连接错误，请检查网络')
      }
    } catch (error) {
      console.error('Failed to connect to WebSocket:', error)
      addSystemMessage('无法连接到实时通信服务器')
    }
  }

  // 处理接收到的消息
  const handleMessage = (message: RealtimeMessage) => {
    setMessages(prev => [...prev, message])
  }

  // 添加系统消息
  const addSystemMessage = (content: string) => {
    setMessages(prev => [
      ...prev,
      {
        type: 'system',
        data: { message: content },
        timestamp: new Date().toISOString(),
        id: Date.now().toString()
      }
    ])
  }

  // 发送消息
  const handleSendMessage = () => {
    if (!messageInput.trim()) {
      return
    }

    // 这里可以通过 WebSocket 发送消息
    addSystemMessage(`发送消息: ${messageInput}`)
    setMessageInput('')
  }

  // 获取消息类型图标
  const getMessageIcon = (type: string) => {
    switch (type) {
      case 'order':
        return <Bell size={20} color="#10B981" />
      case 'location':
        return <MapPin size={20} color="#3B82F6" />
      case 'broadcast':
        return <MessageSquare size={20} color="#F59E0B" />
      case 'system':
        return <Clock size={20} color="#9CA3AF" />
      default:
        return <MessageSquare size={20} color="#9CA3AF" />
    }
  }

  // 获取消息类型背景色
  const getMessageBgColor = (type: string) => {
    switch (type) {
      case 'order':
        return 'bg-emerald-50 border-emerald-200'
      case 'location':
        return 'bg-blue-50 border-blue-200'
      case 'broadcast':
        return 'bg-amber-50 border-amber-200'
      case 'system':
        return 'bg-gray-50 border-gray-200'
      default:
        return 'bg-gray-50 border-gray-200'
    }
  }

  // 格式化时间
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diff = now.getTime() - date.getTime()

    if (diff < 60000) {
      return '刚刚'
    } else if (diff < 3600000) {
      return `${Math.floor(diff / 60000)}分钟前`
    } else if (diff < 86400000) {
      return `${Math.floor(diff / 3600000)}小时前`
    } else {
      return `${Math.floor(diff / 86400000)}天前`
    }
  }

  // 渲染订单消息
  const renderOrderMessage = (data: OrderMessage) => {
    const getStatusInfo = (status: string) => {
      switch (status) {
        case 'accepted':
          return {
            text: '已接单',
            color: '#3B82F6',
            bgColor: 'bg-blue-100'
          }
        case 'in_progress':
          return {
            text: '进行中',
            color: '#F59E0B',
            bgColor: 'bg-amber-100'
          }
        case 'completed':
          return {
            text: '已完成',
            color: '#10B981',
            bgColor: 'bg-emerald-100'
          }
        case 'cancelled':
          return {
            text: '已取消',
            color: '#EF4444',
            bgColor: 'bg-red-100'
          }
        default:
          return {
            text: status,
            color: '#9CA3AF',
            bgColor: 'bg-gray-100'
          }
      }
    }

    const statusInfo = getStatusInfo(data.status)

    return (
      <View className="space-y-3">
        <Text className="block text-base font-bold text-gray-800">{data.message}</Text>
        <View className="flex flex-row items-center gap-2">
          <Text className="block text-xs text-gray-600">订单ID:</Text>
          <Text className="block text-sm font-bold text-gray-800">{data.orderId}</Text>
        </View>
        <View
          className={`${statusInfo.bgColor} px-3 py-1.5 rounded-xl inline-block`}
        >
          <Text
            className="text-xs font-bold"
            style={{ color: statusInfo.color }}
          >
            {statusInfo.text}
          </Text>
        </View>
      </View>
    )
  }

  // 渲染位置消息
  const renderLocationMessage = (data: LocationMessage) => {
    return (
      <View className="space-y-3">
        <Text className="block text-base font-bold text-gray-800">位置更新</Text>
        <View className="bg-white rounded-xl p-4 border border-gray-100">
          <View className="flex flex-row items-center mb-2">
            <Text className="block text-xs text-gray-600 w-20">订单ID:</Text>
            <Text className="block text-sm font-bold text-gray-800">{data.orderId}</Text>
          </View>
          <View className="flex flex-row items-center mb-2">
            <Text className="block text-xs text-gray-600 w-20">地址:</Text>
            <Text className="block text-sm text-gray-800 flex-1">{data.address}</Text>
          </View>
          <View className="flex flex-row items-center">
            <Text className="block text-xs text-gray-600 w-20">坐标:</Text>
            <Text className="block text-xs text-gray-600">
              {data.latitude.toFixed(6)}, {data.longitude.toFixed(6)}
            </Text>
          </View>
        </View>
      </View>
    )
  }

  // 渲染广播消息
  const renderBroadcastMessage = (data: BroadcastMessage) => {
    const priorityColors = {
      low: '#9CA3AF',
      medium: '#F59E0B',
      high: '#EF4444'
    }

    return (
      <View className="space-y-3">
        <Text className="block text-base font-bold text-gray-800">{data.title}</Text>
        <Text className="block text-sm text-gray-700 leading-relaxed">{data.content}</Text>
        <View
          className="px-3 py-1.5 rounded-xl inline-block"
          style={{ backgroundColor: `${priorityColors[data.priority]}20` }}
        >
          <Text
            className="text-xs font-bold"
            style={{ color: priorityColors[data.priority] }}
          >
            {data.priority === 'low' ? '普通' : data.priority === 'medium' ? '重要' : '紧急'}
          </Text>
        </View>
      </View>
    )
  }

  // 渲染消息内容
  const renderMessageContent = (message: RealtimeMessage) => {
    switch (message.type) {
      case 'order':
        return renderOrderMessage(message.data as OrderMessage)
      case 'location':
        return renderLocationMessage(message.data as LocationMessage)
      case 'broadcast':
        return renderBroadcastMessage(message.data as BroadcastMessage)
      case 'system':
        return (
          <Text className="block text-sm text-gray-600">
            {(message.data as any).message}
          </Text>
        )
      default:
        return <Text className="block text-sm text-gray-600">未知消息类型</Text>
    }
  }

  // 渲染消息列表
  const renderMessages = () => {
    if (messages.length === 0) {
      return (
        <View className="flex flex-col items-center justify-center py-16">
          <MessageSquare size={48} color="#E5E7EB" />
          <Text className="block text-base text-gray-500 mt-4">暂无消息</Text>
        </View>
      )
    }

    return (
      <View className="space-y-4">
        {messages.map(message => (
          <View
            key={message.id}
            className={`rounded-2xl p-5 border ${getMessageBgColor(message.type)}`}
          >
            {/* 消息头部 */}
            <View className="flex flex-row items-center justify-between mb-3">
              <View className="flex flex-row items-center">
                {getMessageIcon(message.type)}
                <Text className="block text-sm font-bold text-gray-700 ml-2">
                  {message.type === 'order' && '订单通知'}
                  {message.type === 'location' && '位置更新'}
                  {message.type === 'broadcast' && '系统广播'}
                  {message.type === 'system' && '系统消息'}
                </Text>
              </View>
              <Text className="block text-xs text-gray-500">{formatTime(message.timestamp)}</Text>
            </View>

            {/* 消息内容 */}
            {renderMessageContent(message)}
          </View>
        ))}
      </View>
    )
  }

  return (
    <View className="flex flex-col h-full bg-gray-50">
      {/* 标题栏 */}
      <View className="bg-white px-6 py-6 border-b border-gray-100">
        <View className="flex flex-row items-center justify-between">
          <View>
            <Text className="block text-2xl font-bold text-gray-800 mb-1">实时通信</Text>
            <Text className="block text-sm text-gray-500">订单推送、位置更新</Text>
          </View>
          <View
            className={`px-3 py-1.5 rounded-xl flex flex-row items-center gap-2 ${
              connected ? 'bg-emerald-100' : 'bg-gray-100'
            }`}
          >
            <View
              className={`w-2 h-2 rounded-full ${connected ? 'bg-emerald-500' : 'bg-gray-400'}`}
            />
            <Text
              className={`text-xs font-bold ${connected ? 'text-emerald-600' : 'text-gray-600'}`}
            >
              {connected ? '已连接' : '未连接'}
            </Text>
          </View>
        </View>
      </View>

      {/* 消息列表 */}
      <ScrollView className="flex-1" scrollY>
        <View className="p-4">{renderMessages()}</View>
      </ScrollView>

      {/* 消息输入框 */}
      <View
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: '#fff',
          borderTop: '1px solid #E5E7EB',
          padding: '16px',
          display: 'flex',
          flexDirection: 'row',
          gap: '12px',
          alignItems: 'center',
          paddingBottom: '60px'
        }}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: '#F9FAFB',
            borderRadius: '20px',
            padding: '12px 16px'
          }}
        >
          <input
            type="text"
            placeholder="输入消息..."
            value={messageInput}
            onChange={e => setMessageInput(e.target.value)}
            style={{
              width: '100%',
              border: 'none',
              outline: 'none',
              fontSize: '14px',
              backgroundColor: 'transparent'
            }}
          />
        </View>
        <View
          className="bg-gradient-to-r from-emerald-600 to-emerald-500 w-14 h-14 rounded-full flex items-center justify-center"
          style={{
            boxShadow: '0 4px 12px rgba(16, 185, 129, 0.25)',
            flexShrink: 0
          }}
          onClick={handleSendMessage}
        >
          <Send size={20} color="#fff" />
        </View>
      </View>
    </View>
  )
}

export default RealtimePage
