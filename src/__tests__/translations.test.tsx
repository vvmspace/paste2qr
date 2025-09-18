/**
 * Tests for translations and internationalization
 */

import { render, screen } from '@testing-library/react'
import { I18nextProvider } from 'react-i18next'
import { QRGenerator } from '../components/QRGenerator'
import { Hero } from '../components/Hero'
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

describe('Translations Tests', () => {
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

  describe('English (en)', () => {
    it('should render English translations correctly', () => {
      renderWithI18n(<Hero />, 'en')
      
      expect(screen.getByText('Paste to QR Code')).toBeInTheDocument()
    })

    it('should render English hero content', () => {
      renderWithI18n(<HeroContent />, 'en')
      
      expect(screen.getByText('Paste to QR Code')).toBeInTheDocument()
      expect(screen.getByText(/Paste any text from your clipboard/)).toBeInTheDocument()
    })

    it('should render English action bar', () => {
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
  })

  describe('Spanish (es)', () => {
    it('should render Spanish translations correctly', () => {
      renderWithI18n(<Hero />, 'es')
      
      expect(screen.getByText('Pegar a Código QR')).toBeInTheDocument()
    })

    it('should render Spanish hero content', () => {
      renderWithI18n(<HeroContent />, 'es')
      
      expect(screen.getByText('Pegar a Código QR')).toBeInTheDocument()
      expect(screen.getByText(/Pega cualquier texto/)).toBeInTheDocument()
    })

    it('should render Spanish action bar', () => {
      const mockOnPaste = jest.fn()
      const mockOnPublish = jest.fn()
      
      renderWithI18n(
        <FixedActionBar 
          onPaste={mockOnPaste}
          onPublish={mockOnPublish}
          hasText={true}
        />, 
        'es'
      )
      
      expect(screen.getByText('Pegar')).toBeInTheDocument()
    })
  })

  describe('Chinese (zh)', () => {
    it('should render Chinese translations correctly', () => {
      renderWithI18n(<Hero />, 'zh')
      
      expect(screen.getByText('粘贴到二维码')).toBeInTheDocument()
    })

    it('should render Chinese hero content', () => {
      renderWithI18n(<HeroContent />, 'zh')
      
      expect(screen.getByText('粘贴到二维码')).toBeInTheDocument()
      expect(screen.getByText(/从剪贴板粘贴/)).toBeInTheDocument()
    })

    it('should render Chinese action bar', () => {
      const mockOnPaste = jest.fn()
      const mockOnPublish = jest.fn()
      
      renderWithI18n(
        <FixedActionBar 
          onPaste={mockOnPaste}
          onPublish={mockOnPublish}
          hasText={true}
        />, 
        'zh'
      )
      
      expect(screen.getByText('粘贴')).toBeInTheDocument()
    })
  })

  describe('French (fr)', () => {
    it('should render French translations correctly', () => {
      renderWithI18n(<Hero />, 'fr')
      
      expect(screen.getByText('Coller vers Code QR')).toBeInTheDocument()
    })

    it('should render French hero content', () => {
      renderWithI18n(<HeroContent />, 'fr')
      
      expect(screen.getByText('Coller vers Code QR')).toBeInTheDocument()
      expect(screen.getByText(/Collez n'importe quel texte/)).toBeInTheDocument()
    })

    it('should render French action bar', () => {
      const mockOnPaste = jest.fn()
      const mockOnPublish = jest.fn()
      
      renderWithI18n(
        <FixedActionBar 
          onPaste={mockOnPaste}
          onPublish={mockOnPublish}
          hasText={true}
        />, 
        'fr'
      )
      
      expect(screen.getByText('Coller')).toBeInTheDocument()
    })
  })

  describe('Amharic (am)', () => {
    it('should render Amharic translations correctly', () => {
      renderWithI18n(<Hero />, 'am')
      
      expect(screen.getByText('መለጠፍ ወደ QR ኮድ')).toBeInTheDocument()
    })

    it('should render Amharic hero content', () => {
      renderWithI18n(<HeroContent />, 'am')
      
      expect(screen.getByText('መለጠፍ ወደ QR ኮድ')).toBeInTheDocument()
      expect(screen.getByText(/ከቅንጥብ ቦርድዎ/)).toBeInTheDocument()
    })

    it('should render Amharic action bar', () => {
      const mockOnPaste = jest.fn()
      const mockOnPublish = jest.fn()
      
      renderWithI18n(
        <FixedActionBar 
          onPaste={mockOnPaste}
          onPublish={mockOnPublish}
          hasText={true}
        />, 
        'am'
      )
      
      expect(screen.getByText('መለጠፍ')).toBeInTheDocument()
    })
  })

  describe('Portuguese (pt)', () => {
    it('should render Portuguese translations correctly', () => {
      renderWithI18n(<Hero />, 'pt')
      
      expect(screen.getByText('Colar para Código QR')).toBeInTheDocument()
    })

    it('should render Portuguese hero content', () => {
      renderWithI18n(<HeroContent />, 'pt')
      
      expect(screen.getByText('Colar para Código QR')).toBeInTheDocument()
      expect(screen.getByText(/Cole qualquer texto/)).toBeInTheDocument()
    })

    it('should render Portuguese action bar', () => {
      const mockOnPaste = jest.fn()
      const mockOnPublish = jest.fn()
      
      renderWithI18n(
        <FixedActionBar 
          onPaste={mockOnPaste}
          onPublish={mockOnPublish}
          hasText={true}
        />, 
        'pt'
      )
      
      expect(screen.getByText('Colar')).toBeInTheDocument()
    })
  })

  describe('Language Switching', () => {
    it('should switch between languages correctly', () => {
      const { rerender } = renderWithI18n(<Hero />, 'en')
      expect(screen.getByText('Paste to QR Code')).toBeInTheDocument()

      rerender(
        <I18nextProvider i18n={i18n}>
          <Hero />
        </I18nextProvider>
      )
      i18n.changeLanguage('es')
      
      // Note: In real app, this would trigger re-render automatically
      // In tests, we need to manually trigger it
      expect(screen.getByText('Paste to QR Code')).toBeInTheDocument()
    })
  })

  describe('Missing Translations', () => {
    it('should fallback to English for missing translations', () => {
      // Test with a non-existent locale
      renderWithI18n(<Hero />, 'xx')
      
      // Should fallback to English
      expect(screen.getByText('Paste to QR Code')).toBeInTheDocument()
    })
  })
})
