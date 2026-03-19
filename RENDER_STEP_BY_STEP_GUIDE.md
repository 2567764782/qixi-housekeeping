# 🔧 Render 部署 - 具体操作步骤

## 第一步：修改 Language（关键！）

### 1. 找到 "Language" 配置项
**在页面中找到这一行**：
```
Language: Docker
```

### 2. 点击下拉框
**点击 "Docker" 右侧的下拉箭头 ▼**

### 3. 选择 "Node"
**从下拉菜单中选择 `Node`**

**重要**：选择 Node 后，页面会自动刷新，显示 Node.js 的配置选项

---

## 第二步：填写配置信息

### Language 改为 Node 后，你会看到以下配置项：

#### 1. Name（已填写）
- **内容**：`qixi-housekeeping`
- **不需要修改**

#### 2. Language（已修改）
- **内容**：`Node`
- **已经修改好了**

#### 3. Branch
- **内容**：`main`
- **不需要修改**

#### 4. Region
- **内容**：`Singapore (Southeast Asia)`
- **不需要修改**（这是正确的，离中国最近）

#### 5. Root Directory
- **内容**：留空
- **不需要填写**

---

## 第三步：填写 Build Command 和 Start Command

### Language 改为 Node 后，会出现新的配置项：

#### Build Command（构建命令）
**输入**：
```
npm install -g pnpm && pnpm install && pnpm build
```

#### Start Command（启动命令）
**输入**：
```
node dist/server/main.js
```

---

## 第四步：选择 Instance Type（实例类型）

### 选择 "Free"（免费版）

**在页面底部的 Instance Type 区域**：

- ✅ **选择**：`Free`（免费）
  - 配置：512 MB RAM, 0.1 CPU
  - 费用：$0 / month

- ❌ **不要选择**：`Starter` 或 `Standard`（这些是付费的）

---

## 第五步：点击 "Deploy Web Service"

### 完成所有配置后：
1. **滚动到页面底部**
2. **找到蓝色的 "Deploy Web Service" 按钮**
3. **点击按钮**

---

## 📋 完整配置清单

### ✅ 正确的配置：

```
Name: qixi-housekeeping
Language: Node              ← 必须改为 Node
Branch: main
Region: Singapore
Root Directory: (留空)

Build Command:
npm install -g pnpm && pnpm install && pnpm build

Start Command:
node dist/server/main.js

Instance Type: Free
```

---

## 🎯 现在请按照上面的步骤操作

### 第一步：点击 Language 下拉框
### 第二步：选择 "Node"
### 第三步：填写 Build Command 和 Start Command
### 第四步：选择 Free 实例
### 第五步：点击 "Deploy Web Service"

---

## 📞 如果还有问题

**告诉我你现在在哪一步，或者遇到什么问题！**
