# 📋 如何查看 Vercel 构建日志

## 第一步：进入 Vercel Dashboard

1. **打开浏览器，访问**：https://vercel.com
2. **登录你的账号**
3. **点击你的项目**（qixi-housekeeping）

---

## 第二步：查看部署详情

1. **点击顶部菜单的 "Deployments"**
2. **找到最近失败的部署**（状态是 Failed）
3. **点击这个部署的名称或时间**

---

## 第三步：查看构建日志

1. **在部署详情页面中**
2. **找到 "Building" 部分**
3. **点击展开查看详细日志**

---

## 第四步：找到错误信息

**通常错误信息会有红色标记**

**常见的错误格式**：

### 错误类型 A：依赖安装失败
```
ERR_PNPM_PEER_DEP_ISSUES  Unmet peer dependencies
```

### 错误类型 B：网络请求失败
```
ERR_PNPM_FETCH_FAIL  GET https://registry.npmjs.org/xxx
```

### 错误类型 C：Node.js 版本不兼容
```
ERR_PNPM_UNSUPPORTED_ENGINE  Unsupported environment
```

### 错误类型 D：内存不足
```
FATAL ERROR: Ineffective mark-compacts near heap limit
```

### 错误类型 E：构建脚本失败
```
Error: Command "pnpm build" exited with 1
```

---

## 第五步：复制错误信息

### 方法一：截图
- **直接截图错误部分**
- **发送给我**

### 方法二：复制文本
- **选中错误文本**
- **复制并粘贴给我**

---

## 关键信息清单

**请提供以下信息**：

### 1️⃣ 错误类型
- 例如：`ERR_PNPM_PEER_DEP_ISSUES`

### 2️⃣ 错误详情
- 具体是哪个包失败
- 失败的原因是什么

### 3️⃣ 完整的错误堆栈
- 从哪一行开始出错
- 到哪一行结束

---

## 示例：完整的错误日志

```
Installing dependencies...
npm install -g pnpm@8.15.0 && pnpm install

added 1 package in 1s

Progress: resolved 1, reused 0, downloaded 1, added 1, done

ERR_PNPM_PEER_DEP_ISSUES  Unmet peer dependencies

.
├─┬ @tarojs/components 4.1.9
│ └── ✕ missing peer react-dom@>=16.8.0
└─┬ @tarojs/taro 4.1.9
  └── ✕ missing peer react@>=16.8.0

Error: Command "npm install -g pnpm@8.15.0 && pnpm install" exited with 1
```

---

## 🎯 现在请做这个

### 1️⃣ 打开 Vercel Dashboard
### 2️⃣ 点击失败的部署
### 3️⃣ 查看 Building 日志
### 4️⃣ 找到红色错误信息
### 5️⃣ 复制完整的错误信息给我

**或者截图发给我！**

---

## 💡 提示

**如果你看不到详细的错误信息**：
- 可能需要点击 "View Logs" 或 "Show More"
- 或者点击 "Building" 阶段的展开按钮

**如果你不确定哪个是错误**：
- 截图整个 Building 部分
- 我会帮你分析

---

## 📞 提供错误信息后

**我会根据具体错误提供精准的解决方案！**
