# 📋 从 Supabase 获取数据库连接信息

## 当前状态
✅ 项目已创建成功
- 项目地址：https://tpwkvuzbjxpqjiewktdy.supabase.co
- 状态：Healthy
- 部署区域：South Asia (Mumbai)

---

## 第一步：获取数据库连接字符串（DATABASE_URL）

### 操作步骤：

1. **点击左侧菜单的 "Settings"（设置）图标** ⚙️
   - 在页面左侧边栏，找到齿轮图标
   - 位置：左侧菜单最下方

2. **点击 "Database"（数据库）**
   - 在设置菜单中，找到 "Database" 选项
   - 点击进入数据库设置页面

3. **找到 "Connection string"（连接字符串）**
   - 向下滚动，找到 "Connection string" 部分
   - 有多个选项卡：URI、JDBC、ODBC、.NET、PHP 等

4. **选择 "URI" 格式**
   - 点击 "URI" 选项卡
   - 你会看到类似这样的连接字符串：
   ```
   postgresql://postgres.tpwkvuzbjxpqjiewktdy:[YOUR-PASSWORD]@aws-0-ap-south-1.pooler.supabase.com:6543/postgres
   ```

5. **复制连接字符串**
   - 点击右侧的复制按钮 📋
   - **重要**：把 `[YOUR-PASSWORD]` 替换成你创建项目时设置的密码
   - 例如，如果你的密码是 `Qixi2024!@#$`，则替换为：
   ```
   postgresql://postgres.tpwkvuzbjxpqjiewktdy:Qixi2024!@#$@aws-0-ap-south-1.pooler.supabase.com:6543/postgres
   ```

6. **保存好这个连接字符串**
   - 这个非常重要，后面部署后端时要用
   - 记为：`DATABASE_URL`

---

## 第二步：获取 API 密钥

### 操作步骤：

1. **在左侧菜单，点击 "Settings"** ⚙️

2. **点击 "API"**

3. **找到以下信息**：

   a. **Project URL**（项目 URL）
   ```
   https://tpwkvuzbjxpqjiewktdy.supabase.co
   ```
   - 点击复制按钮
   - 记为：`SUPABASE_URL`

   b. **Project API keys**（API 密钥）
   - 找到 "anon public" 密钥
   - 这是一个很长的字符串，类似：
   ```
   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRwd2t2dXpianhwcWppZXdrdGR5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAxMjM0NTYsImV4cCI6MjA1NTY5OTQ1Nn0.xxxxx
   ```
   - 点击复制按钮
   - 记为：`SUPABASE_ANON_KEY`

---

## ✅ 你需要保存的信息

请把这3个信息保存好（后面部署要用）：

```
1. DATABASE_URL（数据库连接字符串）
   postgresql://postgres.tpwkvuzbjxpqjiewktdy:你的密码@aws-0-ap-south-1.pooler.supabase.com:6543/postgres

2. SUPABASE_URL
   https://tpwkvuzbjxpqjiewktdy.supabase.co

3. SUPABASE_ANON_KEY
   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...（很长的字符串）
```

---

## 📞 获取完成后

当你获取到这3个信息后，回复：

**"信息已获取"**

我会帮你进行下一步：部署后端到 Railway。

---

## 🆘 需要帮助？

如果找不到这些信息，告诉我你看到的页面内容，我会详细指导你！
