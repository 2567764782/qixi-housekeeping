# 🚀 Fly.io 后端免费部署指南

## 为什么选择 Fly.io？

- ✅ **完全免费**：3 个共享 CPU VM（共 550 小时/月）
- ✅ **无需信用卡**：直接用 GitHub 登录
- ✅ **支持 NestJS**：完美兼容我们的后端
- ✅ **不休眠**：服务持续运行，响应更快
- ✅ **全球 CDN**：自动选择最近的节点

---

## 📋 部署步骤（10分钟）

### 第一步：访问 Fly.io

```
https://fly.io
```

点击 **"Sign Up"** 或 **"Get Started"**

---

### 第二步：用 GitHub 登录

1. 选择 **"Sign up with GitHub"**
2. 授权 Fly.io 访问你的 GitHub
3. 登录后进入 Dashboard

---

### 第三步：安装 Fly CLI（可选，推荐）

**本地安装：**
```bash
# macOS
brew install flyctl

# Windows
iwr https://fly.io/install.ps1 -useb | iex

# Linux
curl -L https://fly.io/install.sh | sh
```

**或者使用 Web 终端：**
- Fly.io 提供在线终端，无需本地安装

---

### 第四步：创建应用

**方法一：使用 Web Dashboard（推荐）**

1. 访问：`https://fly.io/dashboard`
2. 点击 **"Launch"** 或 **"Create App"**
3. 选择 **"Deploy from GitHub"**
4. 选择你的仓库：`qixi-housekeeping`
5. 配置：
   ```
   App Name: qixi-housekeeping-api
   Region: Hong Kong (hkg) 或 Tokyo (nrt)
   Organization: Personal
   ```

**方法二：使用命令行**

```bash
# 登录
flyctl auth login

# 进入 server 目录
cd server

# 创建应用
flyctl apps create qixi-housekeeping-api

# 设置 secrets（环境变量）
flyctl secrets set DATABASE_URL="postgresql://postgres:aB3xY9zK2mN5pQ8r@db.owogoivpqbbiuqjgwbjn.supabase.co:5432/postgres"
flyctl secrets set JWT_SECRET="qixi-secret-2024"
flyctl secrets set NODE_ENV="production"
flyctl secrets set PORT="3000"

# 部署
flyctl deploy
```

---

### 第五步：配置 fly.toml

**在 `server` 目录创建 `fly.toml` 文件：**

```toml
app = "qixi-housekeeping-api"
primary_region = "hkg"

[build]
  builder = "heroku/buildpacks:20"

[env]
  PORT = "3000"
  NODE_ENV = "production"

[[services]]
  internal_port = 3000
  protocol = "tcp"

  [[services.ports]]
    handlers = ["http"]
    port = 80

  [[services.ports]]
    handlers = ["tls", "http"]
    port = 443
```

---

### 第六步：部署

**使用 Web Dashboard：**
1. 点击 **"Deploy"**
2. 等待构建完成（约 3-5 分钟）

**使用命令行：**
```bash
cd server
flyctl deploy
```

---

### 第七步：获取域名

**部署成功后，Fly.io 会分配域名：**

```
https://qixi-housekeeping-api.fly.dev
```

**查看域名：**
1. 访问：`https://fly.io/dashboard`
2. 点击你的应用
3. 页面顶部会显示域名

---

## 🔧 更新 Vercel 环境变量

**部署成功后，更新 Vercel 的环境变量：**

1. 访问 Vercel Dashboard
2. 选择你的项目：`qixi-housekeeping`
3. 点击 **Settings** → **Environment Variables**
4. 添加或更新 `PROJECT_DOMAIN`：
   ```
   https://qixi-housekeeping-api.fly.dev
   ```
5. 点击 **Save**
6. 重新部署项目

---

## ⚠️ Fly.io 免费套餐限制

| 限制项 | 说明 |
|--------|------|
| 运行时间 | 550 小时/月（足够运行 3 个服务） |
| 内存 | 256 MB RAM |
| 存储 | 3 GB 永久存储 |
| 带宽 | 160 GB/月 |

**对于小型项目，这些额度完全够用！**

---

## 🎯 验证部署成功

### 测试后端 API

```bash
# 测试 Hello 接口
curl https://qixi-housekeeping-api.fly.dev/api/hello

# 测试用户接口
curl https://qixi-housekeeping-api.fly.dev/api/users

# 测试服务接口
curl https://qixi-housekeeping-api.fly.dev/api/services
```

### 测试前端连接

访问你的 Vercel 前端：
```
https://qixi-housekeeping.vercel.app
```

---

## 🔍 常见问题

### 问题 1：构建失败

**解决方案：**
1. 查看构建日志
2. 确认 `server` 目录存在
3. 检查 `package.json` 中的脚本

### 问题 2：内存不足

**解决方案：**
1. 优化代码，减少内存占用
2. 升级付费套餐（$1.94/月起）

### 问题 3：环境变量未生效

**解决方案：**
1. 使用 `flyctl secrets list` 查看环境变量
2. 重新设置环境变量
3. 重新部署

---

## 💰 升级付费套餐（可选）

如果免费套餐不够用：

| 套餐 | 价格 | 配置 |
|------|------|------|
| Starter | $1.94/月 | 256MB RAM, shared CPU |
| Standard | $5.83/月 | 512MB RAM, shared CPU |
| Pro | $11.67/月 | 1GB RAM, shared CPU |

---

## 📞 需要帮助？

遇到问题时，提供以下信息：
1. Fly.io 构建日志截图
2. 环境变量配置截图
3. 具体的错误信息

我会立即帮你解决！
