# 🎯 解决 Vercel 使用预装 pnpm 的问题

## 问题

虽然安装了 pnpm@9.0.0，但 Vercel 仍然使用了预装的 pnpm 6.35.1：

```
Expected version: >=9.0.0
Got: 6.35.1
```

---

## ✅ 解决方案 A：强制使用 npx（推荐）

### Settings → Build and Deployment

**Install Command**：
```
npm install -g pnpm@9.0.0 && npx pnpm@9.0.0 install
```

**说明**：
- `npx` 会强制使用指定的 pnpm 版本
- 不依赖 PATH 环境变量

---

## ✅ 解决方案 B：使用 corepack + 强制版本

### Settings → General

**Node.js Version**：`22.x`

### Settings → Build and Deployment

**Install Command**：
```
npm install -g corepack && corepack enable && corepack prepare pnpm@9.0.0 --activate && pnpm install
```

---

## ✅ 解决方案 C：修改 GitHub package.json（最根本）

### 第一步：确认 package.json 是否已修改

**访问**：https://github.com/2567764782/qixi-housekeeping/blob/main/package.json

**查找 engines 字段，确认是否还有**：
```json
"engines": {
  "pnpm": ">=9.0.0"
}
```

**如果有，必须删除！**

---

### 第二步：修改 package.json

**删除 pnpm 版本限制**：
```json
"engines": {
  "node": ">=18.0.0"
}
```

**提交更改**

---

### 第三步：确认 Vercel 使用了最新提交

**从日志中看到**：
```
Cloning github.com/2567764782/qixi-housekeeping (Branch: main, Commit: 7201bbc)
```

**确认这个 Commit ID 是最新的**！

---

## 🎯 推荐操作

### 方案 A：使用 npx（最快）

**Settings → Build and Deployment → Install Command**：
```
npm install -g pnpm@9.0.0 && npx pnpm@9.0.0 install
```

**Save 并 Redeploy**

---

### 方案 C：修改 package.json（最根本）

**1. 访问**：https://github.com/2567764782/qixi-housekeeping/blob/main/package.json

**2. 确认是否还有**：
```json
"engines": {
  "pnpm": ">=9.0.0"
}
```

**3. 如果有，删除并提交**

**4. 确认 Vercel 部署使用了最新的 Commit**

---

## 🔍 如何确认是否修改成功

### 查看 GitHub 最新提交

**访问**：https://github.com/2567764782/qixi-housekeeping/commits/main

**确认最新的 Commit 是否修改了 package.json**

---

## 📋 快速测试

### 第一步：尝试方案 A

**Install Command**：
```
npm install -g pnpm@9.0.0 && npx pnpm@9.0.0 install
```

### 第二步：Redeploy

### 第三步：如果还是失败，确认 package.json 是否已修改并提交

---

## 🎯 现在请做这个

### **选择一个方案尝试**：

#### **方案 A（最快）**：
```
npm install -g pnpm@9.0.0 && npx pnpm@9.0.0 install
```

#### **方案 C（最根本）**：
1. 访问 GitHub 查看 package.json
2. 确认 engines.pnpm 是否存在
3. 如果存在，删除并提交
4. 确认 Vercel 使用了最新 Commit

---

## 📞 告诉我你选择哪个方案，或者你的 package.json 现在的 engines 字段是什么！
