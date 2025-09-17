#!/usr/bin/env node

import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runAccessibilityTests() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  // Enable console logging
  page.on('console', msg => {
    console.log('Browser Console:', msg.text());
  });
  
  // Enable network logging
  page.on('request', request => {
    console.log('Request:', request.method(), request.url());
  });
  
  page.on('response', response => {
    console.log('Response:', response.status(), response.url());
  });
  
  try {
    console.log('Testing accessibility...');
    await page.goto('http://localhost:3000');
    
    // Wait for page to load
    await page.waitForLoadState('networkidle');
    
    // Check for accessibility issues
    const accessibilityIssues = await page.evaluate(() => {
      const issues = [];
      
      // Check for missing alt text
      const imagesWithoutAlt = document.querySelectorAll('img:not([alt])');
      imagesWithoutAlt.forEach(img => {
        issues.push(`Image missing alt text: ${img.src}`);
      });
      
      // Check for missing labels
      const inputsWithoutLabels = document.querySelectorAll('input:not([aria-label]):not([aria-labelledby])');
      inputsWithoutLabels.forEach(input => {
        const label = document.querySelector(`label[for="${input.id}"]`);
        if (!label) {
          issues.push(`Input missing label: ${input.type}`);
        }
      });
      
      // Check for missing headings
      const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
      if (headings.length === 0) {
        issues.push('No headings found on page');
      }
      
      // Check for proper heading hierarchy
      let lastLevel = 0;
      headings.forEach(heading => {
        const level = parseInt(heading.tagName.charAt(1));
        if (level > lastLevel + 1) {
          issues.push(`Heading hierarchy issue: ${heading.tagName} after h${lastLevel}`);
        }
        lastLevel = level;
      });
      
      return issues;
    });
    
    // Save results
    const resultsDir = path.join(__dirname, '../test-results');
    if (!fs.existsSync(resultsDir)) {
      fs.mkdirSync(resultsDir, { recursive: true });
    }
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `accessibility-${timestamp}.json`;
    const filepath = path.join(resultsDir, filename);
    
    const results = {
      timestamp: new Date().toISOString(),
      url: 'http://localhost:3000',
      issues: accessibilityIssues,
      issueCount: accessibilityIssues.length
    };
    
    fs.writeFileSync(filepath, JSON.stringify(results, null, 2));
    
    console.log('Accessibility test results saved to:', filepath);
    console.log('Issues found:', accessibilityIssues.length);
    
    if (accessibilityIssues.length > 0) {
      console.log('Issues:');
      accessibilityIssues.forEach(issue => console.log('  -', issue));
    } else {
      console.log('✅ No accessibility issues found!');
    }
    
  } catch (error) {
    console.error('Error running accessibility tests:', error);
  } finally {
    await browser.close();
  }
}

runAccessibilityTests().catch(console.error);









