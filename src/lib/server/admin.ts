import { getCloudflareContext } from '@opennextjs/cloudflare'

export async function getAdminToken(): Promise<string> {
  const context = await getCloudflareContext({ async: true })
  const token = (context.env as Record<string, string>).ADMIN_TOKEN

  if (!token) {
    throw new Error('ADMIN_TOKEN not configured')
  }

  return token
}

export async function requireAdmin(request: Request): Promise<void> {
  const token = request.headers.get('X-Admin-Token')

  if (!token) {
    throw new AdminError('Missing admin token')
  }

  const expected = await getAdminToken()

  if (token !== expected) {
    throw new AdminError('Invalid admin token')
  }
}

export class AdminError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'AdminError'
  }
}
