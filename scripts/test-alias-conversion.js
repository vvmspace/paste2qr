// Test alias conversion functionality
import { textToAlias, aliasToText, isValidAlias } from '../src/lib/alias.ts'

function testAliasConversion() {
  console.log('🔄 Testing Alias Conversion...')

  const testCases = [
    // Latin-compatible text (should be used as-is)
    { text: 'hello-world', expected: 'hello-world' },
    { text: 'https://example.com', expected: 'https%3A%2F%2Fexample.com' },
    { text: 'simple_text_123', expected: 'simple_text_123' },
    
    // Non-Latin text (should be base64 encoded)
    { text: 'Привет мир', expected: 'b64_0J_RgNC40LLQtdGCLCDQvNC40YA%3D%3D' },
    { text: '你好世界', expected: 'b64_5L2g5aW95LiW55WM' },
    { text: 'Bonjour le monde', expected: 'b64_Qm9uam91ciBsZSBtb25kZQ%3D%3D' },
  ]

  let passed = 0
  let failed = 0

  testCases.forEach((testCase, index) => {
    console.log(`\n✅ Test ${index + 1}: "${testCase.text}"`)
    
    try {
      // Test text to alias conversion
      const alias = textToAlias(testCase.text)
      console.log(`   Text -> Alias: "${alias}"`)
      
      // Test alias to text conversion
      const convertedText = aliasToText(alias)
      console.log(`   Alias -> Text: "${convertedText}"`)
      
      // Test validation
      const isValid = isValidAlias(alias)
      console.log(`   Is valid alias: ${isValid ? '✓' : '❌'}`)
      
      // Check if conversion is correct
      const isCorrect = convertedText === testCase.text
      console.log(`   Conversion correct: ${isCorrect ? '✓' : '❌'}`)
      
      if (isCorrect && isValid) {
        passed++
      } else {
        failed++
      }
    } catch (error) {
      console.log(`   Error: ${error.message}`)
      failed++
    }
  })

  console.log(`\n📊 Results: ${passed} passed, ${failed} failed`)
  
  if (failed === 0) {
    console.log('🎉 All alias conversion tests passed!')
  } else {
    console.log('❌ Some alias conversion tests failed!')
    process.exit(1)
  }
}

testAliasConversion()
