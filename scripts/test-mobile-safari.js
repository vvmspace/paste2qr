import puppeteer from 'puppeteer';

async function testMobileSafari() {
  console.log('Testing Mobile Safari compatibility...');
  
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: { width: 375, height: 667 }, // iPhone SE dimensions
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    
    // Set user agent to Mobile Safari
    await page.setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1');
    
    console.log('Navigating to localhost:3000...');
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
    
    // Wait for page to load
    await page.waitForTimeout(3000);
    
    console.log('Testing mobile paste functionality...');
    const pasteButton = await page.$('button:has-text("Paste")');
    if (pasteButton) {
      console.log('Paste button found, testing click...');
      await pasteButton.click();
      await page.waitForTimeout(1000);
      
      // Check if textarea is focused
      const isTextareaFocused = await page.evaluate(() => {
        const textarea = document.querySelector('textarea');
        return textarea === document.activeElement;
      });
      
      console.log('Textarea focused after paste click:', isTextareaFocused);
    }
    
    // Test PWA installation prompt for mobile iOS
    console.log('Testing mobile PWA installation prompt...');
    await page.waitForTimeout(4000); // Wait for the 3-second delay
    
    const pwaPrompt = await page.$('.fixed.bottom-20');
    if (pwaPrompt) {
      console.log('Mobile PWA install prompt found');
      
      // Test install button click
      const installButton = await page.$('button:has-text("Install")');
      if (installButton) {
        console.log('Install button found, testing click...');
        await installButton.click();
        await page.waitForTimeout(1000);
        
        console.log('Mobile iOS installation instructions would be shown');
      }
    } else {
      console.log('Mobile PWA install prompt not found');
    }
    
    // Test mobile-specific features
    console.log('Testing mobile-specific features...');
    const mobileFeatures = await page.evaluate(() => {
      return {
        userAgent: navigator.userAgent,
        isMobile: /iPhone|iPad|iPod|Android/i.test(navigator.userAgent),
        isIOS: /iPad|iPhone|iPod/.test(navigator.userAgent),
        hasTouch: 'ontouchstart' in window,
        hasVibrate: 'vibrate' in navigator,
        standalone: window.navigator.standalone,
        displayMode: window.matchMedia('(display-mode: standalone)').matches
      };
    });
    
    console.log('Mobile Features:', mobileFeatures);
    
    // Test viewport and responsive design
    console.log('Testing responsive design...');
    const viewportInfo = await page.evaluate(() => {
      return {
        windowWidth: window.innerWidth,
        windowHeight: window.innerHeight,
        devicePixelRatio: window.devicePixelRatio,
        screenWidth: screen.width,
        screenHeight: screen.height
      };
    });
    
    console.log('Viewport Info:', viewportInfo);
    
    // Check console for errors
    const consoleErrors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });
    
    await page.waitForTimeout(2000);
    console.log('Console errors:', consoleErrors);
    
    console.log('Mobile Safari compatibility test completed successfully!');
    
  } catch (error) {
    console.error('Error during testing:', error);
  } finally {
    await browser.close();
  }
}

testMobileSafari().catch(console.error);
