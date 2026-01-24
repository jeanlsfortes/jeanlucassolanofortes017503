import { useState, useEffect } from 'react'
import apiClient from '@/@core/interceptors/axios.interceptor'

interface HealthStatus {
  liveness: 'healthy' | 'unhealthy' | 'checking'
  readiness: 'ready' | 'not-ready' | 'checking'
}

const HealthCheck = () => {
  const [status, setStatus] = useState<HealthStatus>({
    liveness: 'checking',
    readiness: 'checking',
  })

  useEffect(() => {
    const checkHealth = async () => {
      try {
        // Check liveness
        const livenessResponse = await apiClient.get('/health/live')
        setStatus((prev) => ({
          ...prev,
          liveness: livenessResponse.status === 200 ? 'healthy' : 'unhealthy',
        }))
      } catch {
        setStatus((prev) => ({ ...prev, liveness: 'unhealthy' }))
      }

      try {
        // Check readiness
        const readinessResponse = await apiClient.get('/health/ready')
        setStatus((prev) => ({
          ...prev,
          readiness: readinessResponse.status === 200 ? 'ready' : 'not-ready',
        }))
      } catch {
        setStatus((prev) => ({ ...prev, readiness: 'not-ready' }))
      }
    }

    checkHealth()
    const interval = setInterval(checkHealth, 30000) // Check every 30 seconds

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="fixed bottom-4 right-4 flex gap-2">
      <div
        className={`px-3 py-1 rounded text-xs font-semibold ${
          status.liveness === 'healthy'
            ? 'bg-green-500 text-white'
            : status.liveness === 'checking'
            ? 'bg-yellow-500 text-white'
            : 'bg-red-500 text-white'
        }`}
        title="Liveness"
      >
        Live: {status.liveness}
      </div>
      <div
        className={`px-3 py-1 rounded text-xs font-semibold ${
          status.readiness === 'ready'
            ? 'bg-green-500 text-white'
            : status.readiness === 'checking'
            ? 'bg-yellow-500 text-white'
            : 'bg-red-500 text-white'
        }`}
        title="Readiness"
      >
        Ready: {status.readiness}
      </div>
    </div>
  )
}

export default HealthCheck

