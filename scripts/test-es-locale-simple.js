import puppeteer from 'puppeteer';

async function testESLocaleSimple() {
  console.log('🇪🇸 Testing Spanish Locale...');
  
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
    await page.screenshot({ path: 'es-locale-main.png', fullPage: true });
    console.log('📸 Screenshot saved as es-locale-main.png');
    
    // Check page title
    const pageTitle = await page.title();
    console.log(`✅ Page title: ${pageTitle}`);
    
    // Check if Spanish content is displayed
    const content = await page.evaluate(() => {
      const body = document.body.textContent;
      return {
        hasSpanish: body.includes('Generador') || body.includes('Código') || body.includes('QR'),
        hasEnglish: body.includes('Generator') || body.includes('Code') || body.includes('QR'),
        bodyText: body.substring(0, 300)
      };
    });
    
    console.log('🇪🇸 Content check:');
    console.log(`   Has Spanish: ${content.hasSpanish}`);
    console.log(`   Has English: ${content.hasEnglish}`);
    console.log(`   Body text: ${content.bodyText}...`);
    
    // Test Spanish URL directly
    console.log('🔗 Testing Spanish URL directly...');
    await page.goto('http://localhost:3000/es');
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Take screenshot
    await page.screenshot({ path: 'es-locale-spanish-url.png', fullPage: true });
    console.log('📸 Screenshot saved as es-locale-spanish-url.png');
    
    // Check page title
    const spanishTitle = await page.title();
    console.log(`✅ Spanish page title: ${spanishTitle}`);
    
    // Check if Spanish content is displayed
    const spanishContent = await page.evaluate(() => {
      const body = document.body.textContent;
      return {
        hasSpanish: body.includes('Generador') || body.includes('Código') || body.includes('QR'),
        hasEnglish: body.includes('Generator') || body.includes('Code') || body.includes('QR'),
        bodyText: body.substring(0, 300)
      };
    });
    
    console.log('🇪🇸 Spanish URL content check:');
    console.log(`   Has Spanish: ${spanishContent.hasSpanish}`);
    console.log(`   Has English: ${spanishContent.hasEnglish}`);
    console.log(`   Body text: ${spanishContent.bodyText}...`);
    
    // Test menu in Spanish
    console.log('🧭 Testing menu in Spanish...');
    const menuButton = await page.$('button[aria-label="Open menu"]');
    if (menuButton) {
      await menuButton.click();
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Take screenshot of menu
      await page.screenshot({ path: 'es-locale-menu.png', fullPage: true });
      console.log('📸 Screenshot saved as es-locale-menu.png');
      
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
        item.text.includes('QR') ||
        item.text.includes('Inicio') ||
        item.text.includes('Datos') ||
        item.text.includes('Casos')
      );
      
      console.log(`✅ Spanish menu items found: ${spanishMenuItems.length}`);
      if (spanishMenuItems.length > 0) {
        console.log('🇪🇸 Spanish menu items:');
        spanishMenuItems.forEach((item, index) => {
          console.log(`   ${index + 1}. ${item.text}`);
        });
      }
    }
    
    // Test navigation to Spanish facts page
    console.log('🔗 Testing Spanish facts page...');
    await page.goto('http://localhost:3000/es/qr-code-facts');
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Take screenshot
    await page.screenshot({ path: 'es-locale-facts.png', fullPage: true });
    console.log('📸 Screenshot saved as es-locale-facts.png');
    
    // Check page title
    const factsTitle = await page.title();
    console.log(`✅ Spanish facts title: ${factsTitle}`);
    
    // Check if content is in Spanish
    const factsContent = await page.evaluate(() => {
      const body = document.body.textContent;
      return {
        hasSpanish: body.includes('Datos') || body.includes('Código') || body.includes('QR') || body.includes('Generador'),
        bodyText: body.substring(0, 300)
      };
    });
    
    console.log('🇪🇸 Spanish facts content:');
    console.log(`   Has Spanish: ${factsContent.hasSpanish}`);
    console.log(`   Content: ${factsContent.bodyText}...`);
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  } finally {
    await browser.close();
  }
}

testESLocaleSimple().catch(console.error);

