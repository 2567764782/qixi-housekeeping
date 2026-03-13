import {
  PrometheusModule,
  makeCounterProvider,
  makeGaugeProvider,
  makeHistogramProvider,
  makeSummaryProvider,
} from '@willsoto/nestjs-prometheus'

export const prometheusConfig = PrometheusModule.register({
  path: '/metrics',
  defaultMetrics: {
    enabled: true,
  },
})

// ==================== HTTP Metrics ====================
export const httpRequestsCounter = makeCounterProvider({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status_code'],
})

export const httpRequestDuration = makeHistogramProvider({
  name: 'http_request_duration_seconds',
  help: 'HTTP request duration in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5, 10],
})

export const httpRequestSize = makeSummaryProvider({
  name: 'http_request_size_bytes',
  help: 'HTTP request size in bytes',
  labelNames: ['method', 'route'],
  percentiles: [0.5, 0.9, 0.95, 0.99],
})

export const httpResponseSize = makeSummaryProvider({
  name: 'http_response_size_bytes',
  help: 'HTTP response size in bytes',
  labelNames: ['method', 'route', 'status_code'],
  percentiles: [0.5, 0.9, 0.95, 0.99],
})

export const activeConnectionsGauge = makeGaugeProvider({
  name: 'active_connections',
  help: 'Number of active connections',
  labelNames: ['type'],
})

// ==================== Business Metrics ====================
// Order Metrics
export const orderCreationCounter = makeCounterProvider({
  name: 'order_creation_total',
  help: 'Total number of order creations',
  labelNames: ['service_type', 'status'],
})

export const orderCreationFailureCounter = makeCounterProvider({
  name: 'order_creation_failures_total',
  help: 'Total number of order creation failures',
  labelNames: ['reason'],
})

export const pendingOrdersGauge = makeGaugeProvider({
  name: 'pending_orders_count',
  help: 'Current number of pending orders',
  labelNames: ['service_type'],
})

export const orderProcessingDuration = makeHistogramProvider({
  name: 'order_processing_duration_seconds',
  help: 'Order processing duration in seconds',
  labelNames: ['order_type', 'status'],
  buckets: [10, 30, 60, 120, 300, 600, 1800],
})

export const orderCancellationCounter = makeCounterProvider({
  name: 'order_cancellation_total',
  help: 'Total number of order cancellations',
  labelNames: ['reason', 'user_type'],
})

// Cleaner Metrics
export const cleanerOnlineGauge = makeGaugeProvider({
  name: 'cleaner_online_count',
  help: 'Current number of online cleaners',
  labelNames: ['region'],
})

export const cleanerAssignmentCounter = makeCounterProvider({
  name: 'cleaner_assignment_total',
  help: 'Total number of cleaner assignments',
  labelNames: ['assignment_type'],
})

export const cleanerCompletionRate = makeGaugeProvider({
  name: 'cleaner_completion_rate',
  help: 'Cleaner order completion rate',
  labelNames: ['cleaner_id'],
})

export const cleanerRatingGauge = makeGaugeProvider({
  name: 'cleaner_rating',
  help: 'Current cleaner rating',
  labelNames: ['cleaner_id', 'time_period'],
})

// Payment Metrics
export const paymentAttemptsCounter = makeCounterProvider({
  name: 'payment_attempts_total',
  help: 'Total number of payment attempts',
  labelNames: ['payment_method'],
})

export const paymentFailuresCounter = makeCounterProvider({
  name: 'payment_failures_total',
  help: 'Total number of payment failures',
  labelNames: ['payment_method', 'error_type'],
})

export const paymentAmountSummary = makeSummaryProvider({
  name: 'payment_amount_total',
  help: 'Payment amount summary',
  labelNames: ['payment_method', 'currency'],
  percentiles: [0.5, 0.75, 0.9, 0.95, 0.99],
})

export const paymentDuration = makeHistogramProvider({
  name: 'payment_processing_duration_seconds',
  help: 'Payment processing duration in seconds',
  labelNames: ['payment_method'],
  buckets: [1, 3, 5, 10, 15, 30],
})

// SMS Metrics
export const smsSendAttemptsCounter = makeCounterProvider({
  name: 'sms_send_attempts_total',
  help: 'Total number of SMS send attempts',
  labelNames: ['template', 'phone_prefix'],
})

export const smsSendFailuresCounter = makeCounterProvider({
  name: 'sms_send_failures_total',
  help: 'Total number of SMS send failures',
  labelNames: ['template', 'error_type'],
})

export const smsDeliveryDuration = makeHistogramProvider({
  name: 'sms_delivery_duration_seconds',
  help: 'SMS delivery duration in seconds',
  labelNames: ['template'],
  buckets: [1, 2, 5, 10, 20, 30],
})

// User Metrics
export const userRegistrationCounter = makeCounterProvider({
  name: 'user_registration_total',
  help: 'Total number of user registrations',
  labelNames: ['registration_method'],
})

