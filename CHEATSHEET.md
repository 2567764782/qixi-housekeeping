# 📋 配置小抄（打印出来备用）

## 🚀 开始配置

```bash
bash scripts/easy-config.sh
```

---

## 🔑 需要准备的 5 个东西

### 1. AppID（18 个字符）
**哪里找：** https://mp.weixin.qq.com/ → 开发 → 开发设置 → 开发者ID
**格式：** `wx1234567890abcdef`

### 2. AppSecret（32 个字符）
**哪里找：** 微信公众平台 → 开发 → 开发设置 → AppSecret 旁边「重置」
**注意：** 只显示一次，立即复制保存！

### 3. Supabase URL
**哪里找：** https://supabase.com/ → 选择项目 → Settings → API → Project URL
**格式：** `https://xxx.supabase.co`

### 4. Supabase Key
**哪里找：** Supabase → Settings → API → anon public key
**格式：** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`（很长）

### 5. 服务器域名
- **开发测试：** `http://localhost:3000`（直接按回车）
- **正式上线：** `https://你的域名.com`

---

## ✅ 配置完成后的 3 条命令

```bash
# 第 1 条：安装依赖
pnpm install

# 第 2 条：构建项目
pnpm build:weapp

# 第 3 条：打开微信开发者工具，导入「dist」文件夹
```

---

## ⚠️ 必须做的事：关闭域名校验

**仅开发时需要做一次：**

1. 微信开发者工具 → 右上角「详情」
2. 找到「本地设置」
3. 勾选「不校验合法域名」

---

## 🆘 遇到问题？

```bash
# 检查配置
bash scripts/verify-config.sh
```

---

## 📱 需要下载的工具

- **微信开发者工具：** https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html
- **Node.js：** https://nodejs.org/（如果还没有安装）

---

## 🌐 需要注册的账号

- **微信小程序：** https://mp.weixin.qq.com/（需要 300 元认证费）
- **Supabase：** https://supabase.com/（免费）

---

## 💡 常见命令速查

```bash
# 配置小程序
bash scripts/easy-config.sh

# 检查配置
bash scripts/verify-config.sh

# 安装依赖
pnpm install

# 构建小程序
pnpm build:weapp

# 启动开发服务器
pnpm dev

# 构建所有
pnpm build
```

---

## 📞 需要帮助？

- 📖 [详细文档](EASY_CONFIG.md)
- 🖼️ [截图说明](docs/CONFIG_STEPS_VISUAL.md)
- 📋 [快速参考](WECHAT_CONFIG_SUMMARY.md)

---

**记住这 5 个网址：**

1. 微信公众平台：https://mp.weixin.qq.com/
2. Supabase：https://supabase.com/
3. 微信开发者工具下载：https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html
4. Node.js 下载：https://nodejs.org/
5. 微信开放社区：https://developers.weixin.qq.com/community/
