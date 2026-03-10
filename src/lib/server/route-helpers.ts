import { NextResponse } from 'next/server'
import { AdminError, requireAdmin } from '@/lib/server/admin'

/**
 * Wraps a handler that requires admin access. Returns 401 on AdminError.
 */
export async function withAdmin(request: Request, handler: () => Promise<Response>): Promise<Response> {
  try {
    await requireAdmin(request)
    return await handler()
  } catch (error) {
    if (error instanceof AdminError) {
      return NextResponse.json({ error: error.message }, { status: 401 })
    }
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal error' },
      { status: 500 },
    )
  }
}
