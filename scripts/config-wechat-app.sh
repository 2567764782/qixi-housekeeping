#!/bin/bash

# 微信小程序一键配置脚本
# 使用方法: bash scripts/config-wechat-app.sh

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 打印带颜色的消息
print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# 检查命令是否存在
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# 获取用户输入
get_input() {
    local prompt=$1
    local default=$2
    local result

    if [ -n "$default" ]; then
        read -p "$(echo -e ${BLUE}${prompt}${NC} [默认: ${GREEN}${default}${NC}]): " result
        result=${result:-$default}
    else
        read -p "$(echo -e ${BLUE}${prompt}${NC}): " result
    fi

    echo "$result"
}

# 验证 AppID 格式
validate_appid() {
    local appid=$1
    if [[ ! $appid =~ ^wx[a-f0-9]{16}$ ]]; then
        print_error "AppID 格式不正确，应为 wx 开头的 18 位字符"
        return 1
    fi
    return 0
}

# 验证 URL 格式
validate_url() {
    local url=$1
    if [[ ! $url =~ ^https?:// ]]; then
        print_error "URL 必须以 http:// 或 https:// 开头"
        return 1
    fi
    return 0
}

# 主函数
main() {
    echo -e "${BLUE}"
    echo "============================================"
    echo "    微信小程序一键配置工具"
    echo "============================================"
    echo -e "${NC}"

    # 检查项目根目录
    if [ ! -f "package.json" ]; then
        print_error "请在项目根目录运行此脚本"
        exit 1
    fi

    # 获取配置信息
    print_info "开始配置微信小程序..."
    echo ""

    # 1. 获取 AppID
    while true; do
        WECHAT_APP_ID=$(get_input "请输入微信小程序 AppID" "")
        if validate_appid "$WECHAT_APP_ID"; then
            break
        fi
    done

    # 2. 获取 AppSecret
    WECHAT_APP_SECRET=$(get_input "请输入微信小程序 AppSecret" "")

    # 3. 获取服务器域名
    while true; do
        PROJECT_DOMAIN=$(get_input "请输入服务器域名（如 https://your-domain.com）" "https://localhost:3000")
        if validate_url "$PROJECT_DOMAIN"; then
            break
        fi
    done

    # 4. 获取商户号（可选）
    WECHAT_MCH_ID=$(get_input "请输入微信支付商户号（如需支付功能，留空跳过）" "")

    # 5. 获取 API 密钥（可选）
    WECHAT_API_KEY=$(get_input "请输入微信支付 API 密钥（如需支付功能，留空跳过）" "")

    # 6. 获取 Supabase 配置
    echo ""
    print_info "请配置数据库连接信息..."

    SUPABASE_URL=$(get_input "请输入 Supabase URL（如 https://xxx.supabase.co）" "")
    SUPABASE_ANON_KEY=$(get_input "请输入 Supabase Anon Key" "")

    # 7. 获取 Redis 配置（可选）
    REDIS_HOST=$(get_input "请输入 Redis 主机地址（留空使用默认）" "localhost")
    REDIS_PORT=$(get_input "请输入 Redis 端口（留空使用默认）" "6379")

    # 8. 获取 Elasticsearch 配置（可选）
    ES_NODE=$(get_input "请输入 Elasticsearch 地址（留空跳过）" "")

    # 9. 获取阿里云短信配置（可选）
    echo ""
    print_info "阿里云短信配置（可选，留空跳过）..."
    ALIYUN_SMS_ACCESS_KEY_ID=$(get_input "请输入阿里云 Access Key ID" "")
    ALIYUN_SMS_ACCESS_KEY_SECRET=$(get_input "请输入阿里云 Access Key Secret" "")

    echo ""
    print_info "配置信息确认："
    echo "============================================"
    echo -e "AppID: ${GREEN}${WECHAT_APP_ID}${NC}"
    echo -e "服务器域名: ${GREEN}${PROJECT_DOMAIN}${NC}"
    echo -e "Supabase URL: ${GREEN}${SUPABASE_URL}${NC}"
    echo -e "Redis: ${GREEN}${REDIS_HOST}:${REDIS_PORT}${NC}"
    echo "============================================"
    echo ""

    read -p "$(echo -e ${YELLOW}确认以上配置信息是否正确？(y/n)${NC}): " confirm
    if [ "$confirm" != "y" ] && [ "$confirm" != "Y" ]; then
        print_warning "配置已取消"
        exit 0
    fi

    echo ""
    print_info "开始更新配置文件..."

    # 更新 project.config.json
    print_info "更新 project.config.json..."
    if [ -f "project.config.json" ]; then
        cat > project.config.json << EOF
{
  "miniprogramRoot": "dist/",
  "cloudfunctionRoot": "cloudfunctions/",
  "setting": {
    "urlCheck": true,
    "es6": true,
    "enhance": true,
    "postcss": true,
    "preloadBackgroundData": false,
    "minified": true,
    "newFeature": false,
    "coverView": true,
    "nodeModules": false,
    "autoAudits": false,
    "showShadowRootInWxmlPanel": true,
    "scopeDataCheck": false,
    "uglifyFileName": false,
    "checkInvalidKey": true,
    "checkSiteMap": true,
    "uploadWithSourceMap": true,
    "compileHotReLoad": false,
    "useMultiFrameRuntime": true,
    "useApiHook": true,
    "useApiHostProcess": true,
    "babelSetting": {
      "ignore": [],
      "disablePlugins": [],
      "outputPath": ""
    },
    "useIsolateContext": true,
    "userConfirmedBundleSwitch": false,
    "packNpmManually": false,
    "packNpmRelationList": [],
    "minifyWXSS": true,
    "disableUseStrict": false,
    "minifyWXML": true,
    "showES6CompileOption": false,
    "useCompilerPlugins": false,
    "ignoreUploadUnusedFiles": true
  },
  "compileType": "miniprogram",
  "libVersion": "2.19.4",
  "appid": "${WECHAT_APP_ID}",
  "projectname": "保洁服务平台",
  "debugOptions": {
    "hidedInDevtools": []
  },
  "scripts": {},
  "staticServerOptions": {
    "baseURL": "",
    "servePath": ""
  },
  "isGameTourist": false,
  "condition": {
    "search": {
      "list": []
    },
    "conversation": {
      "list": []
    },
    "game": {
      "list": []
    },
    "plugin": {
      "list": []
    },
    "gamePlugin": {
      "list": []
    },
    "miniprogram": {
      "list": []
    }
  }
}
EOF
        print_success "project.config.json 更新完成"
    else
        print_warning "未找到 project.config.json，跳过"
    fi

    # 更新 server/.env.production
    print_info "更新 server/.env.production..."
    mkdir -p server
    cat > server/.env.production << EOF
# 微信小程序配置
WECHAT_APP_ID=${WECHAT_APP_ID}
WECHAT_APP_SECRET=${WECHAT_APP_SECRET}
PROJECT_DOMAIN=${PROJECT_DOMAIN}

# 微信支付配置（可选）
WECHAT_MCH_ID=${WECHAT_MCH_ID}
WECHAT_API_KEY=${WECHAT_API_KEY}

# 数据库配置（Supabase）
SUPABASE_URL=${SUPABASE_URL}
SUPABASE_ANON_KEY=${SUPABASE_ANON_KEY}

# Redis 配置
REDIS_HOST=${REDIS_HOST}
REDIS_PORT=${REDIS_PORT}

# Elasticsearch 配置（可选）
ES_NODE=${ES_NODE}

# 阿里云短信配置（可选）
ALIYUN_SMS_ACCESS_KEY_ID=${ALIYUN_SMS_ACCESS_KEY_ID}
ALIYUN_SMS_ACCESS_KEY_SECRET=${ALIYUN_SMS_ACCESS_KEY_SECRET}

# JWT 配置
JWT_SECRET=$(openssl rand -base64 32)
JWT_EXPIRES_IN=7d

# Node 环境
NODE_ENV=production
PORT=3000
EOF
    print_success "server/.env.production 创建完成"

    # 更新 server/.env.development
    print_info "更新 server/.env.development..."
    cat > server/.env.development << EOF
# 微信小程序配置
WECHAT_APP_ID=${WECHAT_APP_ID}
WECHAT_APP_SECRET=${WECHAT_APP_SECRET}
PROJECT_DOMAIN=http://localhost:3000

# 微信支付配置（可选）
WECHAT_MCH_ID=${WECHAT_MCH_ID}
WECHAT_API_KEY=${WECHAT_API_KEY}

# 数据库配置（Supabase）
SUPABASE_URL=${SUPABASE_URL}
SUPABASE_ANON_KEY=${SUPABASE_ANON_KEY}

# Redis 配置
REDIS_HOST=${REDIS_HOST}
REDIS_PORT=${REDIS_PORT}

# Elasticsearch 配置（可选）
ES_NODE=${ES_NODE}

# 阿里云短信配置（可选）
ALIYUN_SMS_ACCESS_KEY_ID=${ALIYUN_SMS_ACCESS_KEY_ID}
ALIYUN_SMS_ACCESS_KEY_SECRET=${ALIYUN_SMS_ACCESS_KEY_SECRET}

# JWT 配置
JWT_SECRET=$(openssl rand -base64 32)
JWT_EXPIRES_IN=7d

# Node 环境
NODE_ENV=development
PORT=3000
EOF
    print_success "server/.env.development 创建完成"

    # 创建 .env.example
    print_info "创建 .env.example..."
    cat > server/.env.example << EOF
# 微信小程序配置
WECHAT_APP_ID=your-wechat-app-id
WECHAT_APP_SECRET=your-wechat-app-secret
PROJECT_DOMAIN=https://your-domain.com

# 微信支付配置（可选）
WECHAT_MCH_ID=your-merchant-id
WECHAT_API_KEY=your-api-key

# 数据库配置（Supabase）
SUPABASE_URL=your-supabase-url
SUPABASE_ANON_KEY=your-supabase-anon-key

# Redis 配置
REDIS_HOST=localhost
REDIS_PORT=6379

# Elasticsearch 配置（可选）
ES_NODE=http://localhost:9200

# 阿里云短信配置（可选）
ALIYUN_SMS_ACCESS_KEY_ID=your-access-key-id
ALIYUN_SMS_ACCESS_KEY_SECRET=your-access-key-secret

# JWT 配置
JWT_SECRET=your-jwt-secret
JWT_EXPIRES_IN=7d

# Node 环境
NODE_ENV=production
PORT=3000
EOF
    print_success ".env.example 创建完成"

    # 更新 .gitignore
    print_info "更新 .gitignore..."
    if [ -f ".gitignore" ]; then
        if ! grep -q ".env.production" .gitignore; then
            echo "" >> .gitignore
            echo "# 环境变量文件" >> .gitignore
            echo "server/.env.production" >> .gitignore
            echo "server/.env.development" >> .gitignore
            print_success ".gitignore 更新完成"
        else
            print_success ".gitignore 已包含必要规则"
        fi
    fi

    echo ""
    print_success "============================================"
    echo "  配置完成！"
    echo "============================================"
    echo ""
    print_info "下一步操作："
    echo ""
    echo -e "${GREEN}1. 安装依赖：${NC}"
    echo "   pnpm install"
    echo ""
    echo -e "${GREEN}2. 构建项目：${NC}"
    echo "   pnpm build"
    echo ""
    echo -e "${GREEN}3. 启动开发服务器：${NC}"
    echo "   pnpm dev"
    echo ""
    echo -e "${GREEN}4. 用微信开发者工具打开项目：${NC}"
    echo "   - 打开微信开发者工具"
    echo "   - 导入项目，选择 dist 目录"
    echo "   - AppID 已自动配置为: ${WECHAT_APP_ID}"
    echo ""
    echo -e "${GREEN}5. 配置服务器域名（小程序后台）：${NC}"
    echo "   登录微信公众平台 → 开发管理 → 开发设置 → 服务器域名"
    echo "   添加以下域名："
    echo "   - request: ${PROJECT_DOMAIN}"
    echo "   - uploadFile: ${PROJECT_DOMAIN}"
    echo "   - downloadFile: ${PROJECT_DOMAIN}"
    echo "   - socket: ${PROJECT_DOMAIN/https/wss}"
    echo ""
    echo -e "${YELLOW}⚠️  注意事项：${NC}"
    echo "   1. 请妥善保管 .env.production 文件，不要提交到 Git"
    echo "   2. 生产环境必须使用 HTTPS 域名"
    echo "   3. 需要在微信小程序后台配置服务器域名白名单"
    echo "   4. 如需支付功能，需要申请微信支付商户号"
    echo ""
    echo -e "${BLUE}详细文档：${NC}"
    echo "   查看 docs/WECHAT_APP_SETUP.md 获取完整配置说明"
    echo ""
}

# 运行主函数
main
