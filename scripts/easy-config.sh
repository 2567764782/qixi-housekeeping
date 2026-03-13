#!/bin/bash

# 超级简化配置向导
# 专为小白设计，只需要回答5个问题

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m'

# 清屏
clear

echo -e "${CYAN}${BOLD}"
echo "╔════════════════════════════════════════╗"
echo "║                                        ║"
echo "║    🚀 小白配置向导（超简单版）         ║"
echo "║                                        ║"
echo "║    只需要回答 5 个问题                 ║"
echo "║                                        ║"
echo "╚════════════════════════════════════════╝"
echo -e "${NC}"
echo ""

# 检查项目目录
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ 请在项目根目录运行此脚本${NC}"
    exit 1
fi

# 定义获取输入的函数
get_input() {
    local prompt=$1
    local default=$2
    local result

    if [ -n "$default" ]; then
        echo -e "${YELLOW}❓ $prompt${NC}"
        read -p "$(echo -e ${GREEN}[直接回车使用: $default] ${NC})" result
        result=${result:-$default}
    else
        echo -e "${YELLOW}❓ $prompt${NC}"
        read -p "$(echo -e ${GREEN}> ${NC})" result
    fi

    echo "$result"
}

# 定义显示教程的函数
show_tutorial() {
    echo ""
    echo -e "${BLUE}${BOLD}━━━ 如何获取？━━━${NC}"
    echo -e "$1"
    echo ""
}

# 定义验证 AppID 的函数
validate_appid() {
    local appid=$1
    if [[ ! $appid =~ ^wx[a-f0-9]{16}$ ]]; then
        echo -e "${RED}❌ AppID 格式不对！应该是 wx 开头，共18个字符${NC}"
        echo -e "${CYAN}例如：wx1234567890abcdef${NC}"
        return 1
    fi
    return 0
}

# 创建 server 目录
mkdir -p server

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# 问题 1: AppID
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo -e "${BOLD}${CYAN}[1/5] 微信小程序 AppID${NC}"
show_tutorial "1. 访问：https://mp.weixin.qq.com/
2. 登录你的小程序账号
3. 点击左侧「开发」→「开发设置」
4. 找到「开发者ID」
5. 复制 AppID（格式：wx1234567890abcdef）"

while true; do
    WECHAT_APP_ID=$(get_input "请粘贴你的 AppID" "")
    if [ -z "$WECHAT_APP_ID" ]; then
        echo -e "${YELLOW}⚠️  AppID 不能为空，请重新输入${NC}"
        continue
    fi
    if validate_appid "$WECHAT_APP_ID"; then
        echo -e "${GREEN}✅ AppID 格式正确${NC}"
        break
    fi
done
echo ""

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# 问题 2: AppSecret
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo -e "${BOLD}${CYAN}[2/5] 微信小程序 AppSecret${NC}"
show_tutorial "1. 在刚才的「开发设置」页面
2. 找到「开发者ID」
3. 点击「AppSecret」旁边的「重置」按钮
4. 扫码验证身份
5. 复制显示的 AppSecret（只显示一次！）"

WECHAT_APP_SECRET=$(get_input "请粘贴你的 AppSecret" "")
if [ -z "$WECHAT_APP_SECRET" ]; then
    echo -e "${YELLOW}⚠️  AppSecret 不能为空${NC}"
    WECHAT_APP_SECRET=$(get_input "请重新输入" "")
fi
echo -e "${GREEN}✅ AppSecret 已保存${NC}"
echo ""

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# 问题 3: 服务器域名
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo -e "${BOLD}${CYAN}[3/5] 服务器域名${NC}"
show_tutorial "刚测试开发：填 http://localhost:3000
正式上线：填 https://你的域名.com
不知道填什么：填 http://localhost:3000"

PROJECT_DOMAIN=$(get_input "服务器域名" "http://localhost:3000")
echo -e "${GREEN}✅ 服务器域名：$PROJECT_DOMAIN${NC}"
echo ""

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# 问题 4: Supabase URL
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo -e "${BOLD}${CYAN}[4/5] Supabase 数据库 URL${NC}"
show_tutorial "1. 访问：https://supabase.com/
2. 登录你的 Supabase 账号
3. 选择你的项目
4. 点击左侧「Settings」→「API」
5. 复制「Project URL」（格式：https://xxx.supabase.co）"

