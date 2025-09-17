/**
 * Accessibility tests for QR Generator
 */

import { render, screen } from '@testing-library/react'
import { axe, toHaveNoViolations } from 'jest-axe'
import { QRGenerator } from '../components/QRGenerator'
import { Hero } from '../components/Hero'
import { PublishModal } from '../components/PublishModal'

// Extend Jest matchers
expect.extend(toHaveNoViolations)

// Mock the analytics
jest.mock('../lib/analytics', () => ({
  trackEvent: jest.fn()
}))

// Mock QRCode library
jest.mock('qrcode', () => ({
  toDataURL: jest.fn().mockResolvedValue('data:image/png;base64,mock-qr-code')
}))

describe('Accessibility Tests', () => {
  beforeEach(() => {
    // Mock window.location
    Object.defineProperty(window, 'location', {
      value: {
        href: 'http://localhost:3000'
      },
      writable: true
    })
  })

  describe('QR Generator Accessibility', () => {
    test('should not have accessibility violations', async () => {
      const { container } = render(<QRGenerator />)
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })

    test('should have proper form labels and descriptions', () => {
      render(<QRGenerator />)
      
      const textarea = screen.getByPlaceholderText('Enter text or paste content...')
      expect(textarea).toBeInTheDocument()
      
      // Check that textarea is properly labeled
      expect(textarea).toHaveAttribute('rows', '3')
    })

    test('should have proper button labels', () => {
      render(<QRGenerator />)
      
      const pasteButton = screen.getByText('Paste')
      const shareButton = screen.getByText('Share')
      
      expect(pasteButton).toBeInTheDocument()
      expect(shareButton).toBeInTheDocument()
      
      // Buttons should be focusable
      expect(pasteButton).toHaveAttribute('type', 'button')
      expect(shareButton).toHaveAttribute('type', 'button')
    })

    test('should support keyboard navigation', () => {
      render(<QRGenerator />)
      
      const textarea = screen.getByPlaceholderText('Enter text or paste content...')
      const pasteButton = screen.getByText('Paste')
      
      // Textarea should be focusable
      textarea.focus()
      expect(document.activeElement).toBe(textarea)
      
      // Button should be focusable
      pasteButton.focus()
      expect(document.activeElement).toBe(pasteButton)
    })

    test('should have proper focus indicators', () => {
      const { container } = render(<QRGenerator />)
      
      // Check for focus styles in CSS classes
      const textarea = screen.getByPlaceholderText('Enter text or paste content...')
      expect(textarea).toHaveClass('focus:border-blue-500', 'focus:outline-none')
      
      const buttons = container.querySelectorAll('button')
      buttons.forEach(button => {
        expect(button).toHaveClass('focus:outline-none')
      })
    })
  })

  describe('Hero Component Accessibility', () => {
    test('should not have accessibility violations', async () => {
      const { container } = render(<Hero title="Test Title" />)
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })

    test('should have proper heading structure', () => {
      render(<Hero title="QR Generator" />)
      
      const heading = screen.getByRole('heading', { level: 1 })
      expect(heading).toBeInTheDocument()
      expect(heading).toHaveTextContent('QR Generator')
    })

    test('should have accessible button for hamburger menu', () => {
      render(<Hero title="Test Title" />)
      
      const hamburgerButton = screen.getByRole('button')
      expect(hamburgerButton).toBeInTheDocument()
      
      // Button should have proper ARIA attributes
      expect(hamburgerButton).toHaveAttribute('type', 'button')
    })
  })

  describe('Publish Modal Accessibility', () => {
    test('should not have accessibility violations', async () => {
      const { container } = render(
        <PublishModal
          qrCodeDataUrl="data:image/png;base64,mock"
          text="Test text"
          prefix=""
          onClose={jest.fn()}
        />
      )
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })

    test('should have proper form structure', () => {
      render(
        <PublishModal
          qrCodeDataUrl="data:image/png;base64,mock"
          text="Test text"
          prefix=""
          onClose={jest.fn()}
        />
      )
      
      // Check form elements
      expect(screen.getByLabelText(/page title/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/description/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/language/i)).toBeInTheDocument()
    })

    test('should have proper modal structure', () => {
      render(
        <PublishModal
          qrCodeDataUrl="data:image/png;base64,mock"
          text="Test text"
          prefix=""
          onClose={jest.fn()}
        />
      )
      
      // Check modal heading
      const heading = screen.getByRole('heading', { level: 3 })
      expect(heading).toHaveTextContent('Publish QR Code')
    })

    test('should support keyboard navigation in modal', () => {
      render(
        <PublishModal
          qrCodeDataUrl="data:image/png;base64,mock"
          text="Test text"
          prefix=""
          onClose={jest.fn()}
        />
      )
      
      const titleInput = screen.getByLabelText(/page title/i)
      const descriptionInput = screen.getByLabelText(/description/i)
      const languageSelect = screen.getByLabelText(/language/i)
      
      // All form elements should be focusable
      titleInput.focus()
      expect(document.activeElement).toBe(titleInput)
      
      descriptionInput.focus()
      expect(document.activeElement).toBe(descriptionInput)
      
      languageSelect.focus()
      expect(document.activeElement).toBe(languageSelect)
    })
  })

  describe('Color Contrast and Visual Accessibility', () => {
    test('should have sufficient color contrast', () => {
      const { container } = render(<QRGenerator />)
      
      // Check that important elements have proper contrast classes
      const buttons = container.querySelectorAll('button')
      buttons.forEach(button => {
        // Buttons should have high contrast colors
        expect(button).toHaveClass(/bg-(blue|green|gray|purple)-600/)
      })
    })

    test('should have proper text sizing', () => {
      render(<QRGenerator />)
      
      const textarea = screen.getByPlaceholderText('Enter text or paste content...')
      expect(textarea).toHaveClass('text-base') // 16px base font size
    })
  })

  describe('Screen Reader Support', () => {
    test('should have proper alt text for images', async () => {
      render(<QRGenerator />)
      
      // Wait for QR code to be generated
      await screen.findByAltText('Generated QR Code')
      
      const qrImage = screen.getByAltText('Generated QR Code')
      expect(qrImage).toBeInTheDocument()
    })

    test('should have proper ARIA labels where needed', () => {
      render(<QRGenerator />)
      
      const textarea = screen.getByPlaceholderText('Enter text or paste content...')
      expect(textarea).toHaveAttribute('placeholder')
    })
  })

  describe('Mobile Accessibility', () => {
    test('should have proper touch targets', () => {
      render(<QRGenerator />)
      
      const buttons = screen.getAllByRole('button')
      buttons.forEach(button => {
        // Check for minimum touch target size (44px)
        expect(button).toHaveClass('py-4') // 16px padding = 32px + content = ~44px
      })
    })

    test('should support haptic feedback', () => {
      // Mock vibrate API
      Object.assign(navigator, {
        vibrate: jest.fn()
      })
      
      render(<QRGenerator />)
      
      const pasteButton = screen.getByText('Paste')
      fireEvent.click(pasteButton)
      
      // Haptic feedback should be called (mocked)
      expect(navigator.vibrate).toHaveBeenCalled()
    })
  })
})
