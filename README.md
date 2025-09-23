# Paste2QR - SEO Optimized QR Code Generator

[🇺🇸 English](README_EN.md) | [🇫🇷 Français](README_FR.md) | [🇪🇸 Español](README_ES.md) | [🇪🇹 አማርኛ](README_AM.md) | [🇨🇳 中文](README_ZH.md)

A modern, SEO-optimized QR code generator built with Next.js, TypeScript, and Tailwind CSS. Generate QR codes instantly from any text with advanced publishing options and comprehensive SEO features.

**🔗 [Paste to QR Code Generator](https://paste2qr.com) - Quickly paste text and get QR code instantly**

**🔗 [Générateur de Code QR](https://paste2qr.com) - Collez du texte et obtenez un code QR instantanément**  
**🔗 [Generador de Código QR](https://paste2qr.com) - Pega texto y obtén código QR al instante**  
**🔗 [二维码生成器](https://paste2qr.com) - 快速粘贴文本生成二维码**  
**🔗 [QR ኮድ ጀነሬተር](https://paste2qr.com) - ጽሑፍ ያስገቡ እና QR ኮድ ያግኙ**

## 💬 What People Say About QR Codes

> "QR codes have become an integral part of marketing campaigns, allowing brands to easily connect offline and online worlds."  
> — _Marketing Professional_ on r/marketing

> "Today QR codes are used everywhere: from restaurant menus to event tickets, simplifying access to information and services."  
> — _Tech Enthusiast_ on r/technology

> "Artists and designers integrate QR codes into their work, creating interactive artworks that come alive when scanned."  
> — _Digital Artist_ on r/art

> "Educational institutions implement QR codes to provide students with quick access to learning materials and schedules."  
> — _Educator_ on r/education

## 🚀 Features

### Core Functionality

-   **Instant QR Generation** - Generate QR codes from any text in seconds
-   **Prefix Support** - Add custom prefixes (https://, tel:, mailto:, etc.)
-   **Publishing System** - Create shareable pages for your QR codes
-   **Mobile-First Design** - Optimized for all devices
-   **PWA Support** - Install as a native app

### SEO Optimization

-   **Multiple SEO Pages** - Dedicated pages for different QR code types
-   **MDX Content System** - Dynamic content management
-   **Semantic HTML** - Proper heading structure and accessibility
-   **Meta Tags** - Comprehensive SEO metadata
-   **Sitemap & Robots.txt** - Search engine optimization

### Technical Features

-   **Next.js 14** - Latest React framework with App Router
-   **TypeScript** - Full type safety
-   **Tailwind CSS** - Utility-first styling
-   **Server-Side Rendering** - Fast initial page loads
-   **Universal Page System** - Configurable page templates

## 📱 SEO Pages

-   **Home** - Main QR code generator
-   **WiFi QR Code Generator** - Share WiFi passwords instantly
-   **Phone Number QR Code** - Call contacts with one scan
-   **Email QR Code Generator** - Send emails instantly
-   **SMS QR Code Maker** - Pre-filled text messages
-   **Contact Info QR Code** - Professional contact sharing

## 🛠️ Development

### Prerequisites

-   Node.js 18+
-   npm or yarn

### Installation

```bash
npm install
```

### Development Server

```bash
npm run dev
```

### Testing

```bash
# Unit tests
npm test

# Accessibility tests
npm run test:accessibility

# Performance tests
npm run test:performance
```

### Build for Production

```bash
npm run build
npm start
```

## 🏗️ Architecture

### Universal Page System

All pages use a single `UniversalPage` component that renders based on configuration:

```typescript
interface PageConfig {
    title: string;
    description: string;
    keywords: string;
    heroTitle: string;
    heroSubtitle: string;
    heroButtonText: string;
    heroGradient: string;
}
```

### Content Management

-   **MDX Files** - SEO content in `src/content/`
-   **JSON Storage** - Published QR codes in abstract storage
-   **Dynamic Routing** - `[slug]/page.tsx` for MDX content
-   **Config Loader** - Universal content loading system

### SEO Structure

```
/
├── / (home)
├── /wifi-qr-code-generator/
├── /phone-number-qr-code/
├── /email-qr-code-generator/
├── /sms-qr-code-maker/
├── /contact-info-qr-code/
└── /p/:alias (published QR codes)
```

## 🎯 SEO Features

### Technical SEO

-   **Semantic HTML5** - Proper document structure
-   **Meta Tags** - Title, description, keywords, Open Graph
-   **Structured Data** - Rich snippets support
-   **Sitemap.xml** - Automatic sitemap generation
-   **Robots.txt** - Search engine directives

### Content SEO

-   **Long-form Content** - Comprehensive guides for each QR type
-   **Keyword Optimization** - Targeted keywords for each page
-   **Internal Linking** - Strategic page connections
-   **Mobile Optimization** - Responsive design
-   **Page Speed** - Optimized performance

### Accessibility

-   **WCAG 2.1 AA** - Full accessibility compliance
-   **Screen Reader Support** - Proper ARIA labels
-   **Keyboard Navigation** - Full keyboard accessibility
-   **Color Contrast** - High contrast ratios
-   **Focus Management** - Clear focus indicators

## 📊 Performance

### Lighthouse Scores

-   **Performance** - 90+ (target)
-   **Accessibility** - 100 (achieved)
-   **Best Practices** - 90+ (target)
-   **SEO** - 90+ (target)

### Optimization Features

-   **Code Splitting** - Automatic bundle optimization
-   **Image Optimization** - Next.js image optimization
-   **Font Optimization** - Google Fonts optimization
-   **CSS Optimization** - Tailwind CSS purging
-   **JavaScript Optimization** - Tree shaking and minification

## 🌐 Deployment

### Netlify (Recommended)

1. Connect your GitHub repository
2. Set build command: `npm run build`
3. Set publish directory: `.next`
4. Deploy automatically on push

### Environment Variables

```env
SITE_ID=default
SITE_TITLE_EN=QR Code Generator - Create QR Codes Instantly
SITE_DESCRIPTION_EN=Generate QR codes instantly from any text...
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

## 📈 Analytics

### Built-in Metrics

-   **QR Generation** - Track generation events
-   **Publishing** - Monitor published QR codes
-   **User Interactions** - Button clicks and form submissions
-   **Error Tracking** - Monitor and log errors

### Integration Ready

-   **Google Analytics** - Easy integration
-   **Mixpanel** - Event tracking
-   **Custom Analytics** - Flexible tracking system

## 🔧 Customization

### Adding New SEO Pages

1. Create MDX file in `src/content/`
2. Add configuration to `src/configs/pages.ts`
3. Page automatically available at `/[slug]/`

### Styling

-   **Tailwind CSS** - Utility-first styling
-   **Custom Components** - Reusable UI components
-   **Responsive Design** - Mobile-first approach
-   **Dark Mode** - Ready for implementation

### Content Management

-   **MDX Frontmatter** - Page configuration
-   **Dynamic Content** - Server-side rendering
-   **SEO Optimization** - Automatic meta tag generation

## 📝 License

MIT License - see LICENSE file for details

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📞 Support

For support and questions:

-   Create an issue on GitHub
-   Check the documentation
-   Review the code examples

---

**🔗 [Paste2QR.com](https://paste2qr.com) - Paste text, get QR code instantly - no registration required**

---

**Built with ❤️ using Next.js, TypeScript, and Tailwind CSS**
