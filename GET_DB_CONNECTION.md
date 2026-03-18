# 🎯 在当前页面获取数据库连接字符串

## 你现在在：Schema Visualizer 页面

### ✅ 第一步：点击左侧菜单的 "Settings"

在左侧菜单中，找到 **"CONFIGURATION"** 部分：

```
CONFIGURATION
├── Roles
├── Policies
└── Settings      ← 点击这个！
```

**点击 "Settings"**

---

### ✅ 第二步：找到 Connection string

在 Settings 页面中：

1. **向下滚动**
2. **找到 "Connection string" 部分**
3. **点击 "URI" 标签**
4. **复制显示的连接字符串**

连接字符串格式：
```
postgresql://postgres.tpwkvuzbjxpqjiewktdy:[YOUR-PASSWORD]@aws-0-ap-south-1.pooler.supabase.com:6543/postgres
```

**记得把 `[YOUR-PASSWORD]` 替换成你的密码！**

---

### ✅ 第三步：获取 API 密钥

**点击左侧菜单最上方的 🔐 Authentication 图标**（锁的形状）

然后：
1. **点击左侧的 "URL Configuration"**
2. **你会看到**：
   - **Project URL**: `https://tpwkvuzbjxpqjiewktdy.supabase.co`
   - **anon key**: 一个很长的字符串

---

## 📋 你需要的信息

```
1. DATABASE_URL（数据库连接字符串）
   postgresql://postgres.tpwkvuzbjxpqjiewktdy:你的密码@aws-0-ap-south-1.pooler.supabase.com:6543/postgres

2. SUPABASE_URL
   https://tpwkvuzbjxpqjiewktdy.supabase.co

3. SUPABASE_ANON_KEY
   eyJhbGciOiJ...（很长的字符串）
```

---

## 🎯 现在就点击左侧的 "Settings" 吧！

这是获取数据库连接字符串的最直接方法！
