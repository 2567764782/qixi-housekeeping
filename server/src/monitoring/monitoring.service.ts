import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common'
import { InjectMetric } from '@willsoto/nestjs-prometheus'
import { Counter, Histogram, Gauge } from 'prom-client'

@Injectable()
export class MonitoringService implements OnModuleInit, OnModuleDestroy {
  private requestCounter: Counter<string>
  private requestDuration: Histogram<string>
  private activeConnections: Gauge<string>

  constructor(
    @InjectMetric('http_requests_total') requestCounter: Counter<string>,
    @InjectMetric('http_request_duration_seconds') requestDuration: Histogram<string>,
    @InjectMetric('active_connections') activeConnections: Gauge<string>,
  ) {
    this.requestCounter = requestCounter
    this.requestDuration = requestDuration
    this.activeConnections = activeConnections
  }

  onModuleInit() {
    // Initialize metrics
    this.activeConnections.set({ type: 'websocket' }, 0)
    this.activeConnections.set({ type: 'http' }, 0)
  }

  onModuleDestroy() {
    // Reset metrics on shutdown
    this.activeConnections.reset()
  }

  /**
   * Increment HTTP request counter
   */
  incrementHttpRequest(method: string, route: string, statusCode: number) {
    this.requestCounter.inc({
      method,
      route,
      status_code: statusCode.toString(),
    })
  }

  /**
   * Record HTTP request duration
   */
  recordHttpRequestDuration(method: string, route: string, statusCode: number, duration: number) {
    this.requestDuration.observe({
      method,
      route,
      status_code: statusCode.toString(),
    }, duration / 1000) // Convert to seconds
  }

  /**
   * Increment active connections
   */
  incrementActiveConnections(type: string) {
    this.activeConnections.inc({ type })
  }

  /**
   * Decrement active connections
   */
  decrementActiveConnections(type: string) {
    this.activeConnections.dec({ type })
  }

  /**
   * Record custom metric
   */
  recordCustomMetric(name: string, value: number, labels?: Record<string, string>) {
    // This can be extended to support dynamic metrics
    console.log(`Recording metric ${name}: ${value}`, labels)
  }
}
