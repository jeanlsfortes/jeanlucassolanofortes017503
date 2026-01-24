import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import HealthCheck from '@/components/shared/HealthCheck/HealthCheck'
import { healthService } from '@/api/services/health.service'
import { BehaviorSubject } from 'rxjs'
import type { HealthStatus } from '@/api/services/health.service'

// Create a mock BehaviorSubject for testing
const createMockStatus$ = (initialStatus: HealthStatus) => {
  return new BehaviorSubject(initialStatus)
}

vi.mock('@/api/services/health.service', () => ({
  healthService: {
    getStatus$: vi.fn(),
    getCurrentStatus: vi.fn(),
    startPolling: vi.fn(),
    stopPolling: vi.fn(),
  },
}))

describe('HealthCheck', () => {
  let mockStatus$: BehaviorSubject<HealthStatus>

  const defaultStatus: HealthStatus = {
    liveness: 'checking',
    readiness: 'checking',
    lastCheck: null,
  }

  const healthyStatus: HealthStatus = {
    liveness: 'healthy',
    readiness: 'ready',
    lastCheck: new Date(),
  }

  const unhealthyStatus: HealthStatus = {
    liveness: 'unhealthy',
    readiness: 'not-ready',
    lastCheck: new Date(),
  }

  beforeEach(() => {
    mockStatus$ = createMockStatus$(defaultStatus)
    vi.mocked(healthService.getStatus$).mockReturnValue(mockStatus$.asObservable())
    vi.mocked(healthService.getCurrentStatus).mockReturnValue(defaultStatus)
    vi.mocked(healthService.startPolling).mockReturnValue(vi.fn())
  })

  afterEach(() => {
    vi.clearAllMocks()
    mockStatus$.complete()
  })

  describe('rendering in development', () => {
    beforeEach(() => {
      // Mock development environment
      vi.stubGlobal('import', { meta: { env: { PROD: false } } })
    })

    it('should render health status badges', () => {
      render(<HealthCheck devOnly={false} />)

      expect(screen.getByText('Live')).toBeInTheDocument()
      expect(screen.getByText('Ready')).toBeInTheDocument()
    })

    it('should show checking status with yellow color', () => {
      render(<HealthCheck devOnly={false} />)

      const liveBadge = screen.getByTitle('Liveness: checking')
      expect(liveBadge).toHaveClass('bg-yellow-500')
    })

    it('should show healthy status with green color', async () => {
      vi.mocked(healthService.getCurrentStatus).mockReturnValue(healthyStatus)
      mockStatus$ = createMockStatus$(healthyStatus)
      vi.mocked(healthService.getStatus$).mockReturnValue(mockStatus$.asObservable())

      render(<HealthCheck devOnly={false} />)

      const liveBadge = screen.getByTitle('Liveness: healthy')
      expect(liveBadge).toHaveClass('bg-green-500')
    })

    it('should show unhealthy status with red color', () => {
      vi.mocked(healthService.getCurrentStatus).mockReturnValue(unhealthyStatus)
      mockStatus$ = createMockStatus$(unhealthyStatus)
      vi.mocked(healthService.getStatus$).mockReturnValue(mockStatus$.asObservable())

      render(<HealthCheck devOnly={false} />)

      const liveBadge = screen.getByTitle('Liveness: unhealthy')
      expect(liveBadge).toHaveClass('bg-red-500')
    })
  })

  describe('visibility toggle', () => {
    it('should hide when close button is clicked', () => {
      render(<HealthCheck devOnly={false} />)

      const closeButton = screen.getByTitle('Hide Health Status')
      fireEvent.click(closeButton)

      expect(screen.queryByText('Live')).not.toBeInTheDocument()
      expect(screen.queryByText('Ready')).not.toBeInTheDocument()
    })

    it('should show again when toggle button is clicked', () => {
      render(<HealthCheck devOnly={false} />)

      // Hide it
      const closeButton = screen.getByTitle('Hide Health Status')
      fireEvent.click(closeButton)

      // Show it again
      const showButton = screen.getByTitle('Show Health Status')
      fireEvent.click(showButton)

      expect(screen.getByText('Live')).toBeInTheDocument()
      expect(screen.getByText('Ready')).toBeInTheDocument()
    })
  })

  describe('polling behavior', () => {
    it('should start polling on mount', () => {
      render(<HealthCheck devOnly={false} pollingInterval={5000} />)

      expect(healthService.startPolling).toHaveBeenCalledWith(5000)
    })

    it('should use default polling interval', () => {
      render(<HealthCheck devOnly={false} />)

      expect(healthService.startPolling).toHaveBeenCalledWith(30000)
    })

    it('should cleanup on unmount', () => {
      const stopPollingMock = vi.fn()
      vi.mocked(healthService.startPolling).mockReturnValue(stopPollingMock)

      const { unmount } = render(<HealthCheck devOnly={false} />)
      unmount()

      expect(stopPollingMock).toHaveBeenCalled()
    })
  })

  describe('last check time', () => {
    it('should display last check time when available', () => {
      const checkTime = new Date()
      const statusWithTime = { ...healthyStatus, lastCheck: checkTime }
      vi.mocked(healthService.getCurrentStatus).mockReturnValue(statusWithTime)
      mockStatus$ = createMockStatus$(statusWithTime)
      vi.mocked(healthService.getStatus$).mockReturnValue(mockStatus$.asObservable())

      render(<HealthCheck devOnly={false} />)

      // The time should be displayed
      expect(
        screen.getByText(checkTime.toLocaleTimeString())
      ).toBeInTheDocument()
    })

    it('should not display time when lastCheck is null', () => {
      render(<HealthCheck devOnly={false} />)

      // No time element should be present with null lastCheck
      const timeElements = screen.queryAllByText(/^\d{1,2}:\d{2}/)
      expect(timeElements.length).toBe(0)
    })
  })
})
