# 🔧 Render 部署 - 选择正确的服务类型

## 问题

从截图看，你当前配置的是 **Docker 部署方式**，显示的是：

- Docker Build Context Directory
- Dockerfile Path
- Docker Command
- Pre-Deploy Command

**这不是我们需要的！**

---

## ✅ 正确的部署方式：Node.js Web Service

### 我们需要的是：
- **Runtime: Node**（自动检测）
- **Build Command**
- **Start Command**

**而不是 Docker 相关配置**

---

## 📋 解决方法

### 第一步：返回 Dashboard

**点击浏览器左上角的 Render 图标**

**或者点击顶部菜单的 "Web Services"**

---

### 第二步：删除错误的服务（如果已创建）

1. **在 Dashboard 中找到刚创建的服务**
2. **点击进入服务详情**
3. **点击右上角的 "Settings"**
4. **滚动到底部，点击 "Delete Web Service"**

---

### 第三步：重新创建正确的服务

1. **点击 "New +" 按钮**
2. **选择 "Web Service"**
3. **选择你的仓库：`2567764782/qixi-housekeeping`**
4. **点击 "Connect"**

---

### 第四步：确认 Runtime

**在配置页面中，确认显示**：
```
Runtime: Node
```

**如果显示 "Runtime: Docker"，请点击修改为 "Node"**

---

## 📋 正确的配置页面示例

### 你应该看到这些字段：

```
Name: qixi-housekeeping
Region: Singapore
Branch: main
Runtime: Node          ← 关键！必须是 Node，不是 Docker

Build Command:
npm install -g pnpm && pnpm install && pnpm build

Start Command:
node dist/server/main.js

Instance Type: Free
```

---

## 🎯 快速检查

### ❌ 错误的页面（Docker）：
- Docker Build Context Directory
- Dockerfile Path
- Docker Command

### ✅ 正确的页面（Node.js）：
- Runtime: Node
- Build Command
- Start Command

---

## 📞 如果你不确定

**请告诉我你在哪个页面看到了什么选项**

**或者截图整个页面给我看**

**我会帮你确认是否正确！**
