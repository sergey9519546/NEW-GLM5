import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export interface Track {
  id: string
  title: string
  artist: string
  album: string
  duration: number
  url: string
  coverUrl?: string
}

export interface Photo {
  id: string
  title: string
  url: string
  thumbnailUrl?: string
  description?: string
}

export interface Video {
  id: string
  title: string
  url: string
  thumbnailUrl?: string
  duration: number
  description?: string
}

export interface NewsItem {
  id: string
  title: string
  content: string
  date: string
  author?: string
}

export interface Wallpaper {
  id: string
  title: string
  url: string
  thumbnailUrl?: string
}

interface AdminBiosState {
  // Band info
  bandName: string
  bandBio: string
  
  // Content
  tracks: Track[]
  photos: Photo[]
  videos: Video[]
  news: NewsItem[]
  wallpapers: Wallpaper[]
  
  // Actions
  setBandName: (name: string) => void
  setBandBio: (bio: string) => void
  
  // Tracks
  addTrack: (track: Track) => void
  updateTrack: (id: string, track: Partial<Track>) => void
  removeTrack: (id: string) => void
  
  // Photos
  addPhoto: (photo: Photo) => void
  updatePhoto: (id: string, photo: Partial<Photo>) => void
  removePhoto: (id: string) => void
  
  // Videos
  addVideo: (video: Video) => void
  updateVideo: (id: string, video: Partial<Video>) => void
  removeVideo: (id: string) => void
  
  // News
  addNews: (item: NewsItem) => void
  updateNews: (id: string, item: Partial<NewsItem>) => void
  removeNews: (id: string) => void
  
  // Wallpapers
  addWallpaper: (wallpaper: Wallpaper) => void
  updateWallpaper: (id: string, wallpaper: Partial<Wallpaper>) => void
  removeWallpaper: (id: string) => void
  
  // Reset
  resetToDefaults: () => void
}

const defaultTracks: Track[] = [
  {
    id: '1',
    title: 'Digital Dreams',
    artist: 'alti.tune',
    album: 'First Wave',
    duration: 234,
    url: 'https://example.com/track1.mp3',
  },
  {
    id: '2',
    title: 'Neon Nights',
    artist: 'alti.tune',
    album: 'First Wave',
    duration: 198,
    url: 'https://example.com/track2.mp3',
  },
  {
    id: '3',
    title: 'Retrograde',
    artist: 'alti.tune',
    album: 'First Wave',
    duration: 267,
    url: 'https://example.com/track3.mp3',
  },
]

const defaultPhotos: Photo[] = [
  {
    id: '1',
    title: 'Live at The Venue',
    url: 'https://picsum.photos/800/600?random=1',
    description: 'Concert photo from 2024 tour',
  },
  {
    id: '2',
    title: 'Studio Session',
    url: 'https://picsum.photos/800/600?random=2',
    description: 'Recording our latest album',
  },
]

const defaultVideos: Video[] = [
  {
    id: '1',
    title: 'Digital Dreams (Official Video)',
    url: 'https://example.com/video1.mp4',
    duration: 240,
    description: 'Official music video',
  },
]

const defaultNews: NewsItem[] = [
  {
    id: '1',
    title: 'New Album Coming Soon',
    content: 'We are excited to announce our upcoming album "First Wave" will be released next month. Stay tuned for more details!',
    date: '2024-01-15',
    author: 'alti.tune',
  },
  {
    id: '2',
    title: 'Tour Dates Announced',
    content: 'We\'re hitting the road! Check out our upcoming tour dates and get your tickets early.',
    date: '2024-01-10',
    author: 'alti.tune',
  },
]

const defaultWallpapers: Wallpaper[] = [
  {
    id: '1',
    title: 'Band Logo',
    url: 'https://picsum.photos/1920/1080?random=10',
  },
]

const initialState = {
  bandName: 'alti.tune',
  bandBio: 'An electronic music duo blending retro synth sounds with modern production techniques. Formed in 2023, alti.tune creates atmospheric soundscapes that transport listeners to another dimension.',
  tracks: defaultTracks,
  photos: defaultPhotos,
  videos: defaultVideos,
  news: defaultNews,
  wallpapers: defaultWallpapers,
}

export const useAdminBiosStore = create<AdminBiosState>()(
  persist(
    (set) => ({
      ...initialState,
      
      setBandName: (name) => set({ bandName: name }),
      setBandBio: (bio) => set({ bandBio: bio }),
      
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
      
      resetToDefaults: () => set(initialState),
    }),
    {
      name: 'w98-admin-bios',
      storage: createJSONStorage(() => localStorage),
    }
  )
)
