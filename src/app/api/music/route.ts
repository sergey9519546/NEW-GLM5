import { NextResponse } from 'next/server'
import { getDb } from '@/lib/db'
import { withAdmin } from '@/lib/server/route-helpers'

export async function GET() {
  try {
    const db = await getDb()
    const tracks = await db.track.findMany({ orderBy: { order: 'asc' } })
    return NextResponse.json({ tracks })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to list tracks' },
      { status: 500 },
    )
  }
}

export async function POST(request: Request) {
  return withAdmin(request, async () => {
    const db = await getDb()
    const body = await request.json()
    const count = await db.track.count()

    const track = await db.track.create({
      data: {
        id: crypto.randomUUID(),
        title: body.title,
        artist: body.artist,
        album: body.album ?? '',
        duration: body.duration ?? 0,
        url: body.url,
        coverUrl: body.coverUrl ?? null,
        order: count,
      },
    })

    return NextResponse.json(track, { status: 201 })
  })
}
