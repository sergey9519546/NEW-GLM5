import { NextResponse } from 'next/server'
import { getDb } from '@/lib/db'
import { withAdmin } from '@/lib/server/route-helpers'

type RouteContext = { params: Promise<{ id: string }> }

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { id } = await context.params
    const db = await getDb()
    const show = await db.show.findUnique({ where: { id } })

    if (!show) {
      return NextResponse.json({ error: 'Show not found' }, { status: 404 })
    }

    return NextResponse.json(show)
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to get show' },
      { status: 500 },
    )
  }
}

export async function PUT(request: Request, context: RouteContext) {
  return withAdmin(request, async () => {
    const { id } = await context.params
    const db = await getDb()
    const body = await request.json()

    const show = await db.show.update({
      where: { id },
      data: {
        ...(body.title !== undefined && { title: body.title }),
        ...(body.venue !== undefined && { venue: body.venue }),
        ...(body.date !== undefined && { date: new Date(body.date) }),
        ...(body.description !== undefined && { description: body.description }),
        ...(body.ticketUrl !== undefined && { ticketUrl: body.ticketUrl }),
        ...(body.posterUrl !== undefined && { posterUrl: body.posterUrl }),
        ...(body.status !== undefined && { status: body.status }),
        ...(body.order !== undefined && { order: body.order }),
      },
    })

    return NextResponse.json(show)
  })
}

export async function DELETE(request: Request, context: RouteContext) {
  return withAdmin(request, async () => {
    const { id } = await context.params
    const db = await getDb()
    await db.show.delete({ where: { id } })
    return NextResponse.json({ ok: true })
  })
}
