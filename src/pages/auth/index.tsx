import { useState } from 'react'
import { View, Text, Input } from '@tarojs/components'
import Taro, { useLoad } from '@tarojs/taro'
import { Lock, User, Shield } from 'lucide-react-taro'
import { Network } from '@/network'
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
  const handleSendCode = async () => {
    if (!phone || phone.length !== 11) {
      Taro.showToast({ title: '请输入正确的手机号', icon: 'none' })
      return
    }

    try {
      setLoading(true)
      const res = await Network.request({
        url: '/api/sms/send-code',
        method: 'POST',
        data: { phone },
      })

      if (res.data.code === 200) {
        // 开发环境显示验证码
        if (res.data.data?.code) {
          Taro.showToast({
            title: `验证码：${res.data.data.code}`,
            icon: 'none',
            duration: 3000,
          })
        } else {
          Taro.showToast({ title: '验证码已发送', icon: 'success' })
        }

        // 开始倒计时
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
      } else {
        throw new Error(res.data.msg || '发送失败')
      }
    } catch (error: any) {
      Taro.showToast({ title: error.message || '发送验证码失败', icon: 'none' })
    } finally {
      setLoading(false)
    }
  }

  // 处理登录
  const handleLogin = async () => {
    if (!phone) {
      Taro.showToast({ title: '请输入手机号', icon: 'none' })
      return
    }
    if (!code && !password) {
      Taro.showToast({ title: '请输入验证码或密码', icon: 'none' })
      return
    }

    try {
      setLoading(true)

      // 优先使用验证码登录
      let url = '/api/auth/login'
      let data: Record<string, string> = { phone, password }

      if (code && !password) {
        url = '/api/auth/login-with-code'
        data = { phone, code }
      }

      const res = await Network.request({
        url,
        method: 'POST',
        data,
      })

      if (res.data.code === 200) {
        const { access_token, user } = res.data.data

        // 存储 token 和用户信息
        Taro.setStorageSync('token', access_token)
        Taro.setStorageSync('userInfo', user)

        Taro.showToast({ title: '登录成功', icon: 'success' })

        // 跳转到首页 - 使用 switchTab 因为首页是 TabBar 页面
        setTimeout(() => {
          Taro.switchTab({ url: '/pages/index/index' })
        }, 1500)
      } else {
        throw new Error(res.data.msg || '登录失败')
      }
    } catch (error: any) {
      Taro.showToast({ title: error.message || '登录失败', icon: 'none' })
    } finally {
      setLoading(false)
    }
  }

  // 处理注册
  const handleRegister = async () => {
    if (!phone) {
      Taro.showToast({ title: '请输入手机号', icon: 'none' })
      return
    }
    if (!code) {
      Taro.showToast({ title: '请输入验证码', icon: 'none' })
      return
    }
    if (!password) {
      Taro.showToast({ title: '请输入密码', icon: 'none' })
      return
    }
    if (password !== confirmPassword) {
      Taro.showToast({ title: '两次密码输入不一致', icon: 'none' })
      return
    }

    try {
      setLoading(true)
      const res = await Network.request({
        url: '/api/auth/register',
        method: 'POST',
        data: { phone, password, nickname: `用户${phone.slice(-4)}` },
      })

      if (res.data.code === 200) {
        Taro.showToast({ title: '注册成功', icon: 'success' })
        setMode('login')
      } else {
        throw new Error(res.data.msg || '注册失败')
      }
    } catch (error: any) {
      Taro.showToast({ title: error.message || '注册失败', icon: 'none' })
    } finally {
      setLoading(false)
    }
  }

  // 处理找回密码
  const handleForgot = async () => {
    if (!phone) {
      Taro.showToast({ title: '请输入手机号', icon: 'none' })
      return
    }
    if (!code) {
      Taro.showToast({ title: '请输入验证码', icon: 'none' })
      return
    }
    if (!password) {
      Taro.showToast({ title: '请输入新密码', icon: 'none' })
      return
    }

    try {
      setLoading(true)
      // 调用重置密码接口
      const res = await Network.request({
        url: '/api/auth/reset-password',
        method: 'POST',
        data: { phone, code, newPassword: password },
      })

      if (res.data.code === 200) {
        Taro.showToast({ title: '密码修改成功', icon: 'success' })
        setMode('login')
      } else {
        throw new Error(res.data.msg || '修改失败')
      }
    } catch (error: any) {
      Taro.showToast({ title: error.message || '密码修改失败', icon: 'none' })
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
      {/* 顶部 Banner - 使用项目主色红色系 */}
      <View className="relative overflow-hidden pt-16 pb-20 px-6" style={{ background: 'linear-gradient(135deg, #F85659 0%, #FF8A8A 100%)' }}>
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
          <Text className="block text-base" style={{ color: 'rgba(255,255,255,0.9)' }}>
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

          {/* 验证码 */}
          <View className="mb-5">
            <Text className="block text-sm font-semibold text-gray-700 mb-2.5">验证码</Text>
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
                className="px-6 py-3.5 rounded-2xl border border-[#F85659] bg-white"
                onClick={countdown > 0 || loading ? undefined : handleSendCode}
              >
                <Text
                  className={`block text-sm font-semibold ${
                    countdown > 0 ? 'text-gray-400' : 'text-[#F85659]'
                  }`}
                >
                  {countdown > 0 ? `${countdown}s` : '获取验证码'}
                </Text>
              </View>
            </View>
          </View>

          {/* 密码 */}
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
            className="w-full rounded-2xl py-4 text-center mb-4"
            style={{
              background: 'linear-gradient(135deg, #F85659 0%, #FF8A8A 100%)',
              boxShadow: '0 4px 12px rgba(248, 86, 89, 0.35), 0 2px 4px rgba(248, 86, 89, 0.15)'
            }}
            onClick={loading ? undefined : handleSubmit}
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
            <View className="w-5 h-5 bg-[#F85659] rounded-lg flex items-center justify-center mr-3 flex-shrink-0 mt-0.5">
              <Shield size={14} color="#fff" />
            </View>
            <Text className="block text-xs text-gray-500 leading-relaxed">
              注册即表示您同意
              <Text className="text-[#F85659]">《服务条款》</Text>
              和
              <Text className="text-[#F85659]">《隐私政策》</Text>
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
