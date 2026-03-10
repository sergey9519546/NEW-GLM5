import { NextResponse } from 'next/server'
import { getDb } from '@/lib/db'
import { withAdmin } from '@/lib/server/route-helpers'

type RouteContext = { params: Promise<{ id: string }> }

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { id } = await context.params
    const db = await getDb()
    const video = await db.video.findUnique({ where: { id } })

    if (!video) {
      return NextResponse.json({ error: 'Video not found' }, { status: 404 })
    }

    return NextResponse.json(video)
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to get video' },
      { status: 500 },
    )
  }
}

export async function PUT(request: Request, context: RouteContext) {
  return withAdmin(request, async () => {
    const { id } = await context.params
    const db = await getDb()
    const body = await request.json()

    const video = await db.video.update({
      where: { id },
      data: {
        ...(body.title !== undefined && { title: body.title }),
        ...(body.url !== undefined && { url: body.url }),
        ...(body.thumbnailUrl !== undefined && { thumbnailUrl: body.thumbnailUrl }),
        ...(body.duration !== undefined && { duration: body.duration }),
        ...(body.description !== undefined && { description: body.description }),
        ...(body.order !== undefined && { order: body.order }),
      },
    })

    return NextResponse.json(video)
  })
}

export async function DELETE(request: Request, context: RouteContext) {
  return withAdmin(request, async () => {
    const { id } = await context.params
    const db = await getDb()
    await db.video.delete({ where: { id } })
    return NextResponse.json({ ok: true })
  })
}
