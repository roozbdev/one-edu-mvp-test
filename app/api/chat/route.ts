import { NextRequest, NextResponse } from 'next/server'
import { chatWithAstra } from '@/lib/openai'

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const { message, childName } = await request.json()

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 })
    }

    const reply = await chatWithAstra(message, childName)
    
    return NextResponse.json({ reply })
  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json(
      { error: 'Failed to process message' },
      { status: 500 }
    )
  }
}