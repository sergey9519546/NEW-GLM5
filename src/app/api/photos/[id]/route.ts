import { NextResponse } from 'next/server'
import { getDb } from '@/lib/db'
import { withAdmin } from '@/lib/server/route-helpers'

type RouteContext = { params: Promise<{ id: string }> }

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { id } = await context.params
    const db = await getDb()
    const photo = await db.photo.findUnique({ where: { id } })

    if (!photo) {
      return NextResponse.json({ error: 'Photo not found' }, { status: 404 })
    }

    return NextResponse.json(photo)
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to get photo' },
      { status: 500 },
    )
  }
}

export async function PUT(request: Request, context: RouteContext) {
  return withAdmin(request, async () => {
    const { id } = await context.params
    const db = await getDb()
    const body = await request.json()

    const photo = await db.photo.update({
      where: { id },
      data: {
        ...(body.title !== undefined && { title: body.title }),
        ...(body.url !== undefined && { url: body.url }),
        ...(body.thumbnailUrl !== undefined && { thumbnailUrl: body.thumbnailUrl }),
        ...(body.description !== undefined && { description: body.description }),
        ...(body.order !== undefined && { order: body.order }),
      },
    })

    return NextResponse.json(photo)
  })
}

export async function DELETE(request: Request, context: RouteContext) {
  return withAdmin(request, async () => {
    const { id } = await context.params
    const db = await getDb()
    await db.photo.delete({ where: { id } })
    return NextResponse.json({ ok: true })
  })
}
