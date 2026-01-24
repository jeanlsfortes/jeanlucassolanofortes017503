import { useState, useEffect, useCallback } from 'react'
import { healthFacade } from '@/facades/health.facade'
import type { HealthStatus } from '@/api/services/health.service'

/**
 * Hook to access reactive health status
 * Integrates RxJS BehaviorSubject with React
 */
export function useHealthStatus() {
  const [status, setStatus] = useState<HealthStatus>(healthFacade.currentStatus)

  useEffect(() => {
    const subscription = healthFacade.status$.subscribe(setStatus)
    return () => subscription.unsubscribe()
  }, [])

  const checkLiveness = useCallback(async () => {
    return healthFacade.checkLiveness()
  }, [])

  const checkReadiness = useCallback(async () => {
    return healthFacade.checkReadiness()
  }, [])

  const checkAll = useCallback(async () => {
    return healthFacade.checkAll()
  }, [])

  const startPolling = useCallback((intervalMs = 30000) => {
    return healthFacade.startPolling(intervalMs)
  }, [])

  const stopPolling = useCallback(() => {
    healthFacade.stopPolling()
  }, [])

  const reset = useCallback(() => {
    healthFacade.reset()
  }, [])

  return {
    // Status
    liveness: status.liveness,
    readiness: status.readiness,
    lastCheck: status.lastCheck,
    isHealthy: status.liveness === 'healthy' && status.readiness === 'ready',
    isChecking: status.liveness === 'checking' || status.readiness === 'checking',

    // Actions
    checkLiveness,
    checkReadiness,
    checkAll,
    startPolling,
    stopPolling,
    reset,
  }
}
