import { NextResponse } from 'next/server'
import { getDb } from '@/lib/db'
import { withAdmin } from '@/lib/server/route-helpers'

export async function GET(request: Request) {
  try {
    const db = await getDb()
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')

    const shows = await db.show.findMany({
      where: status ? { status } : undefined,
      orderBy: { date: 'asc' },
    })

    return NextResponse.json({ shows })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to list shows' },
      { status: 500 },
    )
  }
}

export async function POST(request: Request) {
  return withAdmin(request, async () => {
    const db = await getDb()
    const body = await request.json()
    const count = await db.show.count()

    const show = await db.show.create({
      data: {
        id: crypto.randomUUID(),
        title: body.title,
        venue: body.venue,
        date: new Date(body.date),
        description: body.description ?? null,
        ticketUrl: body.ticketUrl ?? null,
        posterUrl: body.posterUrl ?? null,
        status: body.status ?? 'upcoming',
        order: count,
      },
    })

    return NextResponse.json(show, { status: 201 })
  })
}
