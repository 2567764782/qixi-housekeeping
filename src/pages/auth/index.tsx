import { useState } from 'react'
import { View, Text, Input } from '@tarojs/components'
import Taro, { useLoad } from '@tarojs/taro'
import { Lock, User, Shield } from 'lucide-react-taro'
import './index.css'

type LoginMode = 'login' | 'register' | 'forgot'

const AuthPage = () => {
  useLoad(() => {
    // 页面加载初始化
  })

  const [mode, setMode] = useState<LoginMode>('login')
  const [phone, setPhone] = useState('')
  const [code, setCode] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [countdown, setCountdown] = useState(0)
  const [loading, setLoading] = useState(false)

  // 发送验证码
  const handleSendCode = () => {
    if (!phone || phone.length !== 11) {
      alert('请输入正确的手机号')
      return
    }
    // 模拟发送验证码
    setCountdown(60)
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  // 处理登录
  const handleLogin = async () => {
    if (!phone) {
      alert('请输入手机号')
      return
    }
    if (!code && !password) {
      alert('请输入验证码或密码')
      return
    }

    try {
      setLoading(true)
      // 模拟登录请求
      await new Promise(resolve => setTimeout(resolve, 1000))
      alert('登录成功！')
      Taro.redirectTo({ url: '/pages/index/index' })
    } catch (error) {
      console.error('Login failed:', error)
      alert('登录失败')
    } finally {
      setLoading(false)
    }
  }

  // 处理注册
  const handleRegister = async () => {
    if (!phone) {
      alert('请输入手机号')
      return
    }
    if (!code) {
      alert('请输入验证码')
      return
    }
    if (!password) {
      alert('请输入密码')
      return
    }
    if (password !== confirmPassword) {
      alert('两次密码输入不一致')
      return
    }

    try {
      setLoading(true)
      // 模拟注册请求
      await new Promise(resolve => setTimeout(resolve, 1000))
      alert('注册成功！')
      setMode('login')
    } catch (error) {
      console.error('Register failed:', error)
      alert('注册失败')
    } finally {
      setLoading(false)
    }
  }

  // 处理找回密码
  const handleForgot = async () => {
    if (!phone) {
      alert('请输入手机号')
      return
    }
    if (!code) {
      alert('请输入验证码')
      return
    }
    if (!password) {
      alert('请输入新密码')
      return
    }

    try {
      setLoading(true)
      // 模拟找回密码请求
      await new Promise(resolve => setTimeout(resolve, 1000))
      alert('密码修改成功！')
      setMode('login')
    } catch (error) {
      console.error('Forgot password failed:', error)
      alert('密码修改失败')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = () => {
    if (mode === 'login') handleLogin()
    else if (mode === 'register') handleRegister()
    else handleForgot()
  }

  return (
    <View className="flex flex-col h-full bg-gray-50">
      {/* 顶部 Banner */}
      <View className="relative overflow-hidden bg-gradient-to-br from-emerald-600 via-emerald-500 to-teal-500 pt-16 pb-20 px-6">
        {/* 背景装饰 */}
        <View className="absolute top-[-60px] right-[-60px] w-48 h-48 bg-white/10 rounded-full blur-3xl" />
        <View className="absolute bottom-[-40px] left-[-40px] w-40 h-40 bg-white/10 rounded-full blur-2xl" />

        <View className="relative">
          <View className="flex flex-row items-center mb-3">
            <View className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mr-4">
              <User size={28} color="#fff" />
            </View>
            <Text className="block text-3xl font-bold text-white">
              {mode === 'login' ? '欢迎回来' : mode === 'register' ? '创建账号' : '找回密码'}
            </Text>
          </View>
          <Text className="block text-base text-emerald-100">
            {mode === 'login' ? '登录您的账户继续使用' : mode === 'register' ? '注册账户享受更多服务' : '重置密码以重新登录'}
          </Text>
        </View>
      </View>

      {/* 表单卡片 */}
      <View className="px-4 -mt-12 relative z-10">
        <View
          className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-lg border border-gray-100 p-6"
          style={{
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.08), 0 2px 6px rgba(0, 0, 0, 0.04)'
          }}
        >
          {/* 手机号 */}
          <View className="mb-5">
            <Text className="block text-sm font-semibold text-gray-700 mb-2.5">手机号</Text>
            <View
              className="bg-gray-50 rounded-2xl px-4 py-3.5 border border-gray-100"
              style={{
                boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.03)'
              }}
            >
              <Input
                className="w-full bg-transparent text-base"
                placeholder="请输入手机号"
                type="number"
                value={phone}
                onInput={(e: any) => setPhone(e.detail.value)}
                maxlength={11}
              />
            </View>
          </View>

          {/* 验证码（登录和注册时显示） */}
          {(mode === 'login' || mode === 'register' || mode === 'forgot') && (
            <View className="mb-5">
              <Text className="block text-sm font-semibold text-gray-700 mb-2.5">
                {mode === 'forgot' ? '验证码' : '验证码'}
              </Text>
              <View className="flex flex-row gap-3">
                <View
                  className="flex-1 bg-gray-50 rounded-2xl px-4 py-3.5 border border-gray-100"
                  style={{
                    boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.03)'
                  }}
                >
                  <Input
                    className="w-full bg-transparent text-base"
                    placeholder="请输入验证码"
                    type="number"
                    value={code}
                    onInput={(e: any) => setCode(e.detail.value)}
                    maxlength={6}
                  />
                </View>
                <View
                  className="px-6 py-3.5 rounded-2xl border border-emerald-500 bg-white"
                  onClick={countdown > 0 ? undefined : handleSendCode}
                >
                  <Text
                    className={`block text-sm font-semibold ${
                      countdown > 0 ? 'text-gray-400' : 'text-emerald-600'
                    }`}
                  >
                    {countdown > 0 ? `${countdown}s` : '获取验证码'}
                  </Text>
                </View>
              </View>
            </View>
          )}

          {/* 密码（登录、注册、找回密码时显示） */}
          <View className="mb-5">
            <Text className="block text-sm font-semibold text-gray-700 mb-2.5">
              {mode === 'forgot' ? '新密码' : mode === 'register' ? '设置密码' : '密码'}
            </Text>
            <View
              className="bg-gray-50 rounded-2xl px-4 py-3.5 border border-gray-100"
              style={{
                boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.03)'
              }}
            >
              <Input
                className="w-full bg-transparent text-base"
                placeholder="请输入密码"
                password
                value={password}
                onInput={(e: any) => setPassword(e.detail.value)}
              />
            </View>
          </View>

          {/* 确认密码（注册时显示） */}
          {mode === 'register' && (
            <View className="mb-6">
              <Text className="block text-sm font-semibold text-gray-700 mb-2.5">确认密码</Text>
              <View
                className="bg-gray-50 rounded-2xl px-4 py-3.5 border border-gray-100"
                style={{
                  boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.03)'
                }}
              >
                <Input
                  className="w-full bg-transparent text-base"
                  placeholder="请再次输入密码"
                  password
                  value={confirmPassword}
                  onInput={(e: any) => setConfirmPassword(e.detail.value)}
                />
              </View>
            </View>
          )}

          {/* 提交按钮 */}
          <View
            className="w-full bg-gradient-to-r from-emerald-600 to-emerald-500 rounded-2xl py-4 text-center mb-4"
            style={{
              boxShadow: '0 4px 12px rgba(16, 185, 129, 0.35), 0 2px 4px rgba(16, 185, 129, 0.15)'
            }}
            onClick={handleSubmit}
          >
            <Text className="block text-base font-bold text-white">
              {loading ? '处理中...' : (mode === 'login' ? '登录' : mode === 'register' ? '注册' : '确认修改')}
            </Text>
          </View>

          {/* 切换模式 */}
          <View className="flex flex-row items-center justify-center gap-4">
            {mode === 'login' && (
              <>
                <Text
                  className="block text-sm text-gray-500"
                  onClick={() => setMode('register')}
                >
                  注册账号
                </Text>
                <Text className="block text-sm text-gray-300">|</Text>
                <Text
                  className="block text-sm text-gray-500"
                  onClick={() => setMode('forgot')}
                >
                  忘记密码
                </Text>
              </>
            )}
            {mode === 'register' && (
              <Text
                className="block text-sm text-gray-500"
                onClick={() => setMode('login')}
              >
                已有账号，去登录
              </Text>
            )}
            {mode === 'forgot' && (
              <Text
                className="block text-sm text-gray-500"
                onClick={() => setMode('login')}
              >
                返回登录
              </Text>
            )}
          </View>
        </View>

        {/* 协议提示 */}
        {mode === 'register' && (
          <View className="flex flex-row items-start mt-6 px-2">
            <View className="w-5 h-5 bg-emerald-500 rounded-lg flex items-center justify-center mr-3 flex-shrink-0 mt-0.5">
              <Shield size={14} color="#fff" />
            </View>
            <Text className="block text-xs text-gray-500 leading-relaxed">
              注册即表示您同意
              <Text className="text-emerald-600">《服务条款》</Text>
              和
              <Text className="text-emerald-600">《隐私政策》</Text>
            </Text>
          </View>
        )}
      </View>

      {/* 底部装饰 */}
      <View className="mt-auto py-6 px-6">
        <View className="flex flex-row items-center justify-center gap-2 text-gray-400">
          <Lock size={16} />
          <Text className="block text-xs">安全加密 · 保护隐私</Text>
        </View>
      </View>
    </View>
  )
}

export default AuthPage