while true; do
    SUPABASE_URL=$(get_input "请粘贴你的 Supabase URL" "")
    if [ -z "$SUPABASE_URL" ]; then
        echo -e "${YELLOW}⚠️  Supabase URL 不能为空${NC}"
        continue
    fi
    if [[ $SUPABASE_URL =~ ^https://.*\.supabase\.co$ ]]; then
        echo -e "${GREEN}✅ Supabase URL 格式正确${NC}"
        break
    else
        echo -e "${YELLOW}⚠️  URL 格式好像不对，应该是 https://xxx.supabase.co${NC}"
        echo -e "${CYAN}还要继续吗？(y/n)${NC}"
        read -p "> " continue_or_not
        if [ "$continue_or_not" = "y" ] || [ "$continue_or_not" = "Y" ]; then
            break
        fi
    fi
done
echo ""

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# 问题 5: Supabase Key
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo -e "${BOLD}${CYAN}[5/5] Supabase 数据库密钥${NC}"
show_tutorial "1. 在刚才的 Supabase「API」页面
2. 找到「Project API keys」
3. 复制「anon public」密钥（很长的一串）"

while true; do
    SUPABASE_ANON_KEY=$(get_input "请粘贴你的 Supabase Key" "")
    if [ -z "$SUPABASE_ANON_KEY" ]; then
        echo -e "${YELLOW}⚠️  Supabase Key 不能为空${NC}"
        continue
    fi
    if [[ $SUPABASE_ANON_KEY =~ ^eyJ ]]; then
        echo -e "${GREEN}✅ Supabase Key 格式正确${NC}"
        break
    else
        echo -e "${YELLOW}⚠️  Key 格式好像不对，通常以 eyJ 开头${NC}"
        echo -e "${CYAN}还要继续吗？(y/n)${NC}"
        read -p "> " continue_or_not
        if [ "$continue_or_not" = "y" ] || [ "$continue_or_not" = "Y" ]; then
            break
        fi
    fi
done
echo ""

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# 确认信息
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
clear
echo -e "${BOLD}${GREEN}"
echo "╔════════════════════════════════════════╗"
echo "║                                        ║"
echo "║    ✅ 配置信息确认                     ║"
echo "║                                        ║"
echo "╚════════════════════════════════════════╝"
echo -e "${NC}"
echo ""
echo -e "${CYAN}AppID: ${GREEN}$WECHAT_APP_ID${NC}"
echo -e "${CYAN}服务器域名: ${GREEN}$PROJECT_DOMAIN${NC}"
echo -e "${CYAN}Supabase URL: ${GREEN}$SUPABASE_URL${NC}"
echo ""
echo -e "${YELLOW}⚠️  AppSecret 和 Supabase Key 已保存（不显示）${NC}"
echo ""
read -p "$(echo -e ${YELLOW}确认以上信息正确吗？(y/n) ${NC})" confirm

if [ "$confirm" != "y" ] && [ "$confirm" != "Y" ]; then
    echo -e "${YELLOW}已取消配置${NC}"
    exit 0
fi

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# 自动配置
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
clear
echo -e "${BOLD}${BLUE}"
echo "╔════════════════════════════════════════╗"
echo "║                                        ║"
echo "║    🔧 自动配置中...                   ║"
echo "║                                        ║"
echo "╚════════════════════════════════════════╝"
echo -e "${NC}"
echo ""

# 生成随机密钥
JWT_SECRET=$(openssl rand -base64 32)

# 创建 .env.production
echo -e "${CYAN}创建配置文件...${NC}"
cat > server/.env.production << ENV_EOF
# 微信小程序配置
WECHAT_APP_ID=$WECHAT_APP_ID
WECHAT_APP_SECRET=$WECHAT_APP_SECRET
PROJECT_DOMAIN=$PROJECT_DOMAIN

# 数据库配置
SUPABASE_URL=$SUPABASE_URL
SUPABASE_ANON_KEY=$SUPABASE_ANON_KEY

# JWT 配置
JWT_SECRET=$JWT_SECRET
JWT_EXPIRES_IN=7d

# Redis 配置
REDIS_HOST=localhost
REDIS_PORT=6379

# Node 环境
NODE_ENV=production
PORT=3000
ENV_EOF

# 创建 .env.development
cat > server/.env.development << ENV_EOF
# 微信小程序配置
WECHAT_APP_ID=$WECHAT_APP_ID
WECHAT_APP_SECRET=$WECHAT_APP_SECRET
PROJECT_DOMAIN=http://localhost:3000

# 数据库配置
SUPABASE_URL=$SUPABASE_URL
SUPABASE_ANON_KEY=$SUPABASE_ANON_KEY

# JWT 配置
JWT_SECRET=$JWT_SECRET
JWT_EXPIRES_IN=7d

# Redis 配置
REDIS_HOST=localhost
REDIS_PORT=6379

# Node 环境
NODE_ENV=development
PORT=3000
ENV_EOF

# 创建 project.config.json
echo -e "${CYAN}更新小程序配置...${NC}"
cat > project.config.json << CONFIG_EOF
{
  "miniprogramRoot": "dist/",
  "cloudfunctionRoot": "cloudfunctions/",
  "setting": {
    "urlCheck": true,
    "es6": true,
    "enhance": true,
    "postcss": true,
    "minified": true
  },
  "compileType": "miniprogram",
  "appid": "$WECHAT_APP_ID",
  "projectname": "保洁服务平台"
}
CONFIG_EOF

# 更新 .gitignore
echo -e "${CYAN}更新安全配置...${NC}"
if [ -f ".gitignore" ]; then
    if ! grep -q ".env.production" .gitignore; then
        echo "" >> .gitignore
        echo "# 环境变量文件（不要提交到 Git）" >> .gitignore
        echo "server/.env.production" >> .gitignore
        echo "server/.env.development" >> .gitignore
    fi
fi

echo -e "${GREEN}✅ 配置完成！${NC}"
echo ""

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# 显示下一步操作
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo -e "${BOLD}${GREEN}"
echo "╔════════════════════════════════════════╗"
echo "║                                        ║"
echo "║    🎉 配置成功！下一步：               ║"
echo "║                                        ║"
echo "╚════════════════════════════════════════╝"
echo -e "${NC}"
echo ""
echo -e "${BOLD}${BLUE}第 1 步：安装依赖${NC}"
echo -e "${GREEN}运行这个命令：${NC}"
echo -e "${CYAN}  pnpm install${NC}"
echo ""

echo -e "${BOLD}${BLUE}第 2 步：构建项目${NC}"
echo -e "${GREEN}运行这个命令：${NC}"
echo -e "${CYAN}  pnpm build:weapp${NC}"
echo ""

echo -e "${BOLD}${BLUE}第 3 步：打开微信开发者工具${NC}"
echo -e "${GREEN}1. 下载微信开发者工具：https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html${NC}"
echo -e "${GREEN}2. 用微信扫码登录${NC}"
echo -e "${GREEN}3. 点击「导入项目」${NC}"
echo -e "${GREEN}4. 选择项目文件夹里的「dist」文件夹${NC}"
echo -e "${GREEN}5. AppID 会自动填入：$WECHAT_APP_ID${NC}"
echo -e "${GREEN}6. 点击「导入」${NC}"
echo ""

echo -e "${BOLD}${YELLOW}⚠️  重要提示：${NC}"
echo ""
echo -e "${YELLOW}1. 关闭域名校验（仅开发时需要）：${NC}"
echo -e "   微信开发者工具 → 点击右上角「详情」"
echo -e "   → 找到「本地设置」"
echo -e "   → 勾选「不校验合法域名、web-view（业务域名）、TLS 版本以及 HTTPS 证书」"
echo ""

echo -e "${YELLOW}2. 生产环境配置域名：${NC}"
echo -e "   登录：https://mp.weixin.qq.com/"
echo -e "   → 开发 → 开发设置 → 服务器域名"
echo -e "   → 添加：$PROJECT_DOMAIN"
echo ""

echo -e "${BOLD}${GREEN}🎊 恭喜！你的小程序已经配置好了！${NC}"
echo ""
echo -e "${CYAN}如果遇到问题，运行这个命令检查配置：${NC}"
echo -e "${GREEN}  bash scripts/verify-config.sh${NC}"
echo ""
