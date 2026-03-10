import { NextResponse } from 'next/server'
import { vfsUpdateInputSchema } from '@/lib/personal-state'
import { getOrCreateSession, mergeHeaders } from '@/lib/server/session'
import { deleteVfsEntry, getVfsEntry, updateVfsEntry } from '@/lib/server/vfs'

type RouteContext = {
  params: Promise<{
    id: string
  }>
}

export async function GET(request: Request, context: RouteContext) {
  try {
    const session = await getOrCreateSession(request)
    const { id } = await context.params
    const entry = await getVfsEntry(session.sessionId, id)
    const response = NextResponse.json(entry)

    mergeHeaders(response.headers, session.headers)
    return response
  } catch (error) {
    const status = error instanceof Error && error.message === 'VFS entry not found' ? 404 : 400

    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to load VFS entry' },
      { status },
    )
  }
}

export async function PUT(request: Request, context: RouteContext) {
  try {
    const session = await getOrCreateSession(request)
    const { id } = await context.params
    const payload = vfsUpdateInputSchema.parse(await request.json())
    const entry = await updateVfsEntry(session.sessionId, id, payload)
    const response = NextResponse.json(entry)

    mergeHeaders(response.headers, session.headers)
    return response
  } catch (error) {
    const status = error instanceof Error && error.message === 'VFS entry not found' ? 404 : 400

    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update VFS entry' },
      { status },
    )
  }
}

export async function DELETE(request: Request, context: RouteContext) {
  try {
    const session = await getOrCreateSession(request)
    const { id } = await context.params
    await deleteVfsEntry(session.sessionId, id)
    const response = NextResponse.json({ ok: true })

    mergeHeaders(response.headers, session.headers)
    return response
  } catch (error) {
    const status = error instanceof Error && error.message === 'VFS entry not found' ? 404 : 400

    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to delete VFS entry' },
      { status },
    )
  }
}