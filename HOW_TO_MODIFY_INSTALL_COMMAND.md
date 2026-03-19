# 📝 如何在 Vercel 中修改 Install Command

## 第一步：打开 Vercel Dashboard

1. **打开浏览器**
2. **访问**：https://vercel.com
3. **登录你的账号**

---

## 第二步：进入项目设置

1. **在 Dashboard 首页**
2. **找到并点击你的项目**（qixi-housekeeping）

---

## 第三步：进入 Settings

1. **在项目页面顶部**
2. **点击 "Settings" 标签**（在 Deployments 旁边）

---

## 第四步：找到 Build and Deployment 设置

1. **在 Settings 页面左侧菜单**
2. **点击 "Build and Deployment"**

---

## 第五步：修改 Install Command

1. **在右侧页面中找到 "Install Command" 部分**
2. **点击下拉框，选择 "Override"**
3. **在输入框中输入**：
   ```
   npm install -g pnpm@8.15.9 && pnpm install
   ```
4. **点击 "Save" 按钮**

---

## 第六步：重新部署

### 方法一：自动触发
- **修改设置后，Vercel 会自动重新部署**

### 方法二：手动触发
1. **点击顶部的 "Deployments" 标签**
2. **找到最近的部署**
3. **点击右侧的三个点 "..."**
4. **选择 "Redeploy"**

---

## 📸 图文说明

### 页面结构：

```
┌─────────────────────────────────────────┐
│  qixi-housekeeping                       │
├─────────────────────────────────────────┤
│  Deployments | Settings | Logs | ...     │ ← 点击 Settings
└─────────────────────────────────────────┘

Settings 页面：

┌──────────┬──────────────────────────────┐
│          │                              │
│ General  │  Build and Deployment        │ ← 找到这个区域
│          │                              │
│ Git      │  ┌────────────────────────┐  │
│          │  │ Install Command        │  │
│ Domains  │  │                        │  │
│          │  │ [Override]             │  │ ← 选择 Override
│ Build... │  │ npm install -g pnpm... │  │ ← 输入命令
│          │  │                        │  │
│ Env...   │  │ [Save]                 │  │ ← 点击 Save
│          │  └────────────────────────┘  │
└──────────┴──────────────────────────────┘
```

---

## 🔍 如果找不到 Install Command

### 检查清单：

1. **确认你在 Settings 页面**
   - 顶部应该显示 "Settings" 标签高亮

2. **确认你在 Build and Deployment 子菜单**
   - 左侧菜单中 "Build and Deployment" 应该高亮

3. **向下滚动**
   - Install Command 可能在页面下方
   - 继续向下滚动查找

4. **如果还是找不到**
   - 截图整个 Settings → Build and Deployment 页面
   - 发给我，我会帮你定位

---

## 📋 完整操作清单

- [ ] 打开 Vercel Dashboard（vercel.com）
- [ ] 点击你的项目（qixi-housekeeping）
- [ ] 点击顶部 "Settings" 标签
- [ ] 点击左侧 "Build and Deployment"
- [ ] 找到 "Install Command" 部分
- [ ] 选择 "Override"
- [ ] 输入：`npm install -g pnpm@8.15.9 && pnpm install`
- [ ] 点击 "Save"
- [ ] 重新部署

---

## 🎯 快速导航链接

### 直接访问项目设置页面：

**格式**：
```
https://vercel.com/你的用户名/qixi-housekeeping/settings/build-and-deployment
```

**例如**：
```
https://vercel.com/your-username/qixi-housekeeping/settings/build-and-deployment
```

---

## 📞 完成后告诉我！

**修改并保存后，Vercel 会自动重新部署**

**告诉我结果！**
