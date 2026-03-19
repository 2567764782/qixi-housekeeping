# 🚀 修改完成后的 Vercel 配置和部署步骤

## 第一步：确认 Vercel 设置

### Settings → General

**确认 Node.js Version**：
- **推荐**：`22.x`（最新稳定版）
- **或者**：`20.x`（LTS 版本）

---

### Settings → Build and Deployment

**Install Command（推荐方案）**：
```
npm install -g pnpm@latest && pnpm install --no-frozen-lockfile
```

**或者使用 npx 确保版本正确**：
```
npx pnpm@latest install --no-frozen-lockfile
```

**Save**

---

## 第二步：触发重新部署

### 方法一：自动触发（推荐）

**Vercel 会自动检测到 GitHub 的更改并重新部署**

**等待 1-2 分钟**

---

### 方法二：手动触发

1. **Vercel Dashboard → Deployments**
2. **点击最近的部署**
3. **点击右侧的三个点 "..."**
4. **选择 "Redeploy"**

---

## 第三步：查看部署状态

### 在 Vercel Dashboard 中：

1. **点击 Deployments 标签**
2. **查看最新的部署状态**

#### 预期状态：
- ✅ **Building**：正在构建
- ✅ **Ready**：部署成功
- ❌ **Failed**：部署失败（需要查看错误日志）

---

## 第四步：如果部署成功

### 验证后端 API

**在浏览器中访问**：
```
https://你的项目名.vercel.app/api
```

**预期返回**：
```json
{
  "message": "Hello World"
}
```

---

## 第五步：配置环境变量（重要！）

### Settings → Environment Variables

**需要添加以下环境变量**：

#### 变量 1：SUPABASE_URL
- **Name**：`SUPABASE_URL`
- **Value**：你的 Supabase 项目 URL
  ```
  https://你的项目ID.supabase.co
  ```

#### 变量 2：SUPABASE_ANON_KEY
- **Name**：`SUPABASE_ANON_KEY`
- **Value**：你的 Supabase 匿名密钥

#### 变量 3：PROJECT_DOMAIN（可选）
- **Name**：`PROJECT_DOMAIN`
- **Value**：你的 Vercel 域名
  ```
  https://你的项目名.vercel.app
  ```

---

## 📋 完整检查清单

- [ ] 确认 GitHub package.json 已修改（删除 engines.pnpm）
- [ ] 确认 Vercel Node.js Version 设置正确（22.x 或 20.x）
- [ ] 确认 Vercel Install Command 设置正确
- [ ] 触发重新部署
- [ ] 等待部署完成
- [ ] 验证后端 API 是否正常
- [ ] 配置环境变量

---

## 🎯 推荐的 Install Command

### 方案 A：使用 pnpm@latest
```
npm install -g pnpm@latest && pnpm install --no-frozen-lockfile
```

### 方案 B：使用 npx
```
npx pnpm@latest install --no-frozen-lockfile
```

---

## 📞 现在请做这个

### 第一步：确认 Vercel Install Command

**Settings → Build and Deployment → Install Command**：
```
npm install -g pnpm@latest && pnpm install --no-frozen-lockfile
```

### 第二步：Save

### 第三步：Redeploy

### 第四步：告诉我部署结果！
