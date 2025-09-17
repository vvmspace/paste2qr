import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { NavigationMenu } from '../components/NavigationMenu'
import { Hero } from '../components/Hero'

// Mock the analytics
jest.mock('../lib/analytics', () => ({
  trackEvent: jest.fn()
}))

// Mock next/link
jest.mock('next/link', () => {
  return function MockLink({ href, children, onClick }: any) {
    return (
      <a href={href} onClick={onClick}>
        {children}
      </a>
    )
  }
})

describe('Navigation Tests', () => {
  beforeEach(() => {
    // Reset mocks
    ;(navigator.vibrate as jest.Mock)?.mockClear()
  })

  describe('NavigationMenu Component', () => {
    const mockOnClose = jest.fn()

    beforeEach(() => {
      mockOnClose.mockClear()
    })

    it('should render navigation menu when open', () => {
      render(<NavigationMenu isOpen={true} onClose={mockOnClose} />)
      
      expect(screen.getByText('Menu')).toBeInTheDocument()
      expect(screen.getByText('Home')).toBeInTheDocument()
      expect(screen.getByText('WiFi QR Generator')).toBeInTheDocument()
      expect(screen.getByText('Phone QR Code')).toBeInTheDocument()
      expect(screen.getByText('Email QR Code')).toBeInTheDocument()
      expect(screen.getByText('SMS QR Maker')).toBeInTheDocument()
      expect(screen.getByText('Contact QR Code')).toBeInTheDocument()
    })

    it('should not render when closed', () => {
      render(<NavigationMenu isOpen={false} onClose={mockOnClose} />)
      
      expect(screen.queryByText('Menu')).not.toBeInTheDocument()
    })

    it('should close menu when backdrop is clicked', () => {
      render(<NavigationMenu isOpen={true} onClose={mockOnClose} />)
      
      const backdrop = document.querySelector('.fixed.inset-0')
      fireEvent.click(backdrop!)
      
      expect(mockOnClose).toHaveBeenCalled()
    })

    it('should close menu when close button is clicked', () => {
      render(<NavigationMenu isOpen={true} onClose={mockOnClose} />)
      
      const closeButton = screen.getByRole('button', { name: '' }) // Close button
      fireEvent.click(closeButton)
      
      expect(mockOnClose).toHaveBeenCalled()
    })

    it('should show correct icons for each navigation item', () => {
      render(<NavigationMenu isOpen={true} onClose={mockOnClose} />)
      
      expect(screen.getByText('🏠')).toBeInTheDocument() // Home
      expect(screen.getByText('📶')).toBeInTheDocument() // WiFi
      expect(screen.getByText('📞')).toBeInTheDocument() // Phone
      expect(screen.getByText('📧')).toBeInTheDocument() // Email
      expect(screen.getByText('💬')).toBeInTheDocument() // SMS
      expect(screen.getByText('👤')).toBeInTheDocument() // Contact
    })

    it('should provide haptic feedback when navigation item is clicked', () => {
      render(<NavigationMenu isOpen={true} onClose={mockOnClose} />)
      
      const homeLink = screen.getByText('Home')
      fireEvent.click(homeLink)
      
      expect(navigator.vibrate).toHaveBeenCalledWith(30)
      expect(mockOnClose).toHaveBeenCalled()
    })
  })

  describe('Hero Component with Navigation', () => {
    it('should open navigation menu when hamburger is clicked', () => {
      render(<Hero title="Test Title" />)
      
      // Find hamburger button by its class
      const hamburgerButton = document.querySelector('.p-2.rounded-xl.hover\\:bg-gray-100')
      fireEvent.click(hamburgerButton!)
      
      // Menu should be open
      expect(screen.getByText('Menu')).toBeInTheDocument()
    })

    it('should provide haptic feedback when hamburger is clicked', () => {
      render(<Hero title="Test Title" />)
      
      // Find hamburger button by its class
      const hamburgerButton = document.querySelector('.p-2.rounded-xl.hover\\:bg-gray-100')
      fireEvent.click(hamburgerButton!)
      
      expect(navigator.vibrate).toHaveBeenCalledWith(30)
    })
  })

  describe('Navigation Links', () => {
    it('should have correct href attributes', () => {
      render(<NavigationMenu isOpen={true} onClose={jest.fn()} />)
      
      const homeLink = screen.getByText('Home').closest('a')
      const wifiLink = screen.getByText('WiFi QR Generator').closest('a')
      const phoneLink = screen.getByText('Phone QR Code').closest('a')
      
      expect(homeLink).toHaveAttribute('href', '/')
      expect(wifiLink).toHaveAttribute('href', '/wifi-qr-code-generator')
      expect(phoneLink).toHaveAttribute('href', '/phone-number-qr-code')
    })
  })
})
