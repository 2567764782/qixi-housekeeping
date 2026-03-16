import { NodeSDK } from '@opentelemetry/sdk-node'
import {
  SEMRESATTRS_SERVICE_NAME,
  SEMRESATTRS_SERVICE_VERSION,
  SEMRESATTRS_DEPLOYMENT_ENVIRONMENT,
} from '@opentelemetry/semantic-conventions'
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-grpc'
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node'

// 检查是否启用 tracing（默认禁用，避免连接不存在的主机）
const isTracingEnabled = process.env.ENABLE_TRACING === 'true'

const sdk = new NodeSDK({
  serviceName: 'cleaning-service-api',
  traceExporter: new OTLPTraceExporter({
    url: process.env.JAEGER_ENDPOINT || 'http://localhost:4317',
  }),
  instrumentations: [getNodeAutoInstrumentations()],
})

export function initializeTracing() {
  if (!isTracingEnabled) {
    console.log('⚠️ OpenTelemetry tracing disabled (set ENABLE_TRACING=true to enable)')
    return
  }
  try {
    sdk.start()
    console.log('✅ OpenTelemetry tracing initialized')
  } catch (error) {
    console.error('❌ Failed to initialize OpenTelemetry:', error)
  }
}

export function shutdownTracing() {
  return sdk.shutdown()
}

process.on('SIGTERM', () => {
  shutdownTracing().then(
    () => console.log('OpenTelemetry tracing shut down'),
    (error) => console.error('Error shutting down tracing', error),
  )
})
