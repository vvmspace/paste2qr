import puppeteer from 'puppeteer';

async function testMenuLongContent() {
  console.log('📜 Testing Menu with Long Content...');
  
  const browser = await puppeteer.launch({ 
    headless: false,
    defaultViewport: { width: 375, height: 400 } // Smaller height to force scrolling
  });
  
  try {
    const page = await browser.newPage();
    await page.goto('http://localhost:3000');
    
    // Wait for page to load
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Open menu
    const menuButton = await page.$('button[aria-label="Open menu"]');
    if (menuButton) {
      await menuButton.click();
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Take screenshot
      await page.screenshot({ path: 'menu-long-content.png', fullPage: true });
      console.log('📸 Screenshot saved as menu-long-content.png');
      
      // Check scrollable content
      const scrollableContent = await page.$('.scrollbar-hide');
      if (scrollableContent) {
        // Get scroll properties
        const scrollProperties = await page.evaluate((element) => {
          return {
            scrollHeight: element.scrollHeight,
            clientHeight: element.clientHeight,
            scrollTop: element.scrollTop,
            canScroll: element.scrollHeight > element.clientHeight
          };
        }, scrollableContent);
        
        console.log('📜 Scroll Properties:');
        console.log(`   Scroll Height: ${scrollProperties.scrollHeight}px`);
        console.log(`   Client Height: ${scrollProperties.clientHeight}px`);
        console.log(`   Can Scroll: ${scrollProperties.canScroll}`);
        
        // Test scrolling if possible
        if (scrollProperties.canScroll) {
          console.log('🔄 Testing scroll...');
          
          // Scroll down
          await page.evaluate((element) => {
            element.scrollTop = 200;
          }, scrollableContent);
          
          await new Promise(resolve => setTimeout(resolve, 500));
          
          // Take screenshot after scrolling
          await page.screenshot({ path: 'menu-long-content-scrolled.png', fullPage: true });
          console.log('📸 Screenshot saved as menu-long-content-scrolled.png');
          
          // Check scroll position
          const newScrollTop = await page.evaluate((element) => {
            return element.scrollTop;
          }, scrollableContent);
          
          console.log(`✅ Scroll position: ${newScrollTop}px`);
          
        } else {
          console.log('ℹ️ Content fits in viewport, no scrolling needed');
        }
        
        // Check if scrollbar is hidden
        const scrollbarHidden = await page.evaluate((element) => {
          const computed = window.getComputedStyle(element);
          return computed.overflowY === 'auto' && 
                 computed.scrollbarWidth === 'none' && 
                 computed.msOverflowStyle === 'none';
        }, scrollableContent);
        
        console.log(`✅ Scrollbar hidden: ${scrollbarHidden}`);
        
      } else {
        console.log('❌ Scrollable content not found');
      }
      
    } else {
      console.log('❌ Menu button not found');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  } finally {
    await browser.close();
  }
}

testMenuLongContent().catch(console.error);
