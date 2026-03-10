import {
  storedWindowStateSchema,
  storedWindowStatesSchema,
  type StoredWindowState,
} from '@/lib/personal-state'

async function parseResponse(response: Response) {
  if (!response.ok) {
    const payload = await response.json().catch(() => ({}))
    throw new Error(payload.error || 'Request failed')
  }

  const payload = await response.json()
  const parsed = storedWindowStatesSchema.parse(payload)
  return parsed.windows.map((window) => storedWindowStateSchema.parse(window))
}

export async function fetchWindowStates(): Promise<StoredWindowState[]> {
  const response = await fetch('/api/windows', {
    cache: 'no-store',
  })

  return parseResponse(response)
}

export async function saveWindowStates(
  windows: StoredWindowState[],
): Promise<StoredWindowState[]> {
  const response = await fetch('/api/windows', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ windows }),
  })

  return parseResponse(response)
}