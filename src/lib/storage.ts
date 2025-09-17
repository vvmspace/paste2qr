/**
 * Abstract storage interface for JSON files
 * Can be easily replaced with different storage implementations
 */

// Dynamic imports for server-side only modules
let fs: any = null
let path: any = null

// Only import on server side
if (typeof window === 'undefined') {
  fs = require('fs/promises')
  path = require('path')
}

export interface StorageItem {
  id: string
  title?: string
  description?: string
  language?: string
  text: string
  prefix?: string
  createdAt: string
  updatedAt: string
}

export interface StorageConfig {
  siteId: string
  basePath: string
}

export abstract class AbstractStorage {
  protected config: StorageConfig

  constructor(config: StorageConfig) {
    this.config = config
  }

  abstract save(item: StorageItem): Promise<string>
  abstract get(id: string): Promise<StorageItem | null>
  abstract exists(id: string): Promise<boolean>
  abstract delete(id: string): Promise<boolean>
}

/**
 * File system storage implementation
 * Stores JSON files in the public directory
 */
export class FileSystemStorage extends AbstractStorage {
  private getFilePath(id: string): string {
    return `${this.config.basePath}/${this.config.siteId}/${id}.json`
  }

  async save(item: StorageItem): Promise<string> {
    try {
      // Only work on server side
      if (typeof window !== 'undefined' || !fs || !path) {
        throw new Error('File system storage only works on server side')
      }
      
      const filePath = this.getFilePath(item.id)
      
      // Ensure directory exists
      const dir = path.dirname(filePath)
      await fs.mkdir(dir, { recursive: true })
      
      // Write file
      await fs.writeFile(filePath, JSON.stringify(item, null, 2), 'utf8')
      return item.id
    } catch (error) {
      console.error('Error saving to file system:', error)
      throw new Error('Failed to save item')
    }
  }

  async get(id: string): Promise<StorageItem | null> {
    try {
      // Only work on server side
      if (typeof window !== 'undefined' || !fs) {
        throw new Error('File system storage only works on server side')
      }
      
      const filePath = this.getFilePath(id)
      
      const data = await fs.readFile(filePath, 'utf8')
      return JSON.parse(data) as StorageItem
    } catch (error) {
      if ((error as any).code === 'ENOENT') {
        return null
      }
      console.error('Error reading from file system:', error)
      throw new Error('Failed to read item')
    }
  }

  async exists(id: string): Promise<boolean> {
    try {
      // Only work on server side
      if (typeof window !== 'undefined' || !fs) {
        throw new Error('File system storage only works on server side')
      }
      
      const filePath = this.getFilePath(id)
      
      await fs.access(filePath)
      return true
    } catch {
      return false
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      // Only work on server side
      if (typeof window !== 'undefined' || !fs) {
        throw new Error('File system storage only works on server side')
      }
      
      const filePath = this.getFilePath(id)
      
      await fs.unlink(filePath)
      return true
    } catch (error) {
      console.error('Error deleting from file system:', error)
      return false
    }
  }
}

/**
 * Memory storage implementation for development/testing
 */
export class MemoryStorage extends AbstractStorage {
  private storage = new Map<string, StorageItem>()

  async save(item: StorageItem): Promise<string> {
    this.storage.set(item.id, item)
    return item.id
  }

  async get(id: string): Promise<StorageItem | null> {
    return this.storage.get(id) || null
  }

  async exists(id: string): Promise<boolean> {
    return this.storage.has(id)
  }

  async delete(id: string): Promise<boolean> {
    return this.storage.delete(id)
  }
}

/**
 * Storage factory
 */
export function createStorage(config: StorageConfig): AbstractStorage {
  const storageType = process.env.STORAGE_TYPE || 'filesystem'
  
  switch (storageType) {
    case 'memory':
      return new MemoryStorage(config)
    case 'filesystem':
    default:
      return new FileSystemStorage(config)
  }
}

/**
 * Default storage instance
 */
export const storage = createStorage({
  siteId: process.env.SITE_ID || 'default',
  basePath: process.env.STORAGE_BASE_PATH || './public/data'
})




