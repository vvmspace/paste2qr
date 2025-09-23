# 🧪 Testing Guide

**🔗 [Free QR Code Generator](https://paste2qr.com) - Paste text and get QR code instantly - completely free**

## Quick Testing Commands

### Development Testing (Fast)

```bash
# Browser functionality test
npm run test:browser

# Comprehensive test across all locales
npm run test:comprehensive

# Performance test
npm run test:pagespeed

# Layout test (fixed sidebars, QR spacing)
npm run test:layout

# QR code editing test
npm run test:qr-editing
```

### Demo Testing (Slow - for presentations)

```bash
# Browser functionality demo (1s between steps)
npm run demo:browser

# Comprehensive demo (1s between steps)
npm run demo:comprehensive

# Performance demo (1s between steps)
npm run demo:pagespeed

# Layout demo (1s between steps)
npm run demo:layout

# QR editing demo (1s between steps)
npm run demo:qr-editing
```

## Custom Timeout

You can also set custom timeout values:

```bash
# Custom timeout (e.g., 2 seconds between steps)
node scripts/test-browser.js --timeout=2000
node scripts/test-comprehensive.js --timeout=2000
node scripts/test-pagespeed.js --timeout=2000
node scripts/test-layout.js --timeout=2000
node scripts/test-qr-editing.js --timeout=2000
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

### 4. Layout Test (`test-layout.js`)

-   CSS filter and positioning issues detection
-   Header positioning and scroll behavior (fixed vs broken)
-   Action bar positioning and scroll behavior (fixed vs broken)
-   Sidebar behavior (slide-out menu, not fixed)
-   QR code spacing verification
-   Responsive layout testing (mobile/desktop)
-   Share button functionality

### 5. QR Editing Test (`test-qr-editing.js`)

-   Initial text input and QR generation
-   Text editing and QR code updates
-   Clear and retype functionality
-   Debounce behavior during rapid typing
-   Action bar buttons during editing
-   Clear button functionality

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

---

**🔗 [Paste2QR.com](https://paste2qr.com) - Try it now: paste text and get QR code instantly** 4. Check browser console for errors
