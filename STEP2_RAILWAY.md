# 🚂 第二步：部署后端到 Railway

## 什么是 Railway？

Railway 是一个现代化的云平台，用于部署后端服务：
- ✅ 免费额度：$5/月（足够小型项目使用）
- ✅ 自动部署：连接 GitHub 自动部署
- ✅ 支持 Node.js/NestJS
- ✅ 自动提供 HTTPS 域名

---

## 📋 部署步骤

### 第一步：访问 Railway 官网

**点击这个链接**：
```
https://railway.app
```

---

### 第二步：使用 GitHub 登录

1. 点击 **"Start a New Project"**
2. 选择 **"Login with GitHub"**
3. 授权 Railway 访问你的 GitHub

---

### 第三步：创建新项目

1. 登录后，点击 **"New Project"**
2. 选择 **"Deploy from GitHub repo"**
3. 找到并选择：`2567764782/qixi-housekeeping`
4. 点击 **"Deploy Now"**

---

### 第四步：配置项目

**重要设置**：

1. **Root Directory**（根目录）：
   - 点击 **"Settings"**
   - 找到 **"Root Directory"**
   - 设置为：`server`
   - **这个很重要！因为后端代码在 server 文件夹里**

2. **Build Command**（构建命令）：
   - Railway 会自动检测，通常是：`npm run build`

3. **Start Command**（启动命令）：
   - Railway 会自动检测，通常是：`npm run start:prod`

---

### 第五步：配置环境变量

**点击 "Variables" 标签页，添加以下环境变量**：

```
DATABASE_URL=postgresql://postgres.tpwkvuzbjxpqjiewktdy:你的密码@aws-0-ap-south-1.pooler.supabase.com:6543/postgres

SUPABASE_URL=https://tpwkvuzbjxpqjiewktdy.supabase.co

SUPABASE_ANON_KEY=你复制的anon public key

JWT_SECRET=随机字符串（用于JWT加密）
例如：my-super-secret-jwt-key-2024

NODE_ENV=production

PORT=3000
```

**添加方法**：
1. 点击 **"Add Variable"**
2. 输入变量名和值
3. 点击 **"Add"**
4. 重复以上步骤添加所有变量

---

### 第六步：部署项目

1. 点击 **"Deployments"** 标签页
2. Railway 会自动开始部署
3. 等待部署完成（通常需要 2-5 分钟）

---

### 第七步：获取后端地址

部署完成后：

1. 点击 **"Settings"** 标签页
2. 向下滚动，找到 **"Domains"** 部分
3. 点击 **"Generate Domain"**
4. 你会得到一个域名，类似：
   ```
   https://qixi-housekeeping-production.up.railway.app
   ```

**这就是你的后端 API 地址！**

---

## ✅ 部署成功后

你会得到：
- ✅ 后端 API 地址：`https://xxx.up.railway.app`
- ✅ 所有 API 端点都可以正常访问

---

## 📞 部署完成后告诉我

回复 **"后端已部署"**，我会帮你：
1. 测试后端 API 是否正常工作
2. 继续部署前端到 Vercel

---

## 🆘 遇到问题？

### 问题 1：找不到 qixi-housekeeping 仓库
**解决方案**：
- 确保你已经在 GitHub 上传了代码
- 点击 "Configure GitHub App" 授权 Railway 访问你的仓库

### 问题 2：部署失败
**解决方案**：
- 检查 Root Directory 是否设置为 `server`
- 检查环境变量是否正确配置
- 查看 Railway 的构建日志

### 问题 3：环境变量配置错误
**解决方案**：
- 确保 DATABASE_URL 中的密码已正确替换
- 确保 SUPABASE_ANON_KEY 是完整的长字符串

---

准备好了吗？访问 **https://railway.app** 开始部署！🚀
