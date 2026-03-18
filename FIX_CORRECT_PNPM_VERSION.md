# 🔧 正确的 Node.js 和 pnpm 版本配置

## 问题根源

从 `package.json` 中发现：

```json
"packageManager": "pnpm@9.0.0",
"engines": {
  "pnpm": ">=9.0.0"
}
```

**项目要求 pnpm >= 9.0.0**，之前使用的 pnpm@8.15.0 版本太低了！

---

## ✅ 正确配置

### 第一步：Settings → General

**Node.js Version：`20.x`**（Vercel 最低支持 20.x）

**Save**

---

### 第二步：Settings → Build and Deployment

**Install Command**：
```
corepack enable && corepack prepare pnpm@9.0.0 --activate && pnpm install
```

**说明**：
- `corepack enable` - 启用 corepack
- `corepack prepare pnpm@9.0.0 --activate` - 安装并激活 pnpm 9.0.0
- `pnpm install` - 安装依赖

**Save**

---

### 第三步：Deployments → Redeploy

**重新部署**

---

## 📋 如果还是失败

### 方案 A：使用最新 pnpm 9.x

**Install Command**：
```
corepack enable && corepack prepare pnpm@latest --activate && pnpm install
```

---

### 方案 B：使用 npm 安装 pnpm

**Install Command**：
```
npm install -g pnpm@9.0.0 && pnpm install
```

---

### 方案 C：放宽 pnpm 版本要求（不推荐）

**修改项目的 `package.json`**：

```json
"packageManager": "pnpm@8.15.0",
"engines": {
  "pnpm": ">=8.0.0"
}
```

**注意**：这需要提交到 GitHub 仓库

---

## 🎯 推荐操作

### Settings → General
- **Node.js Version：`20.x`**
- **Save**

### Settings → Build and Deployment
- **Install Command**：
```
corepack enable && corepack prepare pnpm@9.0.0 --activate && pnpm install
```
- **Save**

### Deployments → Redeploy

---

## 📞 完成后告诉我结果！
