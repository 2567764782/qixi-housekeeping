# 🎯 在当前页面获取数据库连接字符串

## 你现在在：Database Settings 页面

### ✅ 第一步：向下滚动页面

你看到的页面内容：
1. Database password
2. Connection pooling
3. SSL configuration

**Connection string 在这些内容的下方！**

---

### ✅ 第二步：找到 Connection string

**向下滚动页面**，直到看到：

#### Connection string（连接字符串）

有多个选项卡：
```
[URI] [JDBC] [ODBC] [.NET] [PHP] [Go] [Python] [Nodejs]
```

**点击 "URI" 标签**

---

### ✅ 第三步：复制连接字符串

你会看到类似这样的文本框：
```
postgresql://postgres.tpwkvuzbjxpqjiewktdy:[YOUR-PASSWORD]@aws-0-ap-south-1.pooler.supabase.com:6543/postgres
```

**操作步骤**：
1. 点击右侧的复制按钮 📋
2. 粘贴到记事本
3. 把 `[YOUR-PASSWORD]` 替换成你的密码

**替换示例**：
```
原始：postgresql://postgres.tpwkvuzbjxpqjiewktdy:[YOUR-PASSWORD]@aws-0-ap-south-1.pooler.supabase.com:6543/postgres

替换后：postgresql://postgres.tpwkvuzbjxpqjiewktdy:Qixi2024!@#$@aws-0-ap-south-1.pooler.supabase.com:6543/postgres
```

---

## ⚠️ 注意事项

1. **密码替换**：必须把 `[YOUR-PASSWORD]` 替换成真实的密码
2. **保存好**：这个连接字符串后面部署要用
3. **不要分享**：这是敏感信息，不要泄露给别人

---

## 📋 完整信息清单

你还需要获取：

### 1. DATABASE_URL（刚才获取的）
```
postgresql://postgres.tpwkvuzbjxpqjiewktdy:你的密码@aws-0-ap-south-1.pooler.supabase.com:6543/postgres
```

### 2. SUPABASE_URL
```
https://tpwkvuzbjxpqjiewktdy.supabase.co
```

### 3. SUPABASE_ANON_KEY
（还需要获取）

---

## 🎯 现在就向下滚动页面

找到 "Connection string" 部分，然后告诉我你看到了什么！
