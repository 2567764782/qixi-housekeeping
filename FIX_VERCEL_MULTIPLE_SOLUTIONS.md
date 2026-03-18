# 🔧 Vercel 部署 - 多种解决方案

## 问题

Vercel 的 Node.js 20.x 不支持 pnpm 9.0.0

---

## ✅ 方案 A：使用 npm 全局安装 pnpm（推荐）

### Settings → Build and Deployment

**Install Command**：
```
npm install -g pnpm@9.0.0 && pnpm install
```

**说明**：
- 不依赖 corepack
- 直接用 npm 全局安装 pnpm 9.0.0

**Save 并 Redeploy**

---

## ✅ 方案 B：使用 pnpm@8.15.0 + 修改项目配置

### 第一步：修改项目的 package.json

**需要修改**：
```json
"packageManager": "pnpm@8.15.0",
"engines": {
  "pnpm": ">=8.0.0"
}
```

**操作步骤**：
1. 访问 GitHub 仓库
2. 编辑 `package.json`
3. 提交更改
4. Vercel 会自动重新部署

---

### 第二步：Vercel 配置

**Settings → Build and Deployment**

**Install Command**：
```
corepack enable && corepack prepare pnpm@8.15.0 --activate && pnpm install
```

---

## ✅ 方案 C：尝试 Node.js 22.x + pnpm@latest

### Settings → General

**Node.js Version：`22.x`**

### Settings → Build and Deployment

**Install Command**：
```
corepack enable && corepack prepare pnpm@latest --activate && pnpm install
```

---

## ✅ 方案 D：移除 packageManager 字段（最简单）

### 修改 package.json

**删除这两行**：
```json
"packageManager": "pnpm@9.0.0",
```

**保留**：
```json
"engines": {
  "pnpm": ">=8.0.0"
}
```

### Vercel 配置

**Install Command**：
```
npm install -g pnpm && pnpm install
```

---

## 🎯 推荐尝试顺序

### 第一步：尝试方案 A（最快）

**Settings → Build and Deployment**

**Install Command**：
```
npm install -g pnpm@9.0.0 && pnpm install
```

**Save 并 Redeploy**

---

### 第二步：如果方案 A 失败，尝试方案 C

**Settings → General**
- Node.js Version：`22.x`

**Settings → Build and Deployment**
- Install Command：`corepack enable && corepack prepare pnpm@latest --activate && pnpm install`

---

### 第三步：如果还是失败，使用方案 D（最可靠）

**修改 GitHub 仓库的 package.json**：
- 删除 `"packageManager": "pnpm@9.0.0"` 这一行

**Vercel Install Command**：
```
npm install -g pnpm && pnpm install
```

---

## 📞 现在请尝试方案 A！

**Settings → Build and Deployment → Install Command**：
```
npm install -g pnpm@9.0.0 && pnpm install
```

**Save 并 Redeploy**

**告诉我结果！**
