import { NextResponse } from 'next/server'
import { getDb } from '@/lib/db'
import { withAdmin } from '@/lib/server/route-helpers'

export async function GET() {
  try {
    const db = await getDb()
    const photos = await db.photo.findMany({ orderBy: { order: 'asc' } })
    return NextResponse.json({ photos })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to list photos' },
      { status: 500 },
    )
  }
}

export async function POST(request: Request) {
  return withAdmin(request, async () => {
    const db = await getDb()
    const body = await request.json()
    const count = await db.photo.count()

    const photo = await db.photo.create({
      data: {
        id: crypto.randomUUID(),
        title: body.title,
        url: body.url,
        thumbnailUrl: body.thumbnailUrl ?? null,
        description: body.description ?? null,
        order: count,
      },
    })

    return NextResponse.json(photo, { status: 201 })
  })
}
