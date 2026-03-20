# 🚀 免费部署完整教程

## 目录
- [第一步：创建 Supabase 数据库](#第一步创建-supabase-数据库)
- [第二步：部署后端到 Railway](#第二步部署后端到-railway)
- [第三步：部署前端到 Vercel](#第三步部署前端到-vercel)
- [第四步：测试和配置](#第四步测试和配置)

---

## 第一步：创建 Supabase 数据库

### 1.1 注册 Supabase 账号

**操作步骤：**

1. 打开浏览器，访问：https://supabase.com

2. 点击右上角 **"Start your project"** 按钮

3. 在弹出的页面中，点击 **"Continue with GitHub"**
   - 这会使用你的 GitHub 账号登录
   - 无需额外注册，非常方便

4. 如果提示授权，点击 **"Authorize Supabase"**
   - 这表示允许 Supabase 访问你的 GitHub 基本信息

5. 登录成功后，你可能会被要求创建组织（Organization）
   - 组织名称随便写，比如：`my-organization`
   - 点击 **"Create organization"**

---

### 1.2 创建数据库项目

**操作步骤：**

1. 进入 Supabase 控制台后，点击 **"New Project"** 按钮

2. 填写项目信息：

   ```
   Name: qixi-housekeeping
   
   Database Password: 
   设置一个复杂密码，比如：Qixi@2024#DbPass
   ⚠️ 重要：这个密码要记住！后面要用！
   
   Region: Northeast Asia (Tokyo)
   选择东京节点，离中国最近，速度更快
   ```

3. 点击 **"Create new project"** 按钮

4. 等待 1-2 分钟，Supabase 正在初始化项目
   - 你会看到一个加载动画
   - 耐心等待，不要关闭页面

5. 看到 "Project is ready" 表示创建成功！

---

### 1.3 获取数据库连接字符串

**操作步骤：**

1. 在项目首页，点击左侧菜单栏的 **齿轮图标**（Settings）

2. 在左侧子菜单中，点击 **"Database"**

3. 向下滚动，找到 **"Connection string"** 部分

4. 点击 **"URI"** 标签页

5. 你会看到类似这样的连接字符串：
   ```
   postgresql://postgres.[项目ID]:[YOUR-PASSWORD]@aws-0-ap-northeast-1.pooler.supabase.com:6543/postgres
   ```

6. **重要：** 把 `[YOUR-PASSWORD]` 替换成你刚才设置的密码
   - 例如：`postgresql://postgres.abc123:Qixi@2024#DbPass@aws-0-ap-northeast-1.pooler.supabase.com:6543/postgres`

7. **⚠️ 复制完整的连接字符串，保存好！**
   - 这是你的 DATABASE_URL
   - 后面在 Railway 部署时要用

---

### 1.4 创建数据表（重要！）

**操作步骤：**

1. 点击左侧菜单栏的 **"SQL Editor"**（图标像一个数据库）

2. 点击 **"New Query"**

3. 复制以下 SQL 代码，粘贴到编辑器中：

```sql
-- 创建用户表
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  phone VARCHAR(20) UNIQUE,
  nickname VARCHAR(50),
  avatar VARCHAR(500),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 创建订单表
CREATE TABLE orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  service_type VARCHAR(50),
  service_name VARCHAR(100),
  price DECIMAL(10, 2),
  status VARCHAR(20) DEFAULT 'pending',
  contact_name VARCHAR(50),
  contact_phone VARCHAR(20),
  province VARCHAR(50),
  city VARCHAR(50),
  area VARCHAR(50),
  address TEXT,
  service_date VARCHAR(50),
  service_time VARCHAR(50),
  remark TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 创建钱包表
CREATE TABLE wallets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) UNIQUE,
  balance DECIMAL(10, 2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 创建积分表
CREATE TABLE points (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  points INTEGER DEFAULT 0,
  type VARCHAR(20),
  source VARCHAR(50),
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 创建交易记录表
CREATE TABLE transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  type VARCHAR(20),
  amount DECIMAL(10, 2),
  balance DECIMAL(10, 2),
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

4. 点击右下角的 **"Run"** 按钮（或按 Ctrl + Enter）

5. 看到 "Success. No rows returned" 表示成功！

---

## 第二步：部署后端到 Railway

### 2.1 注册 Railway 账号

**操作步骤：**

1. 打开浏览器，访问：https://railway.app

2. 点击右上角 **"Start a New Project"** 按钮

3. 在弹出的页面中，选择 **"Login with GitHub"**

4. 如果提示授权，点击 **"Authorize Railway"**
   - 允许 Railway 访问你的 GitHub 仓库

5. 登录成功后，你会看到 Railway 的控制台页面

---

### 2.2 创建新项目

**操作步骤：**

1. 在 Railway 控制台，点击 **"+ New Project"** 按钮

2. 在弹出的选项中，选择 **"Deploy from GitHub repo"**

3. 如果是第一次使用，可能会提示：
   - "Configure GitHub App"
   - 点击 **"Configure GitHub App"**

4. 在 GitHub 授权页面：
   - 选择 **"Only select repositories"**
   - 勾选 **"qixi-housekeeping"** 仓库
   - 点击 **"Install"** 或 **"Save"**

5. 回到 Railway，刷新页面

6. 现在你应该能看到 **"qixi-housekeeping"** 仓库

7. 点击 **"qixi-housekeeping"**

---

### 2.3 配置项目设置

**操作步骤：**

1. 项目创建后，点击项目名称进入项目详情

2. 点击 **"Settings"** 标签

3. 找到 **"Root Directory"** 设置：
   - 点击 **"Edit"**
   - 输入：`server`
   - 点击 **"Update"**
   - ⚠️ 这一步很重要！告诉 Railway 后端代码在 server 文件夹

4. 找到 **"Build Command"**，确认是：
   ```
   npm run build
   ```
   - 如果没有，点击 Edit 添加

5. 找到 **"Start Command"**，确认是：
   ```
   npm run start:prod
   ```
   - 如果没有，点击 Edit 添加

---

### 2.4 添加环境变量（关键步骤！）

**操作步骤：**

1. 点击 **"Variables"** 标签

2. 点击 **"+ New Variable"** 按钮

3. 添加第一个变量：
   ```
   Name: DATABASE_URL
   Value: [粘贴你从 Supabase 复制的连接字符串]
   ```
   点击 **"Add"**

4. 添加第二个变量：
   ```
   Name: JWT_SECRET
   Value: qixi-housekeeping-secret-key-2024-change-this
   ```
   点击 **"Add"**

5. 添加第三个变量：
   ```
   Name: NODE_ENV
   Value: production
   ```
   点击 **"Add"**

6. 添加第四个变量：
   ```
   Name: PORT
   Value: 3000
   ```
   点击 **"Add"**

---

### 2.5 触发部署

**操作步骤：**

1. 环境变量添加完成后，Railway 会自动开始部署

2. 如果没有自动部署，点击右上角的 **"Deploy"** 按钮

3. 等待部署完成（约 2-3 分钟）：
   - 你会看到构建日志滚动
   - 看到 "Deployment successful" 表示成功

4. 如果部署失败，查看日志：
   - 点击部署记录
   - 查看 "Build Logs" 和 "Deploy Logs"
   - 把错误信息复制给我，我帮你解决

---

### 2.6 获取后端域名

**操作步骤：**

1. 部署成功后，点击 **"Settings"** 标签

2. 向下滚动，找到 **"Domains"** 部分

3. 点击 **"Generate Domain"** 按钮

4. 等待几秒钟，Railway 会生成一个域名，格式如：
   ```
   https://qixi-housekeeping-production.up.railway.app
   或
   https://qixi-housekeeping.up.railway.app
   ```

5. **⚠️ 复制这个域名，保存好！**
   - 这是你的后端 API 地址
   - 前端部署时要用

---

### 2.7 测试后端是否正常

**操作步骤：**

1. 在浏览器中打开你的 Railway 域名：
   ```
   https://你的域名.up.railway.app/api/hello
   ```

2. 如果看到类似这样的返回：
   ```json
   {"message":"Hello World"}
   ```
   表示后端部署成功！

3. 如果看到错误页面，检查：
   - 环境变量是否正确
   - 查看部署日志

---

## 第三步：部署前端到 Vercel

### 3.1 注册 Vercel 账号

**操作步骤：**

1. 打开浏览器，访问：https://vercel.com

2. 点击右上角 **"Sign Up"** 按钮

3. 选择 **"Continue with GitHub"**
   - 使用你的 GitHub 账号登录

4. 如果提示授权，点击 **"Authorize Vercel"**

5. 登录成功后，你会看到 Vercel 的控制台

---

### 3.2 导入项目

**操作步骤：**

1. 在 Vercel 控制台，点击 **"Add New..."** 按钮

2. 选择 **"Project"**

3. 在 "Import Git Repository" 部分：
   - 你应该能看到 "qixi-housekeeping" 仓库
   - 如果看不到，点击 "Adjust GitHub App Permissions"
   - 授权 Vercel 访问你的仓库

4. 点击 **"Import"** 按钮（在 qixi-housekeeping 仓库旁边）

---

### 3.3 配置项目

**操作步骤：**

1. 在 "Configure Project" 页面：

2. **Framework Preset**: 
   - 自动检测为 **Vite**
   - 如果没有，手动选择 "Vite"

3. **Root Directory**:
   - 保持默认 `./`
   - 不需要修改

4. **Build and Output Settings**:
   
   点击展开 **"Build and Output Settings"**
   
   - **Build Command**: 
     - 点击 Override
     - 输入：`pnpm build:web`
   
   - **Output Directory**:
     - 点击 Override
     - 输入：`dist-web`
   
   - **Install Command**:
     - 点击 Override
     - 输入：`pnpm install`

5. **Environment Variables**:
   
   点击展开 **"Environment Variables"**
   
   添加变量：
   ```
   Name: PROJECT_DOMAIN
   Value: https://你的Railway域名.up.railway.app
   ```
   - 把 "你的Railway域名" 替换成你在第二步获取的 Railway 域名

---

### 3.4 开始部署

**操作步骤：**

1. 配置完成后，点击 **"Deploy"** 按钮

2. 等待部署（约 1-2 分钟）：
   - 你会看到一个进度条
   - Vercel 正在构建你的项目

3. 看到庆祝动画（烟花）表示部署成功！

---

### 3.5 获取前端域名

**操作步骤：**

1. 部署成功后，你会看到一个预览页面

2. 在页面上，你会看到你的域名，格式如：
   ```
   https://qixi-housekeeping.vercel.app
   或
   https://qixi-housekeeping-xxx.vercel.app
   ```

3. 点击 **"Visit"** 按钮，或者直接在浏览器中打开这个域名

4. 你应该能看到你的小程序 H5 版本！

---

## 第四步：测试和配置

### 4.1 测试前端访问

**操作步骤：**

1. 在浏览器中打开你的 Vercel 域名

2. 测试以下功能：
   - ✅ 首页轮播图是否显示
   - ✅ 点击功能入口是否跳转
   - ✅ 服务选择页面是否正常
   - ✅ 预约表单是否可以填写

3. 如果遇到问题：
   - 打开浏览器开发者工具（F12）
   - 查看 Console 标签的错误信息
   - 把错误信息告诉我

---

### 4.2 测试后端 API

**操作步骤：**

1. 在浏览器中打开：
   ```
   https://你的Railway域名.up.railway.app/api/hello
   ```

2. 应该返回：
   ```json
   {"message":"Hello World"}
   ```

3. 测试数据库连接：
   - 在前端尝试注册或登录
   - 查看是否有错误提示

---

### 4.3 配置微信小程序合法域名

**操作步骤：**

1. 访问微信公众平台：https://mp.weixin.qq.com

2. 登录你的小程序账号

3. 点击左侧菜单：**"开发管理"**

4. 点击 **"开发设置"**

5. 向下滚动，找到 **"服务器域名"**

6. 点击 **"修改"**

7. 添加以下域名：

   **request 合法域名**：
   ```
   https://你的Railway域名.up.railway.app
   ```

   **uploadFile 合法域名**：
   ```
   https://你的Railway域名.up.railway.app
   ```

   **downloadFile 合法域名**：
   ```
   https://你的Railway域名.up.railway.app
   ```

8. 点击 **"保存并提交"**

---

### 4.4 真机测试

**操作步骤：**

1. 打开微信开发者工具

2. 导入你的项目（dist 文件夹）

3. 点击右上角 **"预览"**

4. 用微信扫描二维码

5. 在手机上测试所有功能

---

## 🎉 完成！

恭喜你！现在你已经：

- ✅ 创建了 Supabase 数据库
- ✅ 部署了后端到 Railway
- ✅ 部署了前端到 Vercel
- ✅ 配置了微信小程序域名
- ✅ 完成了真机测试

你的小程序现在可以在互联网上访问了！

---

## 📞 遇到问题？

如果部署过程中遇到任何问题：

1. 把错误信息截图发给我
2. 或者复制错误日志
3. 我会帮你快速解决！

---

## 🔄 后续更新

当你修改代码后，只需要：

```bash
git add .
git commit -m "更新功能"
git push
```

Vercel 和 Railway 会自动检测并重新部署！

---

## 💡 优化建议

部署成功后，你可以：

1. 绑定自定义域名
2. 配置 CDN 加速
3. 添加监控和告警
4. 配置数据库自动备份

需要这些功能时告诉我，我帮你配置！
