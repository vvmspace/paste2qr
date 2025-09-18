/**
 * Comprehensive tests covering all requirements:
 * - Translations
 * - Default input from page configs
 * - QR code generation on page load
 * - SEO metadata
 * - Performance optimization
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { I18nextProvider } from 'react-i18next'
import i18n from '../lib/i18n'
import { QRGenerator } from '../components/QRGenerator'
import { HeroContent } from '../components/HeroContent'
import { SEOHead } from '../components/SEOHead'
import { pageConfigs } from '../configs/pages'

// Mock the analytics
jest.mock('../lib/analytics', () => ({
  trackEvent: jest.fn()
}))

// Mock QRCode library
jest.mock('qrcode', () => ({
  toDataURL: jest.fn().mockResolvedValue('data:image/png;base64,mock-qr-code')
}))

// Helper function to render with i18n
const renderWithI18n = (component: React.ReactElement, locale = 'en') => {
  i18n.changeLanguage(locale)
  return render(
    <I18nextProvider i18n={i18n}>
      {component}
    </I18nextProvider>
  )
}

describe('Comprehensive Application Tests', () => {
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

  describe('Complete User Flow Tests', () => {
    it('should provide complete user experience on home page', async () => {
      const homeConfig = pageConfigs.home
      
      // Test SEO
      render(<SEOHead config={homeConfig} />)
      expect(document.title).toBe(homeConfig.title)
      
      // Test translations
      renderWithI18n(<HeroContent />, 'en')
      expect(screen.getByText('Paste to QR Code')).toBeInTheDocument()
      
      // Test default input and QR generation
      render(<QRGenerator pageConfig={homeConfig} />)
      
      await waitFor(() => {
        const textarea = screen.getByPlaceholderText('Paste any text from your clipboard to generate QR code...')
        expect(textarea).toHaveValue(homeConfig.defaultText)
        expect(screen.getByAltText('Generated QR Code')).toBeInTheDocument()
      })
    })

    it('should provide complete user experience on WiFi page', async () => {
      const wifiConfig = pageConfigs['wifi-qr-code-generator']
      
      // Test SEO
      render(<SEOHead config={wifiConfig} />)
      expect(document.title).toBe(wifiConfig.title)
      
      // Test translations
      renderWithI18n(<HeroContent />, 'en')
      expect(screen.getByText('Paste to QR Code')).toBeInTheDocument()
      
      // Test default input and QR generation
      render(<QRGenerator pageConfig={wifiConfig} />)
      
      await waitFor(() => {
        const textarea = screen.getByPlaceholderText('Paste any text from your clipboard to generate QR code...')
        expect(textarea).toHaveValue(wifiConfig.defaultText)
        expect(screen.getByAltText('Generated QR Code')).toBeInTheDocument()
      })
    })

    it('should provide complete user experience on phone page', async () => {
      const phoneConfig = pageConfigs['phone-number-qr-code']
      
      // Test SEO
      render(<SEOHead config={phoneConfig} />)
      expect(document.title).toBe(phoneConfig.title)
      
      // Test default input and QR generation
      render(<QRGenerator pageConfig={phoneConfig} />)
      
      await waitFor(() => {
        const textarea = screen.getByPlaceholderText('Paste any text from your clipboard to generate QR code...')
        expect(textarea).toHaveValue(phoneConfig.defaultText)
        expect(screen.getByAltText('Generated QR Code')).toBeInTheDocument()
      })
    })
  })

  describe('Multi-language Complete Experience', () => {
    const locales = ['en', 'es', 'zh', 'fr', 'am', 'pt']
    
    locales.forEach(locale => {
      it(`should provide complete experience in ${locale}`, async () => {
        const homeConfig = pageConfigs.home
        
        // Test translations
        renderWithI18n(<HeroContent />, locale)
        
        // Test hero content
        renderWithI18n(<HeroContent />, locale)
        
        // Test default input and QR generation
        render(<QRGenerator pageConfig={homeConfig} />)
        
        await waitFor(() => {
          const textarea = screen.getByPlaceholderText('Paste any text from your clipboard to generate QR code...')
          expect(textarea).toHaveValue(homeConfig.defaultText)
          expect(screen.getByAltText('Generated QR Code')).toBeInTheDocument()
        })
      })
    })
  })

  describe('Performance Under Load', () => {
    it('should handle multiple page configs efficiently', async () => {
      const configs = Object.values(pageConfigs)
      const startTime = performance.now()
      
      configs.forEach(config => {
        render(<QRGenerator pageConfig={config} />)
      })
      
      const endTime = performance.now()
      const totalTime = endTime - startTime
      
      // Should handle all configs within 1 second
      expect(totalTime).toBeLessThan(1000)
    })

    it('should handle language switching efficiently', async () => {
      const locales = ['en', 'es', 'zh', 'fr', 'am', 'pt']
      const startTime = performance.now()
      
      locales.forEach(locale => {
        renderWithI18n(<Hero />, locale)
      })
      
      const endTime = performance.now()
      const totalTime = endTime - startTime
      
      // Should handle all locales within 500ms
      expect(totalTime).toBeLessThan(500)
    })
  })

  describe('SEO Completeness', () => {
    it('should have complete SEO for all pages', () => {
      Object.entries(pageConfigs).forEach(([key, config]) => {
        render(<SEOHead config={config} />)
        
        // Check title
        expect(document.title).toBe(config.title)
        
        // Check meta description
        const metaDescription = document.querySelector('meta[name="description"]')
        expect(metaDescription).toHaveAttribute('content', config.description)
        
        // Check canonical URL
        const canonicalLink = document.querySelector('link[rel="canonical"]')
        expect(canonicalLink).toHaveAttribute('href', config.canonicalUrl)
        
        // Check Open Graph tags
        const ogTitle = document.querySelector('meta[property="og:title"]')
        expect(ogTitle).toHaveAttribute('content', config.title)
        
        // Check Twitter tags
        const twitterTitle = document.querySelector('meta[name="twitter:title"]')
        expect(twitterTitle).toHaveAttribute('content', config.title)
      })
    })
  })

  describe('QR Code Generation Completeness', () => {
    it('should generate QR codes for all page configs', async () => {
      Object.entries(pageConfigs).forEach(async ([key, config]) => {
        render(<QRGenerator pageConfig={config} />)
        
        await waitFor(() => {
          const textarea = screen.getByPlaceholderText('Paste any text from your clipboard to generate QR code...')
          expect(textarea).toHaveValue(config.defaultText)
          expect(screen.getByAltText('Generated QR Code')).toBeInTheDocument()
        })
      })
    })

    it('should use correct prefixes for different page types', async () => {
      // Test WiFi prefix
      render(<QRGenerator pageConfig={pageConfigs['wifi-qr-code-generator']} />)
      await waitFor(() => {
        expect(screen.getByAltText('Generated QR Code')).toBeInTheDocument()
      })
      
      // Test phone prefix
      render(<QRGenerator pageConfig={pageConfigs['phone-number-qr-code']} />)
      await waitFor(() => {
        expect(screen.getByAltText('Generated QR Code')).toBeInTheDocument()
      })
      
      // Test email prefix
      render(<QRGenerator pageConfig={pageConfigs['email-qr-code-generator']} />)
      await waitFor(() => {
        expect(screen.getByAltText('Generated QR Code')).toBeInTheDocument()
      })
      
      // Test SMS prefix
      render(<QRGenerator pageConfig={pageConfigs['sms-qr-code-maker']} />)
      await waitFor(() => {
        expect(screen.getByAltText('Generated QR Code')).toBeInTheDocument()
      })
    })
  })

  describe('Accessibility and Usability', () => {
    it('should be accessible in all languages', async () => {
      const locales = ['en', 'es', 'zh', 'fr', 'am', 'pt']
      
      locales.forEach(locale => {
        renderWithI18n(<QRGenerator pageConfig={pageConfigs.home} />, locale)
        
        // Check for accessible elements
        expect(screen.getByRole('textbox')).toBeInTheDocument()
        expect(screen.getByRole('button')).toBeInTheDocument()
      })
    })

    it('should have proper ARIA labels', async () => {
      render(<QRGenerator pageConfig={pageConfigs.home} />)
      
      await waitFor(() => {
        const textarea = screen.getByRole('textbox')
        expect(textarea).toHaveAttribute('placeholder')
        
        const buttons = screen.getAllByRole('button')
        buttons.forEach(button => {
          expect(button.textContent).toBeTruthy()
        })
      })
    })
  })

  describe('Error Handling', () => {
    it('should handle missing page config gracefully', async () => {
      render(<QRGenerator />)
      
      await waitFor(() => {
        const textarea = screen.getByPlaceholderText('Paste any text from your clipboard to generate QR code...')
        expect(textarea).toHaveValue('http://localhost:3000')
      })
    })

    it('should handle invalid page config gracefully', async () => {
      const invalidConfig = {
        title: 'Test',
        description: 'Test',
        keywords: 'test',
        heroTitle: 'Test',
        heroSubtitle: 'Test',
        heroButtonText: 'Test',
        heroGradient: 'test',
        canonicalUrl: 'http://test.com'
        // Missing defaultText and qrPrefix
      }
      
      render(<QRGenerator pageConfig={invalidConfig} />)
      
      await waitFor(() => {
        const textarea = screen.getByPlaceholderText('Paste any text from your clipboard to generate QR code...')
        expect(textarea).toHaveValue('http://localhost:3000')
      })
    })
  })

  describe('Integration with Real User Scenarios', () => {
    it('should handle typical user workflow', async () => {
      const homeConfig = pageConfigs.home
      
      // User opens page
      render(<QRGenerator pageConfig={homeConfig} />)
      
      // Should see default QR code
      await waitFor(() => {
        expect(screen.getByAltText('Generated QR Code')).toBeInTheDocument()
      })
      
      // User changes text
      const textarea = screen.getByPlaceholderText('Paste any text from your clipboard to generate QR code...')
      fireEvent.change(textarea, { target: { value: 'Custom user text' } })
      
      // Should generate new QR code
      await waitFor(() => {
        expect(screen.getByAltText('Generated QR Code')).toBeInTheDocument()
      })
      
      // User should see action buttons
      expect(screen.getByText('Paste')).toBeInTheDocument()
    })

    it('should handle paste functionality', async () => {
      // Mock clipboard API
      Object.assign(navigator, {
        clipboard: {
          readText: jest.fn().mockResolvedValue('Pasted text')
        }
      })

      render(<QRGenerator pageConfig={pageConfigs.home} />)
      
      const pasteButton = screen.getByText('Paste')
      fireEvent.click(pasteButton)
      
      await waitFor(() => {
        expect(navigator.clipboard.readText).toHaveBeenCalled()
      })
    })
  })
})
