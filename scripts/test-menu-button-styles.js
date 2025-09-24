import puppeteer from 'puppeteer';

async function testMenuButtonStyles() {
  console.log('🎨 Testing Menu Button Styles...');
  
  const browser = await puppeteer.launch({ 
    headless: false,
    defaultViewport: { width: 375, height: 667 }
  });
  
  try {
    const page = await browser.newPage();
    await page.goto('http://localhost:3000');
    
    // Wait for page to load
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Take screenshot
    await page.screenshot({ path: 'menu-button-styles.png', fullPage: true });
    console.log('📸 Screenshot saved as menu-button-styles.png');
    
    // Check menu button styles
    const menuButton = await page.$('button[aria-label="Open menu"]');
    
    if (menuButton) {
      const styles = await page.evaluate((button) => {
        const computed = window.getComputedStyle(button);
        return {
          backgroundColor: computed.backgroundColor,
          color: computed.color,
          padding: computed.padding,
          borderRadius: computed.borderRadius,
          boxShadow: computed.boxShadow,
          fontSize: computed.fontSize,
          width: computed.width,
          height: computed.height
        };
      }, menuButton);
      
      console.log('🎨 Menu Button Styles:');
      console.log(`   Background: ${styles.backgroundColor}`);
      console.log(`   Color: ${styles.color}`);
      console.log(`   Padding: ${styles.padding}`);
      console.log(`   Border Radius: ${styles.borderRadius}`);
      console.log(`   Box Shadow: ${styles.boxShadow}`);
      console.log(`   Size: ${styles.width} x ${styles.height}`);
      
      // Test hover effect
      console.log('🖱️ Testing hover effect...');
      await menuButton.hover();
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const hoverStyles = await page.evaluate((button) => {
        const computed = window.getComputedStyle(button);
        return {
          backgroundColor: computed.backgroundColor,
          boxShadow: computed.boxShadow
        };
      }, menuButton);
      
      console.log('🎨 Hover Styles:');
      console.log(`   Background: ${hoverStyles.backgroundColor}`);
      console.log(`   Box Shadow: ${hoverStyles.boxShadow}`);
      
      // Test click effect
      console.log('👆 Testing click effect...');
      await menuButton.click();
      await new Promise(resolve => setTimeout(resolve, 500));
      
      console.log('✅ Menu opened successfully');
      
      // Check if menu is visible
      const menuVisible = await page.$eval('[data-testid="navigation-menu"]', el => {
        return window.getComputedStyle(el).display !== 'none';
      });
      
      console.log(`✅ Menu visible: ${menuVisible}`);
      
    } else {
      console.log('❌ Menu button not found');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  } finally {
    await browser.close();
  }
}

testMenuButtonStyles().catch(console.error);
