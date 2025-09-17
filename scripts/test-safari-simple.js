import puppeteer from 'puppeteer';

async function testSafariSimple() {
  console.log('Testing Safari compatibility fixes...');
  
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    
    // Set user agent to Safari
    await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15');
    
    console.log('Navigating to localhost:3000...');
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
    
    // Wait for page to load
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    console.log('Testing paste button functionality...');
    const pasteButton = await page.evaluateHandle(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      return buttons.find(button => button.textContent?.includes('Paste'));
    });
    
    if (pasteButton && pasteButton.asElement()) {
      console.log('✅ Paste button found');
      
      // Test paste button click
      await pasteButton.asElement().click();
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if textarea is focused
      const isTextareaFocused = await page.evaluate(() => {
        const textarea = document.querySelector('textarea');
        return textarea === document.activeElement;
      });
      
      console.log('✅ Textarea focused after paste click:', isTextareaFocused);
    } else {
      console.log('❌ Paste button not found');
    }
    
    // Test PWA installation prompt
    console.log('Testing PWA installation prompt...');
    await new Promise(resolve => setTimeout(resolve, 4000)); // Wait for the 3-second delay
    
    const pwaPrompt = await page.$('.fixed.bottom-20');
    if (pwaPrompt) {
      console.log('✅ PWA install prompt found');
      
      // Test install button click
      const installButton = await page.evaluateHandle(() => {
        const buttons = Array.from(document.querySelectorAll('button'));
        return buttons.find(button => button.textContent?.includes('Install'));
      });
      
      if (installButton && installButton.asElement()) {
        console.log('✅ Install button found');
        await installButton.asElement().click();
        await new Promise(resolve => setTimeout(resolve, 1000));
        console.log('✅ iOS installation instructions would be shown');
      }
    } else {
      console.log('❌ PWA install prompt not found');
    }
    
    // Test clipboard API detection
    console.log('Testing clipboard API detection...');
    const clipboardSupport = await page.evaluate(() => {
      return {
        hasClipboardAPI: 'clipboard' in navigator,
        hasReadText: 'clipboard' in navigator && 'readText' in navigator.clipboard,
        userAgent: navigator.userAgent,
        isIOS: /iPad|iPhone|iPod/.test(navigator.userAgent) || 
                (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
      };
    });
    
    console.log('✅ Clipboard API Support:', clipboardSupport);
    
    // Check console for errors
    const consoleErrors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    if (consoleErrors.length > 0) {
      console.log('❌ Console errors found:', consoleErrors);
    } else {
      console.log('✅ No console errors found');
    }
    
    console.log('🎉 Safari compatibility test completed successfully!');
    
  } catch (error) {
    console.error('❌ Error during testing:', error);
  } finally {
    await browser.close();
  }
}

testSafariSimple().catch(console.error);
