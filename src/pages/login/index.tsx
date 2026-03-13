import { useState } from 'react'
import { View, Text, Input, Button } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { Network } from '@/network'
import './index.css'

export default function LoginPage() {
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [code, setCode] = useState('')
  const [nickname, setNickname] = useState('')
  const [loading, setLoading] = useState(false)
  const [isRegister, setIsRegister] = useState(false)
  const [isCodeLogin, setIsCodeLogin] = useState(false)
  const [countdown, setCountdown] = useState(0)
  const [canSendCode, setCanSendCode] = useState(true)

  // 发送验证码
  const handleSendCode = async () => {
    if (!phone) {
      Taro.showToast({
        title: '请输入手机号',
        icon: 'none',
      })
      return
    }

    if (!/^1[3-9]\d{9}$/.test(phone)) {
      Taro.showToast({
        title: '手机号格式不正确',
        icon: 'none',
      })
      return
    }

    try {
      setLoading(true)

      console.log('[Send Code Request]', {
        url: '/api/sms/send-code',
        method: 'POST',
        data: { phone },
      })

      const res = await Network.request({
        url: '/api/sms/send-code',
        method: 'POST',
        data: { phone },
      })

      console.log('[Send Code Response]', res.data)

      if (res.data.code === 200) {
        // 开发环境显示验证码
        if (res.data.data?.code) {
          Taro.showToast({
            title: `验证码：${res.data.data.code}`,
            icon: 'none',
            duration: 3000,
          })
        } else {
          Taro.showToast({
            title: '验证码已发送',
            icon: 'success',
          })
        }

        // 开始倒计时
        setCanSendCode(false)
        setCountdown(60)

        const timer = setInterval(() => {
          setCountdown((prev) => {
            if (prev <= 1) {
              clearInterval(timer)
              setCanSendCode(true)
              return 0
            }
            return prev - 1
          })
        }, 1000)
      } else {
        throw new Error(res.data.msg || '发送失败')
      }
    } catch (error: any) {
      console.error('[Send Code Error]', error)

      Taro.showToast({
        title: error.message || '发送验证码失败',
        icon: 'none',
      })
    } finally {
      setLoading(false)
    }
  }

  // 账号密码登录/注册
  const handlePasswordAuth = async () => {
    if (!phone || !password) {
      Taro.showToast({
        title: '请输入手机号和密码',
        icon: 'none',
      })
      return
    }

    if (isRegister && !nickname) {
      Taro.showToast({
        title: '请输入昵称',
        icon: 'none',
      })
      return
    }

    if (password.length < 6) {
      Taro.showToast({
        title: '密码长度不能少于6位',
        icon: 'none',
      })
      return
    }

    try {
      setLoading(true)

      const url = isRegister ? '/api/auth/register' : '/api/auth/login'

      console.log('[Auth Request]', {
        url,
        method: 'POST',
        data: isRegister ? { phone, password, nickname } : { phone, password },
      })

      const res = await Network.request({
        url,
        method: 'POST',
        data: isRegister ? { phone, password, nickname } : { phone, password },
      })

      console.log('[Auth Response]', res.data)

      if (res.data.code === 200) {
        const { access_token, user } = res.data.data

        // 存储 token 和用户信息
        Taro.setStorageSync('token', access_token)
        Taro.setStorageSync('userInfo', user)

        Taro.showToast({
          title: isRegister ? '注册成功' : '登录成功',
          icon: 'success',
        })

        // 跳转到首页
        setTimeout(() => {
          Taro.switchTab({
            url: '/pages/index/index',
          })
        }, 1500)
      } else {
        throw new Error(res.data.msg || '认证失败')
      }
    } catch (error: any) {
      console.error('[Auth Error]', error)

      Taro.showToast({
        title: error.message || '认证失败，请重试',
        icon: 'none',
      })
    } finally {
      setLoading(false)
    }
  }

  // 验证码登录
  const handleCodeLogin = async () => {
    if (!phone || !code) {
      Taro.showToast({
        title: '请输入手机号和验证码',
        icon: 'none',
      })
      return
    }

    try {
      setLoading(true)

      console.log('[Code Login Request]', {
        url: '/api/auth/login-with-code',
        method: 'POST',
        data: { phone, code },
      })

      const res = await Network.request({
        url: '/api/auth/login-with-code',
        method: 'POST',
        data: { phone, code },
      })

      console.log('[Code Login Response]', res.data)

      if (res.data.code === 200) {
        const { access_token, user } = res.data.data

        // 存储 token 和用户信息
        Taro.setStorageSync('token', access_token)
        Taro.setStorageSync('userInfo', user)

        Taro.showToast({
          title: '登录成功',
          icon: 'success',
        })

        // 跳转到首页
        setTimeout(() => {
          Taro.switchTab({
            url: '/pages/index/index',
          })
        }, 1500)
      } else {
        throw new Error(res.data.msg || '登录失败')
      }
    } catch (error: any) {
      console.error('[Code Login Error]', error)

      Taro.showToast({
        title: error.message || '登录失败，请重试',
        icon: 'none',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleAuth = () => {
    if (isCodeLogin) {
      handleCodeLogin()
    } else {
      handlePasswordAuth()
    }
  }

  return (
    <View className="login-container">
      <View className="login-card">
        <Text className="login-title">{isCodeLogin ? '验证码登录' : (isRegister ? '注册' : '登录')}</Text>

        {isRegister && !isCodeLogin && (
          <View className="input-group">
            <Input
              className="input-field"
              placeholder="请输入昵称"
              value={nickname}
              onInput={(e) => setNickname(e.detail.value)}
            />
          </View>
        )}

        <View className="input-group">
          <Input
            className="input-field"
            type="number"
            placeholder="请输入手机号"
            value={phone}
            onInput={(e) => setPhone(e.detail.value)}
          />
        </View>

        {isCodeLogin ? (
          <View className="input-group-with-button">
            <View className="input-field-wrapper">
              <Input
                className="input-field"
                type="number"
                placeholder="请输入验证码"
                value={code}
                onInput={(e) => setCode(e.detail.value)}
              />
            </View>
            <Button
              className="code-button"
              size="mini"
              disabled={!canSendCode || loading}
              onClick={handleSendCode}
            >
              {countdown > 0 ? `${countdown}秒` : '获取验证码'}
            </Button>
          </View>
        ) : (
          <View className="input-group">
            <Input
              className="input-field"
              password
              placeholder="请输入密码"
              value={password}
              onInput={(e) => setPassword(e.detail.value)}
            />
          </View>
        )}

        <Button
          className="auth-button"
          type="primary"
          loading={loading}
          disabled={loading}
          onClick={handleAuth}
        >
          {isCodeLogin ? '登录' : (isRegister ? '注册' : '登录')}
        </Button>

        {!isCodeLogin && (
          <View className="switch-auth">
            <Text className="switch-text" onClick={() => setIsRegister(!isRegister)}>
              {isRegister ? '已有账号？去登录' : '没有账号？去注册'}
            </Text>
          </View>
        )}

        <View className="switch-auth">
          <Text className="switch-text" onClick={() => setIsCodeLogin(!isCodeLogin)}>
            {isCodeLogin ? '使用密码登录/注册' : '使用验证码登录'}
          </Text>
        </View>
      </View>
    </View>
  )
}
