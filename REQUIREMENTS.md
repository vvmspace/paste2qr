# 📋 paste2qr Application Requirements

## 🎯 **Core Functionality**

### **QR Generator**

-   [ ] User can enter any text in textarea
-   [ ] QR code is generated automatically when text is entered
-   [ ] QR code is displayed as an image
-   [ ] Debouncing support for optimization (200ms)
-   [ ] Minimal QR code grain count depending on text length
-   [ ] Optional prefix for QR code (empty by default), passed as parameter in Universal Page, pulled from content configs, not displayed to user, but considered during QR code generation
-   [ ] There should be spacing before QR code

### **Interactive Elements**

-   [ ] "Paste" button for clipboard paste
-   [ ] "Download" button to download QR code as PNG
-   [ ] "Clear" button to clear input field
-   [ ] "Publish" button to publish QR code
-   [ ] "Share" button to send QR code via link

## 🌍 **Multilingual Support**

### **General Functionality**

-   [ ] Common component after header on all pages: visually like a switcher, actually - navigation between locales, render on server, should not create hydration problems. If i18n adds problems, then we don't need it.
-   [ ] default locale - from env or default (en) - such URLs can be without locale, may require double routing

### **Supported Languages**

-   [ ] English (en) - primary
-   [ ] Spanish (es)
-   [ ] Chinese (zh)
-   [ ] French (fr)
-   [ ] Amharic (am)
-   [ ] Portuguese (pt)

### **Localization**

-   [ ] All interface texts use translation keys
-   [ ] Localized URLs (e.g., `/es/`, `/zh/`)
-   [ ] Proper handling of default locale
-   [ ] SEO-optimized links with `hrefLang` and `rel="alternate"`

## 🚀 **QR Code Publishing**

### **Publishing Form**

-   [ ] "Title" field (optional)
-   [ ] "Description" field (optional)
-   [ ] Language selection (default English)
-   [ ] Unique alias generation
-   [ ] Form validation

### **Data Storage**

-   [ ] Data stored in JSON files
-   [ ] Abstract storage for easy replacement
-   [ ] One time free for one text
-   [ ] Without authorization
-   [ ] Editing not possible yet

## 🎨 **UI/UX Requirements**

### **Design**

-   [ ] Minimalist design
-   [ ] Adaptive Mobile First approach
-   [ ] Dark and light theme support
-   [ ] Modern and beautiful interface

### **Navigation**

-   [ ] Fixed header with language switcher
-   [ ] Side menu (sandwich or swipe right)
-   [ ] Menu closes on click outside or swipe left
-   [ ] Haptic feedback on interaction (30ms vibration)

### **Interface Elements**

-   [ ] Fixed action bar at bottom
-   [ ] Contrasting buttons (black/white text)
-   [ ] Flags for language switcher
-   [ ] Dropdown language list

## ⚡ **Performance**

### **Lighthouse Metrics**

-   [ ] Performance: minimum 80/100
-   [ ] SEO: minimum 90/100
-   [ ] Accessibility: minimum 90/100
-   [ ] Best Practices: minimum 90/100

### **Optimizations**

-   [ ] Lazy loading components
-   [ ] Debouncing user input
-   [ ] CSS containment to reduce repaints
-   [ ] Fixed sizes to prevent CLS
-   [ ] QR code size optimization

## ♿ **Accessibility**

### **ARIA Attributes**

-   [ ] `aria-label` for all interactive elements
-   [ ] `role` attributes (banner, main, contentinfo, menu)
-   [ ] `aria-expanded` and `aria-haspopup` for dropdown menus
-   [ ] Skip link for keyboard navigation

### **Keyboard Navigation**

-   [ ] Tab navigation between elements
-   [ ] Enter/Space for button activation
-   [ ] Escape to close modal windows
-   [ ] Focus indicators

## 🛠️ **Technical Requirements**

### **Technologies**

-   [ ] NextJS 14+
-   [ ] TypeScript
-   [ ] SSR (Server-Side Rendering)
-   [ ] SSG (Static Site Generation) for all pages
-   [ ] PWA support
-   [ ] Hosting on Netlify

### **Testing**

-   [ ] Jest + TypeScript tests
-   [ ] Puppeteer for frontend testing
-   [ ] Lighthouse tests
-   [ ] Hydration tests
-   [ ] Layout testing: top and bottom sidebars should be fixed, there should be spacing before QR code
-   [ ] Each test outputs steps to console
-   [ ] Tests are picked up by `*.spec.*` extension

### **Build and Deployment**

-   [ ] `npm run build && npm start` for production
-   [ ] Process killing and restart before tests
-   [ ] Full production testing script

## 📱 **PWA Requirements**

### **Installation**

-   [ ] One-click installation on Apple and Android
-   [ ] Convenience on mobile devices
-   [ ] Offline support (if needed)

