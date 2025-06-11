import { NextResponse } from "next/server"

// Simple metrics store (in production, use Redis or proper metrics library)
let metrics = {
  http_requests_total: 0,
  http_request_duration_seconds: [] as number[],
  database_connections_active: 0,
  s3_operations_total: 0,
  errors_total: 0,
  uptime_seconds: 0,
}

// Initialize uptime tracking
const startTime = Date.now()

export async function GET() {
  try {
    // Update uptime
    metrics.uptime_seconds = Math.floor((Date.now() - startTime) / 1000)

    // Calculate average response time
    const avgResponseTime = metrics.http_request_duration_seconds.length > 0
      ? metrics.http_request_duration_seconds.reduce((a, b) => a + b, 0) / metrics.http_request_duration_seconds.length
      : 0

    // Generate Prometheus-style metrics
    const prometheusMetrics = `
# HELP http_requests_total Total number of HTTP requests
# TYPE http_requests_total counter
http_requests_total ${metrics.http_requests_total}

# HELP http_request_duration_seconds HTTP request duration in seconds
# TYPE http_request_duration_seconds histogram
http_request_duration_seconds_sum ${metrics.http_request_duration_seconds.reduce((a, b) => a + b, 0)}
http_request_duration_seconds_count ${metrics.http_request_duration_seconds.length}
http_request_duration_seconds_avg ${avgResponseTime}

# HELP database_connections_active Number of active database connections
# TYPE database_connections_active gauge
database_connections_active ${metrics.database_connections_active}

# HELP s3_operations_total Total number of S3 operations
# TYPE s3_operations_total counter
s3_operations_total ${metrics.s3_operations_total}

# HELP errors_total Total number of errors
# TYPE errors_total counter
errors_total ${metrics.errors_total}

# HELP uptime_seconds Application uptime in seconds
# TYPE uptime_seconds counter
uptime_seconds ${metrics.uptime_seconds}

# HELP nodejs_memory_usage_bytes Node.js memory usage
# TYPE nodejs_memory_usage_bytes gauge
nodejs_memory_usage_bytes ${process.memoryUsage().heapUsed}

# HELP nodejs_version_info Node.js version information
# TYPE nodejs_version_info gauge
nodejs_version_info{version="${process.version}"} 1
`.trim()

    // Increment request counter
    metrics.http_requests_total++

    return new NextResponse(prometheusMetrics, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
      },
    })
  } catch (error) {
    console.error("Error generating metrics:", error)
    metrics.errors_total++
    return NextResponse.json({ error: "Failed to generate metrics" }, { status: 500 })
  }
}

// Helper function to record metrics (can be called from other parts of the app)
export function recordMetric(type: string, value?: number) {
  switch (type) {
    case 'http_request':
      metrics.http_requests_total++
      break
    case 'http_duration':
      if (value !== undefined) {
        metrics.http_request_duration_seconds.push(value)
        // Keep only last 1000 measurements
        if (metrics.http_request_duration_seconds.length > 1000) {
          metrics.http_request_duration_seconds = metrics.http_request_duration_seconds.slice(-1000)
        }
      }
      break
    case 'database_connection':
      metrics.database_connections_active = value || 0
      break
    case 's3_operation':
      metrics.s3_operations_total++
      break
    case 'error':
      metrics.errors_total++
      break
  }
} 