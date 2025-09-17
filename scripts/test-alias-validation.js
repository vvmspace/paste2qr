// Test alias validation logic
function isValidAlias(alias) {
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

function aliasToText(alias) {
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

// Test cases
const testCases = [
  'hello-world',
  'https%3A%2F%2Fexample.com',
  'b64_aGVsbG8gd29ybGQ',
  'b64_0J_RgNC40LLQtdGCINC80LjRgA',
  'b64_5L2g5aW95LiW55WM',
  'zzz'
]

console.log('🔍 Testing Alias Validation...')

testCases.forEach(alias => {
  console.log(`\n✅ Testing: "${alias}"`)
  
  const isValid = isValidAlias(alias)
  console.log(`   Is valid: ${isValid ? '✓' : '❌'}`)
  
  if (isValid) {
    try {
      const text = aliasToText(alias)
      console.log(`   Decoded text: "${text}"`)
    } catch (error) {
      console.log(`   Decode error: ${error.message}`)
    }
  }
})
