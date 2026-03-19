#!/bin/bash

# ELK Stack 启动脚本

echo "🚀 Starting ELK Stack..."

# 加载环境变量
if [ -f .env.elk ]; then
  export $(cat .env.elk | grep -v '^#' | xargs)
fi

# 检查 Docker 是否运行
if ! docker info > /dev/null 2>&1; then
  echo "❌ Docker is not running. Please start Docker first."
  exit 1
fi

# 启动 ELK Stack
docker-compose up -d

echo "✅ ELK Stack is starting..."
echo ""
echo "📊 Services:"
echo "  - Elasticsearch: http://localhost:9200"
echo "  - Kibana: http://localhost:5601"
echo "  - Logstash: http://localhost:5044"
echo ""
echo "⏳ Waiting for services to be ready..."
sleep 30

# 检查 Elasticsearch 健康状态
echo "🔍 Checking Elasticsearch health..."
curl -s http://localhost:9200/_cluster/health

echo ""
echo "✅ ELK Stack is ready!"
