# 🚀 前端部署步骤（方案 A）

## 第一步：选择根目录

**在当前 Root Directory 弹窗中**：

```
○ qixi-housekeeping (root) ← 选择这个！
○ assets
○ config
```

**操作**：
- 确保选中 `qixi-housekeeping (root)`
- 点击右下角的 **Continue** 按钮

---

## 第二步：确认配置

点击 Continue 后，回到项目配置页面。

### 自动识别的配置（不需要修改）

```
Application Preset: Vite ✅
Root Directory: ./ ✅
Build Command: pnpm build:web ✅
Output Directory: dist-web ✅
```

**这些应该是正确的，不需要修改！**

---

## 第三步：添加环境变量（可选）

**点击 "Environment Variables" 展开配置**

### 添加以下环境变量：

```
Name: SUPABASE_URL
Value: https://tpwkvuzbjxpqjiewktdy.supabase.co
```

```
Name: SUPABASE_ANON_KEY
Value: 你的anon public key
```

**⚠️ 注意**：
- 如果暂时不想添加，可以先部署
- 后续在 Vercel 项目设置中也可以添加

---

## 第四步：点击 Deploy

**点击页面底部的黑色按钮**：
```
Deploy
```

等待部署完成（通常需要 2-3 分钟）

---

## 🎉 部署成功后

你会得到：
- ✅ 前端域名：`https://qixi-housekeeping.vercel.app`
- ✅ 可以直接访问小程序 H5 版本

---

## 📋 后续工作

部署完成后，我们需要：

### 1. 配置微信小程序
- 添加 AppID
- 配置服务器域名

### 2. 后端方案选择
- 方案 A：使用 Supabase REST API
- 方案 B：后续部署后端

### 3. 数据库配置
- 在 Supabase 创建数据表
- 配置 API 权限

---

## 🎯 现在就开始

1. 选择 `qixi-housekeeping (root)`
2. 点击 **Continue**
3. 确认配置
4. 点击 **Deploy**

完成后告诉我！🚀
