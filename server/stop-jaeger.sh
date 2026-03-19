#!/bin/bash

# Jaeger 分布式追踪停止脚本

echo "🛑 Stopping Jaeger Distributed Tracing..."

# 停止 Jaeger 栈
docker-compose -f docker-compose.jaeger.yml down

echo "✅ Jaeger Distributed Tracing stopped."
