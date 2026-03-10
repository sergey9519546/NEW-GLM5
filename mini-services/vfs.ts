import {
  vfsCreateInputSchema,
  vfsEntrySchema,
  vfsListResponseSchema,
  vfsUpdateInputSchema,
  type VfsCreateInput,
  type VfsEntry,
  type VfsUpdateInput,
} from '@/lib/personal-state'

async function parseResponse<T>(response: Response, parser: (payload: unknown) => T) {
  if (!response.ok) {
    const payload = await response.json().catch(() => ({}))
    throw new Error(payload.error || 'Request failed')
  }

  const payload = await response.json()
  return parser(payload)
}

export async function fetchVfsEntries(parentId?: string | null) {
  const searchParams = new URLSearchParams()

  if (parentId) {
    searchParams.set('parentId', parentId)
  }

  const response = await fetch(`/api/vfs${searchParams.size > 0 ? `?${searchParams.toString()}` : ''}`, {
    cache: 'no-store',
  })

  return parseResponse(response, (payload) => vfsListResponseSchema.parse(payload))
}

export async function fetchVfsEntry(id: string): Promise<VfsEntry> {
  const response = await fetch(`/api/vfs/${id}`, {
    cache: 'no-store',
  })

  return parseResponse(response, (payload) => vfsEntrySchema.parse(payload))
}

export async function createVfsEntry(input: VfsCreateInput): Promise<VfsEntry> {
  const payload = vfsCreateInputSchema.parse(input)
  const response = await fetch('/api/vfs', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  return parseResponse(response, (value) => vfsEntrySchema.parse(value))
}

export async function updateVfsEntry(id: string, input: VfsUpdateInput): Promise<VfsEntry> {
  const payload = vfsUpdateInputSchema.parse(input)
  const response = await fetch(`/api/vfs/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  return parseResponse(response, (value) => vfsEntrySchema.parse(value))
}

export async function deleteVfsEntry(id: string) {
  const response = await fetch(`/api/vfs/${id}`, {
    method: 'DELETE',
  })

  return parseResponse(response, (payload) => payload as { ok: boolean })
}