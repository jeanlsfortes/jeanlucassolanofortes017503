import { Observable } from 'rxjs'
import { healthService, type HealthStatus } from '@/api/services/health.service'

/**
 * HealthFacade - Provides a unified interface for health check operations
 */
class HealthFacade {
  /**
   * Get health status as Observable (reactive)
   */
  get status$(): Observable<HealthStatus> {
    return healthService.getStatus$()
  }

  /**
   * Get current health status (snapshot)
   */
  get currentStatus(): HealthStatus {
    return healthService.getCurrentStatus()
  }

  /**
   * Check liveness
   */
  async checkLiveness(): Promise<boolean> {
    return healthService.checkLiveness()
  }

  /**
   * Check readiness
   */
  async checkReadiness(): Promise<boolean> {
    return healthService.checkReadiness()
  }

  /**
   * Check all health endpoints
   */
  async checkAll(): Promise<{ liveness: boolean; readiness: boolean }> {
    return healthService.checkAll()
  }

  /**
   * Start polling health checks
   */
  startPolling(intervalMs = 30000): () => void {
    return healthService.startPolling(intervalMs)
  }

  /**
   * Stop polling
   */
  stopPolling(): void {
    healthService.stopPolling()
  }

  /**
   * Reset health status
   */
  reset(): void {
    healthService.reset()
  }
}

export const healthFacade = new HealthFacade()
