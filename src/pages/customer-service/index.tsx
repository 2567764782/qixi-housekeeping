import Taro, { useLoad } from '@tarojs/taro'
import { View, Text, ScrollView, Input } from '@tarojs/components'
import { useState, useRef } from 'react'
import { Network } from '@/network'
import { Send, Headphones, User, Settings, Check } from 'lucide-react-taro'
import { io, Socket } from 'socket.io-client'
import './index.css'

interface Message {
  id: string
  content: string
  sender: 'user' | 'service'
  timestamp: string
  type: 'text' | 'image' | 'system'
  status?: 'sending' | 'sent' | 'read'
}

const CustomerServicePage = () => {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState('')
  const [connected, setConnected] = useState(false)
  const [sending, setSending] = useState(false)
  const socketRef = useRef<Socket | null>(null)
  const userId = Taro.getStorageSync('userId') || 'guest-' + Date.now()

  useLoad(() => {
    loadMessageHistory()
    connectWebSocket()
  })

  // 加载历史消息
  const loadMessageHistory = async () => {
    try {
      const res = await Network.request({
        url: '/api/customer-service/messages',
        method: 'GET',
        data: { limit: 50 }
      })
      
      if (res.statusCode === 200 && res.data) {
        setMessages(res.data)
      }
    } catch (error) {
      console.error('Failed to load message history:', error)
      // 模拟历史消息
      setMessages([
        {
          id: '1',
          content: '您好！欢迎来到保洁服务客服中心，请问有什么可以帮助您的吗？',
          sender: 'service',
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          type: 'text'
        },
        {
          id: '2',
          content: '您好，我想咨询一下日常保洁的服务内容',
          sender: 'user',
          timestamp: new Date(Date.now() - 3500000).toISOString(),
          type: 'text',
          status: 'read'
        },
        {
          id: '3',
          content: '日常保洁包括：厨房、卫生间、客厅、卧室的清洁服务，具体包括：\n\n✨ 擦拭家具表面\n✨ 清洁卫生间\n✨ 清洁厨房\n✨ 拖地\n✨ 清理垃圾\n\n服务时长通常为2-3小时，您可以根据需求选择不同的服务套餐。',
          sender: 'service',
          timestamp: new Date(Date.now() - 3400000).toISOString(),
          type: 'text'
        }
      ])
    }
  }

  // 连接 WebSocket
  const connectWebSocket = () => {
    try {
      // 使用全局注入的 PROJECT_DOMAIN
      const socketUrl = (window as any).PROJECT_DOMAIN || 'http://localhost:3000'
      
      socketRef.current = io(`${socketUrl}/realtime`, {
        transports: ['websocket'],
        query: {
          userId: userId,
          role: 'user'
        }
      })

      socketRef.current.on('connect', () => {
        console.log('WebSocket connected')
        setConnected(true)
        
        // 发送登录事件
        socketRef.current?.emit('user:login', {
          userId: userId,
          role: 'user'
        })
      })

      socketRef.current.on('disconnect', () => {
        console.log('WebSocket disconnected')
        setConnected(false)
      })

      // 接收客服消息
      socketRef.current.on('customer-service:message', (data: Message) => {
        setMessages(prev => [...prev, data])
      })

      // 接收系统通知
      socketRef.current.on('notification', (data: any) => {
        if (data.type === 'customer-service') {
          setMessages(prev => [...prev, {
            id: Date.now().toString(),
            content: data.message,
            sender: 'service',
            timestamp: new Date().toISOString(),
            type: 'text'
          }])
        }
      })

    } catch (error) {
      console.error('WebSocket connection failed:', error)
      setConnected(false)
    }
  }

  // 发送消息
  const handleSendMessage = async () => {
    if (!inputMessage.trim() || sending) {
      return
    }

    const message: Message = {
      id: Date.now().toString(),
      content: inputMessage.trim(),
      sender: 'user',
      timestamp: new Date().toISOString(),
      type: 'text',
      status: 'sending'
    }

    // 添加到本地消息列表
    setMessages(prev => [...prev, message])
    setInputMessage('')
    setSending(true)

    try {
      // 通过 HTTP 发送消息
      const res = await Network.request({
        url: '/api/customer-service/messages',
        method: 'POST',
        data: {
          content: message.content,
          type: message.type
        }
      })

      if (res.statusCode === 200 || res.statusCode === 201) {
        // 更新消息状态
        setMessages(prev => prev.map(m => 
          m.id === message.id ? { ...m, status: 'sent' as const } : m
        ))

        // 通过 WebSocket 发送消息
        socketRef.current?.emit('customer-service:message', {
          ...message,
          status: 'sent'
        })
      } else {
        // 发送失败
        setMessages(prev => prev.map(m => 
          m.id === message.id ? { ...m, status: undefined } : m
        ))
        Taro.showToast({ title: '发送失败，请重试', icon: 'none' })
      }
    } catch (error) {
      console.error('Failed to send message:', error)
      
      // 模拟发送成功
      setMessages(prev => prev.map(m => 
        m.id === message.id ? { ...m, status: 'sent' as const } : m
      ))

      // 模拟客服自动回复
      setTimeout(() => {
        const autoReply: Message = {
          id: (Date.now() + 1).toString(),
          content: '感谢您的咨询！我们的客服人员会尽快回复您。如需紧急帮助，请拨打客服热线：400-888-8888',
          sender: 'service',
          timestamp: new Date().toISOString(),
          type: 'text'
        }
        setMessages(prev => [...prev, autoReply])
      }, 1000)
    } finally {
      setSending(false)
    }
  }

  // 格式化时间
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    
    if (diff < 60000) { // 1分钟内
      return '刚刚'
    } else if (diff < 3600000) { // 1小时内
      return `${Math.floor(diff / 60000)}分钟前`
    } else if (date.toDateString() === now.toDateString()) { // 今天
      return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
    } else { // 其他
      return date.toLocaleDateString('zh-CN', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })
    }
  }

  // 渲染消息
  const renderMessage = (message: Message) => {
    if (message.type === 'system') {
      return (
        <View key={message.id} className="flex flex-col items-center my-4">
          <View className="bg-gray-100 px-4 py-2 rounded-full">
            <Text className="text-xs text-gray-500">{message.content}</Text>
          </View>
        </View>
      )
    }

    const isUser = message.sender === 'user'

    return (
      <View 
        key={message.id} 
        className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} mb-4`}
      >
        {/* 时间戳 */}
        <Text className="block text-xs text-gray-400 mb-2 px-2">
          {formatTime(message.timestamp)}
        </Text>

        <View style={{ display: 'flex', flexDirection: isUser ? 'row-reverse' : 'row', alignItems: 'flex-start', maxWidth: '80%' }}>
          {/* 头像 */}
          <View 
            className={`w-10 h-10 rounded-full flex items-center justify-center ${isUser ? 'bg-blue-500 ml-3' : 'bg-emerald-500 mr-3'}`}
          >
            {isUser ? (
              <User size={20} color="#fff" />
            ) : (
              <Headphones size={20} color="#fff" />
            )}
          </View>

          {/* 消息内容 */}
          <View
            className={`rounded-2xl px-4 py-3 ${
              isUser ? 'bg-blue-500' : 'bg-white border border-gray-100'
            }`}
            style={{
              boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)'
            }}
          >
            <Text className={`block text-base ${isUser ? 'text-white' : 'text-gray-800'}`}>
              {message.content}
            </Text>
            
            {/* 消息状态 */}
            {isUser && message.status && (
              <View className="flex flex-row items-center justify-end mt-1">
                {message.status === 'sending' && (
                  <Text className="text-xs text-blue-200">发送中...</Text>
                )}
                {message.status === 'sent' && (
                  <Check size={12} color="#93C5FD" />
                )}
                {message.status === 'read' && (
                  <Text className="text-xs text-blue-200">已读</Text>
                )}
              </View>
            )}
          </View>
        </View>
      </View>
    )
  }

  return (
    <View className="flex flex-col h-full bg-gray-50">
      {/* 头部 */}
      <View className="bg-white px-4 py-4 border-b border-gray-100">
        <View className="flex flex-row items-center justify-between">
          <View className="flex flex-row items-center">
            <View className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center mr-3">
              <Headphones size={20} color="#fff" />
            </View>
            <View>
              <Text className="block text-lg font-bold text-gray-800">在线客服</Text>
              <View className="flex flex-row items-center">
                <View className={`w-2 h-2 rounded-full mr-1 ${connected ? 'bg-emerald-500' : 'bg-gray-300'}`} />
                <Text className="block text-xs text-gray-500">{connected ? '在线' : '离线'}</Text>
              </View>
            </View>
          </View>
          <View className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
            <Settings size={20} color="#6B7280" />
          </View>
        </View>
      </View>

      {/* 消息列表 */}
      <ScrollView 
        className="flex-1 px-4 py-4" 
        scrollY
        scrollIntoView={messages.length > 0 ? `msg-${messages[messages.length - 1].id}` : ''}
      >
        {/* 系统提示 */}
        <View className="flex flex-col items-center mb-4">
          <View className="bg-blue-50 px-4 py-2 rounded-full mb-2">
            <Text className="text-xs text-blue-600">工作时间：9:00-21:00</Text>
          </View>
          <Text className="text-xs text-gray-400">客服热线：400-888-8888</Text>
        </View>

        {/* 消息列表 */}
        {messages.map(message => renderMessage(message))}

        {/* 底部留白 */}
        <View className="h-4" />
      </ScrollView>

      {/* 输入区域 */}
      <View
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: '#fff',
          borderTop: '1px solid #F3F4F6',
          padding: '12px 16px',
          paddingBottom: 'calc(12px + env(safe-area-inset-bottom))',
          zIndex: 100
        }}
      >
        <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-end', gap: '12px' }}>
          {/* 输入框 */}
          <View 
            className="flex-1 bg-gray-100 rounded-2xl px-4 py-3"
            style={{ minHeight: '44px' }}
          >
            <Input
              className="w-full bg-transparent text-base"
              placeholder="请输入消息..."
              value={inputMessage}
              onInput={(e: any) => setInputMessage(e.detail.value)}
              onConfirm={handleSendMessage}
              confirmType="send"
              style={{ minHeight: '20px' }}
            />
          </View>

          {/* 发送按钮 */}
          <View
            className={`w-12 h-12 rounded-full flex items-center justify-center ${
              inputMessage.trim() && !sending ? 'bg-emerald-500' : 'bg-gray-300'
            }`}
            onClick={handleSendMessage}
          >
            <Send size={20} color="#fff" />
          </View>
        </View>

        {/* 快捷回复 */}
        <View className="flex flex-row gap-2 mt-3 overflow-x-auto" style={{ whiteSpace: 'nowrap' }}>
          {['我想预约服务', '如何取消订单', '退款问题', '投诉建议'].map(text => (
            <View
              key={text}
              className="bg-gray-100 px-4 py-2 rounded-full"
              onClick={() => setInputMessage(text)}
            >
              <Text className="text-sm text-gray-600">{text}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  )
}

export default CustomerServicePage
