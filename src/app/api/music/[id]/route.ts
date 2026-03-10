import { NextResponse } from 'next/server'
import { getDb } from '@/lib/db'
import { withAdmin } from '@/lib/server/route-helpers'

type RouteContext = { params: Promise<{ id: string }> }

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { id } = await context.params
    const db = await getDb()
    const track = await db.track.findUnique({ where: { id } })

    if (!track) {
      return NextResponse.json({ error: 'Track not found' }, { status: 404 })
    }

    return NextResponse.json(track)
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to get track' },
      { status: 500 },
    )
  }
}

export async function PUT(request: Request, context: RouteContext) {
  return withAdmin(request, async () => {
    const { id } = await context.params
    const db = await getDb()
    const body = await request.json()

    const track = await db.track.update({
      where: { id },
      data: {
        ...(body.title !== undefined && { title: body.title }),
        ...(body.artist !== undefined && { artist: body.artist }),
        ...(body.album !== undefined && { album: body.album }),
        ...(body.duration !== undefined && { duration: body.duration }),
        ...(body.url !== undefined && { url: body.url }),
        ...(body.coverUrl !== undefined && { coverUrl: body.coverUrl }),
        ...(body.order !== undefined && { order: body.order }),
      },
    })

    return NextResponse.json(track)
  })
}

export async function DELETE(request: Request, context: RouteContext) {
  return withAdmin(request, async () => {
    const { id } = await context.params
    const db = await getDb()
    await db.track.delete({ where: { id } })
    return NextResponse.json({ ok: true })
  })
}
