# 🎯 解决 pnpm 版本冲突问题

## 问题根源

从错误日志中发现：

```
Expected version: >=9.0.0
Got: 6.35.1

This is happening because the package's manifest has an engines.pnpm field specified.
```

**关键问题**：
1. GitHub 的 package.json 中还有 `"pnpm": ">=9.0.0"` 限制
2. Vercel 使用了预装的 pnpm 6.35.1，而不是我们安装的版本

---

## ✅ 解决方案 A：修改 package.json（推荐）

### 第一步：检查 GitHub 的 package.json

**访问**：https://github.com/2567764782/qixi-housekeeping/blob/main/package.json

**查找 engines 字段，应该看到**：
```json
"engines": {
  "pnpm": ">=9.0.0"
}
```

---

### 第二步：修改 engines 字段

**方案 A：完全删除 pnpm 限制**
```json
"engines": {
  "node": ">=18.0.0"
}
```

**方案 B：放宽 pnpm 版本要求**
```json
"engines": {
  "node": ">=18.0.0",
  "pnpm": ">=6.0.0"
}
```

---

### 第三步：提交更改

**点击 "Commit changes"**

---

### 第四步：重新部署

**Vercel 会自动检测到更改并重新部署**

---

## ✅ 解决方案 B：使用 pnpm@9.x（如果不想修改 package.json）

### Settings → Build and Deployment

**Install Command**：
```
npm install -g pnpm@9.0.0 && pnpm install
```

**说明**：
- 安装 pnpm 9.0.0
- 满足 package.json 中的版本要求

---

## 🎯 推荐操作：方案 A + 方案 B 组合

### 第一步：修改 GitHub 的 package.json

**删除或修改 engines.pnpm**：
```json
"engines": {
  "node": ">=18.0.0"
}
```

**提交更改**

---

### 第二步：修改 Vercel Install Command

**Settings → Build and Deployment**

**Install Command**：
```
npm install -g pnpm@latest && pnpm install --no-frozen-lockfile
```

**Save**

---

### 第三步：重新部署

**Deployments → Redeploy**

---

## 📋 检查清单

### GitHub package.json 必须修改的地方：

1. **删除 packageManager 字段**（如果还存在）
   ```json
   "packageManager": "pnpm@9.0.0",  // 删除这一行
   ```

2. **修改 engines 字段**
   ```json
   "engines": {
     "node": ">=18.0.0"  // 只保留 node，删除 pnpm
   }
   ```

---

## 🔍 如何确认是否修改成功

### 在 GitHub 查看 package.json

**访问**：https://github.com/2567764782/qixi-housekeeping/blob/main/package.json

**确认以下内容**：

#### ❌ 不应该存在：
```json
"packageManager": "pnpm@9.0.0",
```

#### ✅ 应该是这样：
```json
"engines": {
  "node": ">=18.0.0"
}
```

#### ❌ 不应该是这样：
```json
"engines": {
  "node": ">=18.0.0",
  "pnpm": ">=9.0.0"  // 这一行要删除
}
```

---

## 🎯 现在请做这个

### 第一步：访问 GitHub 查看 package.json

**访问**：https://github.com/2567764782/qixi-housekeeping/blob/main/package.json

### 第二步：确认 engines 字段

**如果还有 `"pnpm": ">=9.0.0"`，请删除这一行**

### 第三步：提交更改

### 第四步：告诉我你已经修改完成

---

## 📞 或者，如果你想用方案 B

**直接修改 Vercel Install Command**：
```
npm install -g pnpm@9.0.0 && pnpm install
```

**告诉我你选择哪个方案！**
