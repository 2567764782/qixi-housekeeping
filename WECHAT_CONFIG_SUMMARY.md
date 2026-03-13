# 📋 微信小程序配置快速参考

## 一键配置

```bash
bash scripts/config-wechat-app.sh
```

## 核心配置项

| 配置项 | 说明 | 获取方式 |
|--------|------|----------|
| **AppID** | 小程序唯一标识 | 微信公众平台 → 开发 → 开发设置 |
| **AppSecret** | 小程序密钥 | 微信公众平台 → 开发 → 开发设置 |
| **PROJECT_DOMAIN** | 服务器域名 | 你的域名 |
| **SUPABASE_URL** | 数据库地址 | Supabase Dashboard |
| **SUPABASE_ANON_KEY** | 数据库密钥 | Supabase Dashboard |

## 服务器域名白名单

登录微信公众平台 → 开发管理 → 开发设置 → 服务器域名

```
request:      https://your-domain.com
uploadFile:   https://your-domain.com
downloadFile: https://your-domain.com
socket:       wss://your-domain.com
```

## 配置文件位置

```
server/.env.production       # 生产环境配置
server/.env.development      # 开发环境配置
server/.env.wechat.example   # 配置模板
project.config.json          # 小程序项目配置
```

## 构建与发布

```bash
# 构建
pnpm build:weapp

# 上传
微信开发者工具 → 导入项目（选择 dist 目录）→ 上传

# 提交审核
小程序后台 → 版本管理 → 提交审核
```

## 功能对接

### 微信登录
```typescript
const { code } = await Taro.login()
await Network.request({ url: '/api/auth/wechat-login', method: 'POST', data: { code } })
```

### 微信支付
```typescript
await Taro.requestPayment({
  timeStamp: 'xxx',
  nonceStr: 'xxx',
  package: 'xxx',
  signType: 'MD5',
  paySign: 'xxx'
})
```

### 订阅消息
```typescript
await Taro.requestSubscribeMessage({ tmplIds: ['模板ID'] })
```

## 调试技巧

```javascript
// 开启 vconsole
localStorage.setItem('enableVConsole', 'true')

// 关闭域名校验（仅开发环境）
微信开发者工具 → 详情 → 本地设置 → 不校验合法域名
```

## 常见问题

**Q: request 请求失败？**
A: 检查域名是否配置，是否使用 HTTPS

**Q: 微信登录失败？**
A: 检查 AppID/AppSecret 是否正确

**Q: 支付签名错误？**
A: 检查商户号和 API 密钥配置

**Q: 订阅消息发送失败？**
A: 检查模板ID和用户订阅状态

## 更多文档

- 📖 [快速配置指南](QUICK_START_WECHAT.md)
- 📖 [详细配置文档](docs/WECHAT_APP_SETUP.md)
- 📖 [项目 README](README.md)
