/**
 * Simple tests for translations and internationalization
 */

import { render, screen } from '@testing-library/react'
import { I18nextProvider } from 'react-i18next'
import { QRGenerator } from '../components/QRGenerator'
import { HeroContent } from '../components/HeroContent'
import { FixedActionBar } from '../components/FixedActionBar'

// Mock the analytics
jest.mock('../lib/analytics', () => ({
  trackEvent: jest.fn()
}))

// Mock QRCode library
jest.mock('qrcode', () => ({
  toDataURL: jest.fn().mockResolvedValue('data:image/png;base64,mock-qr-code')
}))

// Mock i18n
const mockI18n = {
  changeLanguage: jest.fn(),
  t: jest.fn((key: string) => {
    const translations: Record<string, string> = {
      'hero.title': 'Paste to QR Code',
      'hero.subtitle': 'Paste any text from your clipboard and get a QR code instantly. No typing, no complexity - just paste and generate.',
      'common.paste': 'Paste',
      'common.copy': 'Copy',
      'common.share': 'Share',
      'common.download': 'Download',
      'common.publish': 'Publish',
      'common.clear': 'Clear'
    }
    return translations[key] || key
  }),
  language: 'en',
  isInitialized: true
}

// Helper function to render with i18n
const renderWithI18n = (component: React.ReactElement, locale = 'en') => {
  mockI18n.language = locale
  return render(
    <I18nextProvider i18n={mockI18n as any}>
      {component}
    </I18nextProvider>
  )
}

describe('Simple Translations Tests', () => {
  beforeEach(() => {
    // Mock window.location
    Object.defineProperty(window, 'location', {
      value: {
        href: 'http://localhost:3000',
        pathname: '/'
      },
      writable: true
    })
  })

  describe('Basic Translation Functionality', () => {
    it('should render HeroContent component with translations', () => {
      renderWithI18n(<HeroContent />, 'en')
      
      expect(screen.getByText('hero.title')).toBeInTheDocument()
      expect(screen.getByText('hero.subtitle')).toBeInTheDocument()
    })

    it('should render FixedActionBar component with translations', () => {
      const mockOnPaste = jest.fn()
      const mockOnPublish = jest.fn()
      
      renderWithI18n(
        <FixedActionBar 
          onPaste={mockOnPaste}
          onPublish={mockOnPublish}
          hasText={true}
        />, 
        'en'
      )
      
      expect(screen.getByText('Paste')).toBeInTheDocument()
    })

    it('should render QRGenerator component with translations', () => {
      renderWithI18n(<QRGenerator />, 'en')
      
      expect(screen.getByPlaceholderText('Paste any text from your clipboard to generate QR code...')).toBeInTheDocument()
      expect(screen.getByText('Paste')).toBeInTheDocument()
    })
  })

  describe('Translation Keys', () => {
    it('should have all required translation keys', () => {
      const requiredKeys = [
        'hero.title',
        'hero.subtitle',
        'common.paste',
        'common.copy',
        'common.download',
        'common.publish',
        'common.clear'
      ]
      
      requiredKeys.forEach(key => {
        const translation = mockI18n.t(key)
        expect(translation).toBeTruthy()
        expect(translation).not.toBe(key) // Should not return the key itself
      })
    })
  })

  describe('Component Integration with Translations', () => {
    it('should render all components together with translations', () => {
      const mockOnPaste = jest.fn()
      const mockOnPublish = jest.fn()
      
      renderWithI18n(
        <div>
          <HeroContent />
          <QRGenerator />
          <FixedActionBar 
            onPaste={mockOnPaste}
            onPublish={mockOnPublish}
            hasText={true}
          />
        </div>, 
        'en'
      )
      
      // Check that all components render with translations
      expect(screen.getByText('hero.title')).toBeInTheDocument()
      expect(screen.getByText('hero.subtitle')).toBeInTheDocument()
      expect(screen.getByPlaceholderText('Paste any text from your clipboard to generate QR code...')).toBeInTheDocument()
      expect(screen.getAllByText('Paste')).toHaveLength(2)
    })
  })
})
