# 🧪 Testing Guide

## Quick Testing Commands

### Development Testing (Fast)

```bash
# Browser functionality test
npm run test:browser

# Comprehensive test across all locales
npm run test:comprehensive

# Performance test
npm run test:pagespeed
```

### Demo Testing (Slow - for presentations)

```bash
# Browser functionality demo (1s between steps)
npm run demo:browser

# Comprehensive demo (1s between steps)
npm run demo:comprehensive

# Performance demo (1s between steps)
npm run demo:pagespeed
```

## Custom Timeout

You can also set custom timeout values:

```bash
# Custom timeout (e.g., 2 seconds between steps)
node scripts/test-browser.js --timeout=2000
node scripts/test-comprehensive.js --timeout=2000
node scripts/test-pagespeed.js --timeout=2000
```

## Test Types

### 1. Browser Test (`test-browser.js`)

-   Page loading
-   QR generator visibility
-   Button functionality
-   QR code generation
-   Download functionality
-   Mobile responsiveness
-   Console error checking
-   Performance metrics

### 2. Comprehensive Test (`test-comprehensive.js`)

-   Translations for all locales (en, es, zh, fr, am, pt)
-   Default input functionality
-   QR code generation
-   SEO optimization
-   PageSpeed performance

### 3. PageSpeed Test (`test-pagespeed.js`)

-   Basic performance metrics
-   QR code generation performance
-   Lighthouse audit (Performance, SEO, Accessibility, Best Practices)

## Timeout Behavior

-   **Default**: 100ms between steps (fast development testing)
-   **Demo**: 1000ms between steps (slow, visible for presentations)
-   **Custom**: Any value you specify with `--timeout=N`

The timeout affects:

-   Navigation delays
-   Step transitions
-   Element waiting times
-   Test result display timing

## Requirements

-   Node.js 18+
-   Chrome/Chromium browser
-   Application running on localhost:3000

## Troubleshooting

If tests fail:

1. Ensure the application is running: `npm start`
2. Check port 3000 is available
3. Verify Chrome/Chromium is installed
4. Check browser console for errors
