import { getDb } from '@/lib/db'
import type {
  VfsCreateInput,
  VfsEntry,
  VfsEntryType,
  VfsUpdateInput,
} from '@/lib/personal-state'

type SeedEntry = {
  id: string
  parentId: string | null
  name: string
  type: VfsEntryType
  content?: string
  mimeType?: string
  size?: number
}

const DEFAULT_VFS_ENTRIES: SeedEntry[] = [
  {
    id: 'root',
    parentId: null,
    name: 'C:',
    type: 'folder',
  },
  {
    id: 'documents',
    parentId: 'root',
    name: 'My Documents',
    type: 'folder',
  },
  {
    id: 'music',
    parentId: 'root',
    name: 'My Music',
    type: 'folder',
  },
  {
    id: 'pictures',
    parentId: 'root',
    name: 'My Pictures',
    type: 'folder',
  },
  {
    id: 'videos',
    parentId: 'root',
    name: 'My Videos',
    type: 'folder',
  },
  {
    id: 'desktop',
    parentId: 'root',
    name: 'Desktop',
    type: 'folder',
  },
  {
    id: 'welcome',
    parentId: 'documents',
    name: 'welcome.txt',
    type: 'file',
    content: 'Welcome to alti.tune Desktop!\n\nYour files now live on the server and follow your session.',
    mimeType: 'text/plain',
    size: 89,
  },
]

function scopedId(sessionId: string, entryId: string) {
  return `${sessionId}:${entryId}`
}

function scopedParentId(sessionId: string, parentId: string | null) {
  return parentId ? scopedId(sessionId, parentId) : null
}

function toVfsEntry(entry: {
  id: string
  parentId: string | null
  name: string
  type: string
  content: string | null
  mimeType: string | null
  size: number
  createdAt: Date
  updatedAt: Date
}): VfsEntry {
  return {
    id: entry.id,
    parentId: entry.parentId,
    name: entry.name,
    type: entry.type as VfsEntryType,
    content: entry.content,
    mimeType: entry.mimeType,
    size: entry.size,
    createdAt: entry.createdAt.toISOString(),
    updatedAt: entry.updatedAt.toISOString(),
  }
}

function getRootId(sessionId: string) {
  return scopedId(sessionId, 'root')
}

function getContentSize(content?: string | null) {
  if (!content) {
    return 0
  }

  return new TextEncoder().encode(content).length
}

async function getEntryForSession(sessionId: string, id: string) {
  const db = await getDb()

  return db.vfsEntry.findFirst({
    where: {
      id,
      sessionId,
    },
  })
}

async function requireEntryForSession(sessionId: string, id: string) {
  const entry = await getEntryForSession(sessionId, id)

  if (!entry) {
    throw new Error('VFS entry not found')
  }

  return entry
}

async function requireFolder(sessionId: string, parentId?: string | null) {
  const effectiveParentId = parentId ?? getRootId(sessionId)
  const folder = await requireEntryForSession(sessionId, effectiveParentId)

  if (folder.type !== 'folder') {
    throw new Error('Parent entry must be a folder')
  }

  return folder
}

async function ensureMoveDoesNotCreateCycle(sessionId: string, entryId: string, nextParentId: string) {
  let currentParentId: string | null = nextParentId

  while (currentParentId) {
    if (currentParentId === entryId) {
      throw new Error('Cannot move a folder into one of its descendants')
    }

    const parent = await getEntryForSession(sessionId, currentParentId)
    currentParentId = parent?.parentId ?? null
  }
}

export async function seedSessionVfs(sessionId: string) {
  const db = await getDb()

  await db.vfsEntry.createMany({
    data: DEFAULT_VFS_ENTRIES.map((entry) => ({
      id: scopedId(sessionId, entry.id),
      sessionId,
      parentId: scopedParentId(sessionId, entry.parentId),
      name: entry.name,
      type: entry.type,
      content: entry.content ?? null,
      mimeType: entry.mimeType ?? null,
      size: entry.size ?? 0,
    })),
  })
}

export async function listVfsEntries(sessionId: string, parentId?: string | null) {
  const db = await getDb()
  const folder = await requireFolder(sessionId, parentId)
  const entries = await db.vfsEntry.findMany({
    where: {
      sessionId,
      parentId: folder.id,
    },
  })

  entries.sort((left, right) => {
    if (left.type !== right.type) {
      return left.type === 'folder' ? -1 : 1
    }

    return left.name.localeCompare(right.name)
  })

  return {
    parent: toVfsEntry(folder),
    entries: entries.map(toVfsEntry),
  }
}

export async function getVfsEntry(sessionId: string, id: string) {
  const entry = await requireEntryForSession(sessionId, id)
  return toVfsEntry(entry)
}

export async function createVfsEntry(sessionId: string, input: VfsCreateInput) {
  const db = await getDb()
  const parent = await requireFolder(sessionId, input.parentId)

  const created = await db.vfsEntry.create({
    data: {
      id: crypto.randomUUID(),
      sessionId,
      parentId: parent.id,
      name: input.name,
      type: input.type,
      content: input.type === 'file' ? input.content ?? '' : null,
      mimeType: input.type === 'file' ? input.mimeType ?? 'text/plain' : null,
      size: input.type === 'file' ? getContentSize(input.content ?? '') : 0,
    },
  })

  return toVfsEntry(created)
}

export async function updateVfsEntry(sessionId: string, id: string, input: VfsUpdateInput) {
  const db = await getDb()
  const existing = await requireEntryForSession(sessionId, id)

  let nextParentId = existing.parentId

  if (input.parentId !== undefined) {
    const nextParent = await requireFolder(sessionId, input.parentId)
    await ensureMoveDoesNotCreateCycle(sessionId, existing.id, nextParent.id)
    nextParentId = nextParent.id
  }

  const nextContent = input.content !== undefined ? input.content : existing.content
  const nextMimeType = input.mimeType !== undefined ? input.mimeType : existing.mimeType

  const updated = await db.vfsEntry.update({
    where: { id: existing.id },
    data: {
      parentId: nextParentId,
      name: input.name ?? existing.name,
      content: existing.type === 'file' ? nextContent : null,
      mimeType: existing.type === 'file' ? nextMimeType : null,
      size: existing.type === 'file' ? getContentSize(nextContent) : 0,
    },
  })

  return toVfsEntry(updated)
}

export async function deleteVfsEntry(sessionId: string, id: string) {
  const db = await getDb()
  const existing = await requireEntryForSession(sessionId, id)

  if (existing.parentId === null) {
    throw new Error('Cannot delete the session root folder')
  }

  await db.vfsEntry.delete({
    where: { id: existing.id },
  })
}