#!/bin/bash

# Elasticsearch ILM 策略配置脚本

ELASTICSEARCH_URL="http://localhost:9200"

echo "📝 Creating Elasticsearch ILM Policy for cleaning-service logs..."

# 创建 ILM 策略
curl -X PUT "${ELASTICSEARCH_URL}/_ilm/policy/nestjs-logs-policy" \
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

echo ""
echo "✅ ILM policy created"

# 创建索引模板
echo ""
echo "📝 Creating index template..."

curl -X PUT "${ELASTICSEARCH_URL}/_index_template/nestjs-logs-template" \
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
        "@timestamp": {
          "type": "date"
        },
        "level": {
          "type": "keyword"
        },
        "message": {
          "type": "text",
          "fields": {
            "keyword": {
              "type": "keyword",
              "ignore_above": 256
            }
          }
        },
        "context": {
          "type": "keyword"
        },
        "trace_id": {
          "type": "keyword"
        },
        "span_id": {
          "type": "keyword"
        },
        "environment": {
          "type": "keyword"
        },
        "application": {
          "type": "keyword"
        },
        "version": {
          "type": "keyword"
        },
        "is_error": {
          "type": "boolean"
        },
        "user_id": {
          "type": "keyword"
        },
        "order_id": {
          "type": "keyword"
        }
      }
    }
  }
}'

echo ""
echo "✅ Index template created"

# 初始化第一个索引
echo ""
echo "📝 Initializing first index..."

curl -X PUT "${ELASTICSEARCH_URL}/nestjs-logs-000001" \
  -H 'Content-Type: application/json' \
  -d '{
  "aliases": {
    "nestjs-logs": {
      "is_write_index": true
    }
  }
}'

echo ""
echo "✅ First index initialized"

echo ""
echo "🎉 Elasticsearch ILM configuration completed!"
echo ""
echo "📊 Summary:"
echo "  - Hot Phase: Max 50GB or 1 day"
echo "  - Warm Phase: After 2 days, force merge and shrink"
echo "  - Cold Phase: After 7 days, freeze index"
echo "  - Delete Phase: After 30 days, delete index"
