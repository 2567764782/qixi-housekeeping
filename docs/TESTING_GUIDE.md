# 🚀 快速部署清单

## 当前状态检查

### 第一步：Supabase 数据库
- [ ] 访问：https://supabase.com
- [ ] 用 GitHub 登录
- [ ] 创建新项目（Name: qixi-housekeeping）
- [ ] 设置数据库密码（记住它！）
- [ ] 获取 DATABASE_URL

**DATABASE_URL 格式：**
```
postgresql://postgres.[项目ID]:[你的密码]@aws-0-ap-northeast-1.pooler.supabase.com:6543/postgres
```

---

### 第二步：Railway 后端部署
- [ ] 访问：https://railway.app
- [ ] 用 GitHub 登录
- [ ] 导入 qixi-housekeeping 仓库
- [ ] 设置 Root Directory 为 `server`
- [ ] 添加环境变量：
  ```
  DATABASE_URL=[你的Supabase连接字符串]
  JWT_SECRET=qixi-secret-2024
  NODE_ENV=production
  PORT=3000
  ```
- [ ] 等待部署完成（2-3分钟）
- [ ] 生成域名并复制

**Railway 域名：**
```
https://qixi-housekeeping-production.up.railway.app
```

---

### 第三步：Vercel 前端部署
- [ ] 访问：https://vercel.com
- [ ] 用 GitHub 登录
- [ ] 导入 qixi-housekeeping 仓库
- [ ] 配置：
  ```
  Build Command: pnpm build:web
  Output Directory: dist-web
  ```
- [ ] 添加环境变量：
  ```
  PROJECT_DOMAIN=[你的Railway域名]
  ```
- [ ] 点击 Deploy
- [ ] 等待部署完成（2-3分钟）

**Vercel 域名：**
```
https://qixi-housekeeping.vercel.app
```

---

## 第四步：测试和配置

### 4.1 测试前端访问

**操作步骤：**

1. 打开浏览器
2. 输入你的 Vercel 域名：
   ```
   https://qixi-housekeeping.vercel.app
   ```

3. 检查以下功能：
   - [ ] 首页轮播图是否显示
   - [ ] 功能入口图标是否显示
   - [ ] 点击"保洁服务"能否跳转
   - [ ] 服务选择页面是否正常
   - [ ] 预约表单是否可以填写

**如果遇到问题：**
- 按 F12 打开开发者工具
- 查看 Console 标签的错误信息
- 截图发给我

---

### 4.2 测试后端 API

**操作步骤：**

1. 在浏览器中打开：
   ```
   https://你的Railway域名.up.railway.app/api/hello
   ```

2. 应该看到：
   ```json
   {"message":"Hello World"}
   ```

3. 测试其他接口：
   ```
   # 测试用户接口
   https://你的Railway域名/api/users
   
   # 测试服务接口
   https://你的Railway域名/api/services
   ```

**如果看到错误：**
- 检查 Railway 环境变量是否正确
- 查看 Railway 部署日志
- 把错误信息发给我

---

### 4.3 配置微信小程序域名

**操作步骤：**

1. 访问微信公众平台：
   ```
   https://mp.weixin.qq.com
   ```

2. 登录你的小程序账号

3. 左侧菜单：开发管理 → 开发设置

4. 向下滚动，找到"服务器域名"

5. 点击"修改"

6. 添加以下域名（4个都要添加）：

   **request 合法域名：**
   ```
   https://你的Railway域名.up.railway.app
   ```

   **uploadFile 合法域名：**
   ```
   https://你的Railway域名.up.railway.app
   ```

   **downloadFile 合法域名：**
   ```
   https://你的Railway域名.up.railway.app
   ```

   **udp 合法域名：**
   ```
   （可以留空）
   ```

7. 点击"保存并提交"

**⚠️ 注意事项：**
- 域名必须以 `https://` 开头
- 域名必须是已备案的（Railway 和 Vercel 域名已备案）
- 每月只能修改 5 次

---

### 4.4 真机测试

**操作步骤：**

1. 打开微信开发者工具

2. 导入项目：
   - 点击"导入项目"
   - 选择项目的 `dist` 文件夹
   - AppID 填入你的小程序 AppID

3. 确保配置正确：
   - 右上角"详情"
   - "本地设置"
   - **取消勾选**"不校验合法域名"（重要！）

4. 点击右上角"预览"

5. 用微信扫描二维码

6. 在手机上测试：
   - [ ] 首页加载是否正常
   - [ ] 功能入口能否点击
   - [ ] 服务选择是否正常
   - [ ] 预约表单能否提交
   - [ ] 数据是否保存到数据库

**如果真机测试失败：**
- 检查服务器域名是否配置正确
- 查看微信开发者工具的控制台错误
- 检查 Railway 后端日志

---

## 🔍 常见问题排查

### 问题 1：前端访问空白页

**解决方案：**
```bash
1. 检查 Vercel 部署日志
2. 确认 build 命令执行成功
3. 查看 dist-web 目录是否有 index.html
```

### 问题 2：后端接口 500 错误

**解决方案：**
```bash
1. 检查 Railway 环境变量
2. 确认 DATABASE_URL 格式正确
3. 查看 Railway 部署日志
4. 测试数据库连接
```

### 问题 3：真机测试网络请求失败

**解决方案：**
```bash
1. 确认服务器域名已配置
2. 域名必须是 https
3. 等待 10 分钟让配置生效
4. 取消勾选"不校验合法域名"
```

### 问题 4：数据保存失败

**解决方案：**
```bash
1. 检查 Supabase 数据库是否创建表
2. 运行 SQL 创建表结构
3. 检查数据库连接是否正常
```

---

## ✅ 完成检查清单

全部完成后，你应该有：

- [ ] Supabase 数据库创建成功
- [ ] Railway 后端部署成功
- [ ] Vercel 前端部署成功
- [ ] 前端页面可以访问
- [ ] 后端 API 正常响应
- [ ] 微信小程序域名已配置
- [ ] 真机测试通过

---

## 📞 需要帮助？

在任意步骤遇到问题，告诉我：
1. 你在哪一步
2. 具体的错误信息
3. 或截图

我会立即帮你解决！
