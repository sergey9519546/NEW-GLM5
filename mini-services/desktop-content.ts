import {
  desktopContentSchema,
  type DesktopContentSnapshot,
} from '@/lib/desktop-content'

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
): Promise<DesktopContentSnapshot> {
  const response = await fetch('/api/desktop-content', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(content),
  })

  return parseResponse(response)
}

export async function resetDesktopContent(): Promise<DesktopContentSnapshot> {
  const response = await fetch('/api/desktop-content', {
    method: 'POST',
  })

  return parseResponse(response)
}