import puppeteer from 'puppeteer';

async function testMenuScroll() {
  console.log('📜 Testing Menu Scroll...');
  
  const browser = await puppeteer.launch({ 
    headless: false,
    defaultViewport: { width: 375, height: 667 }
  });
  
  try {
    const page = await browser.newPage();
    await page.goto('http://localhost:3000');
    
    // Wait for page to load
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Take screenshot before opening menu
    await page.screenshot({ path: 'menu-scroll-before.png', fullPage: true });
    console.log('📸 Screenshot saved as menu-scroll-before.png');
    
    // Open menu
    const menuButton = await page.$('button[aria-label="Open menu"]');
    if (menuButton) {
      await menuButton.click();
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Take screenshot after opening menu
      await page.screenshot({ path: 'menu-scroll-after.png', fullPage: true });
      console.log('📸 Screenshot saved as menu-scroll-after.png');
      
      // Check if menu is visible
      const menuVisible = await page.$eval('[role="dialog"]', el => {
        return window.getComputedStyle(el).display !== 'none';
      });
      
      console.log(`✅ Menu visible: ${menuVisible}`);
      
      // Check scrollable content
      const scrollableContent = await page.$('.scrollbar-hide');
      if (scrollableContent) {
        console.log('✅ Scrollable content found');
        
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
            element.scrollTop = 100;
          }, scrollableContent);
          
          await new Promise(resolve => setTimeout(resolve, 500));
          
          // Take screenshot after scrolling
          await page.screenshot({ path: 'menu-scroll-scrolled.png', fullPage: true });
          console.log('📸 Screenshot saved as menu-scroll-scrolled.png');
          
          // Check scroll position
          const newScrollTop = await page.evaluate((element) => {
            return element.scrollTop;
          }, scrollableContent);
          
          console.log(`✅ Scroll position: ${newScrollTop}px`);
          
          // Scroll back to top
          await page.evaluate((element) => {
            element.scrollTop = 0;
          }, scrollableContent);
          
          await new Promise(resolve => setTimeout(resolve, 500));
          
          // Take screenshot after scrolling back
          await page.screenshot({ path: 'menu-scroll-top.png', fullPage: true });
          console.log('📸 Screenshot saved as menu-scroll-top.png');
          
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
      
      // Check menu structure
      const menuStructure = await page.evaluate(() => {
        const menu = document.querySelector('[role="dialog"]');
        if (!menu) return null;
        
        const header = menu.querySelector('.flex-shrink-0:first-child');
        const content = menu.querySelector('.scrollbar-hide');
        const footer = menu.querySelector('.flex-shrink-0:last-child');
        
        return {
          hasHeader: !!header,
          hasContent: !!content,
          hasFooter: !!footer,
          isFlexColumn: menu.classList.contains('flex-col')
        };
      });
      
      if (menuStructure) {
        console.log('🏗️ Menu Structure:');
        console.log(`   Has Header: ${menuStructure.hasHeader}`);
        console.log(`   Has Content: ${menuStructure.hasContent}`);
        console.log(`   Has Footer: ${menuStructure.hasFooter}`);
        console.log(`   Is Flex Column: ${menuStructure.isFlexColumn}`);
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

testMenuScroll().catch(console.error);
