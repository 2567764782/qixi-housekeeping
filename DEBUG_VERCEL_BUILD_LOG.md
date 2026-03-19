# 🔧 查看 Vercel 构建日志并排查问题

## 第一步：查看详细的构建日志

### 在 Vercel Dashboard 中：

1. **点击 "Deployments"**
2. **点击失败的部署**
3. **查看 "Building" 阶段的详细日志**
4. **找到具体的错误信息**

---

## 第二步：可能的错误原因

### 错误 A：依赖冲突
```
ERR_PNPM_PEER_DEP_ISSUES  Unmet peer dependencies
```

**解决方案**：
```
npm install -g pnpm@8.15.0 && pnpm install --no-frozen-lockfile
```

---

### 错误 B：网络问题
```
ERR_PNPM_FETCH_FAIL  GET https://registry.npmjs.org/xxx
```

**解决方案**：
```
npm install -g pnpm@8.15.0 && pnpm config set registry https://registry.npmmirror.com && pnpm install
```

---

### 错误 C：Node.js 版本问题
```
ERR_PNPM_UNSUPPORTED_ENGINE  Unsupported environment
```

**解决方案**：
- Settings → General → Node.js Version：`22.x`
- Install Command：`npm install -g pnpm@latest && pnpm install`

---

### 错误 D：内存不足
```
FATAL ERROR: Ineffective mark-compacts near heap limit
```

**解决方案**：在 `package.json` 中添加：
```json
"scripts": {
  "build": "NODE_OPTIONS='--max-old-space-size=4096' pnpm build"
}
```

---

## 第三步：尝试多种解决方案

### 方案 1：使用淘宝镜像 + no-frozen-lockfile

**Install Command**：
```
npm install -g pnpm@8.15.0 && pnpm config set registry https://registry.npmmirror.com && pnpm install --no-frozen-lockfile
```

---

### 方案 2：使用最新 pnpm + 淘宝镜像

**Install Command**：
```
npm install -g pnpm@latest && pnpm config set registry https://registry.npmmirror.com && pnpm install
```

---

### 方案 3：Node.js 22.x + 最新 pnpm

**Settings → General**
- **Node.js Version：`22.x`**

**Install Command**：
```
npm install -g pnpm@latest && pnpm install
```

---

### 方案 4：跳过 peer dependencies 检查

**Install Command**：
```
npm install -g pnpm@8.15.0 && pnpm config set registry https://registry.npmmirror.com && pnpm install --no-frozen-lockfile --strict-peer-dependencies=false
```

---

## 第四步：创建 .npmrc 文件（推荐）

### 在 GitHub 仓库根目录创建 `.npmrc` 文件

**文件内容**：
```
registry=https://registry.npmmirror.com
shamefully-hoist=true
strict-peer-dependencies=false
auto-install-peers=true
```

**提交更改**

### 然后 Install Command 改为：
```
npm install -g pnpm@8.15.0 && pnpm install
```

---

## 🎯 推荐操作顺序

### 第一步：创建 .npmrc 文件

**在 GitHub 仓库创建 `.npmrc` 文件**：
```
registry=https://registry.npmmirror.com
shamefully-hoist=true
strict-peer-dependencies=false
auto-install-peers=true
```

**提交更改**

---

### 第二步：修改 Vercel 配置

**Settings → Build and Deployment**

**Install Command**：
```
npm install -g pnpm@8.15.0 && pnpm install --no-frozen-lockfile
```

**Save 并 Redeploy**

---

### 第三步：如果还是失败，提供构建日志

**请复制完整的错误信息给我**，我会帮你分析具体问题

---

## 📞 请告诉我

1. **具体的错误信息是什么？**
   - 在 Vercel 的 Building 日志中找到红色错误信息

2. **或者直接尝试创建 .npmrc 文件**

---

## 🎯 快速解决方案

**在 GitHub 创建 `.npmrc` 文件 + 修改 Install Command**

**最稳定可靠！**
