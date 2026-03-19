# 🚀 Railway 部署详细步骤（最简单）

## 第一步：访问 Railway 官网

### 打开浏览器，访问：
```
https://railway.app
```

---

## 第二步：使用 GitHub 登录

### 1. 点击 "Start a New Project"

### 2. 选择 "Login with GitHub"

### 3. 授权 Railway 访问你的 GitHub
- **点击 "Authorize Railway"**
- **完成登录**

---

## 第三步：创建新项目

### 1. 点击 "New Project" 按钮

### 2. 选择 "Deploy from GitHub repo"

### 3. 选择你的仓库
**找到并选择**：`2567764782/qixi-housekeeping`

### 4. 点击 "Deploy Now"
**Railway 会自动开始部署**

---

## 第四步：等待部署完成

### Railway 会自动：
1. **检测项目类型**（Node.js）
2. **安装依赖**
3. **构建项目**
4. **启动服务**

**通常需要 2-5 分钟**

---

## 第五步：查看部署状态

### 在 Dashboard 中：
- **点击你的项目名称**
- **查看 "Deployments" 标签**
- **状态显示 "SUCCESS" 表示部署成功**

---

## 第六步：获取域名

### 1. 在项目页面中，点击 "Settings"

### 2. 向下滚动找到 "Domains"

### 3. 点击 "Generate Domain"
**Railway 会自动分配一个域名**

### 4. 你的域名格式：
```
https://你的项目名.up.railway.app
```

---

## 第七步：配置环境变量（重要！）

### 1. 在项目页面中，点击 "Variables"

### 2. 点击 "New Variable"

### 3. 添加以下环境变量：

#### 变量 1：SUPABASE_URL
- **Name**：`SUPABASE_URL`
- **Value**：你的 Supabase 项目 URL
  ```
  https://你的项目ID.supabase.co
  ```

#### 变量 2：SUPABASE_ANON_KEY
- **Name**：`SUPABASE_ANON_KEY`
- **Value**：你的 Supabase 匿名密钥

#### 变量 3：PROJECT_DOMAIN
- **Name**：`PROJECT_DOMAIN`
- **Value**：你的 Railway 域名
  ```
  https://你的项目名.up.railway.app
  ```

### 4. 点击 "Save"
**Railway 会自动重启服务**

---

## 第八步：添加数据库（可选）

### 1. 在项目页面中，点击 "+ New"

### 2. 选择 "Database"

### 3. 选择 "PostgreSQL"

### 4. Railway 会自动创建数据库并连接

### 5. 数据库连接字符串会自动添加到环境变量中

---

## 第九步：验证部署

### 1. 访问你的域名
```
https://你的项目名.up.railway.app
```

### 2. 测试后端 API
```
https://你的项目名.up.railway.app/api
```

### 3. 预期返回：
```json
{
  "message": "Hello World"
}
```

---

## 📋 注意事项

### 免费额度：
- **每月 $5 免费额度**
- **足够运行一个小型项目**
- **超出后需要付费**

### 自动休眠：
- **Railway 不会自动休眠**（与 Render 不同）
- **服务会持续运行**

---

## 🔧 如果部署失败

### 查看部署日志：
1. **在项目页面中点击 "Deployments"**
2. **点击失败的部署**
3. **查看 "Build Logs" 和 "Deploy Logs"**

### 常见问题：

#### 问题 1：构建失败
**可能需要添加配置文件**

#### 问题 2：启动失败
**检查 Start Command 是否正确**

#### 问题 3：环境变量缺失
**确认所有必要的环境变量已添加**

---

## 🎯 快速检查清单

- [ ] 访问 Railway 官网
- [ ] 使用 GitHub 登录
- [ ] 创建新项目
- [ ] 选择 GitHub 仓库
- [ ] 点击 Deploy
- [ ] 等待部署完成
- [ ] 生成域名
- [ ] 配置环境变量
- [ ] 验证部署成功

---

## 📞 如果遇到问题

**请提供以下信息**：
1. **部署日志**（从 Railway 的 Deployments 页面复制）
2. **错误信息**（如果有）
3. **当前步骤**（你进行到哪一步了）

**我会帮你解决问题！**

---

## 🚀 Railway 的优势

### 相比 Render：
- ✅ **部署更快**（2-5 分钟 vs 5-10 分钟）
- ✅ **国内访问更快**
- ✅ **不会自动休眠**
- ✅ **界面更简洁**

### 相比 Vercel：
- ✅ **不需要复杂配置**
- ✅ **支持后端服务**
- ✅ **不会遇到 pnpm 版本问题**
