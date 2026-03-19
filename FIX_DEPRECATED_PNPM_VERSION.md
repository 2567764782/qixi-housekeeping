# 🔧 解决 pnpm 版本废弃和兼容性问题

## 问题

```
ERR_PNPM_UNSUPPORTED_ENGINE  Unsupported environment (bad pnpm and/or Node.js version)
npm warn deprecated pnpm@8.15.0: This version switched to a hashing algorithm...
Upgrade to v8.15.1 or newer
```

**原因**：
1. pnpm@8.15.0 已废弃
2. 与 Vercel 的 Node.js 版本不兼容

---

## ✅ 解决方案

### 方案 A：使用 pnpm@8.15.1 或更新版本（推荐）

#### Settings → Build and Deployment

**Install Command**：
```
npm install -g pnpm@8.15.9 && pnpm install
```

**说明**：
- `pnpm@8.15.9` 是 8.x 系列的最新稳定版
- 修复了 8.15.0 的废弃问题

---

### 方案 B：使用 pnpm@latest（最新版本）

#### Settings → Build and Deployment

**Install Command**：
```
npm install -g pnpm@latest && pnpm install
```

**说明**：
- 使用最新的稳定版本
- 兼容性更好

---

### 方案 C：Node.js 22.x + pnpm@latest

#### Settings → General

**Node.js Version**：`22.x`

#### Settings → Build and Deployment

**Install Command**：
```
npm install -g pnpm@latest && pnpm install
```

**说明**：
- Node.js 22.x 是更新的版本
- 与最新的 pnpm 兼容性更好

---

### 方案 D：使用淘宝镜像 + pnpm@latest（最稳定）

#### Settings → Build and Deployment

**Install Command**：
```
npm install -g pnpm@latest && pnpm config set registry https://registry.npmmirror.com && pnpm install
```

**说明**：
- 使用最新 pnpm
- 使用淘宝镜像加速
- 避免网络问题

---

## 🎯 推荐操作顺序

### 第一步：尝试方案 A（最快）

**Settings → Build and Deployment → Install Command**：
```
npm install -g pnpm@8.15.9 && pnpm install
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

### 第四步：如果方案 C 失败，尝试方案 D

**Install Command**：
```
npm install -g pnpm@latest && pnpm config set registry https://registry.npmmirror.com && pnpm install
```

---

## 📋 重要提示

### 如果使用 pnpm@latest 或 pnpm@8.15.9

**需要修改 GitHub 的 package.json**

**找到**：
```json
"engines": {
  "pnpm": ">=9.0.0"
}
```

**改为**：
```json
"engines": {
  "pnpm": ">=8.0.0"
}
```

**或者直接删除 engines 字段**

---

## 🎯 最推荐的方案

### **方案 A + 修改 package.json**

#### 第一步：修改 GitHub 的 package.json

**找到并删除或修改**：
```json
"engines": {
  "pnpm": ">=8.0.0"
}
```

**提交更改**

---

#### 第二步：修改 Vercel 配置

**Settings → Build and Deployment → Install Command**：
```
npm install -g pnpm@8.15.9 && pnpm install
```

**Save 并 Redeploy**

---

## 📞 现在请选择一个方案尝试！

**推荐先试方案 A**：
```
npm install -g pnpm@8.15.9 && pnpm install
```

**如果失败，告诉我错误信息，我会继续帮你调整！**
