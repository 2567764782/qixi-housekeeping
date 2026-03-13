# ELK Stack 部署指南

## 概述

本项目集成了 ELK Stack（Elasticsearch、Logstash、Kibana）用于日志收集、存储和分析。

## 服务说明

### Elasticsearch
- **端口**: 9200 (HTTP API), 9300 (节点通信)
- **用途**: 日志存储和检索
- **健康检查**: http://localhost:9200/_cluster/health

### Kibana
- **端口**: 5601
- **用途**: 日志可视化和分析
- **访问地址**: http://localhost:5601

### Logstash
- **端口**: 5044 (TCP), 5000 (JSON), 9600 (监控)
- **用途**: 日志收集和处理
- **配置文件**: `logstash/pipeline/logstash.conf`

## 快速开始

### 1. 启动 ELK Stack

```bash
cd server
chmod +x start-elk.sh stop-elk.sh
./start-elk.sh
```

### 2. 验证服务状态

```bash
# 检查 Elasticsearch
curl http://localhost:9200/_cluster/health

# 检查 Kibana（浏览器访问）
open http://localhost:5601
```

### 3. 停止 ELK Stack

```bash
./stop-elk.sh
```

## 日志索引模式

日志索引名称格式: `nestjs-logs-YYYY.MM.dd`

### 在 Kibana 中创建索引模式

1. 打开 http://localhost:5601
2. 进入 Management > Stack Management > Index Patterns
3. 点击 "Create index pattern"
4. 输入索引模式: `nestjs-logs-*`
5. 选择时间字段: `@timestamp`
6. 点击 "Create index pattern"

## 日志查询示例

### 查询所有错误日志

```json
{
  "query": {
    "match": {
      "level": "error"
    }
  }
}
```

### 查询特定接口的日志

```json
{
  "query": {
    "match": {
      "context": "AuthController"
    }
  }
}
```

### 查询特定时间范围的日志

```json
{
  "query": {
    "range": {
      "@timestamp": {
        "gte": "now-1h",
        "lte": "now"
      }
    }
  }
}
```

## 环境变量

在 `.env` 文件中配置:

```env
# Elasticsearch Configuration (for log analysis)
ELASTICSEARCH_NODE=http://localhost:9200
ELASTICSEARCH_INDEX=nestjs-logs
```

## 注意事项

1. **内存占用**: Elasticsearch 需要至少 512MB 内存，建议 2GB 以上
2. **磁盘空间**: 日志会占用大量磁盘空间，建议定期清理旧日志
3. **生产环境**: 生产环境需要配置安全认证（xpack.security.enabled=true）
4. **日志持久化**: 数据存储在 Docker volume 中，重启不会丢失

## 常见问题

### Elasticsearch 启动失败

检查内存是否充足:
```bash
docker stats elasticsearch
```

### Kibana 无法连接 Elasticsearch

检查 Elasticsearch 是否健康:
```bash
curl http://localhost:9200/_cluster/health
```

### 日志没有显示在 Kibana 中

1. 检查 Logstash 日志:
```bash
docker logs logstash
```

2. 检查日志索引是否创建:
```bash
curl http://localhost:9200/_cat/indices?v
```

## 清理数据

清理所有日志数据:
```bash
curl -X DELETE http://localhost:9200/nestjs-logs-*
```

清理 Docker 数据:
```bash
docker-compose down -v
```
