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

describe('Sandwich Tests - Core Functionality', () => {
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

  describe('QR Generator Sandwich (Core Functionality)', () => {
    it('should render the complete QR generator interface', () => {
      render(<QRGenerator />)
      
      // Check all essential elements are present
      expect(screen.getByPlaceholderText('Enter text or paste content...')).toBeInTheDocument()
      expect(screen.getByText('Paste')).toBeInTheDocument()
      expect(screen.getByText('Share')).toBeInTheDocument()
      expect(screen.getByText('Enter text to generate QR')).toBeInTheDocument()
    })

    it('should generate QR code when text is entered', async () => {
      render(<QRGenerator />)
      
      const textInput = screen.getByPlaceholderText('Enter text or paste content...')
      fireEvent.change(textInput, { target: { value: 'Hello World' } })
      
      await waitFor(() => {
        expect(QRCode.toDataURL).toHaveBeenCalledWith('Hello World', expect.any(Object))
        expect(screen.getByAltText('Generated QR Code')).toBeInTheDocument()
      })
    })

    it('should show publish button when text is not default URL', async () => {
      render(<QRGenerator />)
      
      const textInput = screen.getByPlaceholderText('Enter text or paste content...')
      // Set custom text that's different from default URL
      fireEvent.change(textInput, { target: { value: 'Custom text different from URL' } })
      
      await waitFor(() => {
        expect(screen.getByText('Publish')).toBeInTheDocument()
      })
    })

    it('should handle paste functionality with haptic feedback', async () => {
      render(<QRGenerator />)
      
      const pasteButton = screen.getByText('Paste')
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
      
      const textInput = screen.getByPlaceholderText('Enter text or paste content...')
      fireEvent.change(textInput, { target: { value: 'Download test' } })
      
      await waitFor(() => {
        expect(screen.getByAltText('Generated QR Code')).toBeInTheDocument()
      })
      
      const downloadButton = screen.getByText('Download')
      fireEvent.click(downloadButton)
      
      // Check that vibrate was called (it's mocked in jest.setup.js)
      expect(navigator.vibrate).toHaveBeenCalledWith(50)
    })

    it('should handle share functionality', async () => {
      render(<QRGenerator />)
      
      const textInput = screen.getByPlaceholderText('Enter text or paste content...')
      fireEvent.change(textInput, { target: { value: 'Share test' } })
      
      await waitFor(() => {
        expect(screen.getByAltText('Generated QR Code')).toBeInTheDocument()
      })
      
      // Mock the share function
      const mockShare = jest.fn().mockResolvedValue(undefined)
      const mockCanShare = jest.fn(() => true)
      
      Object.defineProperty(navigator, 'share', {
        value: mockShare,
        writable: true
      })
      Object.defineProperty(navigator, 'canShare', {
        value: mockCanShare,
        writable: true
      })
      
      const shareButton = screen.getByText('Share')
      fireEvent.click(shareButton)
      
      // Wait for share to be called
      await waitFor(() => {
        expect(mockShare).toHaveBeenCalled()
      }, { timeout: 3000 })
      
      expect(navigator.vibrate).toHaveBeenCalledWith(50)
    })
  })

  describe('Language Switcher Sandwich', () => {
    const mockOnLanguageChange = jest.fn()

    beforeEach(() => {
      mockOnLanguageChange.mockClear()
    })

    it('should render language switcher with current language', () => {
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
      // Check that vibrate was called (it's mocked in jest.setup.js)
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

    it('should close dropdown after language selection', () => {
      render(
        <LanguageSwitcher 
          currentLanguage="en" 
          onLanguageChange={mockOnLanguageChange} 
        />
      )
      
      const button = screen.getByText('English')
      fireEvent.click(button)
      
      expect(screen.getByText('Español')).toBeInTheDocument()
      
      const frenchOption = screen.getByText('Français')
      fireEvent.click(frenchOption)
      
      // Dropdown should be closed
      expect(screen.queryByText('Español')).not.toBeInTheDocument()
    })

    it('should provide haptic feedback on language change', () => {
      render(
        <LanguageSwitcher 
          currentLanguage="en" 
          onLanguageChange={mockOnLanguageChange} 
        />
      )
      
      const button = screen.getByText('English')
      fireEvent.click(button)
      
      const chineseOption = screen.getByText('中文')
      fireEvent.click(chineseOption)
      
      // Check that vibrate was called (it's mocked in jest.setup.js)
      expect(navigator.vibrate).toHaveBeenCalledWith(30)
    })
  })

  describe('Integration Sandwich Tests', () => {
    it('should work together - QR generator with language switcher', () => {
      const { container } = render(
        <div>
          <LanguageSwitcher currentLanguage="en" onLanguageChange={jest.fn()} />
          <QRGenerator />
        </div>
      )
      
      // Both components should render without conflicts
      expect(screen.getByText('English')).toBeInTheDocument()
      expect(screen.getByText('Paste')).toBeInTheDocument()
      expect(screen.getByPlaceholderText('Enter text or paste content...')).toBeInTheDocument()
    })

    it('should maintain functionality when language is changed', async () => {
      const mockOnLanguageChange = jest.fn()
      
      render(
        <div>
          <LanguageSwitcher currentLanguage="en" onLanguageChange={mockOnLanguageChange} />
          <QRGenerator />
        </div>
      )
      
      // Change language
      const languageButton = screen.getByText('English')
      fireEvent.click(languageButton)
      
      const spanishOption = screen.getByText('Español')
      fireEvent.click(spanishOption)
      
      // QR generator should still work
      const textInput = screen.getByPlaceholderText('Enter text or paste content...')
      fireEvent.change(textInput, { target: { value: 'Test after language change' } })
      
      await waitFor(() => {
        expect(QRCode.toDataURL).toHaveBeenCalled()
      })
    })
  })
})
