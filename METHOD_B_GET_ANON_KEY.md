# 🔑 方法 B：访问 API 设置页面获取 anon key

## 第一步：访问 API 设置页面

**复制并访问这个链接**：
```
https://supabase.com/dashboard/project/tpwkvuzbjxpqjiewktdy/settings/api
```

---

## 第二步：找到 Project API keys 部分

在页面中找到 **"Project API keys"** 部分

---

## 第三步：复制 anon public key

你会看到两个密钥：

### 1. anon public（公开密钥）← 复制这个！
- 标签：`anon` 或 `anon public`
- 这是一个很长的字符串，类似：
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRwd2t2dXpianhwcWppZXdrdGR5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAxMjM0NTYsImV4cCI6MjA1NTY5OTQ1Nn0.xxxxx...
```

**操作**：
- 点击右侧的复制按钮 📋
- 保存为：`SUPABASE_ANON_KEY`

### 2. service_role（服务密钥）← 不要复制！
- ⚠️ 这是私密密钥，不要泄露！

---

## ✅ 完整信息清单

获取到 anon public key 后，你就拥有所有需要的信息了：

```
✅ DATABASE_URL
   postgresql://postgres.tpwkvuzbjxpqjiewktdy:你的密码@aws-0-ap-south-1.pooler.supabase.com:6543/postgres

✅ SUPABASE_URL
   https://tpwkvuzbjxpqjiewktdy.supabase.co

✅ SUPABASE_ANON_KEY
   eyJhbGciOiJ...（从 API 页面复制的长字符串）
```

---

## 🎯 下一步

当你获取到 anon public key 后，回复：

**"信息已获取"**

或者把 anon public key 复制给我，我会帮你进行下一步：部署后端到 Railway。
