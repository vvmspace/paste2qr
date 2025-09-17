import '@testing-library/jest-dom'

// Mock next/router
jest.mock('next/router', () => ({
  useRouter() {
    return {
      route: '/',
      pathname: '/',
      query: {},
      asPath: '/',
      push: jest.fn(),
      pop: jest.fn(),
      reload: jest.fn(),
      back: jest.fn(),
      prefetch: jest.fn().mockResolvedValue(undefined),
      beforePopState: jest.fn(),
      events: {
        on: jest.fn(),
        off: jest.fn(),
        emit: jest.fn(),
      },
      isFallback: false,
    }
  },
}))

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
    }
  },
  useSearchParams() {
    return new URLSearchParams()
  },
  usePathname() {
    return '/'
  },
}))

// Mock i18next
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => {
      // Return actual translations for common keys
      const translations = {
        'common.paste': 'Paste',
        'common.copy': 'Copy',
        'common.share': 'Share',
        'common.download': 'Download',
        'common.install': 'Install',
        'common.notNow': 'Not now',
        'common.publish': 'Publish',
        'qr.placeholder': 'Paste any text from your clipboard to generate QR code...',
        'qr.enterText': 'Enter text to generate QR',
        'qr.alt': 'Generated QR Code',
        'qr.generating': 'Generating QR code...',
        'qr.copied': 'QR Code copied to clipboard!',
        'qr.copyFailed': 'Failed to copy QR code. Please try downloading it instead.',
        'qr.clipboardError': 'Unable to access clipboard. Please paste manually.',
        'qr.pasteInstruction': 'Please paste your text using Cmd+V (Mac) or Ctrl+V (Windows/Linux)',
        'qr.shareTitle': 'QR Code',
        'qr.shareText': 'Check out this QR code!',
        'publish.title': 'Publish QR Code',
        'publish.pageTitle': 'Page Title',
        'publish.pageTitlePlaceholder': 'Enter page title (optional)',
        'publish.description': 'Description',
        'publish.descriptionPlaceholder': 'Enter description (optional)',
        'publish.language': 'Language',
        'publish.publishing': 'Publishing...',
        'publish.publishQR': 'Publish QR Code',
        'publish.cancel': 'Cancel',
        'publish.successHeader': 'Published Successfully',
        'publish.successTitle': 'Success!',
        'publish.successText': 'Your QR code page has been published and is ready to share!',
        'publish.publishedUrl': 'Published URL:',
        'publish.copyUrl': 'Copy URL',
        'publish.close': 'Close',
        'publish.failed': 'Failed to publish',
        'pwa.promptTitle': 'Install Paste2QR',
        'pwa.promptText': 'Install this app on your device for quick access to QR code generation.',
        'pwa.iosInstallInstructions': 'To install this app on your iOS device:\n\n1. Tap the Share button (square with arrow up)\n2. Scroll down and tap \'Add to Home Screen\'\n3. Tap \'Add\' to confirm\n\nThe app will be installed on your home screen for quick access.'
      }
      return translations[key] || key
    },
    i18n: {
      language: 'en',
      changeLanguage: jest.fn(),
      on: jest.fn(),
      off: jest.fn(),
    },
  }),
  I18nextProvider: ({ children }) => children,
}))

// Mock i18n initialization
jest.mock('./src/lib/i18n', () => ({
  i18n: {
    language: 'en',
    changeLanguage: jest.fn(),
    on: jest.fn(),
    off: jest.fn(),
  }
}))

// Mock QRCode library
jest.mock('qrcode', () => ({
  toDataURL: jest.fn().mockResolvedValue('data:image/png;base64,mock-qr-code'),
}))

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}
global.localStorage = localStorageMock

// Mock navigator.clipboard
Object.assign(navigator, {
  clipboard: {
    writeText: jest.fn().mockResolvedValue(undefined),
    write: jest.fn().mockResolvedValue(undefined),
    readText: jest.fn().mockResolvedValue(''),
  },
})

// Mock window.URL
global.URL.createObjectURL = jest.fn(() => 'mock-url')
global.URL.revokeObjectURL = jest.fn()

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
}
// Mock navigator.vibrate
Object.defineProperty(navigator, 'vibrate', {
  value: jest.fn().mockReturnValue(true),
  writable: true,
});

