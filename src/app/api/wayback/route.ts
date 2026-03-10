import { NextResponse } from 'next/server'

const WAYBACK_API = 'https://archive.org/wayback/available'
const ALLOWED_PROXY_HOST = 'web.archive.org'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const action = searchParams.get('action')

  if (action === 'resolve') {
    return handleResolve(searchParams)
  }

  if (action === 'proxy') {
    return handleProxy(searchParams)
  }

  return NextResponse.json(
    { error: 'Missing action param. Use ?action=resolve or ?action=proxy' },
    { status: 400 },
  )
}

async function handleResolve(searchParams: URLSearchParams) {
  const url = searchParams.get('url')

  if (!url) {
    return NextResponse.json({ error: 'url parameter required' }, { status: 400 })
  }

  const timestamp = searchParams.get('timestamp') ?? ''
  const apiUrl = new URL(WAYBACK_API)
  apiUrl.searchParams.set('url', url)
  if (timestamp) {
    apiUrl.searchParams.set('timestamp', timestamp)
  }

  try {
    const response = await fetch(apiUrl.toString())
    const data = await response.json()

    const snapshot = data?.archived_snapshots?.closest

    if (!snapshot?.available) {
      return NextResponse.json({ available: false })
    }

    return NextResponse.json({
      available: true,
      snapshotUrl: snapshot.url,
      timestamp: snapshot.timestamp,
    })
  } catch {
    return NextResponse.json({ error: 'Wayback API unavailable' }, { status: 502 })
  }
}

async function handleProxy(searchParams: URLSearchParams) {
  const url = searchParams.get('url')

  if (!url) {
    return NextResponse.json({ error: 'url parameter required' }, { status: 400 })
  }

  // SSRF protection: only allow proxying from web.archive.org
  let parsedUrl: URL
  try {
    parsedUrl = new URL(url)
  } catch {
    return NextResponse.json({ error: 'Invalid URL' }, { status: 400 })
  }

  if (parsedUrl.hostname !== ALLOWED_PROXY_HOST) {
    return NextResponse.json(
      { error: `Proxy only allowed for ${ALLOWED_PROXY_HOST}` },
      { status: 403 },
    )
  }

  try {
    const response = await fetch(url)
    const html = await response.text()

    return new Response(html, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'public, max-age=3600',
      },
    })
  } catch {
    return NextResponse.json({ error: 'Failed to fetch archived page' }, { status: 502 })
  }
}
