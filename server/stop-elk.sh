#!/bin/bash

# ELK Stack 停止脚本

echo "🛑 Stopping ELK Stack..."

# 停止 ELK Stack
docker-compose down

echo "✅ ELK Stack stopped."
