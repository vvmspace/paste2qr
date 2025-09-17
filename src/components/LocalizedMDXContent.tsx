'use client'

import { useTranslation } from 'react-i18next'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { getLocalizedContent, MDXPage } from '../lib/mdxLoader'

interface LocalizedMDXContentProps {
  mdxPage: MDXPage
  className?: string
}

// MDX components for rendering
const mdxComponents = {
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
  p: ({ children, ...props }: any) => (
    <p className="text-gray-600 mb-4 leading-relaxed" {...props}>
      {children}
    </p>
  ),
  ul: ({ children, ...props }: any) => (
    <ul className="list-disc list-inside text-gray-600 mb-4 space-y-2" {...props}>
      {children}
    </ul>
  ),
  ol: ({ children, ...props }: any) => (
    <ol className="list-decimal list-inside text-gray-600 mb-4 space-y-2" {...props}>
      {children}
    </ol>
  ),
  li: ({ children, ...props }: any) => (
    <li className="text-gray-600" {...props}>
      {children}
    </li>
  ),
  strong: ({ children, ...props }: any) => (
    <strong className="font-semibold text-gray-900" {...props}>
      {children}
    </strong>
  ),
  em: ({ children, ...props }: any) => (
    <em className="italic text-gray-700" {...props}>
      {children}
    </em>
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
  blockquote: ({ children, ...props }: any) => (
    <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-700 mb-4" {...props}>
      {children}
    </blockquote>
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
  hr: ({ ...props }: any) => (
    <hr className="border-gray-300 my-8" {...props} />
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
  )
}

export function LocalizedMDXContent({ mdxPage, className = '' }: LocalizedMDXContentProps) {
  const { i18n } = useTranslation()
  const currentLocale = i18n.language || 'en'
  
  const localizedContent = getLocalizedContent(mdxPage, currentLocale)
  
  if (!localizedContent) {
    return (
      <div className={`prose prose-gray max-w-none ${className}`}>
        <p className="text-gray-500 italic">Content not available in {currentLocale}</p>
      </div>
    )
  }
  
  return (
    <div className={`prose prose-gray max-w-none ${className}`}>
      <MDXRemote 
        source={localizedContent.content} 
        components={mdxComponents}
      />
    </div>
  )
}
