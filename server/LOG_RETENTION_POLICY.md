# 日志持久化和归档策略

## 概述

本方案实现了完整的日志持久化和归档策略，确保日志数据的安全存储、高效查询和自动清理。

## 索引生命周期管理 (ILM)

### 策略配置

使用 Elasticsearch 的 Index Lifecycle Management (ILM) 功能管理日志索引的生命周期：

```json
{
  "policy": {
    "phases": {
      "hot": {
        "min_age": "0ms",
        "actions": {
          "rollover": {
            "max_size": "50GB",
            "max_age": "1d"
          }
        }
      },
      "warm": {
        "min_age": "2d",
        "actions": {
          "forcemerge": {
            "max_num_segments": 1
          },
          "shrink": {
            "number_of_shards": 1
          }
        }
      },
      "cold": {
        "min_age": "7d",
        "actions": {
          "freeze": {}
        }
      },
      "delete": {
        "min_age": "30d",
        "actions": {
          "delete": {}
        }
      }
    }
  }
}
```

### 阶段说明

#### 1. Hot Phase (热数据)
- **条件**: 最大 50GB 或 1 天
- **特点**:
  - 最新、最常访问的日志
  - 保持多个分片以支持高并发写入
  - 支持实时查询
  - 刷新间隔 5 秒

#### 2. Warm Phase (温数据)
- **条件**: 2 天后
- **特点**:
  - 强制合并段文件，减少段数量
  - 收缩分片为 1 个，减少资源占用
  - 仍然可以查询，但写入频率降低

#### 3. Cold Phase (冷数据)
- **条件**: 7 天后
- **特点**:
  - 冻结索引，节省内存
  - 减少副本数（可选）
  - 只读访问

#### 4. Delete Phase (删除)
- **条件**: 30 天后
- **特点**:
  - 自动删除索引
  - 释放存储空间

## 初始化 ILM 策略

### 使用脚本初始化

```bash
cd server
chmod +x setup-ilm.sh
./setup-ilm.sh
```

### 手动初始化

#### 1. 创建 ILM 策略

```bash
curl -X PUT "http://localhost:9200/_ilm/policy/nestjs-logs-policy" \
  -H 'Content-Type: application/json' \
  -d '{
  "policy": {
    "phases": {
      "hot": {
        "actions": {
          "rollover": {
            "max_size": "50GB",
            "max_age": "1d"
          }
        }
      },
      "warm": {
        "min_age": "2d",
        "actions": {
          "forcemerge": {
            "max_num_segments": 1
          },
          "shrink": {
            "number_of_shards": 1
          }
        }
      },
      "cold": {
        "min_age": "7d",
        "actions": {
          "freeze": {}
        }
      },
      "delete": {
        "min_age": "30d",
        "actions": {
          "delete": {}
        }
      }
    }
  }
}'
```

#### 2. 创建索引模板

```bash
curl -X PUT "http://localhost:9200/_index_template/nestjs-logs-template" \
  -H 'Content-Type: application/json' \
  -d '{
  "index_patterns": ["nestjs-logs-*"],
  "template": {
    "settings": {
      "number_of_shards": 3,
      "number_of_replicas": 1,
      "index.lifecycle.name": "nestjs-logs-policy",
      "index.lifecycle.rollover_alias": "nestjs-logs",
      "index.refresh_interval": "5s"
    },
    "mappings": {
      "properties": {
        "@timestamp": { "type": "date" },
        "level": { "type": "keyword" },
        "message": {
          "type": "text",
          "fields": {
            "keyword": { "type": "keyword", "ignore_above": 256 }
          }
        },
        "context": { "type": "keyword" },
        "trace_id": { "type": "keyword" },
        "span_id": { "type": "keyword" },
        "environment": { "type": "keyword" },
        "application": { "type": "keyword" },
        "version": { "type": "keyword" },
        "is_error": { "type": "boolean" },
        "user_id": { "type": "keyword" },
        "order_id": { "type": "keyword" }
      }
    }
  }
}'
```

#### 3. 初始化第一个索引

