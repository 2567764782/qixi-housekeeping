# 🔧 解决 pnpm 和 Node.js 版本不兼容问题

## 错误信息

```
ERR_PNPM_UNSUPPORTED_ENGINE  Unsupported environment (bad pnpm and/or Node.js version)
```

---

## ⚠️ 问题原因

### 版本不兼容

项目可能需要特定的 Node.js 版本，但 Vercel 默认使用的是 Node.js 24.x，可能太新了。

---

## ✅ 解决方案

### 第一步：修改 Node.js 版本

**进入 Settings → General**

1. 点击左侧菜单的 **"Settings"**
2. 点击 **"General"**
3. 向下滚动找到 **"Node.js Version"**

---

### 第二步：选择合适的版本

**将 Node.js 版本改为**：
- **18.x**（推荐，最稳定）
- 或者 **20.x**

**操作**：
1. 点击下拉菜单
2. 选择 `18.x` 或 `20.x`
3. 点击 **"Save"**

---

### 第三步：修改 Install Command

**回到 Settings → Build and Deployment**

**修改 Install Command 为**：
```
node --version && corepack enable && pnpm install
```

**或者使用特定的 pnpm 版本**：
```
node --version && corepack enable && corepack prepare pnpm@8 --activate && pnpm install
```

---

## 📋 完整操作步骤

### 1. 修改 Node.js 版本

**Settings → General → Node.js Version**
- 改为 **18.x**

---

### 2. 保存设置

**点击 Save 按钮**

---

### 3. 修改 Install Command

**Settings → Build and Deployment → Install Command**
```
node --version && corepack enable && pnpm install
```

---

### 4. 保存并重新部署

**点击 Save → Deployments → Redeploy**

---

## 🎯 如果还是失败

### 尝试指定 pnpm 版本

**修改 Install Command 为**：
```
corepack enable && corepack prepare pnpm@8.15.0 --activate && pnpm install
```

**说明**：
- `pnpm@8.15.0`：使用 pnpm 8.x 的稳定版本
- 更容易兼容项目

---

## 🎯 现在就开始

### 操作顺序

1. **Settings → General**
2. **修改 Node.js Version 为 18.x**
3. **保存**
4. **Settings → Build and Deployment**
5. **修改 Install Command 为**：
   ```
   node --version && corepack enable && pnpm install
   ```
6. **保存并重新部署**

---

## 📞 完成后告诉我结果！
