# 🎯 获取 Supabase 连接信息 - 最简单的方法

## 问题：找不到 Connection string

没关系，我给你提供最简单的方法！

---

## 方法 1：使用页面顶部的 "Connect" 按钮（最快）

### 步骤：

1. **看页面顶部**
2. **找到 "Connect" 按钮**（在路径导航的最右侧）
3. **点击它**
4. **会弹出连接信息面板**

在弹出面板中，你会看到：
- **Connection string**（连接字符串）
- 选择 **"URI"** 或 **"JDBC"** 格式
- 复制连接字符串

---

## 方法 2：向上滚动页面

Connection string 可能在页面顶部，而不是底部。

**请向上滚动页面**，看看是否能找到。

---

## 方法 3：访问项目设置页面

### 步骤：

1. **点击页面顶部的项目名称**：`2567764782's Project`
2. **或者访问这个链接**：
   ```
   https://supabase.com/dashboard/project/tpwkvuzbjxpqjiewktdy/settings/general
   ```

3. **在左侧菜单中，点击 "API"**

4. **你会看到**：
   - **Project URL**: `https://tpwkvuzbjxpqjiewktdy.supabase.co`
   - **anon public key**: 一个很长的字符串

---

## 方法 4：直接构造连接字符串

既然我们知道了项目 ID，你可以直接构造连接字符串：

```
postgresql://postgres.tpwkvuzbjxpqjiewktdy:你的密码@aws-0-ap-south-1.pooler.supabase.com:6543/postgres
```

**替换 "你的密码" 为你创建项目时设置的密码**

---

## 📋 你需要的信息

### 1. DATABASE_URL（数据库连接字符串）
```
postgresql://postgres.tpwkvuzbjxpqjiewktdy:你的密码@aws-0-ap-south-1.pooler.supabase.com:6543/postgres
```

### 2. SUPABASE_URL
```
https://tpwkvuzbjxpqjiewktdy.supabase.co
```

### 3. SUPABASE_ANON_KEY
还需要获取，方法：
- 访问：https://supabase.com/dashboard/project/tpwkvuzbjxpqjiewktdy/settings/api
- 复制 **anon public key**

---

## 🎯 现在请尝试

### 选项 A：点击页面顶部的 "Connect" 按钮
这是最快的方法！

### 选项 B：直接使用构造的连接字符串
把下面的字符串中的 "你的密码" 替换成你的真实密码：
```
postgresql://postgres.tpwkvuzbjxpqjiewktdy:你的密码@aws-0-ap-south-1.pooler.supabase.com:6543/postgres
```

---

## 📞 告诉我

你想尝试哪个方法？或者你看到 "Connect" 按钮了吗？
