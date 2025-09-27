import puppeteer from 'puppeteer';

async function testMainPageESLocale() {
  console.log('🇪🇸 Testing Main Page with Spanish Locale...');
  
  const browser = await puppeteer.launch({ 
    headless: false,
    defaultViewport: { width: 375, height: 667 }
  });
  
  try {
    const page = await browser.newPage();
    
    // Test main page (should be Spanish with DEFAULT_LOCALE=es)
    console.log('📄 Testing main page (/) with Spanish locale...');
    await page.goto('http://localhost:3000');
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Take screenshot
    await page.screenshot({ path: 'main-page-es-locale.png', fullPage: true });
    console.log('📸 Screenshot saved as main-page-es-locale.png');
    
    // Check page title
    const pageTitle = await page.title();
    console.log(`✅ Page title: ${pageTitle}`);
    
    // Check if it's Spanish title
    const isSpanishTitle = pageTitle.includes('Pegar') || pageTitle.includes('Código') || pageTitle.includes('Generador');
    console.log(`🇪🇸 Is Spanish title: ${isSpanishTitle}`);
    
    // Check page content
    const content = await page.evaluate(() => {
      const body = document.body.textContent;
      const h1 = document.querySelector('h1')?.textContent || '';
      const buttons = Array.from(document.querySelectorAll('button')).map(btn => btn.textContent.trim()).filter(text => text);
      const links = Array.from(document.querySelectorAll('a')).map(link => link.textContent.trim()).filter(text => text);
      
      return {
        bodyText: body.substring(0, 500),
        h1: h1,
        buttons: buttons,
        links: links,
        hasSpanish: body.includes('Pegar') || body.includes('Código') || body.includes('Generador') || body.includes('Descargar'),
        hasEnglish: body.includes('Paste') || body.includes('Code') || body.includes('Generator') || body.includes('Download')
      };
    });
    
    console.log('🇪🇸 Content analysis:');
    console.log(`   H1: ${content.h1}`);
    console.log(`   Has Spanish: ${content.hasSpanish}`);
    console.log(`   Has English: ${content.hasEnglish}`);
    console.log(`   Buttons: ${content.buttons.join(', ')}`);
    console.log(`   Links: ${content.links.slice(0, 5).join(', ')}`);
    console.log(`   Body text: ${content.bodyText}...`);
    
    // Check if buttons are in Spanish
    const spanishButtons = content.buttons.filter(btn => 
      btn.includes('Pegar') || btn.includes('Descargar') || btn.includes('Instalar')
    );
    console.log(`🇪🇸 Spanish buttons found: ${spanishButtons.length}`);
    if (spanishButtons.length > 0) {
      console.log(`   Spanish buttons: ${spanishButtons.join(', ')}`);
    }
    
    // Check if links are in Spanish
    const spanishLinks = content.links.filter(link => 
      link.includes('Generador') || link.includes('Código') || link.includes('QR') || link.includes('Inicio')
    );
    console.log(`🇪🇸 Spanish links found: ${spanishLinks.length}`);
    if (spanishLinks.length > 0) {
      console.log(`   Spanish links: ${spanishLinks.slice(0, 3).join(', ')}`);
    }
    
    // Check meta description
    const metaDescription = await page.evaluate(() => {
      const meta = document.querySelector('meta[name="description"]');
      return meta ? meta.getAttribute('content') : '';
    });
    
    console.log(`📝 Meta description: ${metaDescription}`);
    const isSpanishMeta = metaDescription.includes('Genera') || metaDescription.includes('códigos') || metaDescription.includes('QR');
    console.log(`🇪🇸 Is Spanish meta: ${isSpanishMeta}`);
    
    // Check language attribute
    const htmlLang = await page.evaluate(() => {
      return document.documentElement.getAttribute('lang');
    });
    
    console.log(`🌍 HTML lang attribute: ${htmlLang}`);
    
    // Check if the page is actually in Spanish
    const isSpanishPage = isSpanishTitle && content.hasSpanish && !content.hasEnglish;
    console.log(`✅ Is main page in Spanish: ${isSpanishPage}`);
    
    if (!isSpanishPage) {
      console.log('⚠️  WARNING: Main page is not in Spanish despite DEFAULT_LOCALE=es');
      console.log('   This might indicate a configuration issue');
    } else {
      console.log('✅ SUCCESS: Main page is properly in Spanish');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  } finally {
    await browser.close();
  }
}

testMainPageESLocale().catch(console.error);

