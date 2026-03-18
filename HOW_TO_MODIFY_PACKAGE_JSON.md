# 📝 修改 GitHub 仓库的 package.json - 详细步骤

## 方法一：在 GitHub 网页上直接修改（推荐）

### 第一步：访问你的 GitHub 仓库

**打开浏览器，访问**：
```
https://github.com/2567764782/qixi-housekeeping
```

---

### 第二步：找到 package.json 文件

1. **在仓库页面中，找到 `package.json` 文件**
2. **点击文件名 `package.json`**

---

### 第三步：点击编辑按钮

1. **在文件内容上方，找到一支"铅笔"图标** ✏️
2. **点击铅笔图标，进入编辑模式**

---

### 第四步：修改内容

**找到这一行**：
```json
"packageManager": "pnpm@9.0.0",
```

**修改为**：
```json
"packageManager": "pnpm@8.15.0",
```

**同时找到**：
```json
"engines": {
  "pnpm": ">=9.0.0"
}
```

**修改为**：
```json
"engines": {
  "pnpm": ">=8.0.0"
}
```

---

### 第五步：提交更改

1. **滚动到页面底部**
2. **在 "Commit changes" 输入框中输入**：
   ```
   fix: 修改 pnpm 版本为 8.15.0
   ```
3. **点击绿色的 "Commit changes" 按钮**

---

### 第六步：等待 Vercel 自动部署

**提交后，Vercel 会自动检测到更改并重新部署**

---

## 方法二：使用 Git 命令修改（如果你在本地有仓库）

### 第一步：克隆仓库（如果没有）
```bash
git clone https://github.com/2567764782/qixi-housekeeping.git
cd qixi-housekeeping
```

### 第二步：编辑 package.json
```bash
# 使用编辑器打开
notepad package.json
# 或
code package.json
```

### 第三步：修改内容

**找到并修改**：
```json
"packageManager": "pnpm@8.15.0",
"engines": {
  "pnpm": ">=8.0.0"
}
```

### 第四步：提交并推送
```bash
git add package.json
git commit -m "fix: 修改 pnpm 版本为 8.15.0"
git push
```

---

## 📋 修改后的 Vercel 配置

### Settings → General
- **Node.js Version：`20.x`**

### Settings → Build and Deployment
- **Install Command**：
```
corepack enable && corepack prepare pnpm@8.15.0 --activate && pnpm install
```

---

## 🎯 推荐使用方法一（GitHub 网页直接修改）

**最简单，不需要本地环境！**

---

## 📞 完成后告诉我，我会帮你确认下一步！
