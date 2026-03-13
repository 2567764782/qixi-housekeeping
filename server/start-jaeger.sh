#!/bin/bash

# Jaeger 分布式追踪启动脚本

echo "🚀 Starting Jaeger Distributed Tracing..."

# 检查 Docker 是否运行
if ! docker info > /dev/null 2>&1; then
  echo "❌ Docker is not running. Please start Docker first."
  exit 1
fi

# 启动 Jaeger 栈
docker-compose -f docker-compose.jaeger.yml up -d

echo "✅ Jaeger Stack is starting..."
echo ""
echo "📊 Services:"
echo "  - Jaeger UI: http://localhost:16686"
echo "  - Jaeger Collector (OTLP gRPC): localhost:4317"
echo "  - Jaeger Collector (OTLP HTTP): http://localhost:4318"
echo "  - Jaeger Agent (UDP): localhost:6831"
echo "  - Hot Rod (示例应用): http://localhost:8080"
echo ""
echo "⏳ Waiting for services to be ready..."
sleep 10

# 检查 Jaeger UI 健康状态
echo "🔍 Checking Jaeger UI health..."
curl -s http://localhost:16686 > /dev/null && echo "✅ Jaeger UI is ready" || echo "⚠️  Jaeger UI not yet ready"

echo ""
echo "✅ Jaeger Distributed Tracing is ready!"
echo ""
echo "💡 Next steps:"
echo "  1. Open Jaeger UI at http://localhost:16686"
echo "  2. Select 'cleaning-service-api' service"
echo "  3. Click 'Find Traces' to view traces"
echo "  4. Explore the trace spans and timelines"
echo ""
echo "📝 To enable tracing in your NestJS app:"
echo "  - Set JAEGER_ENDPOINT environment variable (default: http://localhost:4317)"
echo "  - The tracing will be automatically initialized in main.ts"
