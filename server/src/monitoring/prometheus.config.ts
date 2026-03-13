import { PrometheusModule, makeCounterProvider, makeGaugeProvider, makeHistogramProvider } from '@willsoto/nestjs-prometheus'

export const prometheusConfig = PrometheusModule.register({
  path: '/metrics',
  defaultMetrics: {
    enabled: true,
  },
})

// Custom Metrics
export const httpRequestsCounter = makeCounterProvider({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status_code'],
})

export const httpRequestDuration = makeHistogramProvider({
  name: 'http_request_duration_seconds',
  help: 'HTTP request duration in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.1, 0.5, 1, 2, 5, 10],
})

export const activeConnectionsGauge = makeGaugeProvider({
  name: 'active_connections',
  help: 'Number of active connections',
  labelNames: ['type'],
})

export const databaseQueryDuration = makeHistogramProvider({
  name: 'database_query_duration_seconds',
  help: 'Database query duration in seconds',
  labelNames: ['operation', 'table'],
  buckets: [0.01, 0.05, 0.1, 0.5, 1, 5],
})

export const redisCacheHitRate = makeCounterProvider({
  name: 'redis_cache_hits_total',
  help: 'Total number of Redis cache hits',
  labelNames: ['key'],
})

export const redisCacheMissRate = makeCounterProvider({
  name: 'redis_cache_misses_total',
  help: 'Total number of Redis cache misses',
  labelNames: ['key'],
})
