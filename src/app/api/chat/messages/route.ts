import { NextResponse } from 'next/server'
import { getDb } from '@/lib/db'
import { getOrCreateSession, mergeHeaders } from '@/lib/server/session'

export async function GET(request: Request) {
  try {
    const db = await getDb()
    const { searchParams } = new URL(request.url)
    const roomId = searchParams.get('roomId') ?? 'general'
    const since = searchParams.get('since')
    const limit = Math.min(Number(searchParams.get('limit')) || 50, 200)

    const messages = await db.chatMessage.findMany({
      where: {
        roomId,
        ...(since ? { createdAt: { gt: new Date(since) } } : {}),
      },
      orderBy: { createdAt: 'asc' },
      take: limit,
    })

    return NextResponse.json({
      messages,
      serverTime: new Date().toISOString(),
    })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch messages' },
      { status: 500 },
    )
  }
}

export async function POST(request: Request) {
  try {
    const session = await getOrCreateSession(request)
    const db = await getDb()
    const body = await request.json()

    const username = typeof body.username === 'string' && body.username.trim()
      ? body.username.trim().slice(0, 32)
      : 'Anonymous'
    const content = typeof body.content === 'string' ? body.content.trim().slice(0, 500) : ''
    const roomId = typeof body.roomId === 'string' ? body.roomId : 'general'

    if (!content) {
      return NextResponse.json({ error: 'Message content required' }, { status: 400 })
    }

    // Ensure room exists
    const room = await db.chatRoom.findUnique({ where: { id: roomId } })
    if (!room) {
      // Auto-create the general room
      if (roomId === 'general') {
        await db.chatRoom.create({ data: { id: 'general', name: 'Fan Chat' } })
      } else {
        return NextResponse.json({ error: 'Room not found' }, { status: 404 })
      }
    }

    const message = await db.chatMessage.create({
      data: {
        id: crypto.randomUUID(),
        roomId,
        sessionId: session.sessionId,
        username,
        content,
        type: 'user',
      },
    })

    const response = NextResponse.json(message, { status: 201 })
    mergeHeaders(response.headers, session.headers)
    return response
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to send message' },
      { status: 500 },
    )
  }
}
