// MDX content loader with localization support

import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

export interface LocalizedMDXContent {
  [locale: string]: {
    frontmatter: {
      title: string
      description: string
      keywords: string
      [key: string]: any
    }
    content: string
  }
}

export interface MDXPage {
  slug: string
  locales: LocalizedMDXContent
}

// Load MDX content with localization support
export function loadLocalizedMDX(slug: string): MDXPage | null {
  try {
    const contentDir = path.join(process.cwd(), 'src/content')
    const locales: LocalizedMDXContent = {}
    
    // Supported locales
    const supportedLocales = ['en', 'es', 'zh', 'fr', 'am']
    
    for (const locale of supportedLocales) {
      const filePath = path.join(contentDir, `${slug}.${locale}.mdx`)
      
      if (fs.existsSync(filePath)) {
        const fileContent = fs.readFileSync(filePath, 'utf8')
        const { data: frontmatter, content } = matter(fileContent)
        
        locales[locale] = {
          frontmatter: frontmatter as any,
          content
        }
      } else {
        // Fallback to English if localized version doesn't exist
        const fallbackPath = path.join(contentDir, `${slug}.mdx`)
        if (fs.existsSync(fallbackPath) && locale === 'en') {
          const fileContent = fs.readFileSync(fallbackPath, 'utf8')
          const { data: frontmatter, content } = matter(fileContent)
          
          locales[locale] = {
            frontmatter: frontmatter as any,
            content
          }
        }
      }
    }
    
    if (Object.keys(locales).length === 0) {
      return null
    }
    
    return {
      slug,
      locales
    }
  } catch (error) {
    console.error(`Error loading MDX content for ${slug}:`, error)
    return null
  }
}

// Get all available MDX pages
export function getAllMDXPages(): string[] {
  try {
    const contentDir = path.join(process.cwd(), 'src/content')
    
    if (!fs.existsSync(contentDir)) {
      return []
    }
    
    const files = fs.readdirSync(contentDir)
    const pages = new Set<string>()
    
    files.forEach(file => {
      if (file.endsWith('.mdx')) {
        // Remove locale suffix and .mdx extension
        const slug = file.replace(/\.(en|es|zh|fr|am)\.mdx$/, '').replace(/\.mdx$/, '')
        pages.add(slug)
      }
    })
    
    return Array.from(pages)
  } catch (error) {
    console.error('Error getting MDX pages:', error)
    return []
  }
}

// Generate static params for MDX pages
export function generateMDXStaticParams(): Array<{ slug: string }> {
  const pages = getAllMDXPages()
  return pages.map(slug => ({ slug }))
}

// Get localized content for a specific locale
export function getLocalizedContent(mdxPage: MDXPage, locale: string): { frontmatter: any; content: string } | null {
  // Try to get content for the requested locale
  if (mdxPage.locales[locale]) {
    return mdxPage.locales[locale]
  }
  
  // Fallback to English
  if (mdxPage.locales['en']) {
    return mdxPage.locales['en']
  }
  
  // Fallback to any available locale
  const availableLocales = Object.keys(mdxPage.locales)
  if (availableLocales.length > 0) {
    return mdxPage.locales[availableLocales[0]]
  }
  
  return null
}

// Get localized MDX content for a specific slug and locale
export async function getLocalizedMDXContent(slug: string, locale: string): Promise<string | null> {
  try {
    const contentDir = path.join(process.cwd(), 'src/content')
    const filePath = path.join(contentDir, `${slug}.${locale}.mdx`)
    
    if (fs.existsSync(filePath)) {
      const fileContent = fs.readFileSync(filePath, 'utf8')
      return fileContent
    }
    
    // Fallback to English
    const fallbackPath = path.join(contentDir, `${slug}.en.mdx`)
    if (fs.existsSync(fallbackPath)) {
      const fileContent = fs.readFileSync(fallbackPath, 'utf8')
      return fileContent
    }
    
    return null
  } catch (error) {
    console.error(`Error loading MDX content for ${slug}.${locale}:`, error)
    return null
  }
}
