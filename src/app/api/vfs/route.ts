import { NextResponse } from 'next/server'
import { vfsCreateInputSchema } from '@/lib/personal-state'
import { getOrCreateSession, mergeHeaders } from '@/lib/server/session'
import { createVfsEntry, listVfsEntries } from '@/lib/server/vfs'

export async function GET(request: Request) {
  try {
    const session = await getOrCreateSession(request)
    const { searchParams } = new URL(request.url)
    const parentId = searchParams.get('parentId')
    const content = await listVfsEntries(session.sessionId, parentId)
    const response = NextResponse.json(content)

    mergeHeaders(response.headers, session.headers)
    return response
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to list VFS entries' },
      { status: 400 },
    )
  }
}

export async function POST(request: Request) {
  try {
    const session = await getOrCreateSession(request)
    const payload = vfsCreateInputSchema.parse(await request.json())
    const entry = await createVfsEntry(session.sessionId, payload)
    const response = NextResponse.json(entry, { status: 201 })

    mergeHeaders(response.headers, session.headers)
    return response
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create VFS entry' },
      { status: 400 },
    )
  }
}