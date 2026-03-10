import { NextResponse } from 'next/server'
import { getDb } from '@/lib/db'
import { withAdmin } from '@/lib/server/route-helpers'

export async function GET(request: Request) {
  try {
    const db = await getDb()
    const { searchParams } = new URL(request.url)
    const limit = Number(searchParams.get('limit')) || 50
    const offset = Number(searchParams.get('offset')) || 0

    const articles = await db.newsArticle.findMany({
      orderBy: { order: 'asc' },
      take: limit,
      skip: offset,
    })

    return NextResponse.json({ articles })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to list articles' },
      { status: 500 },
    )
  }
}

export async function POST(request: Request) {
  return withAdmin(request, async () => {
    const db = await getDb()
    const body = await request.json()
    const count = await db.newsArticle.count()

    const article = await db.newsArticle.create({
      data: {
        id: crypto.randomUUID(),
        title: body.title,
        content: body.content,
        date: body.date ?? new Date().toISOString().split('T')[0],
        author: body.author ?? null,
        order: count,
      },
    })

    return NextResponse.json(article, { status: 201 })
  })
}
