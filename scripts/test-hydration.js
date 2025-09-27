import puppeteer from 'puppeteer';

async function testHydration() {
  console.log('🔄 Testing Hydration Issues...');
  
  const browser = await puppeteer.launch({ 
    headless: false,
    defaultViewport: { width: 375, height: 667 }
  });
  
  try {
    const page = await browser.newPage();
    
    // Enable console logging
    page.on('console', msg => {
      if (msg.type() === 'error') {
        console.log('🚨 Console Error:', msg.text());
      }
    });
    
    // Test main page
    console.log('📄 Testing main page hydration...');
    await page.goto('http://localhost:3000');
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Take screenshot
    await page.screenshot({ path: 'hydration-main.png', fullPage: true });
    console.log('📸 Screenshot saved as hydration-main.png');
    
    // Check for hydration errors
    const hydrationErrors = await page.evaluate(() => {
      const errors = [];
      
      // Check for hydration mismatch errors
      const body = document.body;
      if (body && body.innerHTML.includes('hydration')) {
        errors.push('Hydration mismatch detected in body');
      }
      
      // Check console for errors
      const consoleErrors = window.console.error.toString();
      if (consoleErrors.includes('hydration') || consoleErrors.includes('mismatch')) {
        errors.push('Console hydration errors detected');
      }
      
      // Check for i18next errors
      if (window.i18next && window.i18next.isInitialized) {
        const currentLang = window.i18next.language;
        const htmlLang = document.documentElement.getAttribute('lang');
        
        if (currentLang !== htmlLang) {
          errors.push(`Language mismatch: i18next=${currentLang}, html=${htmlLang}`);
        }
      }
      
      return {
        errors,
        i18nextInitialized: window.i18next ? window.i18next.isInitialized : false,
        currentLanguage: window.i18next ? window.i18next.language : 'unknown',
        htmlLang: document.documentElement.getAttribute('lang'),
        bodyContent: body ? body.textContent.substring(0, 200) : 'no body'
      };
    });
    
    console.log('🔄 Hydration Check Results:');
    console.log(`   Errors: ${hydrationErrors.errors.length}`);
    if (hydrationErrors.errors.length > 0) {
      hydrationErrors.errors.forEach(error => console.log(`   ❌ ${error}`));
    }
    console.log(`   i18next Initialized: ${hydrationErrors.i18nextInitialized}`);
    console.log(`   Current Language: ${hydrationErrors.currentLanguage}`);
    console.log(`   HTML Lang: ${hydrationErrors.htmlLang}`);
    console.log(`   Body Content: ${hydrationErrors.bodyContent}...`);
    
    // Test Spanish page
    console.log('📄 Testing Spanish page hydration...');
    await page.goto('http://localhost:3000/es');
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Take screenshot
    await page.screenshot({ path: 'hydration-spanish.png', fullPage: true });
    console.log('📸 Screenshot saved as hydration-spanish.png');
    
    // Check Spanish page hydration
    const spanishHydration = await page.evaluate(() => {
      const errors = [];
      
      // Check for hydration mismatch errors
      const body = document.body;
      if (body && body.innerHTML.includes('hydration')) {
        errors.push('Hydration mismatch detected in body');
      }
      
      // Check for i18next errors
      if (window.i18next && window.i18next.isInitialized) {
        const currentLang = window.i18next.language;
        const htmlLang = document.documentElement.getAttribute('lang');
        
        if (currentLang !== htmlLang) {
          errors.push(`Language mismatch: i18next=${currentLang}, html=${htmlLang}`);
        }
      }
      
      return {
        errors,
        i18nextInitialized: window.i18next ? window.i18next.isInitialized : false,
        currentLanguage: window.i18next ? window.i18next.language : 'unknown',
        htmlLang: document.documentElement.getAttribute('lang'),
        bodyContent: body ? body.textContent.substring(0, 200) : 'no body'
      };
    });
    
    console.log('🔄 Spanish Page Hydration Check:');
    console.log(`   Errors: ${spanishHydration.errors.length}`);
    if (spanishHydration.errors.length > 0) {
      spanishHydration.errors.forEach(error => console.log(`   ❌ ${error}`));
    }
    console.log(`   i18next Initialized: ${spanishHydration.i18nextInitialized}`);
    console.log(`   Current Language: ${spanishHydration.currentLanguage}`);
    console.log(`   HTML Lang: ${spanishHydration.htmlLang}`);
    console.log(`   Body Content: ${spanishHydration.bodyContent}...`);
    
    // Test menu hydration
    console.log('🧭 Testing menu hydration...');
    await page.goto('http://localhost:3000');
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Open menu
    const menuButton = await page.$('button[aria-label="Open menu"]');
    if (menuButton) {
      await menuButton.click();
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Take screenshot
      await page.screenshot({ path: 'hydration-menu.png', fullPage: true });
      console.log('📸 Screenshot saved as hydration-menu.png');
      
      // Check menu hydration
      const menuHydration = await page.evaluate(() => {
        const menu = document.querySelector('[role="dialog"]');
        const errors = [];
        
        if (!menu) {
          errors.push('Menu not found');
        } else {
          // Check if menu content is properly rendered
          const menuItems = menu.querySelectorAll('nav a');
          if (menuItems.length === 0) {
            errors.push('No menu items found');
          }
          
          // Check for hydration mismatches in menu
          if (menu.innerHTML.includes('hydration')) {
            errors.push('Menu hydration mismatch detected');
          }
        }
        
        return {
          errors,
          menuFound: !!menu,
          menuItemsCount: menu ? menu.querySelectorAll('nav a').length : 0
        };
      });
      
      console.log('🔄 Menu Hydration Check:');
      console.log(`   Errors: ${menuHydration.errors.length}`);
      if (menuHydration.errors.length > 0) {
        menuHydration.errors.forEach(error => console.log(`   ❌ ${error}`));
      }
      console.log(`   Menu Found: ${menuHydration.menuFound}`);
      console.log(`   Menu Items: ${menuHydration.menuItemsCount}`);
    }
    
    // Test QR generator hydration
    console.log('🔲 Testing QR generator hydration...');
    await page.goto('http://localhost:3000');
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Check QR generator
    const qrHydration = await page.evaluate(() => {
      const qrContainer = document.querySelector('[data-testid="qr-generator"]');
      const errors = [];
      
      if (!qrContainer) {
        errors.push('QR generator container not found');
      } else {
        // Check for hydration mismatches
        if (qrContainer.innerHTML.includes('hydration')) {
          errors.push('QR generator hydration mismatch detected');
        }
        
        // Check if QR generator is properly initialized
        const textarea = qrContainer.querySelector('textarea');
        if (!textarea) {
          errors.push('QR generator textarea not found');
        }
      }
      
      return {
        errors,
        qrContainerFound: !!qrContainer,
        textareaFound: qrContainer ? !!qrContainer.querySelector('textarea') : false
      };
    });
    
    console.log('🔄 QR Generator Hydration Check:');
    console.log(`   Errors: ${qrHydration.errors.length}`);
    if (qrHydration.errors.length > 0) {
      qrHydration.errors.forEach(error => console.log(`   ❌ ${error}`));
    }
    console.log(`   QR Container Found: ${qrHydration.qrContainerFound}`);
    console.log(`   Textarea Found: ${qrHydration.textareaFound}`);
    
    // Overall hydration status
    const totalErrors = hydrationErrors.errors.length + spanishHydration.errors.length + (menuHydration?.errors.length || 0) + qrHydration.errors.length;
    
    if (totalErrors === 0) {
      console.log('✅ No hydration errors detected!');
    } else {
      console.log(`⚠️  ${totalErrors} hydration issues found`);
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  } finally {
    await browser.close();
  }
}

testHydration().catch(console.error);

