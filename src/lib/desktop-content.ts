import { z } from 'zod'

export const trackSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  artist: z.string().min(1),
  album: z.string().min(1),
  duration: z.number().int().nonnegative(),
  url: z.string().min(1),
  coverUrl: z.string().optional(),
})

export const photoSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  url: z.string().min(1),
  thumbnailUrl: z.string().optional(),
  description: z.string().optional(),
})

export const videoSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  url: z.string().min(1),
  thumbnailUrl: z.string().optional(),
  duration: z.number().int().nonnegative(),
  description: z.string().optional(),
})

export const newsItemSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  content: z.string().min(1),
  date: z.string().min(1),
  author: z.string().optional(),
})

export const wallpaperSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  url: z.string().min(1),
  thumbnailUrl: z.string().optional(),
})

export const noteDocumentSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  content: z.string(),
  updatedAt: z.string().optional(),
})

export const desktopContentSchema = z.object({
  bandName: z.string().min(1),
  bandBio: z.string().min(1),
  tracks: z.array(trackSchema),
  photos: z.array(photoSchema),
  videos: z.array(videoSchema),
  news: z.array(newsItemSchema),
  wallpapers: z.array(wallpaperSchema),
  notes: z.array(noteDocumentSchema),
})

export type Track = z.infer<typeof trackSchema>
export type Photo = z.infer<typeof photoSchema>
export type Video = z.infer<typeof videoSchema>
export type NewsItem = z.infer<typeof newsItemSchema>
export type Wallpaper = z.infer<typeof wallpaperSchema>
export type NoteDocument = z.infer<typeof noteDocumentSchema>
export type DesktopContentSnapshot = z.infer<typeof desktopContentSchema>

export const DEFAULT_DESKTOP_CONTENT: DesktopContentSnapshot = {
  bandName: 'alti.tune',
  bandBio:
    'An electronic duo building a retro desktop universe for releases, visuals, and notes. Every window is part archive, part instrument, and part stage.',
  tracks: [
    {
      id: 'track-digital-dreams',
      title: 'Digital Dreams',
      artist: 'alti.tune',
      album: 'First Wave',
      duration: 356,
      url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
      coverUrl: 'https://picsum.photos/300/300?random=31',
    },
    {
      id: 'track-neon-nights',
      title: 'Neon Nights',
      artist: 'alti.tune',
      album: 'First Wave',
      duration: 301,
      url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
      coverUrl: 'https://picsum.photos/300/300?random=32',
    },
    {
      id: 'track-retrograde',
      title: 'Retrograde',
      artist: 'alti.tune',
      album: 'Signal Bloom',
      duration: 287,
      url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
      coverUrl: 'https://picsum.photos/300/300?random=33',
    },
  ],
  photos: [
    {
      id: 'photo-live-venue',
      title: 'Live at The Venue',
      url: 'https://picsum.photos/1200/900?random=1',
      thumbnailUrl: 'https://picsum.photos/320/240?random=1',
      description: 'A saturated still from the first sold-out headline set.',
    },
    {
      id: 'photo-studio-session',
      title: 'Studio Session',
      url: 'https://picsum.photos/1200/900?random=2',
      thumbnailUrl: 'https://picsum.photos/320/240?random=2',
      description: 'Late-night patching session surrounded by samplers and tape delay.',
    },
  ],
  videos: [
    {
      id: 'video-flower-loop',
      title: 'Digital Dreams (Visual Loop)',
      url: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
      thumbnailUrl: 'https://picsum.photos/320/180?random=14',
      duration: 30,
      description: 'A lightweight placeholder visual that now plays as a real video source.',
    },
  ],
  news: [
    {
      id: 'news-first-wave',
      title: 'First Wave Status Update',
      content:
        '## The build is live\n\nThe desktop is now the main venue for releases, sketches, and updates.\n\n- New music previews are available in the Music app\n- Visual loops now play inside Videos\n- Notes can be saved and reopened from Notepad',
      date: '2026-03-10',
      author: 'Admin BIOS',
    },
    {
      id: 'news-tour-notes',
      title: 'Studio Notes Archive Opened',
      content:
        'The **Admin BIOS** can now update the news feed, media catalog, and biography from inside the desktop.',
      date: '2026-03-08',
      author: 'Admin BIOS',
    },
  ],
  wallpapers: [
    {
      id: 'wallpaper-grid',
      title: 'Signal Grid',
      url: 'https://picsum.photos/1920/1080?random=10',
      thumbnailUrl: 'https://picsum.photos/320/180?random=10',
    },
  ],
  notes: [
    {
      id: 'note-welcome',
      title: 'welcome.txt',
      content:
        'Welcome to the alti.tune desktop.\n\nUse Admin BIOS from the desktop right-click menu to edit media, news, and profile content.\n\nNotepad now saves notes through the real backend.',
      updatedAt: new Date('2026-03-10T00:00:00.000Z').toISOString(),
    },
  ],
}

export function cloneDesktopContent(snapshot: DesktopContentSnapshot): DesktopContentSnapshot {
  return JSON.parse(JSON.stringify(snapshot)) as DesktopContentSnapshot
}