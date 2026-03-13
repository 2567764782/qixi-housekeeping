#!/bin/bash

# 微信小程序配置验证脚本

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_check() {
    local item=$1
    local status=$2
    if [ "$status" = "pass" ]; then
        echo -e "${GREEN}✅${NC} $item"
    elif [ "$status" = "fail" ]; then
        echo -e "${RED}❌${NC} $item"
    elif [ "$status" = "warn" ]; then
        echo -e "${YELLOW}⚠️  ${NC} $item"
    else
        echo -e "${BLUE}ℹ️  ${NC} $item"
    fi
}

echo -e "${BLUE}"
echo "============================================"
echo "    微信小程序配置验证"
echo "============================================"
echo -e "${NC}"

# 检查文件是否存在
echo -e "\n${BLUE}检查配置文件...${NC}\n"

files_to_check=(
    "server/.env.production"
    "server/.env.development"
    "project.config.json"
)

all_files_exist=true
for file in "${files_to_check[@]}"; do
    if [ -f "$file" ]; then
        print_check "$file 存在" "pass"
    else
        print_check "$file 不存在" "fail"
        all_files_exist=false
    fi
done

if [ "$all_files_exist" = false ]; then
    echo -e "\n${YELLOW}请先运行配置脚本：bash scripts/config-wechat-app.sh${NC}\n"
    exit 1
fi

# 检查 AppID 格式
echo -e "\n${BLUE}检查 AppID 格式...${NC}\n"

appid=$(grep "WECHAT_APP_ID" server/.env.production | cut -d'=' -f2)
if [[ $appid =~ ^wx[a-f0-9]{16}$ ]]; then
    print_check "AppID 格式正确 ($appid)" "pass"
else
    print_check "AppID 格式不正确 ($appid)" "fail"
fi

# 检查 project.config.json 中的 AppID
project_appid=$(grep -o '"appid":"[^"]*"' project.config.json | cut -d'"' -f4)
if [ "$appid" = "$project_appid" ]; then
    print_check "project.config.json AppID 与环境变量一致" "pass"
else
    print_check "project.config.json AppID 与环境变量不一致" "warn"
    echo -e "   环境变量: $appid"
    echo -e "   project.config.json: $project_appid"
fi

# 检查环境变量配置
echo -e "\n${BLUE}检查环境变量配置...${NC}\n"

# 必填项
required_vars=(
    "WECHAT_APP_ID"
    "WECHAT_APP_SECRET"
    "PROJECT_DOMAIN"
    "SUPABASE_URL"
    "SUPABASE_ANON_KEY"
)

all_required_set=true
for var in "${required_vars[@]}"; do
    value=$(grep "^$var" server/.env.production | cut -d'=' -f2)
    if [ -n "$value" ] && [ "$value" != "your-wechat-app-id" ] && [ "$value" != "your-wechat-app-secret" ]; then
        print_check "$var 已设置" "pass"
    else
        print_check "$var 未设置或使用默认值" "fail"
        all_required_set=false
    fi
done

# 可选项
echo -e "\n${BLUE}检查可选配置...${NC}\n"

optional_vars=(
    "WECHAT_MCH_ID"
    "WECHAT_API_KEY"
    "ES_NODE"
    "ALIYUN_SMS_ACCESS_KEY_ID"
)

for var in "${optional_vars[@]}"; do
    value=$(grep "^$var" server/.env.production | cut -d'=' -f2)
    if [ -n "$value" ] && [ "$value" != "" ]; then
        print_check "$var 已设置" "pass"
    else
        print_check "$var 未设置（可选）" "info"
    fi
done

# 检查域名格式
echo -e "\n${BLUE}检查域名格式...${NC}\n"

domain=$(grep "PROJECT_DOMAIN" server/.env.production | cut -d'=' -f2)
if [[ $domain =~ ^https?:// ]]; then
    print_check "域名格式正确 ($domain)" "pass"
else
    print_check "域名格式不正确，应以 http:// 或 https:// 开头" "warn"
fi

if [[ $domain =~ ^https:// ]]; then
    print_check "使用 HTTPS（推荐）" "pass"
else
    print_check "使用 HTTP（仅开发环境）" "warn"
fi

# 检查 Supabase URL 格式
echo -e "\n${BLUE}检查数据库配置...${NC}\n"

supabase_url=$(grep "SUPABASE_URL" server/.env.production | cut -d'=' -f2)
if [[ $supabase_url =~ ^https://.*\.supabase\.co$ ]]; then
    print_check "Supabase URL 格式正确" "pass"
else
    print_check "Supabase URL 格式可能不正确" "warn"
fi

# 检查 JWT Secret
echo -e "\n${BLUE}检查安全配置...${NC}\n"

jwt_secret=$(grep "JWT_SECRET" server/.env.production | cut -d'=' -f2)
if [ -n "$jwt_secret" ] && [ "$jwt_secret" != "your-secret-key-here" ]; then
    secret_length=${#jwt_secret}
    if [ $secret_length -ge 32 ]; then
        print_check "JWT Secret 已设置，长度 $secret_length（推荐 ≥ 32）" "pass"
    else
        print_check "JWT Secret 长度过短（$secret_length），推荐 ≥ 32" "warn"
    fi
else
    print_check "JWT_SECRET 未设置" "fail"
fi

# 检查依赖
echo -e "\n${BLUE}检查依赖安装...${NC}\n"

if [ -d "node_modules" ]; then
    print_check "前端依赖已安装" "pass"
else
    print_check "前端依赖未安装，请运行: pnpm install" "warn"
fi

if [ -d "server/node_modules" ]; then
    print_check "后端依赖已安装" "pass"
else
    print_check "后端依赖未安装，请运行: cd server && pnpm install" "warn"
fi

# 总结
echo -e "\n${BLUE}"
echo "============================================"
echo "    验证总结"
echo "============================================"
echo -e "${NC}"

if [ "$all_required_set" = true ]; then
    echo -e "${GREEN}✅ 所有必填配置项已设置${NC}"
    echo -e "\n${GREEN}下一步：${NC}"
    echo "1. 安装依赖: pnpm install"
    echo "2. 构建项目: pnpm build:weapp"
    echo "3. 上传代码: 用微信开发者工具打开 dist 目录"
    echo "4. 配置域名: 在小程序后台添加服务器域名"
else
    echo -e "${RED}❌ 部分必填配置项未设置${NC}"
    echo -e "\n${YELLOW}请运行配置脚本完善配置：${NC}"
    echo "bash scripts/config-wechat-app.sh"
fi

echo ""
