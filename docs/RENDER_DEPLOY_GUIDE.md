# 🚀 Render 后端免费部署指南

## 为什么选择 Render？

- ✅ **完全免费**：750 小时/月免费运行时间
- ✅ **无需信用卡**：直接用 GitHub 登录
- ✅ **自动 HTTPS**：免费 SSL 证书
- ✅ **支持 NestJS**：完美兼容我们的后端
- ⚠️ **自动休眠**：15分钟无访问会休眠（首次访问需要等待 30 秒唤醒）

---

## 📋 部署步骤（10分钟）

### 第一步：访问 Render

```
https://render.com
```

点击右上角 **"Get Started"** 或 **"Sign Up"**

---

### 第二步：用 GitHub 登录

1. 选择 **"Sign up with GitHub"**
2. 授权 Render 访问你的 GitHub
3. 登录后进入 Dashboard

---

### 第三步：创建 Web Service

1. 点击右上角 **"New +"**
2. 选择 **"Web Service"**

---

### 第四步：连接 GitHub 仓库

1. 点击 **"Connect account"** 或 **"Connect a repository"**
2. 找到你的仓库：`qixi-housekeeping`
3. 点击 **"Connect"**

---

### 第五步：配置服务

**基本信息：**
```
Name: qixi-housekeeping-api
Region: Oregon (US West) 或 Singapore (Southeast Asia)
Branch: main
Root Directory: server
Runtime: Node
```

**构建配置：**
```
Build Command: npm install -g pnpm && pnpm install && pnpm build
Start Command: pnpm start:prod
```

**实例类型：**
```
Instance Type: Free ✨ (选择免费套餐)
```

---

### 第六步：添加环境变量

点击 **"Advanced"** 展开，添加环境变量：

**必需的环境变量：**

| Key | Value | 说明 |
|-----|-------|------|
| `DATABASE_URL` | `postgresql://postgres.xxxxx:密码@host:6543/postgres` | Supabase 数据库连接字符串 |
| `JWT_SECRET` | `qixi-secret-2024` | JWT 密钥 |
| `NODE_ENV` | `production` | 生产环境 |
| `PORT` | `3000` | 端口号 |

**⚠️ DATABASE_URL 获取方法：**

1. 登录 Supabase
2. 左侧菜单：Settings → Database
3. 找到 Connection string → URI
4. 复制连接字符串，替换 `[YOUR-PASSWORD]` 为你的密码

---

### 第七步：开始部署

1. 检查所有配置是否正确
2. 点击底部 **"Create Web Service"**
3. 等待构建完成（约 3-5 分钟）

**部署流程：**
```
Cloning repository... (30秒)
    ↓
Installing dependencies... (2分钟)
    ↓
Building application... (1分钟)
    ↓
Deploying... (30秒)
    ↓
Live! 🎉
```

---

### 第八步：获取域名

部署成功后，Render 会自动分配一个域名：

```
https://qixi-housekeeping-api.onrender.com
```

**测试后端是否正常：**

在浏览器中访问：
```
https://你的域名.onrender.com/api/hello
```

应该看到：
```json
{"message":"Hello World"}
```

---

## 🔧 更新 Vercel 环境变量

**部署成功后，需要更新 Vercel 的环境变量：**

### 操作步骤：

1. 访问 Vercel Dashboard
2. 选择你的项目
3. 点击 **Settings** → **Environment Variables**
4. 找到或添加 `PROJECT_DOMAIN`
5. 更新为你的 Render 域名：
   ```
   https://qixi-housekeeping-api.onrender.com
   ```
6. 点击 **Save**
7. 重新部署项目（点击 Deployments → 最新的部署 → Redeploy）

---

## ⚠️ Render 免费套餐限制

| 限制项 | 说明 |
|--------|------|
| 运行时间 | 750 小时/月（足够运行 1 个服务） |
| 内存 | 512 MB RAM |
| CPU | 0.1 CPU |
| 自动休眠 | 15分钟无访问会休眠 |
| 唤醒时间 | 休眠后首次访问需要等待 30 秒 |

**解决休眠问题：**
- 使用 UptimeRobot 等免费监控服务，每 5 分钟访问一次
- 或使用付费套餐（$7/月）

---

## 🎯 验证部署成功

### 1. 测试后端 API

```bash
# 测试 Hello 接口
curl https://你的域名.onrender.com/api/hello

# 测试用户接口
curl https://你的域名.onrender.com/api/users

# 测试服务接口
curl https://你的域名.onrender.com/api/services
```

### 2. 测试前端连接

访问你的 Vercel 前端：
```
https://你的项目.vercel.app
```

测试功能：
- [ ] 首页是否正常加载
- [ ] 能否选择服务
- [ ] 能否提交预约

---

## 🔍 常见问题

### 问题 1：构建失败

**解决方案：**
1. 查看 Render 部署日志
2. 检查 `server` 目录是否存在
3. 确认 `package.json` 中有 `build` 和 `start:prod` 脚本
4. 检查 Node.js 版本兼容性

### 问题 2：数据库连接失败

**解决方案：**
1. 检查 DATABASE_URL 是否正确
2. 确认 Supabase 项目是否正常运行
3. 检查密码中是否包含特殊字符（需要 URL 编码）

### 问题 3：服务休眠

**解决方案：**
1. 首次访问需要等待 30 秒
2. 使用 UptimeRobot 保持服务唤醒
3. 或升级付费套餐

---

## 💰 升级付费套餐（可选）

如果免费套餐不够用，可以升级：

| 套餐 | 价格 | 配置 |
|------|------|------|
| Starter | $7/月 | 0.5 CPU, 512MB RAM, 不休眠 |
| Standard | $25/月 | 1 CPU, 2GB RAM, 不休眠 |
| Pro | $85/月 | 2 CPU, 4GB RAM, 不休眠 |

---

## 📞 需要帮助？

遇到问题时，提供以下信息：
1. Render 部署日志截图
2. 环境变量配置截图
3. 具体的错误信息

我会立即帮你解决！
