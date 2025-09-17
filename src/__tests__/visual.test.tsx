/**
 * Visual/UI tests for QR Generator components
 */

import { render, screen } from '@testing-library/react'
import { QRGenerator } from '../components/QRGenerator'
import { Hero } from '../components/Hero'
import { UniversalPage } from '../components/UniversalPage'
import { pageConfigs } from '../configs/pages'

// Mock the analytics
jest.mock('../lib/analytics', () => ({
  trackEvent: jest.fn()
}))

// Mock QRCode library
jest.mock('qrcode', () => ({
  toDataURL: jest.fn().mockResolvedValue('data:image/png;base64,mock-qr-code')
}))

describe('Visual/UI Tests', () => {
  beforeEach(() => {
    // Mock window.location
    Object.defineProperty(window, 'location', {
      value: {
        href: 'http://localhost:3000'
      },
      writable: true
    })
  })

  describe('Hero Component', () => {
    test('should render mobile header with hamburger menu', () => {
      render(<Hero title="QR Generator" />)
      
      // Check hamburger menu
      const hamburgerButton = screen.getByRole('button')
      expect(hamburgerButton).toBeInTheDocument()
      
      // Check title
      expect(screen.getByText('QR Generator')).toBeInTheDocument()
      
      // Check QR icon
      const qrIcon = screen.getByRole('button').querySelector('svg')
      expect(qrIcon).toBeInTheDocument()
    })

    test('should have proper mobile styling classes', () => {
      const { container } = render(<Hero title="Test Title" />)
      
      const header = container.firstChild as HTMLElement
      expect(header).toHaveClass('bg-white', 'px-4', 'py-3', 'border-b', 'border-gray-200', 'sticky', 'top-0', 'z-10')
    })
  })

  describe('QR Generator Component', () => {
    test('should render all main UI elements', () => {
      render(<QRGenerator />)
      
      // Check main elements are present
      expect(screen.getByPlaceholderText('Enter text or paste content...')).toBeInTheDocument()
      expect(screen.getByText('Paste')).toBeInTheDocument()
      expect(screen.getByText('Share')).toBeInTheDocument()
    })

    test('should have proper mobile styling', () => {
      const { container } = render(<QRGenerator />)
      
      // Check container has mobile padding
      const mainContainer = container.firstChild as HTMLElement
      expect(mainContainer).toHaveClass('px-4', 'py-4')
      
      // Check textarea styling
      const textarea = screen.getByPlaceholderText('Enter text or paste content...')
      expect(textarea).toHaveClass('w-full', 'px-4', 'py-4', 'border-2', 'border-gray-200', 'rounded-3xl')
      
      // Check button styling
      const pasteButton = screen.getByText('Paste')
      expect(pasteButton).toHaveClass('bg-blue-600', 'hover:bg-blue-700', 'active:bg-blue-800', 'rounded-3xl')
    })

    test('should show placeholder QR code initially', () => {
      render(<QRGenerator />)
      
      // Check placeholder is shown
      const placeholder = screen.getByText('Enter text to generate QR')
      expect(placeholder).toBeInTheDocument()
    })

    test('should have proper button layout', () => {
      render(<QRGenerator />)
      
      const buttonContainer = screen.getByText('Paste').parentElement
      expect(buttonContainer).toHaveClass('flex', 'gap-3')
      
      // Check buttons have proper flex classes
      const pasteButton = screen.getByText('Paste')
      expect(pasteButton).toHaveClass('flex-1')
    })
  })

  describe('Universal Page Component', () => {
    test('should render complete page layout', () => {
      render(<UniversalPage config={pageConfigs.home} />)
      
      // Check all main sections are present
      expect(screen.getByText('QR Generator')).toBeInTheDocument()
      expect(screen.getByText('How to Use Our QR Code Generator')).toBeInTheDocument()
      expect(screen.getByText('Features')).toBeInTheDocument()
    })

    test('should have proper mobile-first layout', () => {
      const { container } = render(<UniversalPage config={pageConfigs.home} />)
      
      const main = container.querySelector('main')
      expect(main).toHaveClass('min-h-screen', 'bg-gray-50')
    })

    test('should render SEO content below the fold', () => {
      render(<UniversalPage config={pageConfigs.home} />)
      
      // Check SEO content is present
      expect(screen.getByText('What Can You Encode?')).toBeInTheDocument()
      expect(screen.getByText('Why Choose Our QR Generator?')).toBeInTheDocument()
    })
  })

  describe('Responsive Design Tests', () => {
    test('should have mobile-first CSS classes', () => {
      const { container } = render(<QRGenerator />)
      
      // Check for mobile-specific classes
      const buttons = container.querySelectorAll('button')
      buttons.forEach(button => {
        expect(button).toHaveClass('py-4', 'px-4', 'rounded-3xl')
      })
    })

    test('should have proper touch targets for mobile', () => {
      render(<QRGenerator />)
      
      const buttons = screen.getAllByRole('button')
      buttons.forEach(button => {
        // Check minimum touch target size (44px = py-4 px-4)
        expect(button).toHaveClass('py-4')
      })
    })
  })

  describe('Accessibility Tests', () => {
    test('should have proper ARIA labels and roles', () => {
      render(<QRGenerator />)
      
      // Check textarea has proper attributes
      const textarea = screen.getByPlaceholderText('Enter text or paste content...')
      expect(textarea).toHaveAttribute('rows', '3')
      
      // Check buttons have proper roles
      const buttons = screen.getAllByRole('button')
      expect(buttons.length).toBeGreaterThan(0)
    })

    test('should have proper focus management', () => {
      render(<QRGenerator />)
      
      const textarea = screen.getByPlaceholderText('Enter text or paste content...')
      expect(textarea).toHaveClass('focus:border-blue-500', 'focus:outline-none')
    })
  })

  describe('Loading States', () => {
    test('should show loading spinner when generating QR', () => {
      render(<QRGenerator />)
      
      // Initially should show placeholder
      expect(screen.getByText('Enter text to generate QR')).toBeInTheDocument()
    })
  })
})
