#!/bin/bash

# Prometheus + Grafana 启动脚本

echo "🚀 Starting Prometheus + Grafana Stack..."

# 检查 Docker 是否运行
if ! docker info > /dev/null 2>&1; then
  echo "❌ Docker is not running. Please start Docker first."
  exit 1
fi

# 启动监控栈
docker-compose -f docker-compose.monitoring.yml up -d

echo "✅ Prometheus + Grafana Stack is starting..."
echo ""
echo "📊 Services:"
echo "  - Prometheus: http://localhost:9090"
echo "  - Grafana: http://localhost:3001 (admin/admin123)"
echo "  - Alertmanager: http://localhost:9093"
echo "  - Node Exporter: http://localhost:9100"
echo ""
echo "⏳ Waiting for services to be ready..."
sleep 15

# 检查 Prometheus 健康状态
echo "🔍 Checking Prometheus health..."
curl -s http://localhost:9090/-/healthy

echo ""
echo "✅ Prometheus + Grafana Stack is ready!"
echo ""
echo "💡 Next steps:"
echo "  1. Open Grafana at http://localhost:3001"
echo "  2. Login with admin/admin123"
echo "  3. Import the '保洁服务监控面板' dashboard"
echo "  4. View metrics and alerts"
