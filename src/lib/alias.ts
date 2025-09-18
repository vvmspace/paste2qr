/**
 * Alias generation utilities
 * Works in both directions: text -> alias and alias -> text
 */

/**
 * Convert text to URL-safe alias
 * If text is already Latin-compatible, use as-is
 * Otherwise, convert to a reversible format
 */
export function textToAlias(text: string): string {
  // If text is already Latin-compatible and URL-safe, use as-is
  if (isLatinCompatible(text)) {
    return encodeURIComponent(text)
  }
  
  // For non-Latin text, use base64 encoding with prefix
  const encoded = btoa(unescape(encodeURIComponent(text)))
  // Make base64 URL-safe by replacing + with - and / with _
  const urlSafeEncoded = encoded.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
  return `b64_${urlSafeEncoded}`
}

/**
 * Convert alias back to original text
 */
export function aliasToText(alias: string): string {
  try {
    // If it's a base64 encoded alias
    if (alias.startsWith('b64_')) {
      const encoded = alias.substring(4)
      // First decode URL-encoded characters
      const urlDecoded = decodeURIComponent(encoded)
      // Convert URL-safe base64 back to standard base64
      const standardBase64 = urlDecoded.replace(/-/g, '+').replace(/_/g, '/')
      // Add padding if needed
      const padded = standardBase64 + '='.repeat((4 - standardBase64.length % 4) % 4)
      return decodeURIComponent(escape(atob(padded)))
    }
    
    // Otherwise, it's a direct encoding
    return decodeURIComponent(alias)
  } catch (error) {
    console.error('Error decoding alias:', error)
    throw new Error('Invalid alias format')
  }
}

/**
 * Check if text is Latin-compatible and URL-safe
 */
function isLatinCompatible(text: string): boolean {
  // Check if text contains only Latin characters, numbers, and common symbols
  const latinRegex = /^[a-zA-Z0-9\-_\.~!*'();:@&=+$,/?#\[\]]+$/
  return latinRegex.test(text) && text.length <= 100 // Reasonable length limit
}

/**
 * Generate a unique alias for storage
 * Combines timestamp with text hash for uniqueness
 */
export function generateUniqueAlias(text: string): string {
  // Use a static timestamp to avoid hydration mismatch
  const timestamp = 'static'
  const textHash = simpleHash(text).toString(36)
  return `${timestamp}_${textHash}`
}

/**
 * Simple hash function for text
 */
function simpleHash(str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32-bit integer
  }
  return Math.abs(hash)
}

/**
 * Validate alias format
 */
export function isValidAlias(alias: string): boolean {
  // Check if it's a base64 encoded alias
  if (alias.startsWith('b64_')) {
    const encoded = alias.substring(4)
    // First decode URL-encoded characters
    try {
      const urlDecoded = decodeURIComponent(encoded)
      // Convert URL-safe base64 back to standard base64
      const standardBase64 = urlDecoded.replace(/-/g, '+').replace(/_/g, '/')
      // Add padding if needed
      const padded = standardBase64 + '='.repeat((4 - standardBase64.length % 4) % 4)
      atob(padded)
      return true
    } catch {
      return false
    }
  }
  
  // Check if it's a URL-encoded alias
  try {
    decodeURIComponent(alias)
    return true
  } catch {
    return false
  }
}

