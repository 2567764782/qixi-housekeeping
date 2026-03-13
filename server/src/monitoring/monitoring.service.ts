import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common'
import {
  InjectMetric,
} from '@willsoto/nestjs-prometheus'
import {
  Counter,
  Histogram,
  Gauge,
  Summary,
} from 'prom-client'
import {
  httpRequestsCounter,
  httpRequestDuration,
  httpRequestSize,
  httpResponseSize,
  activeConnectionsGauge,
  orderCreationCounter,
  orderCreationFailureCounter,
  pendingOrdersGauge,
  orderProcessingDuration,
  orderCancellationCounter,
  cleanerOnlineGauge,
  cleanerAssignmentCounter,
  paymentAttemptsCounter,
  paymentFailuresCounter,
  paymentDuration,
  smsSendAttemptsCounter,
  smsSendFailuresCounter,
  smsDeliveryDuration,
  userRegistrationCounter,
  userLoginCounter,
  activeUsersGauge,
  databaseQueryDuration,
  redisCacheHitsCounter,
  redisCacheMissesCounter,
  websocketConnectionsGauge,
  websocketMessagesCounter,
  taskQueueLengthGauge,
  taskProcessingDuration,
  taskFailureCounter,
  externalApiCallCounter,
  externalApiCallDuration,
} from './prometheus.config'

@Injectable()
export class MonitoringService implements OnModuleInit, OnModuleDestroy {
  // HTTP Metrics
  private httpRequestCounterMetric: Counter<string>
  private httpRequestDurationHistogramMetric: Histogram<string>
  private httpRequestSizeSummaryMetric: Summary<string>
  private httpResponseSizeSummaryMetric: Summary<string>
  private activeConnectionsGaugeMetric: Gauge<string>

  // Business Metrics
  private orderCreationCounterMetric: Counter<string>
  private orderCreationFailureCounterMetric: Counter<string>
  private pendingOrdersGaugeMetric: Gauge<string>
  private orderProcessingDurationHistogramMetric: Histogram<string>
  private orderCancellationCounterMetric: Counter<string>
  private cleanerOnlineGaugeMetric: Gauge<string>
  private cleanerAssignmentCounterMetric: Counter<string>
  private paymentAttemptsCounterMetric: Counter<string>
  private paymentFailuresCounterMetric: Counter<string>
  private paymentDurationHistogramMetric: Histogram<string>
  private smsSendAttemptsCounterMetric: Counter<string>
  private smsSendFailuresCounterMetric: Counter<string>
  private smsDeliveryDurationHistogramMetric: Histogram<string>
  private userRegistrationCounterMetric: Counter<string>
  private userLoginCounterMetric: Counter<string>
  private activeUsersGaugeMetric: Gauge<string>

  // Database Metrics
  private databaseQueryDurationHistogramMetric: Histogram<string>
  private redisCacheHitsCounterMetric: Counter<string>
  private redisCacheMissesCounterMetric: Counter<string>

  // WebSocket Metrics
  private websocketConnectionsGaugeMetric: Gauge<string>
  private websocketMessagesCounterMetric: Counter<string>

  // System Metrics
  private taskQueueLengthGaugeMetric: Gauge<string>
  private taskProcessingDurationHistogramMetric: Histogram<string>
  private taskFailureCounterMetric: Counter<string>
  private externalApiCallCounterMetric: Counter<string>
  private externalApiCallDurationHistogramMetric: Histogram<string>

