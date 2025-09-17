import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { QRGenerator } from '../components/QRGenerator'
import { LanguageSwitcher } from '../components/LanguageSwitcher'
import QRCode from 'qrcode'

// Mock the analytics
jest.mock('../lib/analytics', () => ({
  trackEvent: jest.fn()
}))

// Mock QRCode library
jest.mock('qrcode', () => ({
  toDataURL: jest.fn().mockResolvedValue('data:image/png;base64,mock-qr-code'),
}))

describe('Simple Sandwich Tests - Core Functionality', () => {
  beforeEach(() => {
    // Mock window.location
    Object.defineProperty(window, 'location', {
      value: {
        href: 'http://localhost:3000'
      },
      writable: true
    })
    // Reset mocks
    ;(QRCode.toDataURL as jest.Mock).mockClear()
    ;(navigator.clipboard.readText as jest.Mock)?.mockClear()
    ;(navigator.vibrate as jest.Mock)?.mockClear()
  })

  describe('QR Generator Basic Functionality', () => {
    it('should render the QR generator interface', () => {
      render(<QRGenerator />)
      
      // Check all essential elements are present
      expect(screen.getByPlaceholderText('Paste any text from your clipboard to generate QR code...')).toBeInTheDocument()
      expect(screen.getByText('Paste to QR')).toBeInTheDocument()
    })

    it('should generate QR code when text is entered', async () => {
      render(<QRGenerator />)
      
      const textInput = screen.getByPlaceholderText('Paste any text from your clipboard to generate QR code...')
      fireEvent.change(textInput, { target: { value: 'Hello World' } })
      
      await waitFor(() => {
        expect(QRCode.toDataURL).toHaveBeenCalled()
        expect(screen.getByAltText('Generated QR Code')).toBeInTheDocument()
      })
    })

    it('should handle paste functionality', async () => {
      render(<QRGenerator />)
      
      const pasteButton = screen.getByText('Paste to QR')
      // Mock clipboard readText
      const mockReadText = jest.fn().mockResolvedValue('Pasted content')
      Object.defineProperty(navigator.clipboard, 'readText', {
        value: mockReadText,
        writable: true
      })
      
      fireEvent.click(pasteButton)
      
      await waitFor(() => {
        expect(mockReadText).toHaveBeenCalled()
        expect(navigator.vibrate).toHaveBeenCalledWith(50)
      })
    })

    it('should provide download functionality', async () => {
      render(<QRGenerator />)
      
      const textInput = screen.getByPlaceholderText('Paste any text from your clipboard to generate QR code...')
      fireEvent.change(textInput, { target: { value: 'Download test' } })
      
      await waitFor(() => {
        expect(screen.getByAltText('Generated QR Code')).toBeInTheDocument()
      })
      
      const downloadButton = screen.getByText('Download')
      fireEvent.click(downloadButton)
      
      expect(navigator.vibrate).toHaveBeenCalledWith(50)
    })
  })

  describe('Language Switcher Basic Functionality', () => {
    const mockOnLanguageChange = jest.fn()

    beforeEach(() => {
      mockOnLanguageChange.mockClear()
    })

    it('should render language switcher', () => {
      render(
        <LanguageSwitcher 
          currentLanguage="en" 
          onLanguageChange={mockOnLanguageChange} 
        />
      )
      
      expect(screen.getByText('English')).toBeInTheDocument()
      expect(screen.getByText('🇺🇸')).toBeInTheDocument()
    })

    it('should open language dropdown when clicked', () => {
      render(
        <LanguageSwitcher 
          currentLanguage="en" 
          onLanguageChange={mockOnLanguageChange} 
        />
      )
      
      const button = screen.getByText('English')
      fireEvent.click(button)
      
      expect(screen.getByText('Español')).toBeInTheDocument()
      expect(screen.getByText('中文')).toBeInTheDocument()
      expect(screen.getByText('Français')).toBeInTheDocument()
    })

    it('should change language when option is selected', () => {
      render(
        <LanguageSwitcher 
          currentLanguage="en" 
          onLanguageChange={mockOnLanguageChange} 
        />
      )
      
      const button = screen.getByText('English')
      fireEvent.click(button)
      
      const spanishOption = screen.getByText('Español')
      fireEvent.click(spanishOption)
      
      expect(mockOnLanguageChange).toHaveBeenCalledWith('es')
      expect(navigator.vibrate).toHaveBeenCalledWith(30)
    })

    it('should show correct flag for each language', () => {
      render(
        <LanguageSwitcher 
          currentLanguage="zh" 
          onLanguageChange={mockOnLanguageChange} 
        />
      )
      
      expect(screen.getByText('中文')).toBeInTheDocument()
      expect(screen.getByText('🇨🇳')).toBeInTheDocument()
    })
  })

  describe('Integration Tests', () => {
    it('should work together - QR generator with language switcher', () => {
      render(
        <div>
          <LanguageSwitcher currentLanguage="en" onLanguageChange={jest.fn()} />
          <QRGenerator />
        </div>
      )
      
      // Both components should render without conflicts
      expect(screen.getByText('English')).toBeInTheDocument()
      expect(screen.getByText('Paste to QR')).toBeInTheDocument()
      expect(screen.getByPlaceholderText('Paste any text from your clipboard to generate QR code...')).toBeInTheDocument()
    })
  })
})

