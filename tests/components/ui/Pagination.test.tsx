import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import Pagination from '@/components/ui/Pagination/Pagination'

// Mock i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'common.previous': 'Previous',
        'common.next': 'Next',
      }
      return translations[key] || key
    },
  }),
}))

describe('Pagination', () => {
  const defaultProps = {
    currentPage: 1,
    totalPages: 5,
    onPageChange: vi.fn(),
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('rendering', () => {
    it('should render pagination controls', () => {
      render(<Pagination {...defaultProps} />)

      expect(screen.getByText('Previous')).toBeInTheDocument()
      expect(screen.getByText('Next')).toBeInTheDocument()
    })

    it('should render page numbers', () => {
      render(<Pagination {...defaultProps} />)

      expect(screen.getByText('1')).toBeInTheDocument()
      expect(screen.getByText('2')).toBeInTheDocument()
      expect(screen.getByText('3')).toBeInTheDocument()
      expect(screen.getByText('4')).toBeInTheDocument()
      expect(screen.getByText('5')).toBeInTheDocument()
    })

    it('should not render when totalPages is 1', () => {
      const { container } = render(
        <Pagination currentPage={1} totalPages={1} onPageChange={vi.fn()} />
      )

      expect(container.firstChild).toBeNull()
    })

    it('should not render when totalPages is 0', () => {
      const { container } = render(
        <Pagination currentPage={1} totalPages={0} onPageChange={vi.fn()} />
      )

      expect(container.firstChild).toBeNull()
    })
  })

  describe('navigation', () => {
    it('should disable previous button on first page', () => {
      render(<Pagination {...defaultProps} currentPage={1} />)

      expect(screen.getByText('Previous').closest('button')).toBeDisabled()
    })

    it('should enable previous button when not on first page', () => {
      render(<Pagination {...defaultProps} currentPage={3} />)

      expect(screen.getByText('Previous').closest('button')).not.toBeDisabled()
    })

    it('should disable next button on last page', () => {
      render(<Pagination {...defaultProps} currentPage={5} />)

      expect(screen.getByText('Next').closest('button')).toBeDisabled()
    })

    it('should enable next button when not on last page', () => {
      render(<Pagination {...defaultProps} currentPage={3} />)

      expect(screen.getByText('Next').closest('button')).not.toBeDisabled()
    })
  })

  describe('page change callbacks', () => {
    it('should call onPageChange with previous page when Previous is clicked', () => {
      const onPageChange = vi.fn()
      render(
        <Pagination currentPage={3} totalPages={5} onPageChange={onPageChange} />
      )

      fireEvent.click(screen.getByText('Previous'))

      expect(onPageChange).toHaveBeenCalledWith(2)
    })

    it('should call onPageChange with next page when Next is clicked', () => {
      const onPageChange = vi.fn()
      render(
        <Pagination currentPage={3} totalPages={5} onPageChange={onPageChange} />
      )

      fireEvent.click(screen.getByText('Next'))

      expect(onPageChange).toHaveBeenCalledWith(4)
    })

    it('should call onPageChange with specific page when page number is clicked', () => {
      const onPageChange = vi.fn()
      render(
        <Pagination currentPage={1} totalPages={5} onPageChange={onPageChange} />
      )

      fireEvent.click(screen.getByText('3'))

      expect(onPageChange).toHaveBeenCalledWith(3)
    })
  })

  describe('ellipsis handling', () => {
    it('should show ellipsis when there are many pages', () => {
      render(
        <Pagination
          currentPage={5}
          totalPages={10}
          onPageChange={vi.fn()}
          maxVisible={5}
        />
      )

      // Should show ellipsis
      const ellipses = screen.getAllByText('...')
      expect(ellipses.length).toBeGreaterThan(0)
    })

    it('should not show ellipsis when pages fit within maxVisible', () => {
      render(
        <Pagination
          currentPage={2}
          totalPages={5}
          onPageChange={vi.fn()}
          maxVisible={5}
        />
      )

      expect(screen.queryByText('...')).not.toBeInTheDocument()
    })
  })

  describe('current page styling', () => {
    it('should highlight current page', () => {
      render(<Pagination {...defaultProps} currentPage={3} />)

      const currentPageButton = screen.getByText('3')
      expect(currentPageButton).toHaveClass('bg-gray-900')
      expect(currentPageButton).toHaveClass('text-white')
    })

    it('should not highlight other pages', () => {
      render(<Pagination {...defaultProps} currentPage={3} />)

      const otherPageButton = screen.getByText('1')
      expect(otherPageButton).not.toHaveClass('bg-gray-900')
    })
  })
})
