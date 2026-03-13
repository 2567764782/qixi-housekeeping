# 🎯 小白专用配置指南（超简单）

## 只需要 1 条命令

```bash
bash scripts/easy-config.sh
```

## 然后回答 5 个问题

### 问题 1：微信小程序 AppID
**怎么获取：**
1. 打开浏览器，访问：https://mp.weixin.qq.com/
2. 登录你的小程序账号
3. 点击左侧「开发」→「开发设置」
4. 复制 AppID（格式：wx1234567890abcdef）
5. 粘贴到命令行，按回车

### 问题 2：微信小程序 AppSecret
**怎么获取：**
1. 在刚才的「开发设置」页面
2. 点击「AppSecret」旁边的「重置」按钮
3. 扫码验证身份
4. 复制显示的 AppSecret（只显示一次！）
5. 粘贴到命令行，按回车

### 问题 3：服务器域名
- **刚开始测试**：直接按回车（会使用默认值）
- **正式上线**：填你的域名（比如 `https://你的域名.com`）

### 问题 4：Supabase 数据库 URL
**怎么获取：**
1. 打开浏览器，访问：https://supabase.com/
2. 登录你的 Supabase 账号
3. 选择你的项目
4. 点击左侧「Settings」→「API」
5. 复制「Project URL」（格式：https://xxx.supabase.co）
6. 粘贴到命令行，按回车

### 问题 5：Supabase 数据库密钥
**怎么获取：**
1. 在刚才的 Supabase「API」页面
2. 找到「Project API keys」
3. 复制「anon public」密钥（很长的一串）
4. 粘贴到命令行，按回车

## 完成！

回答完 5 个问题后，配置自动完成！

## 下一步

```bash
# 1. 安装依赖
pnpm install

# 2. 构建项目
pnpm build:weapp

# 3. 打开微信开发者工具
#    - 导入项目，选择「dist」文件夹
#    - AppID 会自动填入
#    - 点击「导入」
```

## ⚠️ 重要：关闭域名校验

**仅开发时需要：**

1. 微信开发者工具 → 点击右上角「详情」
2. 找到「本地设置」
3. 勾选「不校验合法域名、web-view（业务域名）、TLS 版本以及 HTTPS 证书」

## 遇到问题？

```bash
# 检查配置是否正确
bash scripts/verify-config.sh
```

---

**就这么简单！** 🎉
