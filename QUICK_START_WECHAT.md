# 🚀 微信小程序快速配置指南

## 一键配置（推荐）

运行自动配置脚本：

```bash
bash scripts/config-wechat-app.sh
```

脚本会引导你完成所有配置，包括：
- ✅ 微信小程序 AppID
- ✅ 服务器域名
- ✅ 数据库连接
- ✅ 微信支付（可选）

## 手动配置

### 步骤 1: 获取 AppID

1. 登录 [微信公众平台](https://mp.weixin.qq.com/)
2. 开发 → 开发设置 → 复制 AppID

### 步骤 2: 配置环境变量

复制配置模板：

```bash
cp server/.env.wechat.example server/.env.production
```

编辑 `server/.env.production`，填入你的配置：

```bash
# 必填项
WECHAT_APP_ID=wx你的AppID
WECHAT_APP_SECRET=你的AppSecret
PROJECT_DOMAIN=https://your-domain.com
SUPABASE_URL=你的Supabase URL
SUPABASE_ANON_KEY=你的Supabase Anon Key

# 可选项（如果需要支付）
WECHAT_MCH_ID=你的商户号
WECHAT_API_KEY=你的API密钥
```

### 步骤 3: 配置 project.config.json

```bash
cp server/.env.wechat.example server/.env.development
```

编辑 `project.config.json`，修改 AppID：

```json
{
  "appid": "wx你的AppID",
  "projectname": "保洁服务平台"
}
```

### 步骤 4: 配置服务器域名

登录微信公众平台 → 开发管理 → 开发设置 → 服务器域名

添加：
- `request`: `https://your-domain.com`
- `uploadFile`: `https://your-domain.com`
- `downloadFile`: `https://your-domain.com`
- `socket`: `wss://your-domain.com`

## 构建与发布

### 构建项目

```bash
# 安装依赖
pnpm install

# 构建小程序
pnpm build:weapp
```

### 上传代码

1. 打开微信开发者工具
2. 导入项目，选择 `dist` 目录
3. 点击"上传"

### 提交审核

登录小程序后台 → 版本管理 → 开发版本 → 提交审核

## 配置检查清单

- [ ] AppID 已配置
- [ ] AppSecret 已配置（后端）
- [ ] 服务器域名已添加白名单
- [ ] 数据库连接已配置
- [ ] 支付功能已配置（如需要）
- [ ] 订阅消息模板已申请（如需要）

## 常见问题

### Q: 如何获取 AppSecret？
A: 微信公众平台 → 开发 → 开发设置 → 开发者ID → AppSecret（重置后显示）

### Q: 服务器域名必须是 HTTPS 吗？
A: 是的，生产环境必须使用 HTTPS

### Q: 开发环境可以使用 HTTP 吗？
A: 可以，在微信开发者工具中关闭"域名校验"：详情 → 本地设置 → 不校验合法域名

### Q: 如何开启调试模式？
A: 在控制台执行：
```javascript
localStorage.setItem('enableVConsole', 'true')
```

## 获取帮助

- 📖 详细文档：[docs/WECHAT_APP_SETUP.md](docs/WECHAT_APP_SETUP.md)
- 🐛 问题反馈：提交 Issue
- 💬 微信社区：[微信开放社区](https://developers.weixin.qq.com/community/)

## 下一步

配置完成后，开始开发你的小程序功能：

```bash
# 启动开发服务器
pnpm dev

# 在另一个终端启动后端
cd server && pnpm start:dev
```

---

💡 提示：首次配置建议使用一键配置脚本，更简单快捷！
