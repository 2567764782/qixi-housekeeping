import { useState } from 'react'
import { View, Text, Input, Button } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { Network } from '@/network'
import './index.css'

export default function LoginPage() {
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [isRegister, setIsRegister] = useState(false)
  const [nickname, setNickname] = useState('')

  const handleAuth = async () => {
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

  return (
    <View className="login-container">
      <View className="login-card">
        <Text className="login-title">{isRegister ? '注册' : '登录'}</Text>

        {isRegister && (
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

        <View className="input-group">
          <Input
            className="input-field"
            password
            placeholder="请输入密码"
            value={password}
            onInput={(e) => setPassword(e.detail.value)}
          />
        </View>

        <Button
          className="auth-button"
          type="primary"
          loading={loading}
          disabled={loading}
          onClick={handleAuth}
        >
          {isRegister ? '注册' : '登录'}
        </Button>

        <View className="switch-auth">
          <Text className="switch-text" onClick={() => setIsRegister(!isRegister)}>
            {isRegister ? '已有账号？去登录' : '没有账号？去注册'}
          </Text>
        </View>
      </View>
    </View>
  )
}
