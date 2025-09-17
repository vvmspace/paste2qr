import puppeteer from 'puppeteer';

async function detailedVisualCheck() {
  console.log('👁️ Detailed visual check of the application...');
  
  const browser = await puppeteer.launch({ 
    headless: false,
    defaultViewport: { width: 375, height: 667 }
  });
  
  try {
    const page = await browser.newPage();
    
    // Go to the page
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
    await page.waitForSelector('h1', { timeout: 10000 });
    
    // 1. Light theme - main view
    console.log('📸 Taking light theme screenshot...');
    await page.screenshot({ path: 'test-results/visual-01-light-main.png' });
    
    // 2. Language switcher open
    console.log('📸 Taking language switcher screenshot...');
    const languageSwitcher = await page.$('button[aria-label*="language"]');
    if (languageSwitcher) {
      await languageSwitcher.click();
      await new Promise(resolve => setTimeout(resolve, 1000));
      await page.screenshot({ path: 'test-results/visual-02-language-open.png' });
      
      // Close dropdown
      await page.click('body');
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    // 3. Menu open
    console.log('📸 Taking menu screenshot...');
    const menuButton = await page.$('button[aria-label="Menu"]');
    if (menuButton) {
      await menuButton.click();
      await new Promise(resolve => setTimeout(resolve, 1000));
      await page.screenshot({ path: 'test-results/visual-03-menu-open.png' });
      
      // Close menu
      await page.click('body');
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    // 4. Dark theme
    console.log('📸 Taking dark theme screenshot...');
    const themeToggle = await page.$('button[aria-label*="theme"]');
    if (themeToggle) {
      await themeToggle.click();
      await new Promise(resolve => setTimeout(resolve, 1000));
      await page.screenshot({ path: 'test-results/visual-04-dark-main.png' });
    }
    
    // 5. Dark theme - language switcher
    console.log('📸 Taking dark theme language switcher screenshot...');
    if (languageSwitcher) {
      await languageSwitcher.click();
      await new Promise(resolve => setTimeout(resolve, 1000));
      await page.screenshot({ path: 'test-results/visual-05-dark-language.png' });
      
      // Close dropdown
      await page.click('body');
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    // 6. Dark theme - menu
    console.log('📸 Taking dark theme menu screenshot...');
    if (menuButton) {
      await menuButton.click();
      await new Promise(resolve => setTimeout(resolve, 1000));
      await page.screenshot({ path: 'test-results/visual-06-dark-menu.png' });
      
      // Close menu
      await page.click('body');
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    // 7. Add text to show action bar
    console.log('📸 Taking action bar screenshot...');
    const textarea = await page.$('textarea');
    if (textarea) {
      await textarea.click();
      await textarea.type('Visual check of the application');
      await new Promise(resolve => setTimeout(resolve, 2000));
      await page.screenshot({ path: 'test-results/visual-07-action-bar.png' });
    }
    
    console.log('🎉 Visual check completed!');
    console.log('📸 Check the screenshots in test-results/ to see all visual issues');
    
  } catch (error) {
    console.error('❌ Visual check failed:', error.message);
  } finally {
    await browser.close();
  }
}

// Run the detailed visual check
detailedVisualCheck().catch(console.error);
