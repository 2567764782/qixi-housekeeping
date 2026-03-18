# 🎯 Connect 弹窗操作指南

## 你现在看到的是：连接配置弹窗

这个弹窗显示了所有你需要的连接信息！

---

## ✅ 第一步：获取数据库连接字符串（DATABASE_URL）

### 1. 切换连接方式（重要！）

**在弹窗中找到 "Method" 下拉框**：
- 当前选择：`Direct connection`
- **改为**：`Session Pooler` 或 `Transaction Pooler`

**为什么要改？**
- Direct connection 不支持 IPv4 网络
- Session Pooler 支持所有网络环境

### 2. 复制连接字符串

切换后，你会看到新的连接字符串：
```
postgresql://postgres:[YOUR-PASSWORD]@aws-0-ap-south-1.pooler.supabase.co:6543/postgres
```

**操作**：
1. 点击右侧的复制按钮 📋
2. 把 `[YOUR-PASSWORD]` 替换成你的数据库密码
3. 保存为：`DATABASE_URL`

---

## ✅ 第二步：获取 API Keys

### 1. 点击顶部标签页

**在弹窗顶部，你会看到多个标签页**：
```
[Connection String] [App Frameworks] [Mobile Frameworks] [ORMs] [API Keys] [MCP]
```

**点击 "API Keys" 标签页**

### 2. 复制 anon public key

你会看到：
- **Project URL**: `https://tpwkvuzbjxpqjiewktdy.supabase.co`
- **anon public**: 一个很长的字符串（eyJhbGciOiJ...）

**操作**：
1. 复制 **anon public** 那个很长的字符串
2. 保存为：`SUPABASE_ANON_KEY`

---

## 📋 完整信息清单

完成上述步骤后，你将拥有：

```
✅ DATABASE_URL
   postgresql://postgres:你的密码@aws-0-ap-south-1.pooler.supabase.co:6543/postgres

✅ SUPABASE_URL
   https://tpwkvuzbjxpqjiewktdy.supabase.co

✅ SUPABASE_ANON_KEY
   eyJhbGciOiJ...（从 API Keys 标签页复制）
```

---

## 🎯 操作步骤总结

1. **切换 Method** → 选择 **Session Pooler**
2. **复制连接字符串** → 替换密码
3. **点击 API Keys 标签页**
4. **复制 anon public key**

完成后回复 **"信息已获取"**！