## 🔍 **SEO Requirements**

### **Meta Data**

-   [ ] Proper title and description
-   [ ] Open Graph tags
-   [ ] Twitter Card tags
-   [ ] Structured data
-   [ ] Sitemap and robots.txt

### **Content**

-   [ ] Semantic core development
-   [ ] Popular queries in unoccupied niches
-   [ ] Lively texts with lifehacks and best practices
-   [ ] Multiple pages for different search queries
-   [ ] MDX files for content pages

## 🏗️ **Architecture**

### **Structure**

-   [ ] One template for all pages
-   [ ] Difference only in config from MDX/JSON files
-   [ ] Maximum flexibility, minimum code
-   [ ] Multisite with site id
-   [ ] Static generation of all pages (SSG)
-   [ ] Pre-generation of content pages
-   [ ] Optimization for CDN and caching

### **Components**

-   [ ] Single component after header on all pages
-   [ ] Code comments only in English
-   [ ] No Russian in code

## 📊 **Metrics and Analytics**

### **Business Metrics**

-   [ ] Mock function for sending metrics
-   [ ] Compatibility with most metric services
-   [ ] Key business metrics
-   [ ] User action tracking

## ⚠️ **Pitfalls and Critical Points**

### **Hydration (SSR/CSR Consistency)**

-   [ ] No hydration errors between server and client
-   [ ] State consistency on first render
-   [ ] Proper handling of dynamic content
-   [ ] Correct localization work on server and client
-   [ ] Hydration testing on all pages
-   [ ] Check for absence of "hydration mismatch" errors in console

### **Lighthouse and Performance**

-   [ ] **Performance**: minimum 80/100 (current: 76/100)
-   [ ] **LCP (Largest Contentful Paint)**: < 2.5s
-   [ ] **FCP (First Contentful Paint)**: < 1.8s
-   [ ] **CLS (Cumulative Layout Shift)**: < 0.1
-   [ ] **TBT (Total Blocking Time)**: < 200ms
-   [ ] **Speed Index**: < 3.4s
-   [ ] No red zones in Lighthouse
-   [ ] At least one green zone
-   [ ] Static generation for maximum performance
-   [ ] Optimization for CDN and edge caching

### **Browser Compatibility**

-   [ ] No JavaScript errors in console
-   [ ] No React warnings
-   [ ] Correct work in Chrome, Firefox, Safari, Edge
-   [ ] Mobile browser support
-   [ ] Incognito mode testing
-   [ ] Testing with JavaScript disabled

### **Testing and Debugging**

-   [ ] Each test outputs all steps to console
-   [ ] Tests don't hang forever when running
-   [ ] Proper process completion after tests
-   [ ] Killing all background processes before new tests
-   [ ] Browser log checking in each test
-   [ ] Production environment testing

### **Multilingual and Localization**

-   [ ] Proper generation of localized URLs
-   [ ] No hydration problems when changing language
-   [ ] Correct work with default locale
-   [ ] SEO-compatible links with hrefLang
-   [ ] Translation consistency between pages
-   [ ] Proper handling of RTL languages (if needed)

### **PWA and Mobile Devices**

-   [ ] Correct installation on iOS and Android
-   [ ] Offline mode work (if required)
-   [ ] Proper icons and manifest
-   [ ] Haptic feedback on supported devices
-   [ ] Adaptability to different screen sizes
-   [ ] Touch gesture support

### **SEO and Indexing**

-   [ ] Proper sitemap.xml generation
-   [ ] Correct robots.txt
-   [ ] No duplicate content where possible
-   [ ] Proper canonical URLs
-   [ ] Structured data without errors
-   [ ] Fast indexing of new pages

/\*\* not needed yet

### **Security**

-   [ ] No XSS vulnerabilities
-   [ ] Proper user input validation
-   [ ] CSRF attack protection
-   [ ] Secure data storage
-   [ ] Proper security HTTP headers
        \*/

### **Performance and Optimization**

-   [ ] Minimal bundle size
-   [ ] Image and QR code optimization
-   [ ] Proper caching
-   [ ] Lazy loading without UX disruption
-   [ ] No memory leaks
-   [ ] React component re-render optimization

### **Monitoring and Logging**

-   [ ] No errors in production logs
-   [ ] Proper user action logging
-   [ ] Performance monitoring
-   [ ] Real-time error tracking
-   [ ] Alerts for critical issues

### **Deployment and CI/CD**

// - [ ] Automatic testing before deploy

-   [ ] Proper environment variable setup
        // - [ ] Rollback on critical errors
        // - [ ] Deploy status monitoring
        // - [ ] Data backups before updates
-   [ ] Static generation on build
-   [ ] Netlify Edge Functions optimization
-   [ ] Proper redirects and rewrites setup

---

**Please supplement this list with your own requirements!** ✏️
