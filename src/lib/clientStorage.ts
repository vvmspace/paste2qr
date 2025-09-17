/**
 * Client-side storage interface
 * Uses API calls instead of direct file system access
 */

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

export class ClientStorage {
  async save(item: Omit<StorageItem, 'id' | 'createdAt' | 'updatedAt'>): Promise<{ id: string; url: string }> {
    const response = await fetch('/api/publish', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(item)
    })

    if (!response.ok) {
      throw new Error('Failed to save item')
    }

    return response.json()
  }

  async get(id: string): Promise<StorageItem | null> {
    try {
      const response = await fetch(`/api/publish?alias=${id}`)
      
      if (!response.ok) {
        return null
      }

      const result = await response.json()
      return result.data
    } catch (error) {
      console.error('Error fetching item:', error)
      return null
    }
  }

  async exists(id: string): Promise<boolean> {
    const item = await this.get(id)
    return item !== null
  }

  async delete(id: string): Promise<boolean> {
    // For now, we don't support deletion from client side
    // This would require a DELETE API endpoint
    return false
  }
}

export const clientStorage = new ClientStorage()
