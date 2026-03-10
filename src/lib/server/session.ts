import { getDb } from '@/lib/db'
import { seedSessionVfs } from '@/lib/server/vfs'

export const SESSION_COOKIE_NAME = 'sid'
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 365

function readCookie(request: Request, name: string) {
  const cookieHeader = request.headers.get('cookie')

  if (!cookieHeader) {
    return null
  }

  const encodedName = `${name}=`

  for (const part of cookieHeader.split(';')) {
    const trimmed = part.trim()
    if (trimmed.startsWith(encodedName)) {
      return decodeURIComponent(trimmed.slice(encodedName.length))
    }
  }

  return null
}

function buildSessionCookie(sessionId: string) {
  return [
    `${SESSION_COOKIE_NAME}=${encodeURIComponent(sessionId)}`,
    'Path=/',
    `Max-Age=${SESSION_MAX_AGE_SECONDS}`,
    'HttpOnly',
    'SameSite=Lax',
    'Secure',
  ].join('; ')
}

export type SessionContext = {
  sessionId: string
  headers: Headers
  isNewSession: boolean
}

export async function getOrCreateSession(request: Request): Promise<SessionContext> {
  const db = await getDb()
  const sessionId = readCookie(request, SESSION_COOKIE_NAME)

  if (sessionId) {
    const existingSession = await db.session.findUnique({
      where: { id: sessionId },
      select: { id: true },
    })

    if (existingSession) {
      await db.session.update({
        where: { id: sessionId },
        data: { lastSeenAt: new Date() },
      })

      return {
        sessionId,
        headers: new Headers(),
        isNewSession: false,
      }
    }
  }

  const newSessionId = crypto.randomUUID()

  await db.session.create({
    data: { id: newSessionId },
  })

  await seedSessionVfs(newSessionId)

  const headers = new Headers()
  headers.append('Set-Cookie', buildSessionCookie(newSessionId))

  return {
    sessionId: newSessionId,
    headers,
    isNewSession: true,
  }
}

export function mergeHeaders(target: Headers, source: Headers) {
  source.forEach((value, key) => {
    target.append(key, value)
  })

  return target
}