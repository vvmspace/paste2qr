import { execSync } from 'child_process';

function testEnvVars() {
  console.log('🔧 Testing Environment Variables...');
  
  // Test with Spanish locale
  console.log('🇪🇸 Testing with DEFAULT_LOCALE=es...');
  
  try {
    const result = execSync('DEFAULT_LOCALE=es node -e "console.log(\'DEFAULT_LOCALE:\', process.env.DEFAULT_LOCALE)"', { 
      encoding: 'utf8',
      env: { ...process.env, DEFAULT_LOCALE: 'es' }
    });
    
    console.log('✅ Environment variable result:');
    console.log(result);
    
    // Test the getDefaultLocale function
    const localeTest = execSync('DEFAULT_LOCALE=es node -e "const { getDefaultLocale } = require(\'./src/lib/locales.ts\'); console.log(\'getDefaultLocale():\', getDefaultLocale())"', { 
      encoding: 'utf8',
      env: { ...process.env, DEFAULT_LOCALE: 'es' }
    });
    
    console.log('✅ getDefaultLocale() result:');
    console.log(localeTest);
    
  } catch (error) {
    console.error('❌ Error testing environment variables:', error.message);
  }
  
  // Test with English locale
  console.log('🇺🇸 Testing with DEFAULT_LOCALE=en...');
  
  try {
    const result = execSync('DEFAULT_LOCALE=en node -e "console.log(\'DEFAULT_LOCALE:\', process.env.DEFAULT_LOCALE)"', { 
      encoding: 'utf8',
      env: { ...process.env, DEFAULT_LOCALE: 'en' }
    });
    
    console.log('✅ Environment variable result:');
    console.log(result);
    
  } catch (error) {
    console.error('❌ Error testing environment variables:', error.message);
  }
}

testEnvVars();

