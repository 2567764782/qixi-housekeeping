#!/bin/bash
# ============================================
# 阿里云函数计算部署脚本
# ============================================

echo "🚀 开始部署柒玺家政后端服务..."

# 进入 server 目录
cd "$(dirname "$0")"

# 1. 检查是否安装了 s 工具
if ! command -v s &> /dev/null; then
    echo "❌ 未安装 @serverless-devs/s"
    echo "请运行: npm install -g @serverless-devs/s"
    exit 1
fi

# 2. 检查是否配置了密钥
if ! s config get &> /dev/null; then
    echo "❌ 未配置阿里云密钥"
    echo "请运行: s config add"
    exit 1
fi

# 3. 构建项目
echo "📦 构建项目..."
pnpm build
if [ $? -ne 0 ]; then
    echo "❌ 构建失败"
    exit 1
fi

# 4. 部署
echo "🚀 部署到阿里云函数计算..."
s deploy -y
if [ $? -ne 0 ]; then
    echo "❌ 部署失败"
    exit 1
fi

echo "✅ 部署成功！"
echo ""
echo "📝 后续步骤："
echo "1. 在输出中找到 systemUrl 或 HTTP 触发器地址"
echo "2. 将该地址配置到微信小程序前端"
echo "3. 在微信公众平台配置合法域名"
