import puppeteer from 'puppeteer';

async function testMenuFinal() {
  console.log('🎯 Testing Final Menu Implementation...');
  
  const browser = await puppeteer.launch({ 
    headless: false,
    defaultViewport: { width: 375, height: 667 }
  });
  
  try {
    const page = await browser.newPage();
    await page.goto('http://localhost:3000');
    
    // Wait for page to load
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Take screenshot of main page
    await page.screenshot({ path: 'menu-final-main.png', fullPage: true });
    console.log('📸 Screenshot saved as menu-final-main.png');
    
    // Test menu button styles
    const menuButton = await page.$('button[aria-label="Open menu"]');
    if (menuButton) {
      const buttonStyles = await page.evaluate((button) => {
        const computed = window.getComputedStyle(button);
        return {
          backgroundColor: computed.backgroundColor,
          color: computed.color,
          padding: computed.padding,
          borderRadius: computed.borderRadius,
          boxShadow: computed.boxShadow,
          width: computed.width,
          height: computed.height
        };
      }, menuButton);
      
      console.log('🎨 Menu Button Styles:');
      console.log(`   Background: ${buttonStyles.backgroundColor}`);
      console.log(`   Color: ${buttonStyles.color}`);
      console.log(`   Padding: ${buttonStyles.padding}`);
      console.log(`   Border Radius: ${buttonStyles.borderRadius}`);
      console.log(`   Box Shadow: ${buttonStyles.boxShadow}`);
      console.log(`   Size: ${buttonStyles.width} x ${buttonStyles.height}`);
      
      // Open menu
      await menuButton.click();
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Take screenshot of open menu
      await page.screenshot({ path: 'menu-final-open.png', fullPage: true });
      console.log('📸 Screenshot saved as menu-final-open.png');
      
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
          isFlexColumn: menu.classList.contains('flex-col'),
          headerHeight: header ? header.offsetHeight : 0,
          contentHeight: content ? content.offsetHeight : 0,
          footerHeight: footer ? footer.offsetHeight : 0
        };
      });
      
      if (menuStructure) {
        console.log('🏗️ Menu Structure:');
        console.log(`   Has Header: ${menuStructure.hasHeader}`);
        console.log(`   Has Content: ${menuStructure.hasContent}`);
        console.log(`   Has Footer: ${menuStructure.hasFooter}`);
        console.log(`   Is Flex Column: ${menuStructure.isFlexColumn}`);
        console.log(`   Header Height: ${menuStructure.headerHeight}px`);
        console.log(`   Content Height: ${menuStructure.contentHeight}px`);
        console.log(`   Footer Height: ${menuStructure.footerHeight}px`);
      }
      
      // Check scrollable content
      const scrollableContent = await page.$('.scrollbar-hide');
      if (scrollableContent) {
        const scrollProperties = await page.evaluate((element) => {
          return {
            scrollHeight: element.scrollHeight,
            clientHeight: element.clientHeight,
            scrollTop: element.scrollTop,
            canScroll: element.scrollHeight > element.clientHeight,
            overflowY: window.getComputedStyle(element).overflowY
          };
        }, scrollableContent);
        
        console.log('📜 Scroll Properties:');
        console.log(`   Scroll Height: ${scrollProperties.scrollHeight}px`);
        console.log(`   Client Height: ${scrollProperties.clientHeight}px`);
        console.log(`   Can Scroll: ${scrollProperties.canScroll}`);
        console.log(`   Overflow Y: ${scrollProperties.overflowY}`);
        
        // Check if scrollbar is hidden
        const scrollbarHidden = await page.evaluate((element) => {
          const computed = window.getComputedStyle(element);
          return {
            scrollbarWidth: computed.scrollbarWidth,
            msOverflowStyle: computed.msOverflowStyle,
            webkitScrollbar: computed.webkitScrollbar
          };
        }, scrollableContent);
        
        console.log('🔍 Scrollbar Properties:');
        console.log(`   Scrollbar Width: ${scrollbarHidden.scrollbarWidth}`);
        console.log(`   MS Overflow Style: ${scrollbarHidden.msOverflowStyle}`);
        console.log(`   Webkit Scrollbar: ${scrollbarHidden.webkitScrollbar}`);
      }
      
      // Check navigation items
      const navItems = await page.$$eval('nav a', (links) => {
        return links.map(link => ({
          text: link.textContent.trim(),
          href: link.href
        }));
      });
      
      console.log('🧭 Navigation Items:');
      navItems.forEach((item, index) => {
        console.log(`   ${index + 1}. ${item.text} -> ${item.href}`);
      });
      
      // Test navigation to one of the new pages
      const factsLink = await page.$('a[href*="qr-code-facts"]');
      if (factsLink) {
        console.log('🔗 Testing navigation to QR Code Facts...');
        await factsLink.click();
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Take screenshot of facts page
        await page.screenshot({ path: 'menu-final-facts.png', fullPage: true });
        console.log('📸 Screenshot saved as menu-final-facts.png');
        
        // Check page title
        const pageTitle = await page.title();
        console.log(`✅ Page title: ${pageTitle}`);
        
        // Go back to main page
        await page.goBack();
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
    } else {
      console.log('❌ Menu button not found');
    }
    
    console.log('✅ Final menu test completed successfully!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  } finally {
    await browser.close();
  }
}

testMenuFinal().catch(console.error);
