# 🔧 如何进入 Settings 页面修改 Install Command

## 当前状态

你现在在 **Deployment Details（部署详情）** 页面，不是设置页面。

---

## 🎯 进入 Settings 页面的方法

### 方法 1：通过左侧菜单（推荐）

**看页面左侧的垂直菜单栏**

**找到并点击 "Settings" 选项**

左侧菜单通常包含：
- Overview
- Deployments
- Logs
- Analytics
- ...
- **Settings** ← 点击这个！

---

### 方法 2：通过项目名称

1. **点击页面顶部的项目名称 "qixi-housekeeping"**
   - 通常在左上角或面包屑导航中

2. **返回项目概览页面**

3. **点击左侧菜单的 "Settings"**

---

## 📋 进入 Settings 页面后

### 第一步：找到 General 设置

在 Settings 页面，默认会显示 **"General"** 设置

---

### 第二步：向下滚动

找到 **"Build & Development Settings"** 部分

---

### 第三步：找到 Install Command

在 Build & Development Settings 中，你会看到：

```
Framework Preset: Vite
Build Command: pnpm build:web
Output Directory: dist-web
Install Command: [Override] ← 点击这里
```

---

### 第四步：修改 Install Command

**点击 "Override" 或展开 Install Command 设置**

**输入新的命令**：
```
npm install --legacy-peer-deps
```

---

### 第五步：保存

**点击 "Save" 按钮**

---

## 🎯 现在就做

**点击左侧菜单的 "Settings"**

然后告诉我你看到了什么！
