# Jaeger 分布式追踪指南

## 概述

本项目集成了 OpenTelemetry + Jaeger 分布式追踪，用于跟踪请求在系统中的完整调用链路，帮助排查性能问题和定位瓶颈。

## 服务说明

### Jaeger UI
- **端口**: 16686
- **用途**: 可视化追踪数据
- **访问地址**: http://localhost:16686

### Jaeger Collector (OTLP gRPC)
- **端口**: 4317
- **用途**: 接收 gRPC 格式的追踪数据

### Jaeger Collector (OTLP HTTP)
- **端口**: 4318
- **用途**: 接收 HTTP 格式的追踪数据

### Jaeger Agent (UDP)
- **端口**: 6831
- **用途**: 接收 Thrift 格式的追踪数据

## 快速开始

### 1. 启动 Jaeger

```bash
cd server
chmod +x start-jaeger.sh stop-jaeger.sh
./start-jaeger.sh
```

### 2. 验证服务状态

```bash
# 检查 Jaeger UI（浏览器访问）
open http://localhost:16686
```

### 3. 启动应用（追踪会自动启用）

```bash
pnpm dev
```

### 4. 停止 Jaeger

```bash
./stop-jaeger.sh
```

## 使用 Jaeger UI

### 查找追踪

1. 打开 Jaeger UI: http://localhost:16686
2. 在左侧面板选择服务: `cleaning-service-api`
3. 点击 "Find Traces" 按钮查找追踪
4. 点击单个追踪查看详细信息

### 追踪详情

- **Trace Overview**: 显示追踪的整体时间线和所有 Span
- **Span Details**: 显示单个 Span 的详细信息（标签、日志、进程）
- **Timeline**: 显示 Span 的时间线和调用关系

### 搜索过滤

按以下条件过滤追踪：

- **Service**: 服务名称
- **Operation**: 操作名称
- **Tags**: 自定义标签
- **Duration**: 持续时间范围
- **Lookback**: 时间范围

## 配置说明

### 环境变量

在 `.env` 文件中配置：

```env
# Jaeger Distributed Tracing Configuration
JAEGER_ENDPOINT=http://localhost:4317
NODE_ENV=development
```

### 生产环境配置

生产环境建议使用：

```env
JAEGER_ENDPOINT=http://jaeger-collector.production.com:4317
NODE_ENV=production
```

## OpenTelemetry 配置

### 服务名称和版本

在 `src/tracing/tracing.ts` 中配置：

```typescript
const resource = Resource.default().merge(
  new Resource({
    [SEMRESATTRS_SERVICE_NAME]: 'cleaning-service-api',
    [SEMRESATTRS_SERVICE_VERSION]: '1.0.0',
    [SEMRESATTRS_DEPLOYMENT_ENVIRONMENT]: process.env.NODE_ENV || 'development',
  }),
)
```

### 自动插桩

项目启用了 OpenTelemetry 自动插桩，自动追踪：

- HTTP 请求
- HTTP 客户端
- 数据库查询
- 缓存操作
- 文件系统操作
- 定时器
- Promise

## 手动创建 Span

如果需要手动创建 Span，可以使用 OpenTelemetry API：

```typescript
import { trace } from '@opentelemetry/api';

async someMethod() {
  const tracer = trace.getTracer('cleaning-service-api');

  return tracer.startActiveSpan('custom-operation', async (span) => {
    try {
      // 业务逻辑
      span.setAttribute('custom.key', 'custom-value');
      return result;
    } catch (error) {
      span.recordException(error);
      throw error;
    } finally {
      span.end();
    }
  });
}
```

## 添加自定义标签

### 在 Controller 中

```typescript
import { trace } from '@opentelemetry/api';

@Get('users/:id')
async getUser(@Param('id') id: string) {
  const span = trace.getActiveSpan();
  if (span) {
    span.setAttribute('user.id', id);
    span.setAttribute('user.action', 'get_user');
  }
  // ...
}
```

### 在 Service 中

```typescript
async createOrder(dto: CreateOrderDto) {
  const span = trace.getActiveSpan();
  if (span) {
    span.setAttribute('order.service_type', dto.serviceType);
    span.setAttribute('order.user_id', dto.userId);
  }
  // ...
}
```

