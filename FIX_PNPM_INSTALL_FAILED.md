# 🔧 解决 pnpm install 失败问题

## 错误信息

```
Command "pnpm install --no-frozen-lockfile" exited with 1
```

---

## ⚠️ 问题分析

### 可能的原因

1. **Vercel 环境中没有安装 pnpm**
   - 需要先安装 pnpm

2. **pnpm-lock.yaml 文件缺失**
   - GitHub 上传时遗漏了

3. **Node.js 版本问题**
   - 需要特定版本的 Node.js

---

## ✅ 解决方案

### 方案 A：使用 corepack（推荐）

**修改 Install Command 为**：
```
corepack enable && corepack prepare pnpm@latest --activate && pnpm install
```

**说明**：
- `corepack enable`：启用 Node.js 内置的包管理器管理器
- `corepack prepare pnpm@latest`：安装最新版本的 pnpm
- `pnpm install`：安装项目依赖

---

### 方案 B：使用 npm 安装 pnpm

**修改 Install Command 为**：
```
npm install -g pnpm@latest && pnpm install --no-frozen-lockfile
```

**说明**：
- 先用 npm 全局安装 pnpm
- 然后使用 pnpm 安装依赖

---

### 方案 C：完全使用 npm

**修改 Install Command 为**：
```
npm install --legacy-peer-deps --force
```

**说明**：
- `--force`：强制安装，忽略所有冲突
- 可能会有一些警告，但通常会成功

---

### 方案 D：删除 lockfile 后安装

**修改 Install Command 为**：
```
rm -f pnpm-lock.yaml && npm install --legacy-peer-deps
```

**说明**：
- 删除 pnpm-lock.yaml
- 使用 npm 重新安装依赖

---

## 🎯 推荐操作顺序

### 尝试顺序

**第一步：尝试方案 A**
```
corepack enable && corepack prepare pnpm@latest --activate && pnpm install
```

**如果失败，尝试方案 B**：
```
npm install -g pnpm@latest && pnpm install --no-frozen-lockfile
```

**如果还失败，尝试方案 C**：
```
npm install --legacy-peer-deps --force
```

**最后尝试方案 D**：
```
rm -f pnpm-lock.yaml && npm install --legacy-peer-deps
```

---

## 📋 操作步骤

### 修改 Install Command

1. 进入 Settings → Build and Deployment
2. 找到 Install Command
3. 修改为上面的命令之一
4. 保存
5. 重新部署

---

## 🎯 现在就开始

**推荐先尝试方案 A**：
```
corepack enable && corepack prepare pnpm@latest --activate && pnpm install
```

修改后保存并重新部署，告诉我结果！
