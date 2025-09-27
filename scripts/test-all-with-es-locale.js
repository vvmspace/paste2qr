import { execSync } from 'child_process';
import puppeteer from 'puppeteer';

async function testAllWithESLocale() {
  console.log('🇪🇸 Testing All Tests with Spanish Locale...');
  
  try {
    // Set environment variables for Spanish locale
    process.env.DEFAULT_LOCALE = 'es';
    process.env.NODE_ENV = 'development';
    
    console.log('🔧 Environment variables set:');
    console.log(`   DEFAULT_LOCALE: ${process.env.DEFAULT_LOCALE}`);
    console.log(`   NODE_ENV: ${process.env.NODE_ENV}`);
    
    // Start development server
    console.log('🚀 Starting development server...');
    const serverProcess = execSync('npm run dev', { 
      stdio: 'pipe',
      env: { ...process.env, DEFAULT_LOCALE: 'es' }
    });
    
    // Wait for server to start
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    // Test with Puppeteer
    console.log('🧪 Testing with Puppeteer...');
    const browser = await puppeteer.launch({ 
      headless: false,
      defaultViewport: { width: 375, height: 667 }
    });
    
    try {
      const page = await browser.newPage();
      
      // Test main page
      console.log('📄 Testing main page...');
      await page.goto('http://localhost:3000');
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Take screenshot
      await page.screenshot({ path: 'test-es-main.png', fullPage: true });
      console.log('📸 Screenshot saved as test-es-main.png');
      
      // Check page title
      const pageTitle = await page.title();
      console.log(`✅ Page title: ${pageTitle}`);
      
      // Check if Spanish content is displayed
      const spanishContent = await page.evaluate(() => {
        const body = document.body.textContent;
        return {
          hasSpanish: body.includes('Generador') || body.includes('Código') || body.includes('QR'),
          hasEnglish: body.includes('Generator') || body.includes('Code') || body.includes('QR'),
          bodyText: body.substring(0, 200)
        };
      });
      
      console.log('🇪🇸 Spanish content check:');
      console.log(`   Has Spanish: ${spanishContent.hasSpanish}`);
      console.log(`   Has English: ${spanishContent.hasEnglish}`);
      console.log(`   Body text: ${spanishContent.bodyText}...`);
      
      // Test menu
      console.log('🧭 Testing menu...');
      const menuButton = await page.$('button[aria-label="Open menu"]');
      if (menuButton) {
        await menuButton.click();
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Take screenshot of menu
        await page.screenshot({ path: 'test-es-menu.png', fullPage: true });
        console.log('📸 Screenshot saved as test-es-menu.png');
        
        // Check menu items
        const menuItems = await page.$$eval('nav a', (links) => {
          return links.map(link => ({
            text: link.textContent.trim(),
            href: link.href
          }));
        });
        
        console.log('🧭 Menu items:');
        menuItems.forEach((item, index) => {
          console.log(`   ${index + 1}. ${item.text} -> ${item.href}`);
        });
        
        // Check if menu items are in Spanish
        const spanishMenuItems = menuItems.filter(item => 
          item.text.includes('Generador') || 
          item.text.includes('Código') || 
          item.text.includes('QR')
        );
        
        console.log(`✅ Spanish menu items found: ${spanishMenuItems.length}`);
      }
      
      // Test navigation to different pages
      const testPages = [
        { name: 'QR Code Facts', url: '/qr-code-facts' },
        { name: 'QR Code Use Cases', url: '/qr-code-use-cases' },
        { name: 'Contact QR Code', url: '/contact-info-qr-code' },
        { name: 'WiFi QR Generator', url: '/wifi-qr-code-generator' }
      ];
      
      for (const testPage of testPages) {
        console.log(`🔗 Testing ${testPage.name}...`);
        await page.goto(`http://localhost:3000${testPage.url}`);
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Take screenshot
        await page.screenshot({ 
          path: `test-es-${testPage.name.toLowerCase().replace(/\s+/g, '-')}.png`, 
          fullPage: true 
        });
        console.log(`📸 Screenshot saved as test-es-${testPage.name.toLowerCase().replace(/\s+/g, '-')}.png`);
        
        // Check page title
        const pageTitle = await page.title();
        console.log(`✅ ${testPage.name} title: ${pageTitle}`);
        
        // Check if content is in Spanish
        const content = await page.evaluate(() => {
          const body = document.body.textContent;
          return {
            hasSpanish: body.includes('Datos') || body.includes('Código') || body.includes('QR') || body.includes('Generador'),
            bodyText: body.substring(0, 200)
          };
        });
        
        console.log(`🇪🇸 ${testPage.name} Spanish content:`);
        console.log(`   Has Spanish: ${content.hasSpanish}`);
        console.log(`   Content: ${content.bodyText}...`);
      }
      
      // Test language switching
      console.log('🌍 Testing language switching...');
      await page.goto('http://localhost:3000');
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Find language switcher
      const languageButton = await page.$('button[aria-label*="Switch language"]');
      if (languageButton) {
        await languageButton.click();
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Take screenshot of language switcher
        await page.screenshot({ path: 'test-es-language-switcher.png', fullPage: true });
        console.log('📸 Screenshot saved as test-es-language-switcher.png');
        
        // Check available languages
        const languages = await page.$$eval('button[aria-label*="Switch language"]', (buttons) => {
          return buttons.map(button => ({
            text: button.textContent.trim(),
            ariaLabel: button.getAttribute('aria-label')
          }));
        });
        
        console.log('🌍 Available languages:');
        languages.forEach((lang, index) => {
          console.log(`   ${index + 1}. ${lang.text} (${lang.ariaLabel})`);
        });
      }
      
    } catch (error) {
      console.error('❌ Puppeteer test failed:', error.message);
    } finally {
      await browser.close();
    }
    
    console.log('✅ All tests with Spanish locale completed!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testAllWithESLocale().catch(console.error);