```bash
curl -X PUT "http://localhost:9200/nestjs-logs-000001" \
  -H 'Content-Type: application/json' \
  -d '{
  "aliases": {
    "nestjs-logs": {
      "is_write_index": true
    }
  }
}'
```

## 日志归档策略

### 短期归档（30 天）
- **存储位置**: Elasticsearch
- **访问方式**: Kibana 查询
- **清理方式**: ILM 自动删除

### 中期归档（90 天）
对于需要保留 90 天的日志：

```bash
# 修改 ILM 策略
curl -X POST "http://localhost:9200/_ilm/policy/nestjs-logs-policy/_rollover?pretty"

# 创建快照仓库
curl -X PUT "http://localhost:9200/_snapshot/backup_repo" \
  -H 'Content-Type: application/json' \
  -d '{
  "type": "fs",
  "settings": {
    "location": "/backup/elasticsearch"
  }
}'

# 创建快照策略
curl -X PUT "http://localhost:9200/_slm/policy/daily_snapshot" \
  -H 'Content-Type: application/json' \
  -d '{
  "schedule": "0 2 * * *",
  "name": "<daily-snap-{now/d}>",
  "repository": "backup_repo",
  "config": {
    "indices": ["nestjs-logs-*"],
    "ignore_unavailable": false,
    "include_global_state": false
  },
  "retention": {
    "expire_after": "90d",
    "min_count": 5,
    "max_count": 30
  }
}'
```

### 长期归档（1 年以上）
对于需要长期保留的日志：

```bash
# 使用 S3 或其他对象存储作为快照仓库
curl -X PUT "http://localhost:9200/_snapshot/s3_repository" \
  -H 'Content-Type: application/json' \
  -d '{
  "type": "s3",
  "settings": {
    "bucket": "cleaning-service-logs-backup",
    "region": "cn-north-1",
    "access_key": "YOUR_ACCESS_KEY",
    "secret_key": "YOUR_SECRET_KEY"
  }
}'

# 创建年度快照
curl -X PUT "http://localhost:9200/_slm/policy/yearly_snapshot" \
  -H 'Content-Type: application/json' \
  -d '{
  "schedule": "0 0 1 1 *",
  "name": "<yearly-snap-{now{yyyy}}>",
  "repository": "s3_repository",
  "config": {
    "indices": ["nestjs-logs-*"],
    "ignore_unavailable": false,
    "include_global_state": false
  },
  "retention": {
    "expire_after": "3650d",
    "min_count": 1
  }
}'
```

## 日志查询优化

### 常用查询

#### 查询错误日志
```json
{
  "query": {
    "bool": {
      "must": [
        { "term": { "level": "error" } }
      ]
    }
  }
}
```

#### 查询特定用户的日志
```json
{
  "query": {
    "term": {
      "user_id": "user-123"
    }
  }
}
```

#### 查询特定时间范围
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

#### 查询关联的分布式追踪日志
```json
{
  "query": {
    "term": {
      "trace_id": "abc123def456"
    }
  }
}
```

### 性能优化

1. **使用索引别名**:
   ```bash
   # 查询时使用别名而不是具体索引
   curl -X GET "http://localhost:9200/nestjs-logs/_search"
   ```

2. **时间范围过滤**:
   ```json
   {
     "query": {
       "range": {
         "@timestamp": {
           "gte": "now-7d",
           "lte": "now"
         }
       }
     }
   }
   ```

3. **分页优化**:
   ```json
   {
     "from": 0,
     "size": 100,
     "sort": [
       { "@timestamp": { "order": "desc" } }
     ]
   }
   ```

## 监控和告警

### 监控 ILM 策略执行

```bash
# 查看策略执行状态
curl -X GET "http://localhost:9200/_ilm/explain"

# 查看索引生命周期状态
curl -X GET "http://localhost:9200/nestjs-logs-*/_ilm/explain?pretty"
```

### 设置告警

