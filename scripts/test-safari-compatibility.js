import puppeteer from 'puppeteer';

async function testSafariCompatibility() {
  console.log('Testing Safari compatibility issues...');
  
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
    await page.waitForTimeout(3000);
    
    console.log('Testing clipboard API availability...');
    const clipboardSupport = await page.evaluate(() => {
      return {
        hasClipboardAPI: 'clipboard' in navigator,
        hasReadText: 'clipboard' in navigator && 'readText' in navigator.clipboard,
        hasWriteText: 'clipboard' in navigator && 'writeText' in navigator.clipboard,
        hasRead: 'clipboard' in navigator && 'read' in navigator.clipboard,
        hasWrite: 'clipboard' in navigator && 'write' in navigator.clipboard,
        userAgent: navigator.userAgent
      };
    });
    
    console.log('Clipboard API Support:', clipboardSupport);
    
    // Test PWA manifest
    console.log('Testing PWA manifest...');
    const manifestCheck = await page.evaluate(() => {
      const manifestLink = document.querySelector('link[rel="manifest"]');
      return {
        hasManifest: !!manifestLink,
        manifestHref: manifestLink ? manifestLink.href : null
      };
    });
    
    console.log('PWA Manifest:', manifestCheck);
    
    // Test service worker
    console.log('Testing service worker...');
    const swCheck = await page.evaluate(() => {
      return {
        hasServiceWorker: 'serviceWorker' in navigator,
        hasBeforeInstallPrompt: 'onbeforeinstallprompt' in window
      };
    });
    
    console.log('Service Worker Support:', swCheck);
    
    // Test paste button functionality
    console.log('Testing paste button...');
    const pasteButton = await page.$('button:has-text("Paste")');
    if (pasteButton) {
      console.log('Paste button found, testing click...');
      await pasteButton.click();
      await page.waitForTimeout(1000);
      
      // Check for any error messages
      const errorMessages = await page.evaluate(() => {
        const alerts = [];
        // Check for alert dialogs or error messages
        return alerts;
      });
      
      console.log('Error messages after paste click:', errorMessages);
    } else {
      console.log('Paste button not found');
    }
    
    // Check console for errors
    const consoleErrors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });
    
    await page.waitForTimeout(2000);
    console.log('Console errors:', consoleErrors);
    
    // Test PWA installation prompt
    console.log('Testing PWA installation prompt...');
    const pwaPrompt = await page.$('[data-testid="pwa-install-prompt"]');
    if (pwaPrompt) {
      console.log('PWA install prompt found');
    } else {
      console.log('PWA install prompt not found');
    }
    
    // Check if app is installable
    const installabilityCheck = await page.evaluate(() => {
      return {
        isStandalone: window.matchMedia('(display-mode: standalone)').matches,
        isInStandaloneMode: window.navigator.standalone === true
      };
    });
    
    console.log('Installability Check:', installabilityCheck);
    
  } catch (error) {
    console.error('Error during testing:', error);
  } finally {
    await browser.close();
  }
}

testSafariCompatibility().catch(console.error);
