import { NextResponse } from 'next/server'
import { getAdminToken } from '@/lib/server/admin'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const passphrase = typeof body?.passphrase === 'string' ? body.passphrase : ''

    if (!passphrase) {
      return NextResponse.json({ error: 'Passphrase required' }, { status: 400 })
    }

    const token = await getAdminToken()

    if (passphrase !== token) {
      return NextResponse.json({ error: 'Invalid passphrase' }, { status: 401 })
    }

    return NextResponse.json({ token })
  } catch {
    return NextResponse.json({ error: 'Auth service unavailable' }, { status: 500 })
  }
}
