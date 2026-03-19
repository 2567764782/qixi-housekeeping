# 🔍 查看 Railway 部署日志排查问题

## 问题

访问域名时出现：
```
Application failed to respond
This error appears to be caused by the application.
```

**说明**：应用部署成功，但启动失败

---

## 第一步：返回 Railway Dashboard

### 在浏览器中：
1. **返回 Railway 的项目页面**
2. **找到你的服务：qixi-housekeeping**

---

## 第二步：查看部署日志

### 在 Railway 界面中：
1. **点击服务名称 "qixi-housekeeping"**
2. **在右侧面板中，点击 "Deployments" 标签**
3. **找到最新的部署（标记为 ACTIVE）**
4. **点击 "View logs" 按钮**

---

## 第三步：查找错误信息

### 在日志中查找：
- ❌ **红色错误信息**
- ⚠️ **警告信息**
- 🔍 **关键错误关键词**：
  - `Error:`
  - `Failed to start`
  - `ENOENT`
  - `Cannot find module`
  - `Port`
  - `listen`

---

## 第四步：复制错误日志

### 找到错误后：
1. **选中错误信息**
2. **复制完整的错误堆栈**
3. **发送给我**

---

## 📋 常见启动失败原因

### 原因 1：启动命令错误

**错误信息**：
```
Error: Cannot find module '/app/dist/server/main.js'
```

**解决方法**：
- 检查构建命令是否正确
- 检查文件路径是否存在

---

### 原因 2：端口配置错误

**错误信息**：
```
Error: listen EADDRINUSE: address already in use :::3000
```

或
```
Error: Port 3000 is required
```

**解决方法**：
- 添加环境变量 `PORT=3000`

---

### 原因 3：环境变量缺失

**错误信息**：
```
Error: SUPABASE_URL is required
```

**解决方法**：
- 在 Variables 中添加缺失的环境变量

---

### 原因 4：依赖安装失败

**错误信息**：
```
Error: Cannot find module 'xxx'
```

**解决方法**：
- 检查 package.json 中的依赖
- 重新构建

---

## 🔧 临时解决方案

### 如果无法确定原因，可以尝试：

#### 方案 A：添加 PORT 环境变量

**在 Variables 标签中添加**：
- **Name**：`PORT`
- **Value**：`3000`

**保存后服务会自动重启**

---

#### 方案 B：修改启动命令

**在 Settings 标签中找到 "Start Command"**：

**尝试以下命令**：
```
node dist/server/main.js
```

或
```
pnpm start
```

或
```
npm start
```

---

## 🎯 现在请做这个

### 第一步：查看部署日志
1. **点击服务 → Deployments**
2. **点击 "View logs"**

### 第二步：找到错误信息

### 第三步：复制完整的错误日志给我

**我会帮你分析并解决问题！**

---

## 📞 请提供

1. **完整的错误日志**（从 "View logs" 中复制）
2. **或者截图日志页面**

**我会立即帮你解决！**
