# 🚨 重要：修改 Root Directory

## 当前状态

你已经正确选择了 **NestJS** 作为 Application Preset ✅

但是 **Root Directory 显示为 `./`**，这是错误的！❌

---

## ⚠️ 为什么必须修改？

### 项目结构

你的 GitHub 仓库结构：
```
qixi-housekeeping/
├── src/          ← 前端代码
├── server/       ← 后端代码在这里！
│   ├── src/
│   ├── package.json
│   └── ...
├── config/
└── package.json
```

### 问题

- 当前 Root Directory 是 `./`（项目根目录）
- 但后端代码在 `server/` 文件夹里
- 如果不改，Vercel 会找不到后端代码，部署失败！

---

## ✅ 修改步骤

### 第一步：点击 Edit 按钮

**找到 "Root Directory" 那一行**：

```
Root Directory    ./       [Edit]
                           ↑ 点击这里
```

---

### 第二步：选择 server 文件夹

点击 Edit 后，会出现文件夹选择界面：

**你会看到文件夹列表**：
```
📁 src
📁 server    ← 点击选择这个！
📁 config
📁 assets
```

**点击 `server` 文件夹**

---

### 第三步：确认选择

选择 server 后：
- 点击 **"Continue"** 或 **"Confirm"** 或 **"Select"**
- 返回配置页面

---

## 📋 修改后应该显示

```
Root Directory: server
```

而不是 `./`

---

## 🎯 修改完成后

Root Directory 显示为 `server` 后，我们需要：

1. ✅ 添加环境变量
2. ✅ 点击 Deploy 部署

---

## 🚨 非常重要

**如果不修改 Root Directory，部署会失败！**

一定要修改为 `server`！

---

## 📞 修改完成后告诉我

回复 **"已修改"**，我会指导你添加环境变量！
