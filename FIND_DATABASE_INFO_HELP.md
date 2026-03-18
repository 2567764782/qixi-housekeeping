# 🔍 详细指导：如何在 Supabase 找到数据库信息

## 📍 当前位置确认

你现在应该在 Supabase 项目首页，地址栏显示：
```
supabase.com/dashboard/project/tpwkvuzbjxpqjiewktdy
```

---

## 第一步：打开设置菜单

### 方法 1：通过左侧菜单（推荐）

1. **看页面最左侧**，有一个垂直的菜单栏
2. **从上往下数**，找到最下面的图标
3. **应该能看到这些图标**：
   ```
   🏠 Home（首页）
   🗄️ Table Editor（表格编辑器）
   🔍 SQL Editor（SQL编辑器）
   🔐 Authentication（认证）
   📦 Storage（存储）
   ⚡ Edge Functions（边缘函数）
   📡 Realtime（实时）
   📊 Logs（日志）
   📈 Reports（报告）
   ⚙️ Settings（设置）← 找这个！
   ```

4. **点击 ⚙️ Settings（设置）**

---

## 第二步：获取数据库连接字符串

### 点击 Settings 后：

1. **你会看到左侧出现子菜单**，包含：
   ```
   General（通用）
   Database（数据库）← 点这个！
   API
   Authentication
   Storage
   Billing
   ...

   ```

2. **点击 "Database"**

3. **在右侧页面中，向下滚动**

4. **找到这些部分**：
   - Connection info（连接信息）
   - Connection string（连接字符串）

5. **在 "Connection string" 部分**，你会看到多个选项卡：
   ```
   [URI] [JDBC] [ODBC] [.NET] [PHP] [Go] [Python]
   ```

6. **点击 "URI" 标签**

7. **你会看到类似这样的文本框**：
   ```
   postgresql://postgres.tpwkvuzbjxpqjiewktdy:[YOUR-PASSWORD]@aws-0-ap-south-1.pooler.supabase.com:6543/postgres
   ```

8. **点击文本框右侧的复制按钮** 📋

9. **粘贴到记事本**，把 `[YOUR-PASSWORD]` 替换成你的密码

---

## 第三步：获取 API 密钥

### 继续在 Settings 页面：

1. **点击左侧的 "API"**

2. **在右侧页面中，找到**：
   - **Configuration** 部分
   - **Project URL**（项目 URL）
   - **Project API keys**（API 密钥）

3. **复制 Project URL**：
   ```
   https://tpwkvuzbjxpqjiewktdy.supabase.co
   ```

4. **复制 anon public key**：
   - 在 "Project API keys" 部分
   - 找到 "anon public" 行
   - 点击右侧的复制按钮 📋
   - 这是一个很长的字符串

---

## 🆘 如果还是找不到

### 尝试这个方法：

1. **在页面顶部**，找到搜索框（🔍图标）
2. **输入**：`database`
3. **点击搜索结果中的 "Database Settings"**

或者：

1. **直接访问这个链接**：
   ```
   https://supabase.com/dashboard/project/tpwkvuzbjxpqjiewktdy/settings/database
   ```

---

## 📸 截图帮助

如果你还是找不到，可以：

1. **截取整个 Supabase 页面**
2. **发送给我**
3. **我会告诉你具体点击哪里**

或者告诉我：
- 页面上有哪些按钮？
- 左侧菜单有哪些选项？
- 你现在在哪个页面？

---

## 📞 下一步

当你找到这些信息后，告诉我：
- ✅ 我找到了 DATABASE_URL
- ✅ 我找到了 SUPABASE_URL
- ✅ 我找到了 SUPABASE_ANON_KEY

或者截图给我看，我会详细指导你！
