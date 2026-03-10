import { create } from 'zustand'
import type { VfsEntry } from '@/lib/personal-state'
import {
  fetchVfsEntries,
  fetchVfsEntry,
  createVfsEntry,
  updateVfsEntry,
  deleteVfsEntry,
} from '@services/vfs'

interface FileSystemState {
  /** Current parent folder ID (null = root) */
  currentFolderId: string | null
  /** Current parent folder entry */
  currentFolder: VfsEntry | null
  /** Direct children of current folder */
  entries: VfsEntry[]
  /** Breadcrumb path from root to current folder */
  breadcrumb: VfsEntry[]
  /** Currently selected entry IDs */
  selectedIds: Set<string>
  /** View mode: icons or list */
  viewMode: 'icons' | 'list'

  isLoading: boolean
  error: string | null

  // Navigation
  navigateTo: (folderId: string | null) => Promise<void>
  navigateUp: () => Promise<void>
  refresh: () => Promise<void>

  // Selection
  select: (id: string, additive?: boolean) => void
  clearSelection: () => void

  // File/folder operations
  createFolder: (name: string) => Promise<VfsEntry>
  createFile: (name: string, content?: string, mimeType?: string) => Promise<VfsEntry>
  rename: (id: string, name: string) => Promise<void>
  remove: (id: string) => Promise<void>
  readFile: (id: string) => Promise<VfsEntry>
  writeFile: (id: string, content: string) => Promise<void>

  setViewMode: (mode: 'icons' | 'list') => void
}

export const useFileSystemStore = create<FileSystemState>()((set, get) => ({
  currentFolderId: null,
  currentFolder: null,
  entries: [],
  breadcrumb: [],
  selectedIds: new Set<string>(),
  viewMode: 'icons',
  isLoading: false,
  error: null,

  navigateTo: async (folderId) => {
    set({ isLoading: true, error: null, selectedIds: new Set() })
    try {
      const { parent, entries } = await fetchVfsEntries(folderId)

      // Build breadcrumb by walking up from current folder
      const breadcrumb: VfsEntry[] = []
      if (parent.parentId !== null) {
        // We're not at root — fetch ancestors
        let ancestorId: string | null = parent.parentId
        const visited = new Set<string>()
        while (ancestorId && !visited.has(ancestorId)) {
          visited.add(ancestorId)
          try {
            const ancestor = await fetchVfsEntry(ancestorId)
            breadcrumb.unshift(ancestor)
            ancestorId = ancestor.parentId
          } catch {
            break
          }
        }
      }
      breadcrumb.push(parent)

      set({
        currentFolderId: folderId,
        currentFolder: parent,
        entries,
        breadcrumb,
        isLoading: false,
      })
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to load directory',
      })
    }
  },

  navigateUp: async () => {
    const { currentFolder } = get()
    if (!currentFolder?.parentId) return
    // Navigate to grandparent (parent of current parent)
    const parent = await fetchVfsEntry(currentFolder.parentId)
    await get().navigateTo(parent.parentId)
  },

  refresh: async () => {
    const { currentFolderId, navigateTo } = get()
    await navigateTo(currentFolderId)
  },

  select: (id, additive = false) => {
    set((state) => {
      const next = new Set(additive ? state.selectedIds : [])
      if (next.has(id) && additive) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return { selectedIds: next }
    })
  },

  clearSelection: () => set({ selectedIds: new Set() }),

  createFolder: async (name) => {
    const { currentFolder, refresh } = get()
    const entry = await createVfsEntry({
      parentId: currentFolder?.id ?? null,
      name,
      type: 'folder',
    })
    await refresh()
    return entry
  },

  createFile: async (name, content, mimeType) => {
    const { currentFolder, refresh } = get()
    const entry = await createVfsEntry({
      parentId: currentFolder?.id ?? null,
      name,
      type: 'file',
      content,
      mimeType,
    })
    await refresh()
    return entry
  },

  rename: async (id, name) => {
    await updateVfsEntry(id, { name })
    await get().refresh()
  },

  remove: async (id) => {
    await deleteVfsEntry(id)
    set((state) => {
      const next = new Set(state.selectedIds)
      next.delete(id)
      return { selectedIds: next }
    })
    await get().refresh()
  },

  readFile: async (id) => {
    return await fetchVfsEntry(id)
  },

  writeFile: async (id, content) => {
    await updateVfsEntry(id, { content })
  },

  setViewMode: (mode) => set({ viewMode: mode }),
}))
