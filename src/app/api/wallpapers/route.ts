import { NextResponse } from 'next/server'
import { getDb } from '@/lib/db'
import { withAdmin } from '@/lib/server/route-helpers'

export async function GET() {
  try {
    const db = await getDb()
    const wallpapers = await db.wallpaper.findMany({ orderBy: { order: 'asc' } })
    return NextResponse.json({ wallpapers })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to list wallpapers' },
      { status: 500 },
    )
  }
}

export async function POST(request: Request) {
  return withAdmin(request, async () => {
    const db = await getDb()
    const body = await request.json()
    const count = await db.wallpaper.count()

    const wallpaper = await db.wallpaper.create({
      data: {
        id: crypto.randomUUID(),
        title: body.title,
        url: body.url,
        thumbnailUrl: body.thumbnailUrl ?? null,
        order: count,
      },
    })

    return NextResponse.json(wallpaper, { status: 201 })
  })
}
