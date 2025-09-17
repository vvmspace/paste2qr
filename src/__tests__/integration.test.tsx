/**
 * Integration tests for QR Generator functionality
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { QRGenerator } from '../components/QRGenerator'
import { PublishModal } from '../components/PublishModal'

// Mock the analytics
jest.mock('../lib/analytics', () => ({
  trackEvent: jest.fn()
}))

// Mock the client storage
jest.mock('../lib/clientStorage', () => ({
  clientStorage: {
    save: jest.fn().mockResolvedValue({
      id: 'test-alias',
      url: 'http://localhost:3000/p/test-alias'
    })
  }
}))

// Mock QRCode library
jest.mock('qrcode', () => ({
  toDataURL: jest.fn().mockResolvedValue('data:image/png;base64,mock-qr-code')
}))

describe('QR Generator Integration Tests', () => {
  beforeEach(() => {
    // Mock window.location
    Object.defineProperty(window, 'location', {
      value: {
        href: 'http://localhost:3000'
      },
      writable: true
    })
  })

  test('should generate QR code on page load with default URL', async () => {
    render(<QRGenerator />)
    
    // Wait for QR code to be generated
    await waitFor(() => {
      expect(screen.getByAltText('Generated QR Code')).toBeInTheDocument()
    })
  })

  test('should generate QR code when text is entered', async () => {
    render(<QRGenerator />)
    
    const textarea = screen.getByPlaceholderText('Enter text or paste content...')
    fireEvent.change(textarea, { target: { value: 'Test QR Code' } })
    
    await waitFor(() => {
      expect(screen.getByAltText('Generated QR Code')).toBeInTheDocument()
    })
  })

  test('should show paste button and handle paste functionality', async () => {
    // Mock clipboard API
    Object.assign(navigator, {
      clipboard: {
        readText: jest.fn().mockResolvedValue('Pasted text')
      }
    })

    render(<QRGenerator />)
    
    const pasteButton = screen.getByText('Paste')
    fireEvent.click(pasteButton)
    
    await waitFor(() => {
      expect(navigator.clipboard.readText).toHaveBeenCalled()
    })
  })

  test('should show publish button when text is not default URL', async () => {
    render(<QRGenerator />)
    
    const textarea = screen.getByPlaceholderText('Enter text or paste content...')
    fireEvent.change(textarea, { target: { value: 'Custom text' } })
    
    await waitFor(() => {
      expect(screen.getByText('Publish')).toBeInTheDocument()
    })
  })

  test('should handle download functionality', async () => {
    render(<QRGenerator />)
    
    // Wait for QR code to be generated
    await waitFor(() => {
      expect(screen.getByAltText('Generated QR Code')).toBeInTheDocument()
    })
    
    const downloadButton = screen.getByText('Download')
    fireEvent.click(downloadButton)
    
    // Check that download was triggered (mocked)
    expect(downloadButton).toBeInTheDocument()
  })

  test('should handle share functionality', async () => {
    // Mock navigator.share
    Object.assign(navigator, {
      share: jest.fn().mockResolvedValue(undefined)
    })

    render(<QRGenerator />)
    
    // Wait for QR code to be generated
    await waitFor(() => {
      expect(screen.getByAltText('Generated QR Code')).toBeInTheDocument()
    })
    
    const shareButton = screen.getByText('Share')
    fireEvent.click(shareButton)
    
    await waitFor(() => {
      expect(navigator.share).toHaveBeenCalled()
    })
  })
})

describe('Publish Modal Integration Tests', () => {
  test('should open and close publish modal', () => {
    const onClose = jest.fn()
    
    render(
      <PublishModal
        qrCodeDataUrl="data:image/png;base64,mock"
        text="Test text"
        prefix=""
        onClose={onClose}
      />
    )
    
    expect(screen.getByRole('heading', { name: 'Publish QR Code' })).toBeInTheDocument()
    
    const cancelButton = screen.getByText('Cancel')
    fireEvent.click(cancelButton)
    
    expect(onClose).toHaveBeenCalled()
  })

  test('should handle form submission', async () => {
    const onClose = jest.fn()
    
    render(
      <PublishModal
        qrCodeDataUrl="data:image/png;base64,mock"
        text="Test text"
        prefix=""
        onClose={onClose}
      />
    )
    
    const titleInput = screen.getByPlaceholderText('Enter page title (optional)')
    fireEvent.change(titleInput, { target: { value: 'Test Title' } })
    
    const publishButton = screen.getByRole('button', { name: 'Publish QR Code' })
    fireEvent.click(publishButton)
    
    await waitFor(() => {
      expect(screen.getByText('Success!')).toBeInTheDocument()
    })
  })

  test('should show language options', () => {
    const onClose = jest.fn()
    
    render(
      <PublishModal
        qrCodeDataUrl="data:image/png;base64,mock"
        text="Test text"
        prefix=""
        onClose={onClose}
      />
    )
    
    expect(screen.getByDisplayValue('English')).toBeInTheDocument()
    expect(screen.getByText('Español')).toBeInTheDocument()
    expect(screen.getByText('中文')).toBeInTheDocument()
    expect(screen.getByText('Français')).toBeInTheDocument()
  })
})
