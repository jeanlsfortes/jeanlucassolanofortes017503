import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import Input from '@/components/ui/Input/Input'

describe('Input', () => {
  describe('rendering', () => {
    it('should render input element', () => {
      render(<Input />)

      expect(screen.getByRole('textbox')).toBeInTheDocument()
    })

    it('should render with label when provided', () => {
      render(<Input label="Email" />)

      expect(screen.getByText('Email')).toBeInTheDocument()
    })

    it('should not render label when not provided', () => {
      render(<Input />)

      expect(screen.queryByText('label')).not.toBeInTheDocument()
    })

    it('should render with placeholder', () => {
      render(<Input placeholder="Enter your email" />)

      expect(screen.getByPlaceholderText('Enter your email')).toBeInTheDocument()
    })
  })

  describe('error state', () => {
    it('should render error message when provided', () => {
      render(<Input error="This field is required" />)

      expect(screen.getByText('This field is required')).toBeInTheDocument()
    })

    it('should have error styles when error is provided', () => {
      render(<Input error="Error" />)

      const input = screen.getByRole('textbox')
      expect(input).toHaveClass('border-red-500')
    })

    it('should not show error message when not provided', () => {
      render(<Input />)

      expect(screen.queryByRole('paragraph')).not.toBeInTheDocument()
    })
  })

  describe('interactions', () => {
    it('should call onChange when value changes', () => {
      const handleChange = vi.fn()
      render(<Input onChange={handleChange} />)

      fireEvent.change(screen.getByRole('textbox'), { target: { value: 'test' } })

      expect(handleChange).toHaveBeenCalled()
    })

    it('should update value on change', () => {
      render(<Input defaultValue="" />)

      const input = screen.getByRole('textbox')
      fireEvent.change(input, { target: { value: 'new value' } })

      expect(input).toHaveValue('new value')
    })

    it('should call onBlur when focus is lost', () => {
      const handleBlur = vi.fn()
      render(<Input onBlur={handleBlur} />)

      const input = screen.getByRole('textbox')
      fireEvent.blur(input)

      expect(handleBlur).toHaveBeenCalled()
    })

    it('should call onFocus when focused', () => {
      const handleFocus = vi.fn()
      render(<Input onFocus={handleFocus} />)

      const input = screen.getByRole('textbox')
      fireEvent.focus(input)

      expect(handleFocus).toHaveBeenCalled()
    })
  })

  describe('ref forwarding', () => {
    it('should forward ref to input element', () => {
      const ref = vi.fn()
      render(<Input ref={ref} />)

      expect(ref).toHaveBeenCalled()
      expect(ref.mock.calls[0][0]).toBeInstanceOf(HTMLInputElement)
    })
  })

  describe('custom props', () => {
    it('should apply custom className', () => {
      render(<Input className="custom-input" />)

      const input = screen.getByRole('textbox')
      expect(input).toHaveClass('custom-input')
    })

    it('should be disabled when disabled prop is true', () => {
      render(<Input disabled />)

      expect(screen.getByRole('textbox')).toBeDisabled()
    })

    it('should accept different input types', () => {
      render(<Input type="email" />)

      expect(screen.getByRole('textbox')).toHaveAttribute('type', 'email')
    })
  })
})
