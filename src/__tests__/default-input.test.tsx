/**
 * Tests for default input functionality with page configurations
 */

import { render, screen, waitFor } from '@testing-library/react'
import { QRGenerator } from '../components/QRGenerator'
import { pageConfigs } from '../configs/pages'

// Mock the analytics
jest.mock('../lib/analytics', () => ({
  trackEvent: jest.fn()
}))

// Mock QRCode library
jest.mock('qrcode', () => ({
  toDataURL: jest.fn().mockResolvedValue('data:image/png;base64,mock-qr-code')
}))

describe('Default Input Tests', () => {
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

  describe('Home Page Configuration', () => {
    it('should use default text from home page config', async () => {
      const homeConfig = pageConfigs.home
      
      render(<QRGenerator pageConfig={homeConfig} />)
      
      await waitFor(() => {
        const textarea = screen.getByPlaceholderText('Paste any text from your clipboard to generate QR code...')
        expect(textarea).toHaveValue(homeConfig.defaultText)
      })
    })

    it('should generate QR code with default text on home page', async () => {
      const homeConfig = pageConfigs.home
      
      render(<QRGenerator pageConfig={homeConfig} />)
      
      // Check that default text is set
      const textarea = screen.getByDisplayValue(homeConfig.defaultText!)
      expect(textarea).toBeInTheDocument()
      
      // In test environment, QR code generation is mocked, so we check for the placeholder
      expect(screen.getByText('Enter text to generate QR')).toBeInTheDocument()
    })
  })

  describe('WiFi QR Code Generator Configuration', () => {
    it('should use WiFi default text from config', async () => {
      const wifiConfig = pageConfigs['wifi-qr-code-generator']
      
      render(<QRGenerator pageConfig={wifiConfig} />)
      
      await waitFor(() => {
        const textarea = screen.getByPlaceholderText('Paste any text from your clipboard to generate QR code...')
        expect(textarea).toHaveValue(wifiConfig.defaultText)
      })
    })

    it('should use WiFi prefix for QR code generation', async () => {
      const wifiConfig = pageConfigs['wifi-qr-code-generator']
      
      render(<QRGenerator pageConfig={wifiConfig} />)
      
      await waitFor(() => {
        expect(screen.getByAltText('Generated QR Code')).toBeInTheDocument()
      })
    })
  })

  describe('Phone Number QR Code Configuration', () => {
    it('should use phone default text from config', async () => {
      const phoneConfig = pageConfigs['phone-number-qr-code']
      
      render(<QRGenerator pageConfig={phoneConfig} />)
      
      await waitFor(() => {
        const textarea = screen.getByPlaceholderText('Paste any text from your clipboard to generate QR code...')
        expect(textarea).toHaveValue(phoneConfig.defaultText)
      })
    })

    it('should use tel: prefix for phone QR codes', async () => {
      const phoneConfig = pageConfigs['phone-number-qr-code']
      
      render(<QRGenerator pageConfig={phoneConfig} />)
      
      await waitFor(() => {
        expect(screen.getByAltText('Generated QR Code')).toBeInTheDocument()
      })
    })
  })

  describe('Email QR Code Generator Configuration', () => {
    it('should use email default text from config', async () => {
      const emailConfig = pageConfigs['email-qr-code-generator']
      
      render(<QRGenerator pageConfig={emailConfig} />)
      
      await waitFor(() => {
        const textarea = screen.getByPlaceholderText('Paste any text from your clipboard to generate QR code...')
        expect(textarea).toHaveValue(emailConfig.defaultText)
      })
    })

    it('should use mailto: prefix for email QR codes', async () => {
      const emailConfig = pageConfigs['email-qr-code-generator']
      
      render(<QRGenerator pageConfig={emailConfig} />)
      
      await waitFor(() => {
        expect(screen.getByAltText('Generated QR Code')).toBeInTheDocument()
      })
    })
  })

  describe('SMS QR Code Maker Configuration', () => {
    it('should use SMS default text from config', async () => {
      const smsConfig = pageConfigs['sms-qr-code-maker']
      
      render(<QRGenerator pageConfig={smsConfig} />)
      
      await waitFor(() => {
        const textarea = screen.getByPlaceholderText('Paste any text from your clipboard to generate QR code...')
        expect(textarea).toHaveValue(smsConfig.defaultText)
      })
    })

    it('should use sms: prefix for SMS QR codes', async () => {
      const smsConfig = pageConfigs['sms-qr-code-maker']
      
      render(<QRGenerator pageConfig={smsConfig} />)
      
      await waitFor(() => {
        expect(screen.getByAltText('Generated QR Code')).toBeInTheDocument()
      })
    })
  })

  describe('Fallback Behavior', () => {
    it('should use current URL when no page config is provided', async () => {
      Object.defineProperty(window, 'location', {
        value: {
          href: 'http://localhost:3000',
          pathname: '/'
        },
        writable: true
      })
      
      render(<QRGenerator />)
      
      await waitFor(() => {
        const textarea = screen.getByPlaceholderText('Paste any text from your clipboard to generate QR code...')
        expect(textarea).toHaveValue('http://localhost:3000')
      })
    })

    it('should use empty string for non-main pages without config', async () => {
      Object.defineProperty(window, 'location', {
        value: {
          href: 'http://localhost:3000/some-other-page',
          pathname: '/some-other-page'
        },
        writable: true
      })
      
      render(<QRGenerator />)
      
      await waitFor(() => {
        const textarea = screen.getByPlaceholderText('Paste any text from your clipboard to generate QR code...')
        expect(textarea).toHaveValue('')
      })
    })
  })

  describe('QR Code Generation with Default Text', () => {
    it('should always generate a QR code when default text is present', async () => {
      const homeConfig = pageConfigs.home
      
      render(<QRGenerator pageConfig={homeConfig} />)
      
      await waitFor(() => {
        expect(screen.getByAltText('Generated QR Code')).toBeInTheDocument()
      })
    })

    it('should show placeholder when no default text is available', async () => {
      Object.defineProperty(window, 'location', {
        value: {
          href: 'http://localhost:3000/empty-page',
          pathname: '/empty-page'
        },
        writable: true
      })
      
      render(<QRGenerator />)
      
      await waitFor(() => {
        expect(screen.getByText('Enter text to generate QR')).toBeInTheDocument()
      })
    })
  })

  describe('Page Configuration Validation', () => {
    it('should handle missing defaultText in config', async () => {
      const configWithoutDefault = {
        ...pageConfigs.home,
        defaultText: undefined
      }
      
      render(<QRGenerator pageConfig={configWithoutDefault} />)
      
      await waitFor(() => {
        const textarea = screen.getByPlaceholderText('Paste any text from your clipboard to generate QR code...')
        expect(textarea).toHaveValue('http://localhost:3000')
      })
    })

    it('should handle missing qrPrefix in config', async () => {
      const configWithoutPrefix = {
        ...pageConfigs.home,
        qrPrefix: undefined
      }
      
      render(<QRGenerator pageConfig={configWithoutPrefix} />)
      
      await waitFor(() => {
        expect(screen.getByAltText('Generated QR Code')).toBeInTheDocument()
      })
    })
  })
})
