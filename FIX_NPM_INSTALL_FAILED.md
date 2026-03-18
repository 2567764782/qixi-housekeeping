# 🔧 解决 npm install 失败问题

## 错误信息

```
Command "npm install --legacy-peer-deps" exited with 1
```

---

## ⚠️ 问题分析

### 可能的原因

1. **项目使用 pnpm，不是 npm**
   - 项目中有 pnpm-workspace.yaml
   - 项目依赖 pnpm 的特性

2. **缺少 pnpm-lock.yaml**
   - GitHub 上传时可能遗漏了

3. **npm 和 pnpm 不兼容**
   - lockfile 格式不同

---

## ✅ 解决方案

### 方案 A：使用 pnpm 安装（推荐）

**修改 Install Command 为**：
```
pnpm install --no-frozen-lockfile
```

**说明**：
- `--no-frozen-lockfile`：允许更新 lockfile
- pnpm 对依赖冲突的处理更好

---

### 方案 B：先安装 pnpm，再安装依赖

**修改 Install Command 为**：
```
npm install -g pnpm && pnpm install
```

**说明**：
- 先全局安装 pnpm
- 然后使用 pnpm 安装依赖

---

### 方案 C：使用 corepack

**修改 Install Command 为**：
```
corepack enable && pnpm install
```

**说明**：
- corepack 是 Node.js 的包管理器管理器
- 自动启用 pnpm

---

## 🎯 推荐操作

### 第一步：修改 Install Command

**回到 Settings → Build and Deployment**

**将 Install Command 改为**：
```
pnpm install --no-frozen-lockfile
```

---

### 第二步：保存设置

**点击 "Save" 按钮**

---

### 第三步：重新部署

1. 点击左侧的 "Deployments"
2. 点击 Redeploy

---

## 📋 详细操作

### 在 Settings → Build and Deployment 中

**找到 Install Command，修改为以下任一命令**：

**选项 1（推荐）**：
```
pnpm install --no-frozen-lockfile
```

**选项 2**：
```
npm install -g pnpm && pnpm install
```

**选项 3**：
```
corepack enable && pnpm install
```

---

## 🎯 现在就开始

1. 进入 Settings → Build and Deployment
2. 修改 Install Command 为：`pnpm install --no-frozen-lockfile`
3. 保存并重新部署

完成后告诉我结果！