#### 索引空间不足告警
```bash
curl -X PUT "http://localhost:9200/_watcher/watch/disk_space_watch" \
  -H 'Content-Type: application/json' \
  -d '{
  "trigger": {
    "schedule": { "interval": "5m" }
  },
  "input": {
    "search": {
      "request": {
        "indices": ["nestjs-logs-*"],
        "size": 0,
        "aggs": {
          "disk_usage": {
            "max": {
              "field": "store.size"
            }
          }
        }
      }
    }
  },
  "condition": {
    "compare": {
      "ctx.payload.aggregations.disk_usage.value": {
        "gt": 50000000000
      }
    }
  },
  "actions": {
    "send_email": {
      "email": {
        "to": "admin@example.com",
        "subject": "Disk Space Warning",
        "body": "Disk usage is over 50GB"
      }
    }
  }
}'
```

## 备份和恢复

### 创建快照

```bash
# 手动创建快照
curl -X PUT "http://localhost:9200/_snapshot/backup_repo/snapshot-1?wait_for_completion=true"

# 查看快照状态
curl -X GET "http://localhost:9200/_snapshot/backup_repo/_all"
```

### 恢复快照

```bash
# 恢复所有索引
curl -X POST "http://localhost:9200/_snapshot/backup_repo/snapshot-1/_restore?wait_for_completion=true"

# 恢复特定索引
curl -X POST "http://localhost:9200/_snapshot/backup_repo/snapshot-1/_restore" \
  -H 'Content-Type: application/json' \
  -d '{
  "indices": ["nestjs-logs-2025.01.15"],
  "rename_pattern": "(.+)",
  "rename_replacement": "restored_$1"
}'
```

## 清理策略

### 手动清理旧索引

```bash
# 删除 30 天前的索引
curl -X DELETE "http://localhost:9200/nestjs-logs-$(date -d '30 days ago' +%Y.%m.%d)-*"

# 删除所有测试环境的日志
curl -X DELETE "http://localhost:9200/nestjs-logs-*"
```

### 清理未使用的快照

```bash
# 查看所有快照
curl -X GET "http://localhost:9200/_snapshot/backup_repo/_all"

# 删除特定快照
curl -X DELETE "http://localhost:9200/_snapshot/backup_repo/snapshot-1"

# 删除 90 天前的快照
curl -X DELETE "http://localhost:9200/_snapshot/backup_repo/snap-$(date -d '90 days ago' +%Y.%m.%d)-*"
```

## 最佳实践

1. **定期检查 ILM 策略**:
   ```bash
   curl -X GET "http://localhost:9200/_ilm/policy/nestjs-logs-policy"
   ```

2. **监控索引大小**:
   ```bash
   curl -X GET "http://localhost:9200/_cat/indices/nestjs-logs-*?v&h=index,docs.count,store.size"
   ```

3. **定期备份快照**:
   - 建议每天自动创建快照
   - 保留最近 30 天的快照
   - 定期将快照归档到长期存储

4. **优化查询性能**:
   - 使用时间范围限制查询
   - 避免通配符查询
   - 使用索引别名

5. **监控日志量**:
   - 设置告警规则监控日志增长速度
   - 及时调整 ILM 策略
   - 优化日志输出级别

## 故障排查

### 日志未出现在 Kibana

1. 检查 Logstash 日志:
   ```bash
   docker logs logstash
   ```

2. 检查 Elasticsearch 索引:
   ```bash
   curl -X GET "http://localhost:9200/_cat/indices?v"
   ```

3. 检查索引模板:
   ```bash
   curl -X GET "http://localhost:9200/_index_template/nestjs-logs-template"
   ```

### ILM 策略未执行

1. 检查策略配置:
   ```bash
   curl -X GET "http://localhost:9200/_ilm/policy/nestjs-logs-policy"
   ```

2. 检查索引生命周期状态:
   ```bash
   curl -X GET "http://localhost:9200/nestjs-logs-*/_ilm/explain"
   ```

3. 手动触发 Rollover:
   ```bash
   curl -X POST "http://localhost:9200/nestjs-logs/_rollover"
   ```

### 存储空间不足

1. 查看索引大小:
   ```bash
   curl -X GET "http://localhost:9200/_cat/indices?v&h=index,store.size&sort=store.size:desc"
   ```

2. 删除旧索引:
   ```bash
   curl -X DELETE "http://localhost:9200/nestjs-logs-$(date -d '30 days ago' +%Y.%m.%d)-*"
   ```

3. 调整 ILM 策略，缩短保留时间
