# 🚀 柒玺家政小程序 - 最简单快速部署方案

## 🎯 推荐方案对比

### 方案 A：Zeabur（推荐，最简单）
- ✅ **优点**：国内可访问、自动配置、支持 Node.js + 数据库
- ✅ **部署时间**：5-10 分钟
- ✅ **免费额度**：每月 $5 免费额度
- ❌ **缺点**：需要绑定信用卡（可试用）

---

### 方案 B：Render（免费，简单）
- ✅ **优点**：完全免费、无需信用卡、支持 Node.js
- ✅ **部署时间**：10-15 分钟
- ❌ **缺点**：国内访问可能较慢

---

### 方案 C：Vercel（继续使用）
- ✅ **优点**：你已经配置好了
- ❌ **缺点**：需要修复代码问题

---

## 🎯 推荐方案 A：使用 Zeabur（最简单）

### 第一步：注册 Zeabur
1. **访问**：https://zeabur.com
2. **使用 GitHub 登录**（推荐）
3. **授权 GitHub 访问**

---

### 第二步：创建项目
1. **点击 "New Project"**
2. **选择 "Import from GitHub"**
3. **选择你的仓库**：`2567764782/qixi-housekeeping`
4. **点击 "Import"**

---

### 第三步：配置服务
1. **Zeabur 会自动检测项目类型**（Node.js）
2. **点击 "Deploy"**
3. **等待部署完成**（通常 2-3 分钟）

---

### 第四步：添加数据库（可选）
1. **在项目中点击 "Add Service"**
2. **选择 "Database"**
3. **选择 "PostgreSQL"**
4. **自动创建并连接数据库**

---

### 第五步：配置环境变量
1. **在服务中点击 "Variables"**
2. **添加环境变量**：
   - `SUPABASE_URL`：你的 Supabase URL
   - `SUPABASE_ANON_KEY`：你的 Supabase Anon Key
3. **点击 "Save"**
4. **服务会自动重启**

---

### 第六步：获取域名
1. **在服务中点击 "Domains"**
2. **点击 "Generate Domain"**
3. **Zeabur 会自动分配一个域名**
4. **例如**：`qixi-housekeeping.zeabur.app`

---

## 🎯 方案 B：使用 Render（完全免费）

### 第一步：注册 Render
1. **访问**：https://render.com
2. **使用 GitHub 登录**
3. **授权 GitHub 访问**

---

### 第二步：创建 Web Service
1. **点击 "New +"**
2. **选择 "Web Service"**
3. **连接 GitHub 仓库**：`2567764782/qixi-housekeeping`
4. **点击 "Connect"**

---

### 第三步：配置服务
1. **Name**：`qixi-housekeeping`
2. **Region**：Singapore（离中国最近）
3. **Branch**：main
4. **Build Command**：`npm install -g pnpm && pnpm install && pnpm build:server`
5. **Start Command**：`pnpm start:server`

**注意**：需要先修改 package.json 添加 `start:server` 脚本

---

### 第四步：创建数据库
1. **点击 "New +"**
2. **选择 "PostgreSQL"**
3. **配置数据库**
4. **获取数据库连接字符串**

---

### 第五步：配置环境变量
1. **在 Web Service 中点击 "Environment"**
2. **添加环境变量**：
   - `DATABASE_URL`：数据库连接字符串
   - `SUPABASE_URL`：你的 Supabase URL
   - `SUPABASE_ANON_KEY`：你的 Supabase Anon Key
3. **点击 "Save Changes"**

---

## 🎯 方案 C：继续使用 Vercel（需要修复代码）

### 第一步：修复代码问题

**需要删除以下 3 处配置**：

1. **删除 packageManager 字段**
2. **删除 engines.pnpm 字段**
3. **删除 pnpm.patchedDependencies 配置**

---

### 第二步：提交到 GitHub

**访问**：https://github.com/2567764782/qixi-housekeeping/edit/main/package.json

**删除并提交**

---

### 第三步：重新部署

**Vercel 会自动检测并重新部署**

---

## 🎯 我的推荐

### **如果你能访问国外网站**：
- **推荐 Zeabur**（最简单，自动化程度高）

### **如果你想要完全免费**：
- **推荐 Render**（免费，无需信用卡）

### **如果你想继续使用 Vercel**：
- **我可以帮你修复代码问题**

---

## 📞 请告诉我你选择哪个方案？

1. **方案 A：Zeabur**（最简单）
2. **方案 B：Render**（免费）
3. **方案 C：继续 Vercel**（需要修复代码）

**我会根据你的选择提供详细的部署步骤！**
