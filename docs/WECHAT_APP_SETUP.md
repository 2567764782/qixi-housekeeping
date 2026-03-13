# 微信小程序一键配置指南

## 快速开始

使用一键配置脚本，快速完成微信小程序的配置：

```bash
bash scripts/config-wechat-app.sh
```

脚本会引导你完成以下配置：
- ✅ 微信小程序 AppID
- ✅ 微信小程序 AppSecret
- ✅ 服务器域名
- ✅ 微信支付商户号（可选）
- ✅ Supabase 数据库配置
- ✅ Redis 缓存配置
- ✅ Elasticsearch 配置（可选）
- ✅ 阿里云短信配置（可选）

## 手动配置

如果你想手动配置，请按照以下步骤操作：

### 1. 获取微信小程序 AppID

1. 登录 [微信公众平台](https://mp.weixin.qq.com/)
2. 在"开发" → "开发设置"中找到 AppID
3. AppID 格式：`wx` 开头，共18位字符

### 2. 配置 project.config.json

在项目根目录创建 `project.config.json`：

```json
{
  "miniprogramRoot": "dist/",
  "setting": {
    "urlCheck": true,
    "es6": true,
    "minified": true
  },
  "appid": "你的AppID",
  "projectname": "保洁服务平台"
}
```

### 3. 配置环境变量

创建 `server/.env.production`：

```bash
# 微信小程序配置
WECHAT_APP_ID=你的AppID
WECHAT_APP_SECRET=你的AppSecret
PROJECT_DOMAIN=https://your-domain.com

# 微信支付配置（可选）
WECHAT_MCH_ID=你的商户号
WECHAT_API_KEY=你的API密钥

# 数据库配置
SUPABASE_URL=你的Supabase URL
SUPABASE_ANON_KEY=你的Supabase Anon Key

# Redis 配置
REDIS_HOST=localhost
REDIS_PORT=6379

# JWT 配置
JWT_SECRET=随机生成的密钥
JWT_EXPIRES_IN=7d
```

### 4. 配置服务器域名

登录微信公众平台 → 开发管理 → 开发设置 → 服务器域名

添加以下域名：

```
request 合法域名：
https://your-domain.com

uploadFile 合法域名：
https://your-domain.com

downloadFile 合法域名：
https://your-domain.com

socket 合法域名：
wss://your-domain.com
```

## 功能对接

### 微信登录

```typescript
// 前端调用
const { code } = await Taro.login()
const res = await Network.request({
  url: '/api/auth/wechat-login',
  method: 'POST',
  data: { code }
})
```

### 微信支付

```typescript
// 统一下单
const res = await Network.request({
  url: '/api/payment/unified-order',
  method: 'POST',
  data: { orderId }
})

// 调起支付
await Taro.requestPayment({
  timeStamp: res.data.data.timeStamp,
  nonceStr: res.data.data.nonceStr,
  package: res.data.data.package,
  signType: 'MD5',
  paySign: res.data.data.paySign
})
```

### 订阅消息

```typescript
// 申请订阅
await Taro.requestSubscribeMessage({
  tmplIds: ['模板ID1', '模板ID2']
})
```

## 部署流程

### 1. 构建项目

```bash
# 安装依赖
pnpm install

# 构建生产版本
pnpm build:weapp
```

### 2. 上传代码

1. 打开微信开发者工具
2. 导入项目，选择 `dist` 目录
3. 配置 AppID
4. 点击"上传"

### 3. 提交审核

1. 登录微信小程序后台
2. 版本管理 → 开发版本 → 提交审核
3. 填写审核信息

## 调试技巧

### 开启 vconsole

```javascript
localStorage.setItem('enableVConsole', 'true')
```

### 查看网络请求

所有网络请求都会打印到控制台，包括：
- 请求 URL
- 请求方法
- 请求参数
- 响应数据

## 常见问题

### Q1: request 请求失败？
检查服务器域名是否配置正确，是否使用 HTTPS。

### Q2: 微信登录失败？
检查 AppID 和 AppSecret 是否正确，code 是否有效。

### Q3: 支付签名错误？
检查商户号、API密钥配置，签名算法是否正确。

### Q4: 订阅消息发送失败？
检查模板ID是否正确，用户是否同意订阅。

## 安全建议

1. **不要在前端代码中硬编码敏感信息**
2. **使用环境变量存储密钥**
3. **生产环境必须使用 HTTPS**
4. **定期更新 JWT 密钥**
5. **限制 API 访问频率**

## 更多帮助

- [微信小程序官方文档](https://developers.weixin.qq.com/miniprogram/dev/framework/)
- [微信支付官方文档](https://pay.weixin.qq.com/wiki/doc/api/index.html)
- 项目 README.md
