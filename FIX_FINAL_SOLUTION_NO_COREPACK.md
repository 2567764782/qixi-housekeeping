# 🔧 Vercel 部署 - 最终解决方案（不依赖 corepack）

## 问题

Vercel 的 corepack 和 pnpm 版本管理存在兼容性问题。

---

## ✅ 方案 A：使用 npm 全局安装 pnpm（最推荐）

### 第一步：修改 GitHub 的 package.json

**删除 packageManager 字段**：
```json
"packageManager": "pnpm@8.15.0",
```

**保留或修改 engines**：
```json
"engines": {
  "pnpm": ">=8.0.0",
  "node": ">=18.0.0"
}
```

---

### 第二步：Vercel 配置

**Settings → General**
- **Node.js Version：`20.x`**

**Settings → Build and Deployment**
- **Install Command**：
```
npm install -g pnpm@8.15.0 && pnpm install
```

**说明**：
- 完全不使用 corepack
- 直接用 npm 全局安装 pnpm
- 最稳定可靠

---

## ✅ 方案 B：尝试 Node.js 22.x

### Settings → General
- **Node.js Version：`22.x`**

### Settings → Build and Deployment
- **Install Command**：
```
npm install -g pnpm@latest && pnpm install
```

---

## ✅ 方案 C：完全移除 pnpm 限制

### 第一步：修改 GitHub 的 package.json

**删除所有 pnpm 相关配置**：
```json
"packageManager": "pnpm@8.15.0",  // 删除这一行
"engines": {
  "pnpm": ">=8.0.0"  // 删除这个
}
```

**但是保留 preinstall 脚本**：
```json
"preinstall": "npx only-allow pnpm",
```

---

### 第二步：Vercel 配置

**Settings → Build and Deployment**
- **Install Command**：
```
npm install -g pnpm && pnpm install
```

---

## ✅ 方案 D：使用 Vercel 官方推荐的 pnpm 配置

### 创建 .npmrc 文件

**在项目根目录创建 `.npmrc` 文件**：
```
shamefully-hoist=true
strict-peer-dependencies=false
```

### Settings → Build and Deployment
- **Install Command**：
```
npm install -g pnpm@8 && pnpm install
```

---

## 🎯 推荐操作顺序

### 第一步：修改 GitHub 的 package.json

**删除这一行**：
```json
"packageManager": "pnpm@8.15.0",
```

**修改 engines**：
```json
"engines": {
  "node": ">=18.0.0"
}
```

**提交更改**

---

### 第二步：修改 Vercel 配置

**Settings → General**
- **Node.js Version：`20.x`**

**Settings → Build and Deployment**
- **Install Command**：
```
npm install -g pnpm@8.15.0 && pnpm install
```

**Save 并 Redeploy**

---

### 第三步：如果还是失败，尝试 Node.js 22.x

**Settings → General**
- **Node.js Version：`22.x`**

**Install Command**：
```
npm install -g pnpm@latest && pnpm install
```

---

## 📋 关键点

1. **不要使用 corepack** - Vercel 环境和 corepack 不兼容
2. **使用 npm 全局安装 pnpm** - 最稳定可靠
3. **删除 packageManager 字段** - 避免版本冲突
4. **Node.js 20.x 或 22.x** - Vercel 支持的版本

---

## 🎯 现在请做这个

### 1️⃣ 修改 GitHub 的 package.json

**删除**：`"packageManager": "pnpm@8.15.0",`

**提交更改**

### 2️⃣ 修改 Vercel 配置

**Install Command**：
```
npm install -g pnpm@8.15.0 && pnpm install
```

### 3️⃣ Save 并 Redeploy

---

## 📞 完成后告诉我结果！
