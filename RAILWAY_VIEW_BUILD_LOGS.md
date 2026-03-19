# 🔍 查看 Railway 详细构建日志

## 当前状态

从日志看到：
- ❌ **FAILED**：部署失败
- ❌ **Build > Build image**：镜像构建失败
- ❌ **Failed to build an image**：构建镜像失败

---

## 第一步：点击 "View logs" 按钮

### 在页面右上角：
1. **找到红色的 "View logs" 按钮**
2. **点击按钮**

---

## 第二步：查看构建日志

### 点击后会显示详细的构建日志：

**查找以下错误信息**：

#### 常见错误 1：找不到文件
```
Error: Cannot find file 'package.json'
Error: ENOENT: no such file or directory
```

#### 常见错误 2：依赖安装失败
```
npm ERR! code ERESOLVE
pnpm: ERR_PNPM_FETCH_FAIL
Error: Could not resolve dependency
```

#### 常见错误 3：构建命令失败
```
Error: Command failed with exit code 1
sh: pnpm: command not found
```

#### 常见错误 4：内存不足
```
FATAL ERROR: Ineffective mark-compacts near heap limit
JavaScript heap out of memory
```

---

## 第三步：复制完整的错误日志

### 找到错误后：
1. **选中从 "Installing dependencies" 或 "Building" 开始的所有日志**
2. **复制完整的错误堆栈**
3. **发送给我**

---

## 🔧 可能的解决方案

### 方案 A：Railway 可能没有正确检测项目类型

**需要手动配置**：

#### 在 Settings 标签中：
1. **找到 "Build Command"**
2. **手动输入**：
   ```
   npm install -g pnpm && pnpm install && pnpm build
   ```

3. **找到 "Start Command"**
4. **手动输入**：
   ```
   node dist/server/main.js
   ```

---

### 方案 B：添加 railway.toml 配置文件

#### 在项目根目录创建 `railway.toml` 文件：

```toml
[build]
builder = "NIXPACKS"

[build.nixpacksPlan]
phases = {
  install = { cmds = ["npm install -g pnpm", "pnpm install"] }
  build = { cmds = ["pnpm build"] }
}

[start]
cmd = "node dist/server/main.js"
```

**提交到 GitHub 后 Railway 会自动检测**

---

## 🎯 现在请做这个

### 第一步：点击 "View logs" 按钮

### 第二步：查看完整的构建日志

### 第三步：找到红色错误信息

### 第四步：复制完整的错误日志给我

---

## 📞 请提供

1. **完整的构建日志**（从 "Installing dependencies" 开始）
2. **或者截图日志页面**

**我会帮你分析并解决！**
