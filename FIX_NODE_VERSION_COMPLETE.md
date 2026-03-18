# 🔧 Node.js 版本问题完整解决方案

## 问题

Node.js 20.x 和 24.x 都不行，出现 `ERR_PNPM_UNSUPPORTED_ENGINE` 错误。

---

## ✅ 解决方案

### 方案 A：尝试 Node.js 18.x

**Settings → General → Node.js Version**

**改为 `18.x`**

**保存并重新部署**

---

### 方案 B：指定特定版本的 pnpm

**Settings → Build and Deployment → Install Command**

**修改为**：
```
corepack enable && corepack prepare pnpm@8.15.0 --activate && pnpm install
```

**说明**：
- pnpm 8.15.0 是稳定版本
- 更容易兼容项目

---

### 方案 C：使用 Node.js 18.x + 指定 pnpm 版本

**第一步：Settings → General**
- Node.js Version：`18.x`

**第二步：Settings → Build and Deployment**
- Install Command：
```
corepack enable && corepack prepare pnpm@8.15.0 --activate && pnpm install
```

---

### 方案 D：检查项目的 Node.js 版本要求

**查看项目的 package.json**

项目中可能指定了特定的 Node.js 版本要求，例如：
```json
"engines": {
  "node": ">=18.0.0",
  "pnpm": ">=8.0.0"
}
```

**你需要告诉我项目的 Node.js 版本要求是什么**

---

## 🎯 推荐尝试顺序

### 第一步：尝试 Node.js 18.x

**Settings → General → Node.js Version：18.x**

**重新部署**

---

### 第二步：如果还是失败，修改 Install Command

**Settings → Build and Deployment → Install Command**：
```
corepack enable && corepack prepare pnpm@8.15.0 --activate && pnpm install
```

**保存并重新部署**

---

### 第三步：如果还失败，告诉我项目的 Node.js 版本要求

**访问你的 GitHub 仓库**：
```
https://github.com/2567764782/qixi-housekeeping
```

**查看 package.json 文件中的 `engines` 字段**

---

## 🎯 现在请尝试

**方案 A + B 组合**：

1. **Settings → General**
   - Node.js Version：`18.x`
   - Save

2. **Settings → Build and Deployment**
   - Install Command：`corepack enable && corepack prepare pnpm@8.15.0 --activate && pnpm install`
   - Save

3. **Deployments → Redeploy**

---

## 📞 完成后告诉我结果！
