import { NextRequest, NextResponse } from 'next/server'
import { storage, StorageItem } from '../../../lib/storage'
import { generateUniqueAlias } from '../../../lib/alias'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { text, prefix, title, description, language } = body

    if (!text) {
      return NextResponse.json(
        { error: 'Text is required' },
        { status: 400 }
      )
    }

    const alias = generateUniqueAlias(text)
    const fullText = prefix ? `${prefix}${text}` : text

    const storageItem: StorageItem = {
      id: alias,
      title: title || `QR Code - ${new Date().toLocaleDateString()}`,
      description: description || `QR code containing: ${fullText.substring(0, 100)}${fullText.length > 100 ? '...' : ''}`,
      language: language || 'en',
      text: fullText,
      prefix: prefix || undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    await storage.save(storageItem)

    const url = `${request.nextUrl.origin}/qr/${alias}`

    return NextResponse.json({
      success: true,
      alias,
      url,
      data: storageItem
    })
  } catch (error) {
    console.error('Error publishing QR code:', error)
    return NextResponse.json(
      { error: 'Failed to publish QR code' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const alias = searchParams.get('alias')

    if (!alias) {
      return NextResponse.json(
        { error: 'Alias is required' },
        { status: 400 }
      )
    }

    const storageItem = await storage.get(alias)

    if (!storageItem) {
      return NextResponse.json(
        { error: 'QR code not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: storageItem
    })
  } catch (error) {
    console.error('Error fetching QR code:', error)
    return NextResponse.json(
      { error: 'Failed to fetch QR code' },
      { status: 500 }
    )
  }
}

