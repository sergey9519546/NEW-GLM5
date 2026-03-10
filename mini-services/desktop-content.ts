import {
  desktopContentSchema,
  type DesktopContentSnapshot,
} from '@/lib/desktop-content'

function createAdminHeaders(adminToken?: string) {
  return {
    'Content-Type': 'application/json',
    ...(adminToken ? { 'X-Admin-Token': adminToken } : {}),
  }
}

async function parseResponse(response: Response) {
  if (!response.ok) {
    const payload = await response.json().catch(() => ({}))
    throw new Error(payload.error || 'Request failed')
  }

  const payload = await response.json()
  return desktopContentSchema.parse(payload)
}

export async function fetchDesktopContent(): Promise<DesktopContentSnapshot> {
  const response = await fetch('/api/desktop-content', { cache: 'no-store' })
  return parseResponse(response)
}

export async function saveDesktopContent(
  content: DesktopContentSnapshot,
  adminToken?: string,
): Promise<DesktopContentSnapshot> {
  const response = await fetch('/api/desktop-content', {
    method: 'PUT',
    headers: createAdminHeaders(adminToken),
    body: JSON.stringify(content),
  })

  return parseResponse(response)
}

export async function resetDesktopContent(adminToken?: string): Promise<DesktopContentSnapshot> {
  const response = await fetch('/api/desktop-content', {
    method: 'POST',
    headers: adminToken ? { 'X-Admin-Token': adminToken } : undefined,
  })

  return parseResponse(response)
}