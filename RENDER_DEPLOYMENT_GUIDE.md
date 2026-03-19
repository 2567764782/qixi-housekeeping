# 🚀 Render 部署详细步骤（完全免费）

## 第一步：注册 Render 账号

### 1. 访问 Render 官网
**打开浏览器，访问**：
```
https://render.com
```

### 2. 点击 "Get Started for Free"

### 3. 使用 GitHub 登录
- **点击 "Sign up with GitHub"**
- **授权 Render 访问你的 GitHub**
- **完成注册**

---

## 第二步：创建 Web Service

### 1. 进入 Dashboard
**登录后，你会看到 Render Dashboard**

### 2. 点击 "New +" 按钮
**在右上角，点击绿色的 "New +" 按钮**

### 3. 选择 "Web Service"
**从下拉菜单中选择 "Web Service"**

---

## 第三步：连接 GitHub 仓库

### 1. 授权 GitHub
**如果是第一次使用，需要授权 Render 访问你的 GitHub**

### 2. 选择仓库
**找到你的仓库**：`2567764782/qixi-housekeeping`

**点击 "Connect"**

---

## 第四步：配置 Web Service

### 填写以下信息：

#### 基本信息
- **Name**：`qixi-housekeeping`（或你喜欢的名称）
- **Region**：**Singapore**（离中国最近，速度最快）
- **Branch**：`main`

#### 构建配置
- **Runtime**：**Node**（Render 会自动检测）
- **Build Command**：
  ```
  npm install -g pnpm && pnpm install && pnpm build
  ```
- **Start Command**：
  ```
  node dist/server/main.js
  ```

#### 实例类型
- **Instance Type**：**Free**（免费版）

---

## 第五步：点击 "Deploy Web Service"

**点击蓝色的 "Deploy Web Service" 按钮**

**Render 会开始构建和部署你的应用**

---

## 第六步：等待部署完成

### 部署过程：
1. **Cloning repository**：克隆代码
2. **Installing dependencies**：安装依赖
3. **Building application**：构建应用
4. **Starting service**：启动服务

**通常需要 5-10 分钟**

---

## 第七步：查看部署状态

### 在 Dashboard 中查看：
- **Logs**：查看构建日志
- **Events**：查看部署事件

### 部署成功的标志：
- ✅ **Status**：Live（绿色）
- ✅ **URL**：你的应用域名，例如：`https://qixi-housekeeping.onrender.com`

---

## 第八步：创建数据库（可选）

### 如果需要 PostgreSQL 数据库：

### 1. 点击 "New +"
**在 Dashboard 中点击 "New +" 按钮**

### 2. 选择 "PostgreSQL"
**从下拉菜单中选择 "PostgreSQL"**

### 3. 配置数据库
- **Name**：`qixi-housekeeping-db`
- **Region**：**Singapore**（与 Web Service 相同）
- **PostgreSQL Version**：**15**（或最新版本）
- **Instance Type**：**Free**

### 4. 点击 "Create Database"
**Render 会自动创建数据库**

---

## 第九步：连接数据库到 Web Service

### 1. 在 Web Service 中点击 "Environment"

### 2. 添加环境变量
**Render 会自动添加 `DATABASE_URL` 环境变量**

**或者手动添加**：
- **Key**：`DATABASE_URL`
- **Value**：从数据库详情页复制连接字符串

### 3. 点击 "Save Changes"
**Web Service 会自动重启**

---

## 第十步：配置其他环境变量

### 在 Web Service 中点击 "Environment"

### 添加以下环境变量：

#### 变量 1：SUPABASE_URL
- **Key**：`SUPABASE_URL`
- **Value**：你的 Supabase 项目 URL
  ```
  https://你的项目ID.supabase.co
  ```

#### 变量 2：SUPABASE_ANON_KEY
- **Key**：`SUPABASE_ANON_KEY`
- **Value**：你的 Supabase 匿名密钥

#### 变量 3：PROJECT_DOMAIN
- **Key**：`PROJECT_DOMAIN`
- **Value**：你的 Render 域名
  ```
  https://qixi-housekeeping.onrender.com
  ```

### 点击 "Save Changes"

---

## 第十一步：验证部署

### 1. 访问你的应用
**在浏览器中访问**：
```
https://你的应用名.onrender.com
```

### 2. 测试后端 API
**访问**：
```
https://你的应用名.onrender.com/api
```

**预期返回**：
```json
{
  "message": "Hello World"
}
```

---

## 📋 注意事项

### 免费版限制：
- **每月 750 小时免费运行时间**
- **服务会在 15 分钟无活动后休眠**
- **休眠后首次访问需要 30 秒唤醒**
- **数据库有 1GB 存储空间限制**

### 避免休眠的方法：
- 使用外部监控服务（如 UptimeRobot）定期 ping 你的应用
- 或者升级到付费版本

---

## 🔧 如果部署失败

### 查看构建日志
**在 Web Service 中点击 "Logs"**

### 常见问题：

#### 问题 1：Build Command 失败
**检查构建命令是否正确**

#### 问题 2：Start Command 失败
**检查启动命令是否正确**

#### 问题 3：环境变量缺失
**确认所有必要的环境变量已添加**

---

## 🎯 快速检查清单

- [ ] 注册 Render 账号
- [ ] 创建 Web Service
- [ ] 连接 GitHub 仓库
- [ ] 配置 Build Command 和 Start Command
- [ ] 点击 Deploy
- [ ] 等待部署完成
- [ ] 创建数据库（可选）
- [ ] 配置环境变量
- [ ] 验证部署成功

---

## 📞 如果遇到问题

**请提供以下信息**：
1. **部署日志**（从 Render 的 Logs 页面复制）
2. **错误信息**（如果有）
3. **当前步骤**（你进行到哪一步了）

**我会帮你解决问题！**
