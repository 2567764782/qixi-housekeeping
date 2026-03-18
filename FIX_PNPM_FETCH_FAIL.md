# 🔧 解决 pnpm 获取包失败问题

## 问题

```
ERR_PNPM_META_FETCH_FAIL  GET https://registry.npmjs.org/@babel%2Fcore: Value of "this" must be of type URLSearchParams
```

**原因**：Vercel 环境中 pnpm 和 Node.js 版本兼容性问题

---

## ✅ 解决方案

### 方案 A：使用淘宝镜像（推荐）

#### Settings → Build and Deployment

**Install Command**：
```
npm install -g pnpm@8.15.0 && pnpm config set registry https://registry.npmmirror.com && pnpm install
```

**说明**：
- 使用淘宝镜像加速
- 避免 npmjs.org 的网络问题

---

### 方案 B：使用更新版本的 pnpm

#### Settings → Build and Deployment

**Install Command**：
```
npm install -g pnpm@latest && pnpm install
```

**说明**：
- 使用最新版 pnpm
- 修复版本兼容性问题

---

### 方案 C：使用 Node.js 22.x + 最新 pnpm

#### Settings → General

**Node.js Version**：`22.x`

#### Settings → Build and Deployment

**Install Command**：
```
npm install -g pnpm@latest && pnpm install
```

---

### 方案 D：创建 .npmrc 文件（最稳定）

#### 第一步：在项目根目录创建 .npmrc 文件

**在 GitHub 仓库中创建 `.npmrc` 文件**：

**文件内容**：
```
registry=https://registry.npmmirror.com
shamefully-hoist=true
strict-peer-dependencies=false
```

**提交更改**

#### 第二步：Vercel 配置

**Settings → Build and Deployment**

**Install Command**：
```
npm install -g pnpm@8.15.0 && pnpm install
```

---

## 🎯 推荐操作顺序

### 第一步：尝试方案 A（最快）

**Settings → Build and Deployment → Install Command**：
```
npm install -g pnpm@8.15.0 && pnpm config set registry https://registry.npmmirror.com && pnpm install
```

**Save 并 Redeploy**

---

### 第二步：如果方案 A 失败，尝试方案 B

**Install Command**：
```
npm install -g pnpm@latest && pnpm install
```

---

### 第三步：如果方案 B 失败，尝试方案 C

**Settings → General**
- **Node.js Version：`22.x`**

**Install Command**：
```
npm install -g pnpm@latest && pnpm install
```

---

### 第四步：如果还是失败，使用方案 D

**创建 .npmrc 文件**：
```
registry=https://registry.npmmirror.com
shamefully-hoist=true
strict-peer-dependencies=false
```

**Install Command**：
```
npm install -g pnpm@8.15.0 && pnpm install
```

---

## 📋 确认你的当前配置

### 请确认以下配置是否正确：

#### 1️⃣ GitHub 的 package.json
- **已删除** `"packageManager": "pnpm@8.15.0",` 这一行

#### 2️⃣ Vercel Settings → General
- **Node.js Version**：`20.x`

#### 3️⃣ Vercel Settings → Build and Deployment
- **Install Command**：应该是不包含 `corepack` 的命令

---

## 🎯 现在请先尝试方案 A

**Settings → Build and Deployment → Install Command**：
```
npm install -g pnpm@8.15.0 && pnpm config set registry https://registry.npmmirror.com && pnpm install
```

**Save 并 Redeploy**

**告诉我结果！**
