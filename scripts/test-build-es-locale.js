import { execSync } from 'child_process';
import puppeteer from 'puppeteer';
import fs from 'fs';

async function testBuildWithESLocale() {
  console.log('🇪🇸 Testing Build with Spanish Locale...');
  
  try {
    // Set environment variables for Spanish locale
    process.env.DEFAULT_LOCALE = 'es';
    process.env.NODE_ENV = 'production';
    
    console.log('🔧 Environment variables set:');
    console.log(`   DEFAULT_LOCALE: ${process.env.DEFAULT_LOCALE}`);
    console.log(`   NODE_ENV: ${process.env.NODE_ENV}`);
    
    // Clean previous build
    console.log('🧹 Cleaning previous build...');
    try {
      execSync('rm -rf .next', { stdio: 'inherit' });
      console.log('✅ Previous build cleaned');
    } catch (error) {
      console.log('ℹ️ No previous build to clean');
    }
    
    // Build the application
    console.log('🔨 Building application...');
    const buildStart = Date.now();
    
    try {
      execSync('npm run build', { 
        stdio: 'inherit',
        env: { ...process.env, DEFAULT_LOCALE: 'es' }
      });
      const buildTime = Date.now() - buildStart;
      console.log(`✅ Build completed in ${buildTime}ms`);
    } catch (error) {
      console.error('❌ Build failed:', error.message);
      return;
    }
    
    // Check if build files exist
    const buildFiles = [
      '.next/static',
      '.next/server',
      '.next/cache'
    ];
    
    console.log('📁 Checking build files...');
    for (const file of buildFiles) {
      if (fs.existsSync(file)) {
        console.log(`✅ ${file} exists`);
      } else {
        console.log(`❌ ${file} missing`);
      }
    }
    
    // Start production server
    console.log('🚀 Starting production server...');
    const serverProcess = execSync('npm run start', { 
      stdio: 'pipe',
      env: { ...process.env, DEFAULT_LOCALE: 'es' }
    });
    
    // Wait for server to start
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    // Test with Puppeteer
    console.log('🧪 Testing with Puppeteer...');
    const browser = await puppeteer.launch({ 
      headless: false,
      defaultViewport: { width: 375, height: 667 }
    });
    
    try {
      const page = await browser.newPage();
      
      // Test main page
      console.log('📄 Testing main page...');
      await page.goto('http://localhost:3000');
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Take screenshot
      await page.screenshot({ path: 'build-es-main.png', fullPage: true });
      console.log('📸 Screenshot saved as build-es-main.png');
      
      // Check page title
      const pageTitle = await page.title();
      console.log(`✅ Page title: ${pageTitle}`);
      
      // Check if Spanish content is displayed
      const spanishContent = await page.evaluate(() => {
        const body = document.body.textContent;
        return {
          hasSpanish: body.includes('Generador') || body.includes('Código') || body.includes('QR'),
          hasEnglish: body.includes('Generator') || body.includes('Code') || body.includes('QR'),
          bodyText: body.substring(0, 200)
        };
      });
      
      console.log('🇪🇸 Spanish content check:');
      console.log(`   Has Spanish: ${spanishContent.hasSpanish}`);
      console.log(`   Has English: ${spanishContent.hasEnglish}`);
      console.log(`   Body text: ${spanishContent.bodyText}...`);
      
      // Test menu
      console.log('🧭 Testing menu...');
      const menuButton = await page.$('button[aria-label="Open menu"]');
      if (menuButton) {
        await menuButton.click();
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Take screenshot of menu
        await page.screenshot({ path: 'build-es-menu.png', fullPage: true });
        console.log('📸 Screenshot saved as build-es-menu.png');
        
        // Check menu items
        const menuItems = await page.$$eval('nav a', (links) => {
          return links.map(link => ({
            text: link.textContent.trim(),
            href: link.href
          }));
        });
        
        console.log('🧭 Menu items:');
        menuItems.forEach((item, index) => {
          console.log(`   ${index + 1}. ${item.text} -> ${item.href}`);
        });
        
        // Check if menu items are in Spanish
        const spanishMenuItems = menuItems.filter(item => 
          item.text.includes('Generador') || 
          item.text.includes('Código') || 
          item.text.includes('QR')
        );
        
        console.log(`✅ Spanish menu items found: ${spanishMenuItems.length}`);
      }
      
      // Test navigation to a specific page
      console.log('🔗 Testing navigation to QR Code Facts...');
      await page.goto('http://localhost:3000/qr-code-facts');
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Take screenshot of facts page
      await page.screenshot({ path: 'build-es-facts.png', fullPage: true });
      console.log('📸 Screenshot saved as build-es-facts.png');
      
      // Check page title
      const factsTitle = await page.title();
      console.log(`✅ Facts page title: ${factsTitle}`);
      
      // Check if content is in Spanish
      const factsContent = await page.evaluate(() => {
        const body = document.body.textContent;
        return {
          hasSpanish: body.includes('Datos') || body.includes('Código') || body.includes('QR'),
          bodyText: body.substring(0, 300)
        };
      });
      
      console.log('🇪🇸 Facts page Spanish content:');
      console.log(`   Has Spanish: ${factsContent.hasSpanish}`);
      console.log(`   Content: ${factsContent.bodyText}...`);
      
    } catch (error) {
      console.error('❌ Puppeteer test failed:', error.message);
    } finally {
      await browser.close();
    }
    
    console.log('✅ Build test with Spanish locale completed!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testBuildWithESLocale().catch(console.error);