  constructor(
    @InjectMetric('http_requests_total') httpRequestCounterMetric: Counter<string>,
    @InjectMetric('http_request_duration_seconds') httpRequestDurationHistogramMetric: Histogram<string>,
    @InjectMetric('http_request_size_bytes') httpRequestSizeSummaryMetric: Summary<string>,
    @InjectMetric('http_response_size_bytes') httpResponseSizeSummaryMetric: Summary<string>,
    @InjectMetric('active_connections') activeConnectionsGaugeMetric: Gauge<string>,

    @InjectMetric('order_creation_total') orderCreationCounterMetric: Counter<string>,
    @InjectMetric('order_creation_failures_total') orderCreationFailureCounterMetric: Counter<string>,
    @InjectMetric('pending_orders_count') pendingOrdersGaugeMetric: Gauge<string>,
    @InjectMetric('order_processing_duration_seconds') orderProcessingDurationHistogramMetric: Histogram<string>,
    @InjectMetric('order_cancellation_total') orderCancellationCounterMetric: Counter<string>,
    @InjectMetric('cleaner_online_count') cleanerOnlineGaugeMetric: Gauge<string>,
    @InjectMetric('cleaner_assignment_total') cleanerAssignmentCounterMetric: Counter<string>,

    @InjectMetric('payment_attempts_total') paymentAttemptsCounterMetric: Counter<string>,
    @InjectMetric('payment_failures_total') paymentFailuresCounterMetric: Counter<string>,
    @InjectMetric('payment_processing_duration_seconds') paymentDurationHistogramMetric: Histogram<string>,

    @InjectMetric('sms_send_attempts_total') smsSendAttemptsCounterMetric: Counter<string>,
    @InjectMetric('sms_send_failures_total') smsSendFailuresCounterMetric: Counter<string>,
    @InjectMetric('sms_delivery_duration_seconds') smsDeliveryDurationHistogramMetric: Histogram<string>,

    @InjectMetric('user_registration_total') userRegistrationCounterMetric: Counter<string>,
    @InjectMetric('user_login_total') userLoginCounterMetric: Counter<string>,
    @InjectMetric('active_users_count') activeUsersGaugeMetric: Gauge<string>,

    @InjectMetric('database_query_duration_seconds') databaseQueryDurationHistogramMetric: Histogram<string>,
    @InjectMetric('redis_cache_hits_total') redisCacheHitsCounterMetric: Counter<string>,
    @InjectMetric('redis_cache_misses_total') redisCacheMissesCounterMetric: Counter<string>,

    @InjectMetric('websocket_connections') websocketConnectionsGaugeMetric: Gauge<string>,
    @InjectMetric('websocket_messages_total') websocketMessagesCounterMetric: Counter<string>,

    @InjectMetric('task_queue_length') taskQueueLengthGaugeMetric: Gauge<string>,
    @InjectMetric('task_processing_duration_seconds') taskProcessingDurationHistogramMetric: Histogram<string>,
    @InjectMetric('task_failures_total') taskFailureCounterMetric: Counter<string>,

    @InjectMetric('external_api_calls_total') externalApiCallCounterMetric: Counter<string>,
    @InjectMetric('external_api_call_duration_seconds') externalApiCallDurationHistogramMetric: Histogram<string>,
  ) {
    this.httpRequestCounterMetric = httpRequestCounterMetric
    this.httpRequestDurationHistogramMetric = httpRequestDurationHistogramMetric
    this.httpRequestSizeSummaryMetric = httpRequestSizeSummaryMetric
    this.httpResponseSizeSummaryMetric = httpResponseSizeSummaryMetric
    this.activeConnectionsGaugeMetric = activeConnectionsGaugeMetric

    this.orderCreationCounterMetric = orderCreationCounterMetric
    this.orderCreationFailureCounterMetric = orderCreationFailureCounterMetric
    this.pendingOrdersGaugeMetric = pendingOrdersGaugeMetric
    this.orderProcessingDurationHistogramMetric = orderProcessingDurationHistogramMetric
    this.orderCancellationCounterMetric = orderCancellationCounterMetric
    this.cleanerOnlineGaugeMetric = cleanerOnlineGaugeMetric
    this.cleanerAssignmentCounterMetric = cleanerAssignmentCounterMetric

    this.paymentAttemptsCounterMetric = paymentAttemptsCounterMetric
    this.paymentFailuresCounterMetric = paymentFailuresCounterMetric
    this.paymentDurationHistogramMetric = paymentDurationHistogramMetric

    this.smsSendAttemptsCounterMetric = smsSendAttemptsCounterMetric
    this.smsSendFailuresCounterMetric = smsSendFailuresCounterMetric
    this.smsDeliveryDurationHistogramMetric = smsDeliveryDurationHistogramMetric

    this.userRegistrationCounterMetric = userRegistrationCounterMetric
    this.userLoginCounterMetric = userLoginCounterMetric
    this.activeUsersGaugeMetric = activeUsersGaugeMetric

    this.databaseQueryDurationHistogramMetric = databaseQueryDurationHistogramMetric
    this.redisCacheHitsCounterMetric = redisCacheHitsCounterMetric
    this.redisCacheMissesCounterMetric = redisCacheMissesCounterMetric

    this.websocketConnectionsGaugeMetric = websocketConnectionsGaugeMetric
    this.websocketMessagesCounterMetric = websocketMessagesCounterMetric

    this.taskQueueLengthGaugeMetric = taskQueueLengthGaugeMetric
    this.taskProcessingDurationHistogramMetric = taskProcessingDurationHistogramMetric
    this.taskFailureCounterMetric = taskFailureCounterMetric

    this.externalApiCallCounterMetric = externalApiCallCounterMetric
    this.externalApiCallDurationHistogramMetric = externalApiCallDurationHistogramMetric
  }

