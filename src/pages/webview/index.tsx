import Taro, { useLoad } from '@tarojs/taro'
import { View, WebView } from '@tarojs/components'
import { useState } from 'react'
import './index.css'

const WebViewPage = () => {
  const [url, setUrl] = useState('')

  useLoad((options) => {
    console.log('🔗 接收到的 URL 参数:', options)
    if (options && options.url) {
      setUrl(decodeURIComponent(options.url))
    } else {
      Taro.showToast({
        title: '链接无效',
        icon: 'none'
      })
      setTimeout(() => {
        Taro.navigateBack()
      }, 1500)
    }
  })

  return (
    <View className="w-full h-full">
      {url && (
        <WebView src={url} className="w-full h-full" />
      )}
    </View>
  )
}

export default WebViewPage