export const userLoginCounter = makeCounterProvider({
  name: 'user_login_total',
  help: 'Total number of user logins',
  labelNames: ['login_method'],
})

export const activeUsersGauge = makeGaugeProvider({
  name: 'active_users_count',
  help: 'Current number of active users',
  labelNames: ['time_period'],
})

// ==================== Database Metrics ====================
export const databaseQueryDuration = makeHistogramProvider({
  name: 'database_query_duration_seconds',
  help: 'Database query duration in seconds',
  labelNames: ['operation', 'table'],
  buckets: [0.001, 0.005, 0.01, 0.05, 0.1, 0.5, 1],
})

export const databaseConnectionsGauge = makeGaugeProvider({
  name: 'database_connections',
  help: 'Database connection pool statistics',
  labelNames: ['state'],
})

export const databaseQueryCounter = makeCounterProvider({
  name: 'database_queries_total',
  help: 'Total number of database queries',
  labelNames: ['operation', 'table', 'status'],
})

// ==================== Cache Metrics ====================
export const redisCacheHitsCounter = makeCounterProvider({
  name: 'redis_cache_hits_total',
  help: 'Total number of Redis cache hits',
  labelNames: ['cache_key_pattern'],
})

export const redisCacheMissesCounter = makeCounterProvider({
  name: 'redis_cache_misses_total',
  help: 'Total number of Redis cache misses',
  labelNames: ['cache_key_pattern'],
})

export const redisCacheSizeGauge = makeGaugeProvider({
  name: 'redis_cache_size',
  help: 'Current Redis cache size',
  labelNames: ['cache_type'],
})

export const redisCacheEvictionCounter = makeCounterProvider({
  name: 'redis_cache_evictions_total',
  help: 'Total number of Redis cache evictions',
  labelNames: ['eviction_reason'],
})

// ==================== WebSocket Metrics ====================
export const websocketConnectionsGauge = makeGaugeProvider({
  name: 'websocket_connections',
  help: 'Current number of WebSocket connections',
  labelNames: ['connection_type'],
})

export const websocketMessagesCounter = makeCounterProvider({
  name: 'websocket_messages_total',
  help: 'Total number of WebSocket messages',
  labelNames: ['direction', 'message_type'],
})

export const websocketMessageDuration = makeHistogramProvider({
  name: 'websocket_message_processing_duration_seconds',
  help: 'WebSocket message processing duration',
  labelNames: ['message_type'],
  buckets: [0.01, 0.05, 0.1, 0.5, 1],
})

// ==================== System Metrics ====================
export const taskQueueLengthGauge = makeGaugeProvider({
  name: 'task_queue_length',
  help: 'Current task queue length',
  labelNames: ['queue_name'],
})

export const taskProcessingDuration = makeHistogramProvider({
  name: 'task_processing_duration_seconds',
  help: 'Task processing duration',
  labelNames: ['task_type', 'status'],
  buckets: [0.1, 0.5, 1, 5, 10, 30, 60],
})

export const taskFailureCounter = makeCounterProvider({
  name: 'task_failures_total',
  help: 'Total number of task failures',
  labelNames: ['task_type', 'failure_reason'],
})

export const externalApiCallCounter = makeCounterProvider({
  name: 'external_api_calls_total',
  help: 'Total number of external API calls',
  labelNames: ['api_name', 'status'],
})

export const externalApiCallDuration = makeHistogramProvider({
  name: 'external_api_call_duration_seconds',
  help: 'External API call duration',
  labelNames: ['api_name'],
  buckets: [0.1, 0.5, 1, 2, 5, 10, 30],
})

// Export all metrics for easy import
export const allMetrics = {
  // HTTP
  httpRequestsCounter,
  httpRequestDuration,
  httpRequestSize,
  httpResponseSize,
  activeConnectionsGauge,
  // Business
  orderCreationCounter,
  orderCreationFailureCounter,
  pendingOrdersGauge,
  orderProcessingDuration,
  orderCancellationCounter,
  cleanerOnlineGauge,
  cleanerAssignmentCounter,
  cleanerCompletionRate,
  cleanerRatingGauge,
  paymentAttemptsCounter,
  paymentFailuresCounter,
  paymentAmountSummary,
  paymentDuration,
  smsSendAttemptsCounter,
  smsSendFailuresCounter,
  smsDeliveryDuration,
  userRegistrationCounter,
  userLoginCounter,
  activeUsersGauge,
  // Database
  databaseQueryDuration,
  databaseConnectionsGauge,
  databaseQueryCounter,
  // Cache
  redisCacheHitsCounter,
  redisCacheMissesCounter,
  redisCacheSizeGauge,
  redisCacheEvictionCounter,
  // WebSocket
  websocketConnectionsGauge,
  websocketMessagesCounter,
  websocketMessageDuration,
  // System
  taskQueueLengthGauge,
  taskProcessingDuration,
  taskFailureCounter,
  externalApiCallCounter,
  externalApiCallDuration,
}
