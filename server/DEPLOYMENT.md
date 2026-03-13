# 自动化部署指南

本文档介绍了如何使用自动化部署脚本和 CI/CD 流水线来部署保洁服务应用。

## 目录

- [快速开始](#快速开始)
- [本地开发](#本地开发)
- [生产部署](#生产部署)
- [监控与日志](#监控与日志)
- [故障排查](#故障排查)

## 快速开始

### 前置要求

- Docker 和 Docker Compose
- Node.js 20+
- pnpm 8+
- 至少 8GB 可用内存（运行完整 ELK 栈）

### 一键部署

使用部署脚本一键启动所有服务：

```bash
# 进入 server 目录
cd server

# 添加执行权限
chmod +x deploy.sh

# 部署所有服务
./deploy.sh deploy
```

部署脚本会自动完成以下步骤：

1. 检查环境（Docker、Docker Compose、Node.js、pnpm）
2. 安装依赖
3. 构建应用
4. 启动 ELK 栈（Elasticsearch、Logstash、Kibana）
5. 初始化 ILM 策略
6. 启动监控栈（Prometheus、Grafana、Alertmanager）
7. 启动 Jaeger 分布式追踪
8. 启动应用
9. 执行健康检查

### 部署完成后可访问的服务

| 服务 | 地址 | 说明 |
|------|------|------|
| 应用 | http://localhost:3000 | 主应用 |
| 健康检查 | http://localhost:3000/health | 健康检查端点 |
| API 文档 | http://localhost:3000/api-docs | Swagger UI |
| 指标 | http://localhost:3000/metrics | Prometheus 指标 |
| Elasticsearch | http://localhost:9200 | 日志存储 |
| Kibana | http://localhost:5601 | 日志分析 |
| Prometheus | http://localhost:9090 | 指标采集 |
| Grafana | http://localhost:3001 | 可视化监控 |
| Alertmanager | http://localhost:9093 | 告警管理 |
| Jaeger UI | http://localhost:16686 | 分布式追踪 |

## 本地开发

### 启动开发环境

```bash
# 使用 coze dev 启动（推荐）
cd /workspace/projects
coze dev

# 或使用 npm script
cd server
pnpm dev
```

### 启动 ELK 栈（开发环境）

```bash
cd server
./start-elk.sh
```

### 启动监控栈（开发环境）

```bash
cd server
./start-monitoring.sh
```

### 启动 Jaeger（开发环境）

```bash
cd server
./start-jaeger.sh
```

### 查看日志

```bash
# 查看应用日志
./deploy.sh logs app

# 查看 ELK 日志
./deploy.sh logs elk

# 查看监控日志
./deploy.sh logs monitoring

# 查看所有日志
./deploy.sh logs all
```

## 生产部署

### Docker Compose 部署

1. **配置环境变量**

创建 `.env` 文件：

```bash
cp .env.example .env
# 编辑 .env 文件，填入生产环境配置
```

2. **使用 Docker Compose 部署**

```bash
cd server

# 构建并启动所有服务
docker-compose -f docker-compose.prod.yml up -d

# 查看服务状态
docker-compose -f docker-compose.prod.yml ps

# 查看日志
docker-compose -f docker-compose.prod.yml logs -f
```

3. **配置 Nginx SSL 证书**

```bash
# 创建 SSL 目录
mkdir -p ssl

# 将证书文件复制到 ssl 目录
# fullchain.pem - 完整证书链
# privkey.pem - 私钥
```

4. **重启服务**

```bash
docker-compose -f docker-compose.prod.yml restart
```

### CI/CD 自动部署

项目配置了 GitHub Actions CI/CD 流水线，支持自动部署：

#### 工作流程

1. **测试阶段**
   - 运行 ESLint 检查
   - 运行 TypeScript 类型检查
   - 运行单元测试
   - 生成测试覆盖率报告

2. **构建阶段**
   - 构建应用
   - 上传构建产物

3. **部署阶段**（仅 main 分支）
   - 部署到生产服务器
   - 重启应用服务

4. **健康检查阶段**（仅 main 分支）
   - 检查应用健康状态
   - 检查 API 文档
   - 检查指标端点

5. **通知阶段**
   - 发送部署状态通知（Slack）

#### 配置 GitHub Secrets

在 GitHub 仓库设置中配置以下 Secrets：

- `SERVER_HOST`: 生产服务器地址
- `SERVER_USER`: 服务器用户名
- `SERVER_SSH_KEY`: 服务器 SSH 私钥
- `SLACK_WEBHOOK_URL`: Slack Webhook URL

#### 手动触发部署

```bash
git push origin main
# 或创建 Pull Request 到 main 分支
```

## 监控与日志

### Prometheus 监控

访问 Grafana (http://localhost:3001) 查看监控面板：

- **用户名**: admin
- **密码**: admin123

默认预置了以下监控面板：

1. **应用概览** - 应用整体健康状态
2. **性能指标** - 请求响应时间、吞吐量
3. **业务指标** - 订单统计、保洁员在线状态
4. **系统资源** - CPU、内存、磁盘使用率
5. **数据库指标** - 连接池、慢查询
6. **缓存指标** - Redis 连接、命中率

### 告警配置

告警规则位于 `prometheus/alert_rules.yml`，包含：

- 应用健康告警
- 性能指标告警
- 业务指标告警
- 系统资源告警

#### 配置通知渠道

在 `.env` 文件中配置通知渠道：

```bash
# Webhook 通知
WEBHOOK_NOTIFICATION_ENABLED=true
WEBHOOK_URL=http://your-webhook-url

# Slack 通知
SLACK_NOTIFICATION_ENABLED=true
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/...
SLACK_CHANNEL=#alerts

# 微信企业号通知
WECHAT_NOTIFICATION_ENABLED=true
WECHAT_CORP_ID=your-corp-id
WECHAT_AGENT_ID=your-agent-id
WECHAT_SECRET=your-secret
WECHAT_TO_USER=@all

# 短信通知
SMS_NOTIFICATION_ENABLED=true
SMS_PHONES=13800138000,13900139000
SMS_ALERT_TEMPLATE_ID=your-template-id

# 邮件通知
EMAIL_NOTIFICATION_ENABLED=true
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USERNAME=your-email@example.com
SMTP_PASSWORD=your-password
EMAIL_FROM=noreply@cleaning-service.com
EMAIL_TO=admin@example.com,ops@example.com
```

#### 手动测试通知

```bash
# 使用 API 测试通知
curl -X POST http://localhost:3000/api/notifications/test \
  -H "Content-Type: application/json"
```

### ELK 日志

#### 查看日志

访问 Kibana (http://localhost:5601)：

1. 进入 **Stack Management** > **Index Patterns**
2. 创建索引模式：`cleaning-*`
3. 进入 **Discover** 查看日志

#### 日志查询示例

```json
// 查看错误日志
level: "error"

// 查看特定服务日志
service: "cleaning-api"

// 查看最近 1 小时的日志
@timestamp: [now-1h TO now]

// 查看特定用户日志
userId: "123"

// 查看慢请求
duration: >1000
```

#### 日志归档

日志保留策略：

- **热数据**（7 天）：高性能存储
- **温数据**（7-23 天）：标准存储
- **冷数据**（23-30 天）：低成本存储
- **自动删除**（30 天后）

如需修改保留策略，编辑 `logstash/pipeline/logstash.conf` 中的 ILM 策略。

### Jaeger 分布式追踪

访问 Jaeger UI (http://localhost:16686) 查看分布式追踪：

1. 选择服务（如 `cleaning-api`）
2. 点击 **Find Traces** 查看追踪记录
3. 点击单个追踪查看详细信息

#### 追踪查询

- 按操作名称过滤：如 `GET /api/orders`
- 按标签过滤：如 `userId: 123`
- 按时间范围过滤
- 按持续时间过滤

## 部署脚本使用

### 可用命令

```bash
# 部署所有服务
./deploy.sh deploy

# 停止所有服务
./deploy.sh stop

# 重启所有服务
./deploy.sh restart

# 健康检查
./deploy.sh health

# 查看日志
./deploy.sh logs <service>

# 可用服务: app, elk, monitoring, jaeger, all
```

## 故障排查

### 服务无法启动

1. **检查端口占用**

```bash
# 检查端口是否被占用
lsof -i :3000  # 应用
lsof -i :9200  # Elasticsearch
lsof -i :9090  # Prometheus
```

2. **检查 Docker 容器状态**

```bash
docker ps -a
```

3. **查看容器日志**

```bash
docker logs <container-name>
```

### Elasticsearch 无法启动

```bash
# 检查内存是否充足
free -h

# 增加 Docker 内存限制
# 或降低 ES 堆内存大小
```

### 应用健康检查失败

```bash
# 检查应用日志
./deploy.sh logs app

# 检查数据库连接
curl http://localhost:3000/health

# 检查 Redis 连接
redis-cli -h localhost -p 6379 ping
```

### 告警不触发

1. 检查 Alertmanager 是否正常运行

```bash
curl http://localhost:9093/-/healthy
```

2. 检查告警规则是否加载

```bash
curl http://localhost:9090/api/v1/rules
```

3. 检查通知渠道配置

```bash
curl http://localhost:3000/api/notifications/channels
```

4. 手动测试通知

```bash
curl -X POST http://localhost:3000/api/notifications/test
```

### 日志无法发送到 Elasticsearch

1. 检查 Logstash 配置

```bash
cat logstash/pipeline/logstash.conf
```

2. 检查 Elasticsearch 连接

```bash
curl http://localhost:9200/_cluster/health
```

3. 查看 Logstash 日志

```bash
docker logs logstash
```

## 性能优化建议

### 生产环境优化

1. **增加 Elasticsearch 堆内存**

```yaml
environment:
  - "ES_JAVA_OPTS=-Xms2g -Xmx2g"
```

2. **启用 Redis 持久化**

```yaml
command: redis-server --requirepass yourpassword --appendonly yes
```

3. **配置 Nginx 缓存**

```nginx
proxy_cache_path /var/cache/nginx levels=1:2 keys_zone=my_cache:10m max_size=1g;

location /api/ {
    proxy_cache my_cache;
    proxy_cache_valid 200 1h;
    proxy_pass http://backend/api/;
}
```

4. **启用 gzip 压缩**

已在 `nginx.conf` 中配置。

### 监控优化

1. **调整指标采集间隔**

```typescript
// monitoring.service.ts
this.updateMetrics(); // 每 60 秒执行一次
```

2. **优化 Prometheus 存储**

```yaml
# prometheus/prometheus.yml
storage:
  tsdb:
    retention.time: 15d
```

3. **减少日志输出量**

```typescript
// 只记录必要级别的日志
logger.log('info', message);
logger.log('error', error);
```

## 安全建议

1. **使用强密码** - 所有密码使用复杂字符串
2. **启用 SSL/TLS** - 所有服务启用 HTTPS
3. **限制访问** - 使用防火墙限制端口访问
4. **定期更新** - 及时更新依赖和镜像
5. **备份策略** - 定期备份数据库和配置文件
6. **监控告警** - 配置关键指标告警

## 附录

### 环境变量清单

详见 `.env.example` 文件。

### 端口清单

| 服务 | 端口 | 说明 |
|------|------|------|
| 应用 | 3000 | HTTP |
| PostgreSQL | 5432 | 数据库 |
| Redis | 6379 | 缓存 |
| Elasticsearch | 9200 | 日志存储 |
| Kibana | 5601 | 日志分析 |
| Logstash | 5044 | 日志收集 |
| Prometheus | 9090 | 指标采集 |
| Grafana | 3001 | 可视化监控 |
| Alertmanager | 9093 | 告警管理 |
| Jaeger | 16686 | 分布式追踪 |

### 常用命令速查

```bash
# 部署
./deploy.sh deploy

# 停止
./deploy.sh stop

# 重启
./deploy.sh restart

# 健康检查
./deploy.sh health

# 查看日志
./deploy.sh logs app
./deploy.sh logs elk
./deploy.sh logs monitoring
./deploy.sh logs jaeger
./deploy.sh logs all

# Docker Compose
docker-compose -f docker-compose.prod.yml up -d
docker-compose -f docker-compose.prod.yml down
docker-compose -f docker-compose.prod.yml logs -f
```

## 获取帮助

如遇到问题，请：

1. 查看本文档的故障排查部分
2. 检查应用日志
3. 查看 GitHub Issues

## 更新日志

- v1.0.0 (2024-01-01): 初始版本
  - 添加自动化部署脚本
  - 集成 ELK 栈
  - 集成 Prometheus + Grafana
  - 集成 Jaeger
  - 配置 CI/CD 流水线
  - 添加通知服务
