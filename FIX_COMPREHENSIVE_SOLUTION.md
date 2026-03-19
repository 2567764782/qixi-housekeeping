# 🔧 综合解决方案 - 同时修改多个配置

## 问题

`npm install -g pnpm@8.15.9 && pnpm install` 还是失败

---

## ✅ 综合解决方案（同时修改 3 个地方）

### 第一步：修改 GitHub 的 package.json

**访问**：https://github.com/2567764782/qixi-housekeeping/blob/main/package.json

**找到并删除**：
```json
"packageManager": "pnpm@9.0.0",
```

**修改 engines 字段**：
```json
"engines": {
  "node": ">=18.0.0"
}
```

**删除 `"pnpm": ">=9.0.0"` 这一行**

**提交更改**

---

### 第二步：修改 Vercel Node.js 版本

**Settings → General**

**Node.js Version：`22.x`**

**Save**

---

### 第三步：修改 Vercel Install Command

**Settings → Build and Deployment**

**Install Command**：
```
npm install -g pnpm@latest && pnpm install --no-frozen-lockfile
```

**Save**

---

### 第四步：重新部署

**Deployments → Redeploy**

---

## 🎯 方案总结

### GitHub 修改（1 处）
- 删除 `packageManager` 字段
- 修改 `engines` 字段，只保留 `node`

### Vercel 修改（2 处）
- Node.js Version：`22.x`
- Install Command：`npm install -g pnpm@latest && pnpm install --no-frozen-lockfile`

---

## 📋 详细操作步骤

### 第一步：修改 GitHub

1. **访问**：https://github.com/2567764782/qixi-housekeeping
2. **点击 package.json 文件**
3. **点击铅笔图标 ✏️ 编辑**
4. **删除这一行**：
   ```json
   "packageManager": "pnpm@9.0.0",
   ```
5. **修改 engines**：
   ```json
   "engines": {
     "node": ">=18.0.0"
   }
   ```
6. **提交更改**

---

### 第二步：修改 Vercel（Node.js）

1. **打开 Vercel Dashboard**
2. **Settings → General**
3. **Node.js Version：`22.x`**
4. **Save**

---

### 第三步：修改 Vercel（Install Command）

1. **Settings → Build and Deployment**
2. **Install Command**：
   ```
   npm install -g pnpm@latest && pnpm install --no-frozen-lockfile
   ```
3. **Save**

---

### 第四步：重新部署

**Deployments → Redeploy**

---

## 🔍 如果还是失败，请提供错误日志

### 在 Vercel 中查看：

1. **Deployments → 点击失败的部署**
2. **查看 Building 日志**
3. **找到红色错误信息**
4. **复制完整的错误日志给我**

---

## 🎯 现在请按照上面的步骤操作

### 需要修改 3 个地方：

- [ ] GitHub：删除 packageManager + 修改 engines
- [ ] Vercel：Node.js Version 改为 22.x
- [ ] Vercel：Install Command 改为 `npm install -g pnpm@latest && pnpm install --no-frozen-lockfile`

---

## 📞 完成后告诉我结果！

**如果还是失败，请提供完整的错误日志！**
