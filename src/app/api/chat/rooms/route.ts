import { NextResponse } from 'next/server'
import { getDb } from '@/lib/db'

export async function GET() {
  try {
    const db = await getDb()
    let rooms = await db.chatRoom.findMany({ orderBy: { createdAt: 'asc' } })

    // Ensure the default room exists
    if (rooms.length === 0) {
      await db.chatRoom.create({ data: { id: 'general', name: 'Fan Chat' } })
      rooms = await db.chatRoom.findMany({ orderBy: { createdAt: 'asc' } })
    }

    return NextResponse.json({ rooms })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to list rooms' },
      { status: 500 },
    )
  }
}
