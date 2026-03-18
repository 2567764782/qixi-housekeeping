# 🗄️ 第一步：创建 Supabase 数据库

## 什么是 Supabase？

Supabase 是一个开源的 Firebase 替代品，提供：
- ✅ PostgreSQL 数据库（免费 500MB）
- ✅ 自动生成 API
- ✅ 实时订阅
- ✅ 身份认证

---

## 📝 创建步骤

### 步骤 1：访问 Supabase 官网

**点击这个链接**：
```
https://supabase.com
```

---

### 步骤 2：注册/登录

**推荐使用 GitHub 登录**（最简单）：
1. 点击 **"Start your project"**
2. 选择 **"Sign in with GitHub"**
3. 授权 Supabase 访问你的 GitHub

---

### 步骤 3：创建组织

1. 登录后，点击 **"New Organization"**
2. 填写组织信息：
   - **Name**: `qixi-housekeeping`
   - **Plan**: 选择 **Free**（免费版）
3. 点击 **"Create new organization"**

---

### 步骤 4：创建项目

1. 在组织页面，点击 **"New Project"**
2. 填写项目信息：
   - **Name**: `qixi-housekeeping`
   - **Database Password**: 设置一个复杂密码
     - 建议：`Qixi2024!@#$`（记住这个密码，后面要用）
   - **Region**: 选择 **Northeast Asia (Tokyo)**
   - **Plan**: 选择 **Free**
3. 点击 **"Create new project"**

---

### 步骤 5：等待项目创建

⏱️ 大约需要 2-3 分钟，请耐心等待...

---

### 步骤 6：获取数据库连接信息

项目创建完成后：

1. 点击左侧菜单 **"Settings"** ⚙️
2. 点击 **"Database"**
3. 找到 **"Connection string"** 部分
4. 选择 **"URI"** 格式
5. 复制连接字符串

**连接字符串格式**：
```
postgresql://postgres.[项目ID]:[密码]@aws-0-ap-northeast-1.pooler.supabase.com:6543/postgres
```

**重要**：
- ⚠️ 把 `[密码]` 替换成你设置的密码
- ⚠️ 保存好这个连接字符串，后面部署要用

---

### 步骤 7：获取 API 密钥

1. 点击左侧菜单 **"Settings"** ⚙️
2. 点击 **"API"**
3. 找到以下信息并保存：
   - **Project URL**: `https://[项目ID].supabase.co`
   - **anon public key**: `eyJhbGciOiJ...`（很长的字符串）

---

## ✅ 完成后你会有这些信息

请保存好以下信息，后面部署要用：

```
1. DATABASE_URL（数据库连接字符串）
   postgresql://postgres.[项目ID]:[密码]@aws-0-ap-northeast-1.pooler.supabase.com:6543/postgres

2. SUPABASE_URL
   https://[项目ID].supabase.co

3. SUPABASE_ANON_KEY
   eyJhbGciOiJ...
```

---

## 📞 完成后告诉我

当你获取到 **DATABASE_URL** 后，回复 **"数据库已创建"**，我会帮你进行下一步：部署后端到 Railway。

---

## 🆘 遇到问题？

### 问题 1：GitHub 登录失败
**解决方案**：尝试用邮箱注册

### 问题 2：找不到创建项目按钮
**解决方案**：先创建组织（Organization），然后才能创建项目

### 问题 3：地区选择
**解决方案**：选择离中国最近的 Tokyo 节点

---

准备好了就开始吧！🚀
