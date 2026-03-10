import { NextResponse } from 'next/server'
import { getCloudflareContext } from '@opennextjs/cloudflare'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const messages = Array.isArray(body.messages) ? body.messages : []

    if (messages.length === 0) {
      return NextResponse.json({ error: 'Messages array required' }, { status: 400 })
    }

    const context = await getCloudflareContext({ async: true })
    const env = context.env as Record<string, string>
    const baseUrl = env.ZAI_BASE_URL || process.env.ZAI_BASE_URL
    const apiKey = env.ZAI_API_KEY || process.env.ZAI_API_KEY

    if (!baseUrl || !apiKey) {
      return NextResponse.json({ error: 'AI service not configured' }, { status: 503 })
    }

    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'yi-large',
        messages: messages.map((m: { role: string; content: string }) => ({
          role: m.role === 'assistant' ? 'assistant' : 'user',
          content: typeof m.content === 'string' ? m.content.slice(0, 4000) : '',
        })),
      }),
    })

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unknown error')
      return NextResponse.json(
        { error: `AI service error: ${response.status}`, details: errorText },
        { status: 502 },
      )
    }

    const data = await response.json()
    const reply = data?.choices?.[0]?.message?.content ?? ''

    return NextResponse.json({ reply })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'AI service unavailable' },
      { status: 500 },
    )
  }
}
