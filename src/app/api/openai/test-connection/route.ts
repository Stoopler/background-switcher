import { NextResponse } from 'next/server'
import OpenAI from 'openai'

export async function POST(request: Request) {
  const { apiKey, orgId } = await request.json()

  const openai = new OpenAI({
    apiKey: apiKey,
    organization: orgId || undefined,
  })

  try {
    // Test the connection by listing models
    await openai.models.list()
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error testing OpenAI connection:', error)
    return NextResponse.json({ success: false, error: 'Failed to connect to OpenAI' }, { status: 500 })
  }
}
