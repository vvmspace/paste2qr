import puppeteer from 'puppeteer';

async function testAnalytics() {
  console.log('📊 Testing Analytics Integration...');
  
  const browser = await puppeteer.launch({ 
    headless: false,
    defaultViewport: { width: 375, height: 667 }
  });
  
  try {
    const page = await browser.newPage();
    
    // Enable console logging
    page.on('console', msg => {
      if (msg.type() === 'log' && msg.text().includes('📊 Analytics')) {
        console.log('📊 Analytics Event:', msg.text());
      }
    });
    
    // Test main page
    console.log('📄 Testing main page analytics...');
    await page.goto('http://localhost:3000');
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Take screenshot
    await page.screenshot({ path: 'analytics-main.png', fullPage: true });
    console.log('📸 Screenshot saved as analytics-main.png');
    
    // Check if Google Analytics is loaded
    const analyticsLoaded = await page.evaluate(() => {
      return {
        gtagExists: typeof window.gtag === 'function',
        dataLayerExists: Array.isArray(window.dataLayer),
        analyticsScript: !!document.querySelector('script[src*="googletagmanager.com"]')
      };
    });
    
    console.log('🔍 Analytics Status:');
    console.log(`   Google Analytics Loaded: ${analyticsLoaded.gtagExists}`);
    console.log(`   Data Layer Exists: ${analyticsLoaded.dataLayerExists}`);
    console.log(`   Analytics Script: ${analyticsLoaded.analyticsScript}`);
    
    // Test menu analytics
    console.log('🧭 Testing menu analytics...');
    const menuButton = await page.$('button[aria-label="Open menu"]');
    if (menuButton) {
      await menuButton.click();
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Take screenshot
      await page.screenshot({ path: 'analytics-menu.png', fullPage: true });
      console.log('📸 Screenshot saved as analytics-menu.png');
    }
    
    // Test QR generator analytics
    console.log('🔲 Testing QR generator analytics...');
    const textarea = await page.$('textarea');
    if (textarea) {
      await textarea.type('Test QR Code');
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if QR code was generated
      const qrCode = await page.$('[data-testid="qr-generator"] canvas');
      if (qrCode) {
        console.log('✅ QR code generated successfully');
      }
    }
    
    // Test language switcher analytics
    console.log('🌍 Testing language switcher analytics...');
    const langButton = await page.$('button:has-text("EN")');
    if (langButton) {
      await langButton.click();
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Take screenshot
      await page.screenshot({ path: 'analytics-language.png', fullPage: true });
      console.log('📸 Screenshot saved as analytics-language.png');
    }
    
    // Test theme toggle analytics
    console.log('🌙 Testing theme toggle analytics...');
    const themeButton = await page.$('button[aria-label*="theme"], button:has-text("🌙"), button:has-text("☀️")');
    if (themeButton) {
      await themeButton.click();
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Take screenshot
      await page.screenshot({ path: 'analytics-theme.png', fullPage: true });
      console.log('📸 Screenshot saved as analytics-theme.png');
    }
    
    // Check analytics events in console
    const analyticsEvents = await page.evaluate(() => {
      const events = [];
      const logs = window.console.log.toString();
      if (logs.includes('📊 Analytics')) {
        events.push('Analytics events detected in console');
      }
      return events;
    });
    
    console.log('📊 Analytics Events Detected:');
    analyticsEvents.forEach(event => console.log(`   ✅ ${event}`));
    
    // Test page view tracking
    console.log('📄 Testing page view tracking...');
    await page.goto('http://localhost:3000/qr-code-facts');
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Take screenshot
    await page.screenshot({ path: 'analytics-facts.png', fullPage: true });
    console.log('📸 Screenshot saved as analytics-facts.png');
    
    // Check if analytics is working on different pages
    const pageAnalytics = await page.evaluate(() => {
      return {
        gtagExists: typeof window.gtag === 'function',
        dataLayerLength: window.dataLayer ? window.dataLayer.length : 0,
        currentUrl: window.location.href
      };
    });
    
    console.log('📊 Page Analytics Status:');
    console.log(`   Current URL: ${pageAnalytics.currentUrl}`);
    console.log(`   Google Analytics: ${pageAnalytics.gtagExists}`);
    console.log(`   Data Layer Events: ${pageAnalytics.dataLayerLength}`);
    
    // Overall analytics status
    const overallStatus = analyticsLoaded.gtagExists && analyticsLoaded.dataLayerExists && analyticsLoaded.analyticsScript;
    
    if (overallStatus) {
      console.log('✅ Analytics integration working correctly!');
    } else {
      console.log('⚠️  Analytics integration has issues');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  } finally {
    await browser.close();
  }
}

testAnalytics().catch(console.error);