  onModuleInit() {
    // Initialize metrics
    this.activeConnectionsGaugeMetric.set({ type: 'websocket' }, 0)
    this.activeConnectionsGaugeMetric.set({ type: 'http' }, 0)
    this.websocketConnectionsGaugeMetric.set({ connection_type: 'total' }, 0)
  }

  onModuleDestroy() {
    // Reset metrics on shutdown
    this.activeConnectionsGaugeMetric.reset()
    this.websocketConnectionsGaugeMetric.reset()
    this.pendingOrdersGaugeMetric.reset()
  }

  // ==================== HTTP Metrics ====================
  incrementHttpRequest(method: string, route: string, statusCode: number) {
    this.httpRequestCounterMetric.inc({
      method,
      route,
      status_code: statusCode.toString(),
    })
  }

  recordHttpRequestDuration(method: string, route: string, statusCode: number, duration: number) {
    this.httpRequestDurationHistogramMetric.observe(
      {
        method,
        route,
        status_code: statusCode.toString(),
      },
      duration / 1000, // Convert to seconds
    )
  }

  recordHttpRequestSize(method: string, route: string, size: number) {
    this.httpRequestSizeSummaryMetric.observe({ method, route }, size)
  }

  recordHttpResponseSize(method: string, route: string, statusCode: number, size: number) {
    this.httpResponseSizeSummaryMetric.observe(
      {
        method,
        route,
        status_code: statusCode.toString(),
      },
      size,
    )
  }

  incrementActiveConnections(type: string) {
    this.activeConnectionsGaugeMetric.inc({ type })
  }

  decrementActiveConnections(type: string) {
    this.activeConnectionsGaugeMetric.dec({ type })
  }

  // ==================== Order Metrics ====================
  incrementOrderCreation(serviceType: string, status: string) {
    this.orderCreationCounterMetric.inc({ service_type: serviceType, status })
  }

  incrementOrderCreationFailure(reason: string) {
    this.orderCreationFailureCounterMetric.inc({ reason })
  }

  setPendingOrdersCount(serviceType: string, count: number) {
    this.pendingOrdersGaugeMetric.set({ service_type: serviceType }, count)
  }

  recordOrderProcessingDuration(orderType: string, status: string, duration: number) {
    this.orderProcessingDurationHistogramMetric.observe(
      { order_type: orderType, status },
      duration,
    )
  }

  incrementOrderCancellation(reason: string, userType: string) {
    this.orderCancellationCounterMetric.inc({ reason, user_type: userType })
  }

  // ==================== Cleaner Metrics ====================
  setCleanerOnlineCount(region: string, count: number) {
    this.cleanerOnlineGaugeMetric.set({ region }, count)
  }

  incrementCleanerAssignment(assignmentType: string) {
    this.cleanerAssignmentCounterMetric.inc({ assignment_type: assignmentType })
  }

