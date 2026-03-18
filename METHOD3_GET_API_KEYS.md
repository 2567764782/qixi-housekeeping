# 🔑 方法 3：获取 API 密钥详细步骤

## 第一步：访问 API 设置页面

**直接访问这个链接**：
```
https://supabase.com/dashboard/project/tpwkvuzbjxpqjiewktdy/settings/api
```

**或者手动导航**：
1. 点击页面左上角的图标，回到项目首页
2. 点击左侧菜单的 ⚙️ Settings
3. 点击 API

---

## 第二步：复制信息

### 1. Project URL（项目 URL）

你会看到一个文本框：
```
https://tpwkvuzbjxpqjiewktdy.supabase.co
```

**操作**：
- 点击右侧的复制按钮 📋
- 保存为：`SUPABASE_URL`

---

### 2. Project API keys（API 密钥）

你会看到两个密钥：

#### anon public（公开密钥）← 复制这个！
- 这是一个很长的字符串，类似：
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRwd2t2dXpianhwcWppZXdrdGR5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAxMjM0NTYsImV4cCI6MjA1NTY5OTQ1Nn0.xxxxx...
```

**操作**：
- 点击右侧的复制按钮 📋
- 保存为：`SUPABASE_ANON_KEY`

#### service_role（服务密钥）← 不要复制！
- ⚠️ 这是私密密钥，不要泄露！

---

## 第三步：构造数据库连接字符串

使用项目 ID 和你的密码，构造连接字符串：

```
postgresql://postgres.tpwkvuzbjxpqjiewktdy:你的密码@aws-0-ap-south-1.pooler.supabase.com:6543/postgres
```

**替换 "你的密码" 为你创建项目时设置的密码**

**保存为：`DATABASE_URL`**

---

## ✅ 完整信息清单

请保存好这 3 个信息：

```
1. DATABASE_URL
   postgresql://postgres.tpwkvuzbjxpqjiewktdy:你的密码@aws-0-ap-south-1.pooler.supabase.com:6543/postgres

2. SUPABASE_URL
   https://tpwkvuzbjxpqjiewktdy.supabase.co

3. SUPABASE_ANON_KEY
   eyJhbGciOiJ...（从 API 页面复制的长字符串）
```

---

## 🎯 下一步

当你获取到这 3 个信息后，回复：

**"信息已获取"**

我会帮你进行下一步：部署后端到 Railway。
