export interface PrometheusAlert {
  status: string
  labels: Record<string, string>
  annotations: Record<string, string>
  startsAt: string
  endsAt?: string
  generatorURL?: string
  fingerprint: string
}

export interface PrometheusAlertsResponse {
  status: string
  data: {
    alerts: PrometheusAlert[]
  }
}
