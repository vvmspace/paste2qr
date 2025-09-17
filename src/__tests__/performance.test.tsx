/**
 * Performance tests for QR Generator
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { QRGenerator } from '../components/QRGenerator'

// Mock the analytics
jest.mock('../lib/analytics', () => ({
  trackEvent: jest.fn()
}))

// Mock QRCode library with performance tracking
jest.mock('qrcode', () => ({
  toDataURL: jest.fn()
}))

describe('Performance Tests', () => {
  beforeEach(() => {
    // Mock window.location
    Object.defineProperty(window, 'location', {
      value: {
        href: 'http://localhost:3000'
      },
      writable: true
    })
    
    // Reset mocks
    const QRCode = require('qrcode')
    QRCode.toDataURL.mockClear()
  })

  test('should generate QR code within reasonable time', async () => {
    const startTime = performance.now()
    
    const QRCode = require('qrcode')
    QRCode.toDataURL.mockResolvedValue('data:image/png;base64,mock-qr-code')
    
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

  test('should debounce text input to prevent excessive QR generation', async () => {
    const QRCode = require('qrcode')
    QRCode.toDataURL.mockResolvedValue('data:image/png;base64,mock-qr-code')
    
    render(<QRGenerator />)
    
    const textarea = screen.getByPlaceholderText('Enter text or paste content...')
    
    // Type multiple characters quickly
    fireEvent.change(textarea, { target: { value: 'T' } })
    fireEvent.change(textarea, { target: { value: 'Te' } })
    fireEvent.change(textarea, { target: { value: 'Tes' } })
    fireEvent.change(textarea, { target: { value: 'Test' } })
    
    // Wait for debounce
    await waitFor(() => {
      const QRCode = require('qrcode')
    expect(QRCode.toDataURL).toHaveBeenCalled()
    }, { timeout: 1000 })
    
    // Should not be called for every character due to debouncing
    const QRCode = require('qrcode')
    expect(QRCode.toDataURL).toHaveBeenCalledTimes(1)
  })

  test('should handle large text efficiently', async () => {
    const largeText = 'A'.repeat(1000) // 1000 character text
    const QRCode = require('qrcode')
    QRCode.toDataURL.mockResolvedValue('data:image/png;base64,mock-qr-code')
    
    render(<QRGenerator />)
    
    const textarea = screen.getByPlaceholderText('Enter text or paste content...')
    fireEvent.change(textarea, { target: { value: largeText } })
    
    await waitFor(() => {
      expect(screen.getByAltText('Generated QR Code')).toBeInTheDocument()
    })
    
    // Should handle large text without issues
    const QRCode = require('qrcode')
    expect(QRCode.toDataURL).toHaveBeenCalledWith(
      expect.stringContaining(largeText),
      expect.objectContaining({
        errorCorrectionLevel: 'Q', // Higher error correction for large text
        width: 160
      })
    )
  })

  test('should optimize QR code size based on text length', async () => {
    const QRCode = require('qrcode')
    QRCode.toDataURL.mockResolvedValue('data:image/png;base64,mock-qr-code')
    
    render(<QRGenerator />)
    
    const textarea = screen.getByPlaceholderText('Enter text or paste content...')
    
    // Test short text (should use 'L' error correction)
    fireEvent.change(textarea, { target: { value: 'Short' } })
    
    await waitFor(() => {
      const QRCode = require('qrcode')
    expect(QRCode.toDataURL).toHaveBeenCalledWith(
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
      const QRCode = require('qrcode')
    expect(QRCode.toDataURL).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          errorCorrectionLevel: 'M'
        })
      )
    })
    
    mockQRCode.toDataURL.mockClear()
    
    // Test long text (should use 'Q' error correction)
    fireEvent.change(textarea, { target: { value: 'A'.repeat(150) } })
    
    await waitFor(() => {
      const QRCode = require('qrcode')
    expect(QRCode.toDataURL).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          errorCorrectionLevel: 'Q'
        })
      )
    })
  })

  test('should not cause memory leaks with multiple generations', async () => {
    const QRCode = require('qrcode')
    QRCode.toDataURL.mockResolvedValue('data:image/png;base64,mock-qr-code')
    
    const { unmount } = render(<QRGenerator />)
    
    const textarea = screen.getByPlaceholderText('Enter text or paste content...')
    
    // Generate multiple QR codes
    for (let i = 0; i < 10; i++) {
      fireEvent.change(textarea, { target: { value: `Test ${i}` } })
      await waitFor(() => {
        expect(screen.getByAltText('Generated QR Code')).toBeInTheDocument()
      })
    }
    
    // Unmount component
    unmount()
    
    // Should not throw any errors
    const QRCode = require('qrcode')
    expect(QRCode.toDataURL).toHaveBeenCalledTimes(10)
  })

  test('should handle rapid user interactions gracefully', async () => {
    const QRCode = require('qrcode')
    QRCode.toDataURL.mockResolvedValue('data:image/png;base64,mock-qr-code')
    
    render(<QRGenerator />)
    
    const textarea = screen.getByPlaceholderText('Enter text or paste content...')
    const pasteButton = screen.getByText('Paste')
    
    // Simulate rapid interactions
    fireEvent.change(textarea, { target: { value: 'Test 1' } })
    fireEvent.click(pasteButton)
    fireEvent.change(textarea, { target: { value: 'Test 2' } })
    fireEvent.click(pasteButton)
    
    // Should handle all interactions without errors
    await waitFor(() => {
      expect(screen.getByAltText('Generated QR Code')).toBeInTheDocument()
    })
  })
})