## 追踪数据导出

### 导出到 Jaeger Collector

默认配置使用 gRPC 导出到 Jaeger：

```typescript
const traceExporter = new OTLPTraceExporter({
  url: process.env.JAEGER_ENDPOINT || 'http://localhost:4317',
});
```

### 导出到其他后端

可以修改为导出到其他追踪后端：

```typescript
import { JaegerExporter } from '@opentelemetry/exporter-jaeger';

const traceExporter = new JaegerExporter({
  endpoint: 'http://localhost:14268/api/traces',
});
```

## 常见问题

### 追踪数据未显示

1. 检查 Jaeger 是否运行:
   ```bash
   curl http://localhost:16686
   ```

2. 检查应用是否正确初始化追踪:
   ```bash
   pnpm dev
   # 应该看到 "✅ OpenTelemetry tracing initialized"
   ```

3. 检查环境变量配置:
   ```bash
   echo $JAEGER_ENDPOINT
   ```

### Span 数量过多

调整采样率：

```typescript
import { ParentBasedSampler, TraceIdRatioBasedSampler } from '@opentelemetry/sdk-trace-base';

const sampler = new ParentBasedSampler({
  root: new TraceIdRatioBasedSampler(0.1), // 10% 采样率
});

const sdk = new NodeSDK({
  sampler,
  // ...
});
```

### 性能影响

追踪会带来轻微的性能开销，建议：

1. 生产环境使用适当的采样率（如 10-20%）
2. 避免在热路径中添加过多标签
3. 定期清理旧的追踪数据

## 追踪最佳实践

### 1. 选择合适的操作名称

```typescript
// ❌ 不好的做法
span.updateName('method')

// ✅ 好的做法
span.updateName('POST /api/users')
```

### 2. 添加有意义的标签

```typescript
span.setAttribute('http.method', 'GET')
span.setAttribute('http.route', '/api/users')
span.setAttribute('http.status_code', '200')
span.setAttribute('user.id', userId)
```

### 3. 记录事件和异常

```typescript
try {
  // 业务逻辑
  span.addEvent('database_query_started', { query: 'SELECT * FROM users' })
  // ...
} catch (error) {
  span.recordException(error)
  throw error
}
```

### 4. 使用 Span 状态

```typescript
span.setStatus({
  code: SpanStatusCode.ERROR,
  message: 'Database connection failed'
})
```

## 相关文档

- [OpenTelemetry 官方文档](https://opentelemetry.io/docs/)
- [Jaeger 官方文档](https://www.jaegertracing.io/docs/)
- [OpenTelemetry JavaScript SDK](https://github.com/open-telemetry/opentelemetry-js)
- [Jaeger UI 使用指南](https://www.jaegertracing.io/docs/latest/deployment/#ui)

## 集成示例

### 追踪 HTTP 请求

OpenTelemetry 自动插桩会自动追踪所有 HTTP 请求，无需额外配置。

### 追踪数据库查询

使用 TypeORM 或 Prisma 时，数据库查询会自动被追踪。

### 追踪外部 API 调用

使用 axios 或 fetch 时，外部 API 调用会自动被追踪。

```typescript
import axios from 'axios'

const response = await axios.get('https://api.example.com/data')
// 这个请求会自动创建一个 Span
```

## 性能监控结合

### 结合 Prometheus 指标

追踪可以与 Prometheus 指标结合使用：

1. 使用 Prometheus 监控整体性能（QPS、延迟、错误率）
2. 使用 Jaeger 追踪排查具体问题（调用链路、瓶颈定位）

### 结合 ELK 日志

追踪可以与 ELK 日志结合使用：

1. 在日志中包含 `trace_id` 和 `span_id`
2. 在 Jaeger 中查看追踪，然后根据 trace_id 查询相关日志

```typescript
import { trace } from '@opentelemetry/api';

const span = trace.getActiveSpan();
const traceId = span?.spanContext().traceId;
const spanId = span?.spanContext().spanId;

logger.log({ message: 'Processing request', traceId, spanId });
```
