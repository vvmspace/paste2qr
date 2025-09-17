#!/usr/bin/env node

import lighthouse from 'lighthouse';
import chromeLauncher from 'chrome-launcher';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runLighthouse() {
  const chrome = await chromeLauncher.launch({chromeFlags: ['--headless']});
  const options = {
    logLevel: 'info',
    output: 'json',
    onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
    port: chrome.port,
  };
  
  const runnerResult = await lighthouse('http://localhost:3000', options);
  
  // Save results
  const resultsDir = path.join(__dirname, '../test-results');
  if (!fs.existsSync(resultsDir)) {
    fs.mkdirSync(resultsDir, { recursive: true });
  }
  
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filename = `lighthouse-${timestamp}.json`;
  const filepath = path.join(resultsDir, filename);
  
  fs.writeFileSync(filepath, JSON.stringify(runnerResult.lhr, null, 2));
  
  console.log('Lighthouse results saved to:', filepath);
  console.log('Performance Score:', runnerResult.lhr.categories.performance.score * 100);
  console.log('Accessibility Score:', runnerResult.lhr.categories.accessibility.score * 100);
  console.log('Best Practices Score:', runnerResult.lhr.categories['best-practices'].score * 100);
  console.log('SEO Score:', runnerResult.lhr.categories.seo.score * 100);
  
  await chrome.kill();
}

runLighthouse().catch(console.error);









