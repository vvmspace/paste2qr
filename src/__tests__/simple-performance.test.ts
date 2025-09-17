/**
 * Simple performance tests for QR Generator
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { QRGenerator } from '../components/QRGenerator'

// Mock the analytics
jest.mock('../lib/analytics', () => ({
  trackEvent: jest.fn()
}))

// Mock QRCode library
const mockQRCode = {
  toDataURL: jest.fn().mockResolvedValue('data:image/png;base64,mock-qr-code')
}

jest.mock('qrcode', () => mockQRCode)

describe('Simple Performance Tests', () => {
  beforeEach(() => {
    // Mock window.location
    Object.defineProperty(window, 'location', {
      value: {
        href: 'http://localhost:3000'
      },
      writable: true
    })
    
    // Reset mocks
    mockQRCode.toDataURL.mockClear()
  })

  test('should generate QR code within reasonable time', async () => {
    const startTime = performance.now()
    
    render(<QRGenerator />)
    
    const textarea = screen.getByPlaceholderText('Enter text or paste content...')
    fireEvent.change(textarea, { target: { value: 'Test QR Code' } })
    
    await waitFor(() => {
      expect(screen.getByAltText('Generated QR Code')).toBeInTheDocument()
    })
    
    const endTime = performance.now()
    const generationTime = endTime - startTime
    
    // QR code generation should be fast (less than 1 second)
    expect(generationTime).toBeLessThan(1000)
  })

  test('should handle large text efficiently', async () => {
    const largeText = 'A'.repeat(1000) // 1000 character text
    
    render(<QRGenerator />)
    
    const textarea = screen.getByPlaceholderText('Enter text or paste content...')
    fireEvent.change(textarea, { target: { value: largeText } })
    
    await waitFor(() => {
      expect(screen.getByAltText('Generated QR Code')).toBeInTheDocument()
    })
    
    // Should handle large text without issues
    expect(mockQRCode.toDataURL).toHaveBeenCalledWith(
      expect.stringContaining(largeText),
      expect.objectContaining({
        errorCorrectionLevel: 'Q', // Higher error correction for large text
        width: 160
      })
    )
  })

  test('should optimize QR code size based on text length', async () => {
    render(<QRGenerator />)
    
    const textarea = screen.getByPlaceholderText('Enter text or paste content...')
    
    // Test short text (should use 'L' error correction)
    fireEvent.change(textarea, { target: { value: 'Short' } })
    
    await waitFor(() => {
      expect(mockQRCode.toDataURL).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          errorCorrectionLevel: 'L'
        })
      )
    })
    
    mockQRCode.toDataURL.mockClear()
    
    // Test medium text (should use 'M' error correction)
    fireEvent.change(textarea, { target: { value: 'A'.repeat(75) } })
    
    await waitFor(() => {
      expect(mockQRCode.toDataURL).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          errorCorrectionLevel: 'M'
        })
      )
    })
  })
})
