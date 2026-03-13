# Prometheus + Grafana 监控指南

## 概述

本项目集成了 Prometheus + Grafana + Alertmanager 监控栈，用于实时监控应用性能和健康状况。

## 服务说明

### Prometheus
- **端口**: 9090
- **用途**: 指标收集和存储
- **访问地址**: http://localhost:9090

### Grafana
- **端口**: 3001
- **用途**: 可视化监控面板
- **默认账号**: admin / admin123
- **访问地址**: http://localhost:3001

### Alertmanager
- **端口**: 9093
- **用途**: 告警管理和通知
- **访问地址**: http://localhost:9093

### Node Exporter
- **端口**: 9100
- **用途**: 服务器系统指标收集
- **访问地址**: http://localhost:9100

## 快速开始

### 1. 启动监控栈

```bash
cd server
chmod +x start-monitoring.sh stop-monitoring.sh
./start-monitoring.sh
```

### 2. 验证服务状态

```bash
# 检查 Prometheus
curl http://localhost:9090/-/healthy

# 检查 Grafana（浏览器访问）
open http://localhost:3001
```

### 3. 停止监控栈

```bash
./stop-monitoring.sh
```

## 指标说明

### 应用指标

#### HTTP 请求指标
- `http_requests_total`: HTTP 请求总数（按方法、路由、状态码分组）
- `http_request_duration_seconds`: HTTP 请求延迟（按方法、路由、状态码分组）

#### 连接指标
- `active_connections`: 活动连接数（按连接类型分组）

#### 数据库指标
- `database_query_duration_seconds`: 数据库查询延迟

#### Redis 缓存指标
- `redis_cache_hits_total`: Redis 缓存命中数
- `redis_cache_misses_total`: Redis 缓存未命中数

### 系统指标

#### Node Exporter 指标
- CPU 使用率
- 内存使用量
- 磁盘 I/O
- 网络流量
- 文件系统信息

## 告警规则

### 应用健康
- **ApplicationDown**: 应用实例下线（严重）
- **HighErrorRate**: 5xx 错误率超过 10%（警告）
- **HighLatency**: 99% 请求延迟超过 2 秒（警告）

### 系统资源
- **HighMemoryUsage**: 内存使用率超过 80%（警告）
- **LowDiskSpace**: 磁盘剩余空间低于 10%（严重）

### 数据库
- **DatabaseConnectionFailed**: 数据库连接失败（严重）
- **RedisConnectionFailed**: Redis 连接失败（警告）

## Grafana Dashboard

### 预置 Dashboard

项目预置了 "保洁服务监控面板"，包含以下面板：

1. **HTTP 请求速率**: 每秒请求数（按 HTTP 方法分组）
2. **请求延迟 (P99)**: 99% 请求延迟
3. **HTTP 状态码分布**: 按状态码统计的请求数
4. **内存使用量**: 应用内存占用
5. **应用健康状态**: 应用运行状态

### 导入 Dashboard

1. 登录 Grafana (http://localhost:3001)
2. 进入 Dashboards > Manage
3. 找到 "保洁服务监控面板"
4. 点击打开查看

## 自定义配置

### 修改告警规则

编辑 `prometheus/alert_rules.yml`:

```yaml
- alert: CustomAlert
  expr: your_expression_here
  for: 5m
  labels:
    severity: warning
  annotations:
    summary: "自定义告警"
    description: "告警描述"
```

### 修改 Prometheus 配置

编辑 `prometheus/prometheus.yml`:

```yaml
scrape_configs:
  - job_name: 'custom_job'
    static_configs:
      - targets: ['your-target:port']
```

### 修改 Grafana 数据源

编辑 `grafana/provisioning/datasources/prometheus.yml`:

```yaml
datasources:
  - name: Prometheus
    type: prometheus
    access: proxy
    url: http://prometheus:9090
```

## 查询示例

### PromQL 查询

#### 查询 QPS（每秒请求数）
```promql
sum(rate(http_requests_total[1m]))
```

#### 查询错误率
```promql
sum(rate(http_requests_total{status_code=~"5.."}[5m])) / sum(rate(http_requests_total[5m]))
```

#### 查询 P95 延迟
```promql
histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m]))
```

#### 查询内存使用率
```promql
(process_resident_memory_bytes / total_memory) * 100
```

## 集成到应用

### 暴露指标端点

应用已自动暴露指标端点: `http://localhost:3000/metrics`

### 记录自定义指标

```typescript
import { MonitoringService } from './monitoring/monitoring.service'

constructor(private readonly monitoringService: MonitoringService) {}

async someMethod() {
  const start = Date.now()

  try {
    // 业务逻辑
    this.monitoringService.recordCustomMetric('custom_operation', 1)
  } finally {
    const duration = Date.now() - start
    this.monitoringService.recordCustomMetric('custom_duration', duration)
  }
}
```

## 注意事项

1. **数据持久化**: 指标数据存储在 Docker volume 中，重启不会丢失
2. **性能影响**: 指标收集会带来轻微性能开销，建议合理设置采集间隔
3. **存储空间**: Prometheus 会持续存储指标数据，需要定期清理旧数据
4. **安全性**: 生产环境需要配置身份验证和 HTTPS

## 常见问题

### Prometheus 无法抓取指标

检查应用是否正在运行:
```bash
curl http://localhost:3000/metrics
```

### Grafana 无法连接 Prometheus

检查 Prometheus 是否健康:
```bash
curl http://localhost:9090/-/healthy
```

### 告警未触发

检查 Alertmanager 配置:
```bash
curl http://localhost:9093/api/v1/status
```

## 清理数据

清理所有监控数据:
```bash
docker-compose -f docker-compose.monitoring.yml down -v
```

## 相关文档

- [Prometheus 官方文档](https://prometheus.io/docs/)
- [Grafana 官方文档](https://grafana.com/docs/)
- [Alertmanager 官方文档](https://prometheus.io/docs/alerting/latest/alertmanager/)
- [Node Exporter 官方文档](https://github.com/prometheus/node_exporter)
