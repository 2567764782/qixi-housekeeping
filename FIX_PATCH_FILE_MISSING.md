# 🔧 解决 pnpm patch 文件缺失问题

## 问题

```
ENOENT: no such file or directory, open '/vercel/path0/patches/@tarojs__plugin-mini-ci@4.1.9.patch'
```

**原因**：package.json 中配置了 pnpm patch，但 patch 文件不存在

---

## 📋 检查 GitHub 仓库

### 第一步：访问 GitHub 仓库

**访问**：https://github.com/2567764782/qixi-housekeeping

**查看是否有 `patches` 目录**

---

## ✅ 解决方案

### 方案 A：删除 patchedDependencies 配置（推荐）

#### 第一步：修改 GitHub 的 package.json

**访问**：https://github.com/2567764782/qixi-housekeeping/blob/main/package.json

**找到并删除整个 pnpm.patchedDependencies 配置**：

**删除前**：
```json
"pnpm": {
  "patchedDependencies": {
    "@tarojs/plugin-mini-ci@4.1.9": "patches/@tarojs__plugin-mini-ci@4.1.9.patch"
  }
}
```

**删除后**：
```json
// 完全删除 pnpm 配置块
```

**提交更改**

---

#### 第二步：重新部署

**Vercel 会自动检测到更改并重新部署**

---

### 方案 B：创建 patches 文件（如果确实需要 patch）

#### 第一步：在 GitHub 创建 patches 目录

1. **在仓库根目录创建 `patches` 文件夹**
2. **创建文件**：`patches/@tarojs__plugin-mini-ci@4.1.9.patch`

---

#### 第二步：创建空的 patch 文件

**文件内容**：
```diff
diff --git a/node_modules/@tarojs/plugin-mini-ci/dist/index.js b/node_modules/@tarojs/plugin-mini-ci/dist/index.js
index 1234567..abcdefg 100644
--- a/node_modules/@tarojs/plugin-mini-ci/dist/index.js
+++ b/node_modules/@tarojs/plugin-mini-ci/dist/index.js
@@ -1,0 +1,0 @@
```

**注意**：这是一个空的 patch 文件，不会修改任何内容

---

### 方案 C：使用 --ignore-scripts 跳过 patch

#### Settings → Build and Deployment

**Install Command**：
```
npx pnpm@latest install --no-frozen-lockfile --ignore-scripts
```

**说明**：
- `--ignore-scripts` 会跳过所有脚本，包括 patch
- 但可能会影响其他功能

---

## 🎯 推荐操作：方案 A（删除 patchedDependencies）

### 第一步：访问 GitHub

**访问**：https://github.com/2567764782/qixi-housekeeping/blob/main/package.json

---

### 第二步：点击编辑

**点击铅笔图标 ✏️ 编辑**

---

### 第三步：删除 pnpm.patchedDependencies

**找到并删除整个配置块**：
```json
"pnpm": {
  "patchedDependencies": {
    "@tarojs/plugin-mini-ci@4.1.9": "patches/@tarojs__plugin-mini-ci@4.1.9.patch"
  }
}
```

**确保 JSON 格式正确**

---

### 第四步：提交更改

**Commit 信息**：
```
fix: 删除不存在的 patchedDependencies 配置
```

**点击 "Commit changes"**

---

### 第五步：等待 Vercel 自动部署

**Vercel 会自动检测到更改并重新部署**

---

## 📋 完整的 package.json 修改示例

### 修改前：
```json
{
  "name": "coze-mini-program",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    ...
  },
  "dependencies": {
    ...
  },
  "devDependencies": {
    ...
  },
  "engines": {
    "node": ">=18.0.0"
  },
  "pnpm": {
    "patchedDependencies": {
      "@tarojs/plugin-mini-ci@4.1.9": "patches/@tarojs__plugin-mini-ci@4.1.9.patch"
    }
  },
  "templateInfo": {
    ...
  }
}
```

### 修改后：
```json
{
  "name": "coze-mini-program",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    ...
  },
  "dependencies": {
    ...
  },
  "devDependencies": {
    ...
  },
  "engines": {
    "node": ">=18.0.0"
  },
  "templateInfo": {
    ...
  }
}
```

**注意**：删除整个 `pnpm` 配置块

---

## 🎯 现在请做这个

### 第一步：访问 GitHub package.json

**访问**：https://github.com/2567764782/qixi-housekeeping/blob/main/package.json

---

### 第二步：删除 pnpm.patchedDependencies 配置

**删除整个 pnpm 配置块**

---

### 第三步：提交更改

---

### 第四步：告诉我已经完成

**我会帮你确认下一步！**
