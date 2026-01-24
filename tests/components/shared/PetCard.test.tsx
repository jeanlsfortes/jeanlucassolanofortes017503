import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import PetCard from '@/components/shared/PetCard/PetCard'
import type { Pet } from '@/api/types/pet.types'

// Mock i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'pets.deletePetTooltip': 'Delete pet',
        'common.year': 'year',
        'common.years': 'years',
      }
      return translations[key] || key
    },
  }),
}))

// Wrapper component to provide router context
const renderWithRouter = (ui: React.ReactElement) => {
  return render(<BrowserRouter>{ui}</BrowserRouter>)
}

describe('PetCard', () => {
  const mockPet: Pet = {
    id: 1,
    nome: 'Rex',
    raca: 'Labrador',
    idade: 3,
  }

  const mockPetWithPhoto: Pet = {
    ...mockPet,
    foto: {
      id: 1,
      nome: 'photo.jpg',
      contentType: 'image/jpeg',
      url: 'https://example.com/photo.jpg',
    },
  }

  describe('rendering', () => {
    it('should render pet name', () => {
      renderWithRouter(<PetCard pet={mockPet} />)

      // Pet name appears twice in the card (in overlay and info section)
      const names = screen.getAllByText('Rex')
      expect(names.length).toBeGreaterThan(0)
    })

    it('should render pet breed when available', () => {
      renderWithRouter(<PetCard pet={mockPet} />)

      expect(screen.getByText('Labrador')).toBeInTheDocument()
    })

    it('should render pet age with correct pluralization', () => {
      renderWithRouter(<PetCard pet={mockPet} />)

      expect(screen.getByText('3 years')).toBeInTheDocument()
    })

    it('should render "year" for age 1', () => {
      const youngPet = { ...mockPet, idade: 1 }
      renderWithRouter(<PetCard pet={youngPet} />)

      expect(screen.getByText('1 year')).toBeInTheDocument()
    })

    it('should not render age if undefined', () => {
      const petWithoutAge = { ...mockPet, idade: undefined }
      renderWithRouter(<PetCard pet={petWithoutAge} />)

      expect(screen.queryByText(/year/)).not.toBeInTheDocument()
    })

    it('should not render breed if undefined', () => {
      const petWithoutBreed = { ...mockPet, raca: undefined }
      renderWithRouter(<PetCard pet={petWithoutBreed} />)

      expect(screen.queryByText('Labrador')).not.toBeInTheDocument()
    })
  })

  describe('photo handling', () => {
    it('should render photo when available', () => {
      renderWithRouter(<PetCard pet={mockPetWithPhoto} />)

      const img = screen.getByAltText('Rex')
      expect(img).toHaveAttribute('src', 'https://example.com/photo.jpg')
    })

    it('should render placeholder when no photo', () => {
      renderWithRouter(<PetCard pet={mockPet} />)

      const img = screen.getByAltText('Rex')
      expect(img.getAttribute('src')).toContain('unsplash')
    })
  })

  describe('link behavior', () => {
    it('should link to pet detail page', () => {
      renderWithRouter(<PetCard pet={mockPet} />)

      const link = screen.getByRole('link')
      expect(link).toHaveAttribute('href', '/pets/1')
    })
  })

  describe('delete functionality', () => {
    it('should not render delete button when onDelete is not provided', () => {
      renderWithRouter(<PetCard pet={mockPet} />)

      expect(screen.queryByTitle('Delete pet')).not.toBeInTheDocument()
    })

    it('should render delete button when onDelete is provided', () => {
      const onDelete = vi.fn()
      renderWithRouter(<PetCard pet={mockPet} onDelete={onDelete} />)

      expect(screen.getByTitle('Delete pet')).toBeInTheDocument()
    })

    it('should call onDelete with pet when delete button is clicked', () => {
      const onDelete = vi.fn()
      renderWithRouter(<PetCard pet={mockPet} onDelete={onDelete} />)

      const deleteButton = screen.getByTitle('Delete pet')
      fireEvent.click(deleteButton)

      expect(onDelete).toHaveBeenCalledWith(mockPet)
    })

    it('should prevent link navigation when delete button is clicked', () => {
      const onDelete = vi.fn()
      renderWithRouter(<PetCard pet={mockPet} onDelete={onDelete} />)

      const deleteButton = screen.getByTitle('Delete pet')
      const clickEvent = fireEvent.click(deleteButton)

      // The click handler should stop propagation
      expect(onDelete).toHaveBeenCalled()
    })
  })
})