  // ==================== Payment Metrics ====================
  incrementPaymentAttempts(paymentMethod: string) {
    this.paymentAttemptsCounterMetric.inc({ payment_method: paymentMethod })
  }

  incrementPaymentFailures(paymentMethod: string, errorType: string) {
    this.paymentFailuresCounterMetric.inc({ payment_method: paymentMethod, error_type: errorType })
  }

  recordPaymentDuration(paymentMethod: string, duration: number) {
    this.paymentDurationHistogramMetric.observe({ payment_method: paymentMethod }, duration)
  }

  // ==================== SMS Metrics ====================
  incrementSmsSendAttempts(template: string, phonePrefix: string) {
    this.smsSendAttemptsCounterMetric.inc({ template, phone_prefix: phonePrefix })
  }

  incrementSmsSendFailures(template: string, errorType: string) {
    this.smsSendFailuresCounterMetric.inc({ template, error_type: errorType })
  }

  recordSmsDeliveryDuration(template: string, duration: number) {
    this.smsDeliveryDurationHistogramMetric.observe({ template }, duration)
  }

  // ==================== User Metrics ====================
  incrementUserRegistration(registrationMethod: string) {
    this.userRegistrationCounterMetric.inc({ registration_method: registrationMethod })
  }

  incrementUserLogin(loginMethod: string) {
    this.userLoginCounterMetric.inc({ login_method: loginMethod })
  }

  setActiveUsersCount(timePeriod: string, count: number) {
    this.activeUsersGaugeMetric.set({ timePeriod }, count)
  }

  // ==================== Database Metrics ====================
  recordDatabaseQueryDuration(operation: string, table: string, duration: number) {
    this.databaseQueryDurationHistogramMetric.observe({ operation, table }, duration / 1000)
  }

  incrementRedisCacheHits(cacheKeyPattern: string) {
    this.redisCacheHitsCounterMetric.inc({ cache_key_pattern: cacheKeyPattern })
  }

  incrementRedisCacheMisses(cacheKeyPattern: string) {
    this.redisCacheMissesCounterMetric.inc({ cache_key_pattern: cacheKeyPattern })
  }

  // ==================== WebSocket Metrics ====================
  setWebsocketConnections(connectionType: string, count: number) {
    this.websocketConnectionsGaugeMetric.set({ connection_type: connectionType }, count)
  }

  incrementWebsocketMessages(direction: string, messageType: string) {
    this.websocketMessagesCounterMetric.inc({ direction, message_type: messageType })
  }

  // ==================== Task Metrics ====================
  setTaskQueueLength(queueName: string, length: number) {
    this.taskQueueLengthGaugeMetric.set({ queue_name: queueName }, length)
  }

  recordTaskProcessingDuration(taskType: string, status: string, duration: number) {
    this.taskProcessingDurationHistogramMetric.observe({ task_type: taskType, status }, duration)
  }

  incrementTaskFailure(taskType: string, failureReason: string) {
    this.taskFailureCounterMetric.inc({ task_type: taskType, failure_reason: failureReason })
  }

  // ==================== External API Metrics ====================
  incrementExternalApiCall(apiName: string, status: string) {
    this.externalApiCallCounterMetric.inc({ apiName, status })
  }

  recordExternalApiCallDuration(apiName: string, duration: number) {
    this.externalApiCallDurationHistogramMetric.observe({ apiName }, duration / 1000)
  }

  // ==================== Utility Methods ====================
  /**
   * 记录自定义指标
   */
  recordCustomMetric(name: string, value: number, labels?: Record<string, string>) {
    console.log(`Recording metric ${name}: ${value}`, labels)
  }

  /**
   * 获取所有指标
   */
  async getAllMetrics() {
    // This can be used to get current metric values
    return {
      pendingOrders: this.pendingOrdersGaugeMetric.get(),
      activeConnections: this.activeConnectionsGaugeMetric.get(),
      websocketConnections: this.websocketConnectionsGaugeMetric.get(),
    }
  }
}
