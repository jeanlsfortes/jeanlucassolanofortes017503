import { useState, useEffect } from 'react'
import { healthService, type HealthStatus } from '@/api/services/health.service'

interface HealthCheckProps {
  /** Polling interval in milliseconds (default: 30000) */
  pollingInterval?: number
  /** Show component only in development mode */
  devOnly?: boolean
}

const HealthCheck = ({ pollingInterval = 30000, devOnly = true }: HealthCheckProps) => {
  const [status, setStatus] = useState<HealthStatus>(healthService.getCurrentStatus())
  const [isVisible, setIsVisible] = useState(true)

  // Don't render in production if devOnly is true
  if (devOnly && import.meta.env.PROD) {
    return null
  }

  useEffect(() => {
    // Subscribe to health status changes
    const subscription = healthService.getStatus$().subscribe(setStatus)

    // Start polling
    const stopPolling = healthService.startPolling(pollingInterval)

    return () => {
      subscription.unsubscribe()
      stopPolling()
    }
  }, [pollingInterval])

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-4 right-4 p-2 bg-gray-800 text-white rounded-full shadow-lg hover:bg-gray-700 transition-colors"
        title="Show Health Status"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      </button>
    )
  }

  return (
    <div className="fixed bottom-4 right-4 flex items-center gap-2 bg-gray-900 rounded-lg p-2 shadow-lg">
      {/* Liveness Badge */}
      <div
        className={`px-3 py-1 rounded text-xs font-semibold ${
          status.liveness === 'healthy'
            ? 'bg-green-500 text-white'
            : status.liveness === 'checking'
              ? 'bg-yellow-500 text-white'
              : 'bg-red-500 text-white'
        }`}
        title={`Liveness: ${status.liveness}`}
      >
        <span className="flex items-center gap-1">
          <span className={`w-2 h-2 rounded-full ${
            status.liveness === 'healthy' ? 'bg-green-200' :
            status.liveness === 'checking' ? 'bg-yellow-200 animate-pulse' :
            'bg-red-200'
          }`} />
          Live
        </span>
      </div>

      {/* Readiness Badge */}
      <div
        className={`px-3 py-1 rounded text-xs font-semibold ${
          status.readiness === 'ready'
            ? 'bg-green-500 text-white'
            : status.readiness === 'checking'
              ? 'bg-yellow-500 text-white'
              : 'bg-red-500 text-white'
        }`}
        title={`Readiness: ${status.readiness}`}
      >
        <span className="flex items-center gap-1">
          <span className={`w-2 h-2 rounded-full ${
            status.readiness === 'ready' ? 'bg-green-200' :
            status.readiness === 'checking' ? 'bg-yellow-200 animate-pulse' :
            'bg-red-200'
          }`} />
          Ready
        </span>
      </div>

      {/* Last Check Time */}
      {status.lastCheck && (
        <span className="text-xs text-gray-400 hidden sm:block">
          {status.lastCheck.toLocaleTimeString()}
        </span>
      )}

      {/* Close Button */}
      <button
        onClick={() => setIsVisible(false)}
        className="p-1 text-gray-400 hover:text-white transition-colors"
        title="Hide Health Status"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  )
}

export default HealthCheck
