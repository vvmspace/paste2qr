import { MDXRemote } from 'next-mdx-remote/rsc'
import { PageConfig } from '../configs/pages'

interface ServerMDXContentProps {
  config: PageConfig
  mdxSource?: string
}

// Компоненты для MDX
const components = {
  h1: ({ children, ...props }: any) => (
    <h1 className="text-3xl font-bold text-gray-900 mb-6" {...props}>
      {children}
    </h1>
  ),
  h2: ({ children, ...props }: any) => (
    <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8" {...props}>
      {children}
    </h2>
  ),
  h3: ({ children, ...props }: any) => (
    <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6" {...props}>
      {children}
    </h3>
  ),
  h4: ({ children, ...props }: any) => (
    <h4 className="text-lg font-semibold text-gray-900 mb-2 mt-4" {...props}>
      {children}
    </h4>
  ),
  p: ({ children, ...props }: any) => (
    <p className="text-gray-700 mb-4 leading-relaxed" {...props}>
      {children}
    </p>
  ),
  ul: ({ children, ...props }: any) => (
    <ul className="list-disc list-inside mb-4 space-y-2" {...props}>
      {children}
    </ul>
  ),
  ol: ({ children, ...props }: any) => (
    <ol className="list-decimal list-inside mb-4 space-y-2" {...props}>
      {children}
    </ol>
  ),
  li: ({ children, ...props }: any) => (
    <li className="text-gray-700" {...props}>
      {children}
    </li>
  ),
  strong: ({ children, ...props }: any) => (
    <strong className="font-semibold text-gray-900" {...props}>
      {children}
    </strong>
  ),
  em: ({ children, ...props }: any) => (
    <em className="italic text-gray-800" {...props}>
      {children}
    </em>
  ),
  code: ({ children, ...props }: any) => (
    <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono text-gray-800" {...props}>
      {children}
    </code>
  ),
  pre: ({ children, ...props }: any) => (
    <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto mb-4" {...props}>
      {children}
    </pre>
  ),
  blockquote: ({ children, ...props }: any) => (
    <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-600 mb-4" {...props}>
      {children}
    </blockquote>
  ),
  a: ({ children, href, ...props }: any) => (
    <a 
      href={href} 
      className="text-blue-600 hover:text-blue-800 underline" 
      target="_blank" 
      rel="noopener noreferrer"
      {...props}
    >
      {children}
    </a>
  ),
  img: ({ src, alt, ...props }: any) => (
    <img 
      src={src} 
      alt={alt} 
      className="max-w-full h-auto rounded-lg mb-4" 
      {...props}
    />
  ),
  table: ({ children, ...props }: any) => (
    <div className="overflow-x-auto mb-4">
      <table className="min-w-full border-collapse border border-gray-300" {...props}>
        {children}
      </table>
    </div>
  ),
  th: ({ children, ...props }: any) => (
    <th className="border border-gray-300 px-4 py-2 bg-gray-100 font-semibold text-left" {...props}>
      {children}
    </th>
  ),
  td: ({ children, ...props }: any) => (
    <td className="border border-gray-300 px-4 py-2" {...props}>
      {children}
    </td>
  ),
}

export function ServerMDXContent({ config, mdxSource }: ServerMDXContentProps) {
  // Если есть MDX контент, рендерим его
  if (mdxSource) {
    return (
      <div className="prose prose-gray max-w-none">
        <MDXRemote source={mdxSource} components={components} />
      </div>
    )
  }

  // Иначе рендерим контент на основе конфига
  return (
    <div className="prose prose-gray max-w-none">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">
        {config.heroTitle}
      </h2>
      <p className="text-gray-600 mb-6">
        {config.heroSubtitle}
      </p>
      
      {/* Features section */}
      {config.features && config.features.length > 0 && (
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Key Features</h3>
          <ul className="space-y-3">
            {config.features.map((feature, index) => (
              <li key={index} className="flex items-start gap-3">
                {feature.icon && (
                  <span className="text-2xl flex-shrink-0">{feature.icon}</span>
                )}
                <div>
                  <strong className="text-gray-900">{feature.title}</strong>
                  <p className="text-gray-600 text-sm mt-1">{feature.description}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* FAQ section */}
      {config.faq && config.faq.length > 0 && (
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Frequently Asked Questions</h3>
          <div className="space-y-4">
            {config.faq.map((item, index) => (
              <div key={index} className="border-l-4 border-blue-500 pl-4">
                <h4 className="font-semibold text-gray-900 mb-2">{item.question}</h4>
                <p className="text-gray-600">{item.answer}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Custom content */}
      {config.customContent && (
        <div 
          className="text-gray-700"
          dangerouslySetInnerHTML={{ __html: config.customContent }}
        />
      )}

      {/* Default content if no custom content */}
      {!config.customContent && !config.features && !config.faq && (
        <div>
          <h3>How to Use Our Paste to QR Code Generator</h3>
          <p>
            Our paste to QR code generator is designed to be as simple as possible. Just paste any text 
            from your clipboard and the QR code will be generated instantly. No typing, no complex settings, 
            no confusing options - just paste and generate!
          </p>
          
          <h3>Key Features</h3>
          <ul>
            <li><strong>One-Click Paste:</strong> Simply tap the "Paste to QR" button to insert content from clipboard</li>
            <li><strong>Instant Generation:</strong> QR codes are created automatically when you paste</li>
            <li><strong>Clipboard Integration:</strong> Works seamlessly with your device's clipboard</li>
            <li><strong>Mobile Optimized:</strong> Perfect for mobile devices and touch interfaces</li>
            <li><strong>No Registration:</strong> Use immediately without signing up or logging in</li>
          </ul>
          
          <h3>What Can You Paste to QR?</h3>
          <p>
            You can paste any text content from your clipboard to create QR codes:
          </p>
          <ul>
            <li><strong>Website URLs:</strong> Paste links to share websites instantly</li>
            <li><strong>WiFi Passwords:</strong> Paste WiFi credentials to share network access</li>
            <li><strong>Phone Numbers:</strong> Paste phone numbers for instant calling</li>
            <li><strong>Email Addresses:</strong> Paste email addresses for quick contact</li>
            <li><strong>Text Messages:</strong> Paste SMS content for instant messaging</li>
            <li><strong>Contact Information:</strong> Paste vCard data for contact sharing</li>
            <li><strong>Any Text:</strong> Paste any text content you want to share</li>
          </ul>
          
          <h3>Why Choose Our Paste to QR Generator?</h3>
          <p>
            Our paste to QR code generator is built with one goal in mind: making QR code creation 
            as effortless as possible. We believe that creating QR codes should be as simple as 
            copying and pasting text. No typing, no complex forms, no unnecessary steps - 
            just paste from your clipboard and get your QR code instantly!
          </p>
          
          <h3>Perfect for Mobile Use</h3>
          <p>
            Designed specifically for mobile devices, our paste to QR generator works perfectly 
            with touch interfaces. The large "Paste to QR" button makes it easy to use on any 
            smartphone or tablet, and the instant generation means you get your QR code in seconds.
          </p>
        </div>
      )}
    </div>
  )
}
