import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { healthFacade } from '@/facades/health.facade'
import { healthService } from '@/api/services/health.service'

vi.mock('@/api/services/health.service')

describe('HealthFacade', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('status$', () => {
    it('should return status observable from service', () => {
      const mockObservable = { subscribe: vi.fn() }
      vi.mocked(healthService.getStatus$).mockReturnValue(mockObservable as any)

      const result = healthFacade.status$

      expect(healthService.getStatus$).toHaveBeenCalled()
      expect(result).toBe(mockObservable)
    })
  })

  describe('currentStatus', () => {
    it('should return current status from service', () => {
      const mockStatus = {
        liveness: 'healthy' as const,
        readiness: 'ready' as const,
        lastCheck: new Date(),
      }
      vi.mocked(healthService.getCurrentStatus).mockReturnValue(mockStatus)

      const result = healthFacade.currentStatus

      expect(healthService.getCurrentStatus).toHaveBeenCalled()
      expect(result).toEqual(mockStatus)
    })
  })

  describe('checkLiveness', () => {
    it('should delegate to service', async () => {
      vi.mocked(healthService.checkLiveness).mockResolvedValue(true)

      const result = await healthFacade.checkLiveness()

      expect(healthService.checkLiveness).toHaveBeenCalled()
      expect(result).toBe(true)
    })

    it('should return false when unhealthy', async () => {
      vi.mocked(healthService.checkLiveness).mockResolvedValue(false)

      const result = await healthFacade.checkLiveness()

      expect(result).toBe(false)
    })
  })

  describe('checkReadiness', () => {
    it('should delegate to service', async () => {
      vi.mocked(healthService.checkReadiness).mockResolvedValue(true)

      const result = await healthFacade.checkReadiness()

      expect(healthService.checkReadiness).toHaveBeenCalled()
      expect(result).toBe(true)
    })

    it('should return false when not ready', async () => {
      vi.mocked(healthService.checkReadiness).mockResolvedValue(false)

      const result = await healthFacade.checkReadiness()

      expect(result).toBe(false)
    })
  })

  describe('checkAll', () => {
    it('should delegate to service', async () => {
      const mockResult = { liveness: true, readiness: true }
      vi.mocked(healthService.checkAll).mockResolvedValue(mockResult)

      const result = await healthFacade.checkAll()

      expect(healthService.checkAll).toHaveBeenCalled()
      expect(result).toEqual(mockResult)
    })

    it('should return partial results', async () => {
      const mockResult = { liveness: true, readiness: false }
      vi.mocked(healthService.checkAll).mockResolvedValue(mockResult)

      const result = await healthFacade.checkAll()

      expect(result).toEqual(mockResult)
    })
  })

  describe('startPolling', () => {
    it('should delegate to service with default interval', () => {
      const mockCleanup = vi.fn()
      vi.mocked(healthService.startPolling).mockReturnValue(mockCleanup)

      const result = healthFacade.startPolling()

      expect(healthService.startPolling).toHaveBeenCalledWith(30000)
      expect(result).toBe(mockCleanup)
    })

    it('should delegate to service with custom interval', () => {
      const mockCleanup = vi.fn()
      vi.mocked(healthService.startPolling).mockReturnValue(mockCleanup)

      const result = healthFacade.startPolling(5000)

      expect(healthService.startPolling).toHaveBeenCalledWith(5000)
      expect(result).toBe(mockCleanup)
    })
  })

  describe('stopPolling', () => {
    it('should delegate to service', () => {
      healthFacade.stopPolling()

      expect(healthService.stopPolling).toHaveBeenCalled()
    })
  })

  describe('reset', () => {
    it('should delegate to service', () => {
      healthFacade.reset()

      expect(healthService.reset).toHaveBeenCalled()
    })
  })
})
