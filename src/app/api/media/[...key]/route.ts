import { NextResponse } from 'next/server'
import { requireAdmin, AdminError } from '@/lib/server/admin'
import {
  getMediaObject,
  putMediaObject,
  deleteMediaObject,
  listMediaObjects,
} from '@/lib/server/r2'

function getKeyFromRequest(request: Request): string {
  const url = new URL(request.url)
  // Strip /api/media/ prefix to get the R2 key
  const key = url.pathname.replace(/^\/api\/media\/?/, '')
  return decodeURIComponent(key)
}

export async function GET(request: Request) {
  const key = getKeyFromRequest(request)

  // No key = list objects (admin only)
  if (!key) {
    try {
      await requireAdmin(request)
    } catch (error) {
      if (error instanceof AdminError) {
        return NextResponse.json({ error: error.message }, { status: 401 })
      }
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const prefix = new URL(request.url).searchParams.get('prefix') ?? undefined
    const objects = await listMediaObjects(prefix)
    return NextResponse.json({ objects })
  }

  // Serve media file (public)
  const object = await getMediaObject(key)

  if (!object) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  return new Response(object.body, {
    headers: {
      'Content-Type': object.contentType,
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  })
}

export async function PUT(request: Request) {
  try {
    await requireAdmin(request)
  } catch (error) {
    if (error instanceof AdminError) {
      return NextResponse.json({ error: error.message }, { status: 401 })
    }
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const key = getKeyFromRequest(request)

  if (!key) {
    return NextResponse.json({ error: 'Key required' }, { status: 400 })
  }

  const contentType = request.headers.get('Content-Type') ?? 'application/octet-stream'
  const body = await request.arrayBuffer()

  await putMediaObject(key, body, contentType)
  return NextResponse.json({ key, size: body.byteLength })
}

export async function DELETE(request: Request) {
  try {
    await requireAdmin(request)
  } catch (error) {
    if (error instanceof AdminError) {
      return NextResponse.json({ error: error.message }, { status: 401 })
    }
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const key = getKeyFromRequest(request)

  if (!key) {
    return NextResponse.json({ error: 'Key required' }, { status: 400 })
  }

  await deleteMediaObject(key)
  return NextResponse.json({ ok: true })
}
