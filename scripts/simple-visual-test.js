import puppeteer from 'puppeteer';

async function simpleVisualTest() {
  console.log('👁️ Simple visual test...');
  
  const browser = await puppeteer.launch({ 
    headless: false,
    defaultViewport: { width: 375, height: 667 }
  });
  
  try {
    const page = await browser.newPage();
    
    // Go to the page
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
    await page.waitForSelector('h1', { timeout: 10000 });
    
    // Wait a bit for everything to load
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Take a comprehensive screenshot
    await page.screenshot({ 
      path: 'test-results/current-state.png',
      fullPage: true 
    });
    
    console.log('📸 Screenshot taken - current state');
    
    // Check if dark mode is active
    const isDarkMode = await page.evaluate(() => {
      return document.documentElement.classList.contains('dark');
    });
    console.log('Dark mode active:', isDarkMode);
    
    // Check language button
    const languageButton = await page.$('button[aria-label*="language"]');
    if (languageButton) {
      const buttonText = await languageButton.evaluate(el => el.textContent);
      console.log('Language button text:', buttonText);
    }
    
  } catch (error) {
    console.error('❌ Visual test failed:', error.message);
  } finally {
    await browser.close();
  }
}

// Run the simple visual test
simpleVisualTest().catch(console.error);
