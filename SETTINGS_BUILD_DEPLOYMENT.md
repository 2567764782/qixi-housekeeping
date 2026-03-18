# 📋 在 Settings 页面修改 Install Command

## 当前位置

你现在在 **Settings → General** 页面 ✅

---

## 🎯 找到 Build and Deployment 设置

### 第一步：点击左侧菜单的 "Build and Deployment"

**在左侧菜单中，你会看到**：

```
General ← 当前位置
Build and Deployment ← 点击这个！
Environments
Environment Variables
Git
Deployment Protection
Functions
...
```

**点击 "Build and Deployment"**

---

## 📋 点击后你会看到

### Build and Deployment 设置页面

会包含以下设置：

1. **Build Command**（构建命令）
   - 当前：`pnpm build:web`

2. **Output Directory**（输出目录）
   - 当前：`dist-web`

3. **Install Command**（安装命令）← 我们要修改这个！
   - 当前：`Automatic` 或 `npm install`
   - 需要改为：`npm install --legacy-peer-deps`

---

## 🎯 具体操作步骤

### 第一步：点击 "Build and Deployment"

**点击左侧菜单的 "Build and Deployment"**

---

### 第二步：找到 Install Command

**在页面中找到 "Install Command" 设置**

---

### 第三步：展开 Override

**点击 "Override" 或 "Edit" 按钮**

---

### 第四步：输入新命令

**在输入框中输入**：
```
npm install --legacy-peer-deps
```

---

### 第五步：保存

**点击 "Save" 按钮**

---

## 🎯 现在就开始

**点击左侧菜单的 "Build and Deployment"！**

然后告诉我你看到了什么设置选项！
