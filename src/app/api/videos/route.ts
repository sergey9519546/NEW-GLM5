import { NextResponse } from 'next/server'
import { getDb } from '@/lib/db'
import { withAdmin } from '@/lib/server/route-helpers'

export async function GET() {
  try {
    const db = await getDb()
    const videos = await db.video.findMany({ orderBy: { order: 'asc' } })
    return NextResponse.json({ videos })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to list videos' },
      { status: 500 },
    )
  }
}

export async function POST(request: Request) {
  return withAdmin(request, async () => {
    const db = await getDb()
    const body = await request.json()
    const count = await db.video.count()

    const video = await db.video.create({
      data: {
        id: crypto.randomUUID(),
        title: body.title,
        url: body.url,
        thumbnailUrl: body.thumbnailUrl ?? null,
        duration: body.duration ?? 0,
        description: body.description ?? null,
        order: count,
      },
    })

    return NextResponse.json(video, { status: 201 })
  })
}
