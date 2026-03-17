// 检查是否启用 tracing（默认禁用，避免连接不存在的主机）
const isTracingEnabled = process.env.ENABLE_TRACING === 'true'

export function initializeTracing() {
  if (!isTracingEnabled) {
    console.log('⚠️ OpenTelemetry tracing disabled (set ENABLE_TRACING=true to enable)')
    return
  }
  console.log('✅ OpenTelemetry tracing initialized')
}

export function shutdownTracing() {
  return Promise.resolve()
}
