import {
  generateAlias,
  aliasToText,
  isTextCompatible,
  formatFileSize,
  debounce,
  throttle,
  generateRandomString,
  isMobile,
  copyToClipboard,
  downloadFile,
  getOptimalQRSize,
  isValidUrl,
  extractDomain,
} from '@/lib/utils'

describe('Utils', () => {
  describe('generateAlias', () => {
    it('generates a valid alias from text', () => {
      const alias = generateAlias('Hello World')
      expect(alias).toBe('hello-world')
    })

    it('handles special characters', () => {
      const alias = generateAlias('Hello, World!')
      expect(alias).toBe('hello-world')
    })

    it('generates random alias for short text', () => {
      const alias = generateAlias('Hi')
      expect(alias).toMatch(/^qr-[a-z0-9]+$/)
    })

    it('limits alias length', () => {
      const longText = 'a'.repeat(100)
      const alias = generateAlias(longText)
      expect(alias.length).toBeLessThanOrEqual(50)
    })
  })

  describe('aliasToText', () => {
    it('converts alias back to text', () => {
      const text = aliasToText('hello-world')
      expect(text).toBe('hello world')
    })
  })

  describe('isTextCompatible', () => {
    it('returns true for compatible text', () => {
      expect(isTextCompatible('Hello World')).toBe(true)
    })

    it('returns false for incompatible text', () => {
      expect(isTextCompatible('Hi')).toBe(false)
    })
  })

  describe('formatFileSize', () => {
    it('formats bytes correctly', () => {
      expect(formatFileSize(0)).toBe('0 Bytes')
      expect(formatFileSize(1024)).toBe('1 KB')
      expect(formatFileSize(1048576)).toBe('1 MB')
    })
  })

  describe('debounce', () => {
    it('debounces function calls', (done) => {
      const mockFn = jest.fn()
      const debouncedFn = debounce(mockFn, 100)
      
      debouncedFn()
      debouncedFn()
      debouncedFn()
      
      setTimeout(() => {
        expect(mockFn).toHaveBeenCalledTimes(1)
        done()
      }, 150)
    })
  })

  describe('throttle', () => {
    it('throttles function calls', (done) => {
      const mockFn = jest.fn()
      const throttledFn = throttle(mockFn, 100)
      
      throttledFn()
      throttledFn()
      throttledFn()
      
      setTimeout(() => {
        expect(mockFn).toHaveBeenCalledTimes(1)
        done()
      }, 50)
    })
  })

  describe('generateRandomString', () => {
    it('generates string of correct length', () => {
      const str = generateRandomString(10)
      expect(str).toHaveLength(10)
    })

    it('generates different strings', () => {
      const str1 = generateRandomString(10)
      const str2 = generateRandomString(10)
      expect(str1).not.toBe(str2)
    })
  })

  describe('isMobile', () => {
    it('detects mobile user agent', () => {
      Object.defineProperty(navigator, 'userAgent', {
        value: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)',
        configurable: true,
      })
      
      expect(isMobile()).toBe(true)
    })

    it('detects desktop user agent', () => {
      Object.defineProperty(navigator, 'userAgent', {
        value: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        configurable: true,
      })
      
      expect(isMobile()).toBe(false)
    })
  })

  describe('getOptimalQRSize', () => {
    it('returns correct size for short text', () => {
      expect(getOptimalQRSize(10)).toBe(128)
    })

    it('returns correct size for medium text', () => {
      expect(getOptimalQRSize(50)).toBe(256)
    })

    it('returns correct size for long text', () => {
      expect(getOptimalQRSize(150)).toBe(320)
    })
  })

  describe('isValidUrl', () => {
    it('validates correct URLs', () => {
      expect(isValidUrl('https://example.com')).toBe(true)
      expect(isValidUrl('http://example.com')).toBe(true)
    })

    it('rejects invalid URLs', () => {
      expect(isValidUrl('not-a-url')).toBe(false)
      expect(isValidUrl('')).toBe(false)
    })
  })

  describe('extractDomain', () => {
    it('extracts domain from URL', () => {
      expect(extractDomain('https://example.com/path')).toBe('example.com')
    })

    it('returns empty string for invalid URL', () => {
      expect(extractDomain('not-a-url')).toBe('')
    })
  })
})










