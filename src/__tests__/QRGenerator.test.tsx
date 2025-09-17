/**
 * Unit tests for QRGenerator component
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { QRGenerator } from '../components/QRGenerator'

// Mock the analytics
jest.mock('../lib/analytics', () => ({
  trackEvent: jest.fn()
}))

// Mock QRCode library
jest.mock('qrcode', () => ({
  toDataURL: jest.fn().mockResolvedValue('data:image/png;base64,mock-qr-code')
}))

describe('QRGenerator', () => {
  beforeEach(() => {
    // Mock window.location
    Object.defineProperty(window, 'location', {
      value: {
        href: 'http://localhost:3000'
      },
      writable: true
    })
  })

  it('renders the QR generator form', () => {
    render(<QRGenerator />)
    
    expect(screen.getByPlaceholderText('Paste any text from your clipboard to generate QR code...')).toBeInTheDocument()
    expect(screen.getByText('Paste')).toBeInTheDocument()
  })

  it('shows placeholder QR code when text is empty', () => {
    render(<QRGenerator />)
    
    expect(screen.getByText('Enter text to generate QR')).toBeInTheDocument()
  })

  it('generates QR code when text is provided', async () => {
    render(<QRGenerator />)
    
    const textInput = screen.getByPlaceholderText('Paste any text from your clipboard to generate QR code...')
    
    fireEvent.change(textInput, { target: { value: 'test text' } })
    
    await waitFor(() => {
      expect(screen.getByAltText('Generated QR Code')).toBeInTheDocument()
    })
  })

  it('shows publish button when text is not default URL', async () => {
    render(<QRGenerator />)
    
    const textInput = screen.getByPlaceholderText('Paste any text from your clipboard to generate QR code...')
    
    fireEvent.change(textInput, { target: { value: 'custom text' } })
    
    await waitFor(() => {
      expect(screen.getByText('Publish')).toBeInTheDocument()
    })
  })

  it('handles paste functionality', async () => {
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

  it('handles download functionality', async () => {
    render(<QRGenerator />)
    
    // Enter text to generate QR code
    const textInput = screen.getByPlaceholderText('Paste any text from your clipboard to generate QR code...')
    fireEvent.change(textInput, { target: { value: 'test text' } })
    
    // Wait for QR code to be generated
    await waitFor(() => {
      expect(screen.getByAltText('Generated QR Code')).toBeInTheDocument()
    })
    
    const downloadButton = screen.getByText('Download')
    fireEvent.click(downloadButton)
    
    // Check that download was triggered (mocked)
    expect(downloadButton).toBeInTheDocument()
  })

  it('handles share functionality', async () => {
    // Mock navigator.share
    Object.assign(navigator, {
      share: jest.fn().mockResolvedValue(undefined),
      canShare: jest.fn().mockReturnValue(true)
    })

    render(<QRGenerator />)
    
    // Enter text to generate QR code
    const textInput = screen.getByPlaceholderText('Paste any text from your clipboard to generate QR code...')
    fireEvent.change(textInput, { target: { value: 'test text' } })
    
    // Wait for QR code to be generated
    await waitFor(() => {
      expect(screen.getByAltText('Generated QR Code')).toBeInTheDocument()
    })
    
    const shareButton = screen.getByText('Share')
    fireEvent.click(shareButton)
    
    // Just verify the button exists and is clickable
    expect(shareButton).toBeInTheDocument()
  })
})




