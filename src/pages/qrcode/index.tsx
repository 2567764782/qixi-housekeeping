import Taro from '@tarojs/taro'
import { View, Text, Image, Button, ScrollView } from '@tarojs/components'
import { ArrowLeft, Copy, QrCode } from 'lucide-react-taro'
import './index.css'

const QrcodePage = () => {
  const handleCopyWechat = () => {
    Taro.setClipboardData({
      data: 'your_wechat_id', // 替换为实际的微信号
      success: () => {
        Taro.showToast({
          title: '微信号已复制',
          icon: 'success'
        })
      }
    })
  }

  const handleSaveImage = () => {
    Taro.saveImageToPhotosAlbum({
      filePath: 'https://images.unsplash.com/photo-1616322427078-ec595747c258?w=600&h=600&fit=crop',
      success: () => {
        Taro.showToast({
          title: '已保存到相册',
          icon: 'success'
        })
      },
      fail: (err) => {
        console.error('保存图片失败:', err)
        Taro.showToast({
          title: '保存失败',
          icon: 'none'
        })
      }
    })
  }

  return (
    <View className="qrcode-page">
      {/* 导航栏 */}
      <View className="navbar">
        <View className="navbar-content">
          <View
            className="nav-back"
            onClick={() => {
              Taro.navigateBack()
            }}
          >
            <ArrowLeft size={24} color="#333" />
          </View>
          <Text className="nav-title">扫码入群</Text>
          <View className="nav-placeholder" />
        </View>
      </View>

      {/* 主内容区 */}
      <ScrollView className="content">
        <View className="qrcode-container">
          {/* 标题区域 */}
          <View className="header-section">
            <View className="icon-wrapper">
              <QrCode size={48} color="#10B981" />
            </View>
            <Text className="title">扫码加入服务交流群</Text>
            <Text className="subtitle">获取最新服务资讯 · 享受专属优惠</Text>
          </View>

          {/* 二维码卡片 */}
          <View className="qrcode-card">
            <View className="qrcode-wrapper">
              <Image
                className="qrcode-image"
                src="https://images.unsplash.com/photo-1616322427078-ec595747c258?w=600&h=600&fit=crop"
                mode="widthFix"
              />
            </View>

            {/* 提示信息 */}
            <View className="tips-section">
              <Text className="tips-title">使用说明</Text>
              <View className="tips-list">
                <View className="tips-item">
                  <View className="tips-dot" />
                  <Text className="tips-text">长按识别二维码</Text>
                </View>
                <View className="tips-item">
                  <View className="tips-dot" />
                  <Text className="tips-text">点击&ldquo;加入群聊&rdquo;按钮</Text>
                </View>
                <View className="tips-item">
                  <View className="tips-dot" />
                  <Text className="tips-text">等待管理员审核通过</Text>
                </View>
              </View>
            </View>
          </View>

          {/* 微信号区域 */}
          <View className="wechat-section">
            <View className="wechat-info">
              <Text className="wechat-label">微信号</Text>
              <Text className="wechat-id">your_wechat_id</Text>
            </View>
            <View
              className="copy-button"
              onClick={handleCopyWechat}
            >
              <Copy size={16} color="#10B981" />
              <Text className="copy-text">复制</Text>
            </View>
          </View>

          {/* 客服信息 */}
          <View className="service-section">
            <Text className="service-title">如扫码失败，请联系客服</Text>
            <Text className="service-phone">客服电话：400-888-8888</Text>
            <Text className="service-time">服务时间：9:00-21:00</Text>
          </View>

          {/* 保存按钮 */}
          <View className="action-section">
            <Button className="save-button" onClick={handleSaveImage}>
              保存二维码到相册
            </Button>
          </View>
        </View>
      </ScrollView>
    </View>
  )
}

export default QrcodePage
