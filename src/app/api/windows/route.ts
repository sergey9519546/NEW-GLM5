import { NextResponse } from 'next/server'
import { storedWindowStatesSchema } from '@/lib/personal-state'
import { getOrCreateSession, mergeHeaders } from '@/lib/server/session'
import { getWindowStates, replaceWindowStates } from '@/lib/server/windows'

export async function GET(request: Request) {
  try {
    const session = await getOrCreateSession(request)
    const windows = await getWindowStates(session.sessionId)
    const response = NextResponse.json({ windows })

    mergeHeaders(response.headers, session.headers)
    return response
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to load window state' },
      { status: 400 },
    )
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getOrCreateSession(request)
    const payload = storedWindowStatesSchema.parse(await request.json())
    const windows = await replaceWindowStates(session.sessionId, payload.windows)
    const response = NextResponse.json({ windows })

    mergeHeaders(response.headers, session.headers)
    return response
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to save window state' },
      { status: 400 },
    )
  }
}