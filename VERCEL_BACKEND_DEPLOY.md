# 🚀 使用 Vercel 部署后端（详细指南）

## 为什么选择 Vercel？

- ✅ 国内访问稳定
- ✅ 免费额度充足
- ✅ 支持 NestJS
- ✅ 自动 HTTPS 域名
- ✅ 部署简单快速

---

## 第一步：访问 Vercel 官网

**点击这个链接**：
```
https://vercel.com
```

---

## 第二步：使用 GitHub 登录

1. 点击 **"Sign Up"** 或 **"Log In"**
2. 选择 **"Continue with GitHub"**
3. 授权 Vercel 访问你的 GitHub 账号

---

## 第三步：导入项目

1. 登录后，点击 **"Add New..."** → **"Project"**
2. 在 **"Import Git Repository"** 部分
3. 找到并选择：`2567764782/qixi-housekeeping`
4. 点击 **"Import"**

**如果看不到你的仓库**：
- 点击 **"Adjust GitHub App Permissions"**
- 授权 Vercel 访问你的仓库

---

## 第四步：配置项目（重要！）

### Framework Preset（框架预设）

**在 "Framework Preset" 下拉框中**：
- 选择 **"NestJS"** 或 **"Other"**

### Root Directory（根目录）

**这个非常重要！**

1. 展开 **"Root Directory"** 设置
2. 点击 **"Edit"**
3. 选择 **"server"** 文件夹
4. 点击 **"Continue"**

**为什么要设置 Root Directory？**
- 因为后端代码在 `server/` 文件夹里
- Vercel 需要知道从哪个文件夹开始部署

---

## 第五步：配置环境变量

**在 "Environment Variables" 部分**：

点击 **"Add Variable"**，逐个添加以下变量：

### 1. DATABASE_URL
```
Name: DATABASE_URL
Value: postgresql://postgres.tpwkvuzbjxpqjiewktdy:你的密码@aws-0-ap-south-1.pooler.supabase.com:6543/postgres
```
**记得把 "你的密码" 替换成实际密码！**

### 2. SUPABASE_URL
```
Name: SUPABASE_URL
Value: https://tpwkvuzbjxpqjiewktdy.supabase.co
```

### 3. SUPABASE_ANON_KEY
```
Name: SUPABASE_ANON_KEY
Value: 你复制的anon public key（那个很长的字符串）
```

### 4. JWT_SECRET
```
Name: JWT_SECRET
Value: my-super-secret-jwt-key-qixi-2024
```
（这个可以自己随便设置，用于JWT加密）

### 5. NODE_ENV
```
Name: NODE_ENV
Value: production
```

### 6. PORT（可选）
```
Name: PORT
Value: 3000
```

---

## 第六步：部署项目

1. 确认所有配置正确
2. 点击 **"Deploy"** 按钮
3. 等待部署完成（通常需要 2-5 分钟）

**部署过程中你会看到**：
- Building...（构建中）
- Deploying...（部署中）
- ✅ Ready!（完成）

---

## 第七步：获取后端地址

部署完成后：

1. 你会看到一个域名，类似：
   ```
   https://qixi-housekeeping.vercel.app
   或
   https://qixi-housekeeping-xxx.vercel.app
   ```

2. **这就是你的后端 API 地址！**

---

## ✅ 部署成功后测试

### 测试 API 是否正常：

**在浏览器访问**：
```
https://你的域名/api
```

如果返回数据，说明部署成功！

---

## 📞 部署完成后告诉我

回复 **"后端已部署"**，并提供你的 Vercel 域名，我会：
1. 帮你测试 API 是否正常
2. 继续部署前端

---

## 🆘 遇到问题？

### 问题 1：找不到 qixi-housekeeping 仓库
**解决方案**：
- 点击 "Adjust GitHub App Permissions"
- 授权 Vercel 访问你的所有仓库

### 问题 2：Root Directory 设置不了
**解决方案**：
- 先导入项目
- 在 Settings 中再修改 Root Directory

### 问题 3：部署失败
**解决方案**：
- 检查环境变量是否正确
- 查看 Vercel 的构建日志
- 确保 DATABASE_URL 中的密码已正确替换

### 问题 4：API 返回 404
**解决方案**：
- 检查 Root Directory 是否设置为 `server`
- 检查 API 路由是否正确配置

---

准备好了吗？访问 **https://vercel.com** 开始部署！🚀
