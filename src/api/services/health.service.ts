import { BehaviorSubject, Observable, interval, Subscription } from 'rxjs'
import apiClient from '@/@core/interceptors/axios.interceptor'
import { API_CONFIG } from '@/@core/configs/api.config'

export interface HealthStatus {
  liveness: 'healthy' | 'unhealthy' | 'checking'
  readiness: 'ready' | 'not-ready' | 'checking'
  lastCheck: Date | null
}

const initialStatus: HealthStatus = {
  liveness: 'checking',
  readiness: 'checking',
  lastCheck: null,
}

class HealthService {
  private status$ = new BehaviorSubject<HealthStatus>(initialStatus)
  private pollingSubscription: Subscription | null = null

  /**
   * Get health status as Observable (reactive)
   */
  getStatus$(): Observable<HealthStatus> {
    return this.status$.asObservable()
  }

  /**
   * Get current health status (snapshot)
   */
  getCurrentStatus(): HealthStatus {
    return this.status$.getValue()
  }

  /**
   * Single health check - uses /health (Kubernetes-style APIs often use /health/live and /health/ready,
   * but this API uses /health)
   */
  private async checkHealth(): Promise<boolean> {
    try {
      const response = await apiClient.get(API_CONFIG.ENDPOINTS.HEALTH.BASE)
      return response.status === 200
    } catch {
      return false
    }
  }

  /**
   * Check liveness endpoint
   */
  async checkLiveness(): Promise<boolean> {
    const isHealthy = await this.checkHealth()
    this.updateStatus({ liveness: isHealthy ? 'healthy' : 'unhealthy' })
    return isHealthy
  }

  /**
   * Check readiness endpoint
   */
  async checkReadiness(): Promise<boolean> {
    const isReady = await this.checkHealth()
    this.updateStatus({ readiness: isReady ? 'ready' : 'not-ready' })
    return isReady
  }

  /**
   * Check both liveness and readiness (single request to /health)
   */
  async checkAll(): Promise<{ liveness: boolean; readiness: boolean }> {
    const isHealthy = await this.checkHealth()
    this.updateStatus({
      liveness: isHealthy ? 'healthy' : 'unhealthy',
      readiness: isHealthy ? 'ready' : 'not-ready',
      lastCheck: new Date(),
    })
    return { liveness: isHealthy, readiness: isHealthy }
  }

  /**
   * Start polling health checks at specified interval
   * @param intervalMs - Polling interval in milliseconds (default: 30000)
   * @returns Cleanup function to stop polling
   */
  startPolling(intervalMs = 30000): () => void {
    // Stop any existing polling
    this.stopPolling()

    // Initial check
    this.checkAll()

    // Set up interval polling
    this.pollingSubscription = interval(intervalMs).subscribe(() => {
      this.checkAll()
    })

    return () => this.stopPolling()
  }

  /**
   * Stop polling health checks
   */
  stopPolling(): void {
    if (this.pollingSubscription) {
      this.pollingSubscription.unsubscribe()
      this.pollingSubscription = null
    }
  }

  /**
   * Reset status to initial state
   */
  reset(): void {
    this.stopPolling()
    this.status$.next(initialStatus)
  }

  private updateStatus(partial: Partial<HealthStatus>): void {
    this.status$.next({
      ...this.status$.getValue(),
      ...partial,
    })
  }
}

export const healthService = new HealthService()
