import { create } from 'zustand'
import {
  DEFAULT_DESKTOP_CONTENT,
  cloneDesktopContent,
  type DesktopContentSnapshot,
  type NewsItem,
  type NoteDocument,
  type Photo,
  type Track,
  type Video,
  type Wallpaper,
} from '@/lib/desktop-content'
import {
  fetchDesktopContent,
  resetDesktopContent as resetDesktopContentRequest,
  saveDesktopContent,
} from '@services/desktop-content'
import { useSystemStore } from './systemStore'

interface AdminBiosState {
  bandName: string
  bandBio: string
  tracks: Track[]
  photos: Photo[]
  videos: Video[]
  news: NewsItem[]
  wallpapers: Wallpaper[]
  notes: NoteDocument[]
  hasLoaded: boolean
  isHydrating: boolean
  isSaving: boolean
  error: string | null
  setBandName: (name: string) => void
  setBandBio: (bio: string) => void
  addTrack: (track: Track) => void
  updateTrack: (id: string, track: Partial<Track>) => void
  removeTrack: (id: string) => void
  addPhoto: (photo: Photo) => void
  updatePhoto: (id: string, photo: Partial<Photo>) => void
  removePhoto: (id: string) => void
  addVideo: (video: Video) => void
  updateVideo: (id: string, video: Partial<Video>) => void
  removeVideo: (id: string) => void
  addNews: (item: NewsItem) => void
  updateNews: (id: string, item: Partial<NewsItem>) => void
  removeNews: (id: string) => void
  addWallpaper: (wallpaper: Wallpaper) => void
  updateWallpaper: (id: string, wallpaper: Partial<Wallpaper>) => void
  removeWallpaper: (id: string) => void
  saveNote: (note: Pick<NoteDocument, 'title' | 'content'> & { id?: string }) => Promise<NoteDocument | null>
  deleteNote: (id: string) => Promise<void>
  hydrate: () => Promise<void>
  saveContent: () => Promise<boolean>
  resetToDefaults: () => Promise<void>
  clearError: () => void
}

const initialState = {
  ...cloneDesktopContent(DEFAULT_DESKTOP_CONTENT),
  hasLoaded: false,
  isHydrating: false,
  isSaving: false,
  error: null,
} satisfies Partial<AdminBiosState>

function snapshotFromState(state: AdminBiosState): DesktopContentSnapshot {
  return {
    bandName: state.bandName,
    bandBio: state.bandBio,
    tracks: state.tracks,
    photos: state.photos,
    videos: state.videos,
    news: state.news,
    wallpapers: state.wallpapers,
    notes: state.notes,
  }
}

export const useAdminBiosStore = create<AdminBiosState>()(
  (set, get) => ({
      ...initialState,
      setBandName: (bandName) => set({ bandName }),
      setBandBio: (bandBio) => set({ bandBio }),
      addTrack: (track) => set(state => ({
        tracks: [...state.tracks, track],
      })),
      updateTrack: (id, track) => set(state => ({
        tracks: state.tracks.map(t => t.id === id ? { ...t, ...track } : t),
      })),
      removeTrack: (id) => set(state => ({
        tracks: state.tracks.filter(t => t.id !== id),
      })),
      addPhoto: (photo) => set(state => ({
        photos: [...state.photos, photo],
      })),
      updatePhoto: (id, photo) => set(state => ({
        photos: state.photos.map(p => p.id === id ? { ...p, ...photo } : p),
      })),
      removePhoto: (id) => set(state => ({
        photos: state.photos.filter(p => p.id !== id),
      })),
      addVideo: (video) => set(state => ({
        videos: [...state.videos, video],
      })),
      updateVideo: (id, video) => set(state => ({
        videos: state.videos.map(v => v.id === id ? { ...v, ...video } : v),
      })),
      removeVideo: (id) => set(state => ({
        videos: state.videos.filter(v => v.id !== id),
      })),
      addNews: (item) => set(state => ({
        news: [...state.news, item],
      })),
      updateNews: (id, item) => set(state => ({
        news: state.news.map(n => n.id === id ? { ...n, ...item } : n),
      })),
      removeNews: (id) => set(state => ({
        news: state.news.filter(n => n.id !== id),
      })),
      addWallpaper: (wallpaper) => set(state => ({
        wallpapers: [...state.wallpapers, wallpaper],
      })),
      updateWallpaper: (id, wallpaper) => set(state => ({
        wallpapers: state.wallpapers.map(w => w.id === id ? { ...w, ...wallpaper } : w),
      })),
      removeWallpaper: (id) => set(state => ({
        wallpapers: state.wallpapers.filter(w => w.id !== id),
      })),

      saveNote: async (note) => {
        const newNote: NoteDocument = {
          id: note.id || globalThis.crypto.randomUUID(),
          title: note.title,
          content: note.content,
          updatedAt: new Date().toISOString(),
        }

        set(state => ({
          notes: state.notes.some(existingNote => existingNote.id === newNote.id)
            ? state.notes.map(existingNote => existingNote.id === newNote.id ? newNote : existingNote)
            : [...state.notes, newNote],
        }))

        const saved = await get().saveContent()
        return saved ? newNote : null
      },

      deleteNote: async (id) => {
        set(state => ({
          notes: state.notes.filter(note => note.id !== id),
        }))

        await get().saveContent()
      },

      hydrate: async () => {
        if (get().isHydrating) return

        set({ isHydrating: true, error: null })

        try {
          const content = await fetchDesktopContent()
          set({ ...content, hasLoaded: true, isHydrating: false, error: null })
        } catch (error) {
          set({
            hasLoaded: true,
            isHydrating: false,
            error: error instanceof Error ? error.message : 'Failed to load desktop content',
          })
        }
      },

      saveContent: async () => {
        const snapshot = cloneDesktopContent(snapshotFromState(get()))
        const adminToken = useSystemStore.getState().adminToken
        set({ isSaving: true, error: null })

        try {
          const content = await saveDesktopContent(snapshot, adminToken ?? undefined)
          set({ ...content, hasLoaded: true, isSaving: false, error: null })
          return true
        } catch (error) {
          set({
            isSaving: false,
            error: error instanceof Error ? error.message : 'Failed to save desktop content',
          })
          return false
        }
      },

      resetToDefaults: async () => {
        const adminToken = useSystemStore.getState().adminToken
        set({ isSaving: true, error: null })

        try {
          const content = await resetDesktopContentRequest(adminToken ?? undefined)
          set({ ...content, hasLoaded: true, isSaving: false, error: null })
        } catch (error) {
          set({
            isSaving: false,
            error: error instanceof Error ? error.message : 'Failed to reset desktop content',
          })
        }
      },

      clearError: () => set({ error: null }),
    })
)

export type {
  NewsItem,
  NoteDocument,
  Photo,
  Track,
  Video,
  Wallpaper,
}
