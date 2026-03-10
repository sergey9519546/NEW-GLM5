import { NextResponse } from 'next/server'
import { getDb } from '@/lib/db'
import { withAdmin } from '@/lib/server/route-helpers'

type RouteContext = { params: Promise<{ id: string }> }

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { id } = await context.params
    const db = await getDb()
    const article = await db.newsArticle.findUnique({ where: { id } })

    if (!article) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 })
    }

    return NextResponse.json(article)
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to get article' },
      { status: 500 },
    )
  }
}

export async function PUT(request: Request, context: RouteContext) {
  return withAdmin(request, async () => {
    const { id } = await context.params
    const db = await getDb()
    const body = await request.json()

    const article = await db.newsArticle.update({
      where: { id },
      data: {
        ...(body.title !== undefined && { title: body.title }),
        ...(body.content !== undefined && { content: body.content }),
        ...(body.date !== undefined && { date: body.date }),
        ...(body.author !== undefined && { author: body.author }),
        ...(body.order !== undefined && { order: body.order }),
      },
    })

    return NextResponse.json(article)
  })
}

export async function DELETE(request: Request, context: RouteContext) {
  return withAdmin(request, async () => {
    const { id } = await context.params
    const db = await getDb()
    await db.newsArticle.delete({ where: { id } })
    return NextResponse.json({ ok: true })
  })
}
