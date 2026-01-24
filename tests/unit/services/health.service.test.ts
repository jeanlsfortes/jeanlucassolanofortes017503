import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { healthService } from '@/api/services/health.service'
import apiClient from '@/@core/interceptors/axios.interceptor'

vi.mock('@/@core/interceptors/axios.interceptor')

describe('HealthService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.useFakeTimers()
    healthService.reset()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  describe('getStatus$', () => {
    it('should return an observable', () => {
      const status$ = healthService.getStatus$()
      expect(status$.subscribe).toBeDefined()
    })

    it('should emit initial status', () => {
      let emittedStatus
      healthService.getStatus$().subscribe((status) => {
        emittedStatus = status
      })

      expect(emittedStatus).toEqual({
        liveness: 'checking',
        readiness: 'checking',
        lastCheck: null,
      })
    })
  })

  describe('getCurrentStatus', () => {
    it('should return current status snapshot', () => {
      const status = healthService.getCurrentStatus()

      expect(status).toEqual({
        liveness: 'checking',
        readiness: 'checking',
        lastCheck: null,
      })
    })
  })

  describe('checkLiveness', () => {
    it('should return true and update status when healthy', async () => {
      vi.mocked(apiClient.get).mockResolvedValueOnce({ status: 200 })

      const result = await healthService.checkLiveness()

      expect(result).toBe(true)
      expect(apiClient.get).toHaveBeenCalledWith('/health/live')
      expect(healthService.getCurrentStatus().liveness).toBe('healthy')
    })

    it('should return false and update status when unhealthy', async () => {
      vi.mocked(apiClient.get).mockRejectedValueOnce(new Error('Service unavailable'))

      const result = await healthService.checkLiveness()

      expect(result).toBe(false)
      expect(healthService.getCurrentStatus().liveness).toBe('unhealthy')
    })
  })

  describe('checkReadiness', () => {
    it('should return true and update status when ready', async () => {
      vi.mocked(apiClient.get).mockResolvedValueOnce({ status: 200 })

      const result = await healthService.checkReadiness()

      expect(result).toBe(true)
      expect(apiClient.get).toHaveBeenCalledWith('/health/ready')
      expect(healthService.getCurrentStatus().readiness).toBe('ready')
    })

    it('should return false and update status when not ready', async () => {
      vi.mocked(apiClient.get).mockRejectedValueOnce(new Error('Not ready'))

      const result = await healthService.checkReadiness()

      expect(result).toBe(false)
      expect(healthService.getCurrentStatus().readiness).toBe('not-ready')
    })
  })

  describe('checkAll', () => {
    it('should check both liveness and readiness', async () => {
      vi.mocked(apiClient.get)
        .mockResolvedValueOnce({ status: 200 }) // liveness
        .mockResolvedValueOnce({ status: 200 }) // readiness

      const result = await healthService.checkAll()

      expect(result).toEqual({ liveness: true, readiness: true })
      expect(healthService.getCurrentStatus().lastCheck).not.toBeNull()
    })

    it('should return partial results when one check fails', async () => {
      vi.mocked(apiClient.get)
        .mockResolvedValueOnce({ status: 200 }) // liveness
        .mockRejectedValueOnce(new Error('Not ready')) // readiness

      const result = await healthService.checkAll()

      expect(result).toEqual({ liveness: true, readiness: false })
    })
  })

  describe('startPolling', () => {
    it('should perform initial check', async () => {
      vi.mocked(apiClient.get).mockResolvedValue({ status: 200 })

      healthService.startPolling(30000)

      // Wait for initial check promises to resolve (flush microtask queue)
      await Promise.resolve()
      await Promise.resolve()

      expect(apiClient.get).toHaveBeenCalled()

      // Clean up to prevent infinite timer loop
      healthService.stopPolling()
    })

    it('should return cleanup function', () => {
      vi.mocked(apiClient.get).mockResolvedValue({ status: 200 })

      const cleanup = healthService.startPolling(30000)

      expect(typeof cleanup).toBe('function')
      cleanup()
    })
  })

  describe('stopPolling', () => {
    it('should stop polling', async () => {
      vi.mocked(apiClient.get).mockResolvedValue({ status: 200 })

      healthService.startPolling(1000)
      
      // Wait for initial check to complete
      await Promise.resolve()
      await Promise.resolve()
      
      vi.clearAllMocks()
      healthService.stopPolling()
      
      await vi.advanceTimersByTimeAsync(2000)

      // Should not have called after stopping
      expect(apiClient.get).not.toHaveBeenCalled()
    })
  })

  describe('reset', () => {
    it('should reset status to initial state', async () => {
      vi.mocked(apiClient.get).mockResolvedValue({ status: 200 })

      await healthService.checkAll()
      expect(healthService.getCurrentStatus().liveness).toBe('healthy')

      healthService.reset()

      expect(healthService.getCurrentStatus()).toEqual({
        liveness: 'checking',
        readiness: 'checking',
        lastCheck: null,
      })
    })
  })
})
