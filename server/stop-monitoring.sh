#!/bin/bash

# Prometheus + Grafana 停止脚本

echo "🛑 Stopping Prometheus + Grafana Stack..."

# 停止监控栈
docker-compose -f docker-compose.monitoring.yml down

echo "✅ Prometheus + Grafana Stack stopped."
