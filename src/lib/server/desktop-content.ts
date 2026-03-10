import { db } from '@/lib/db'
import {
  cloneDesktopContent,
  DEFAULT_DESKTOP_CONTENT,
  type DesktopContentSnapshot,
} from '@/lib/desktop-content'

const BIOS_PROFILE_ID = 'main'

export async function getDesktopContent(): Promise<DesktopContentSnapshot> {
  const profile = await db.biosProfile.findUnique({ where: { id: BIOS_PROFILE_ID } })

  if (!profile) {
    return resetDesktopContent()
  }

  const [tracks, photos, videos, news, wallpapers, notes] = await Promise.all([
    db.track.findMany({ orderBy: { order: 'asc' } }),
    db.photo.findMany({ orderBy: { order: 'asc' } }),
    db.video.findMany({ orderBy: { order: 'asc' } }),
    db.newsArticle.findMany({ orderBy: { order: 'asc' } }),
    db.wallpaper.findMany({ orderBy: { order: 'asc' } }),
    db.noteDocument.findMany({ orderBy: { order: 'asc' } }),
  ])

  return {
    bandName: profile.bandName,
    bandBio: profile.bandBio,
    tracks: tracks.map(({ order, ...track }) => track),
    photos: photos.map(({ order, ...photo }) => photo),
    videos: videos.map(({ order, ...video }) => video),
    news: news.map(({ order, ...item }) => item),
    wallpapers: wallpapers.map(({ order, ...wallpaper }) => wallpaper),
    notes: notes.map(({ order, createdAt, updatedAt, ...note }) => ({
      ...note,
      updatedAt: updatedAt.toISOString(),
    })),
  }
}

export async function replaceDesktopContent(
  content: DesktopContentSnapshot,
): Promise<DesktopContentSnapshot> {
  await db.$transaction(async (tx) => {
    await tx.biosProfile.upsert({
      where: { id: BIOS_PROFILE_ID },
      update: {
        bandName: content.bandName,
        bandBio: content.bandBio,
      },
      create: {
        id: BIOS_PROFILE_ID,
        bandName: content.bandName,
        bandBio: content.bandBio,
      },
    })

    await Promise.all([
      tx.track.deleteMany(),
      tx.photo.deleteMany(),
      tx.video.deleteMany(),
      tx.newsArticle.deleteMany(),
      tx.wallpaper.deleteMany(),
      tx.noteDocument.deleteMany(),
    ])

    if (content.tracks.length > 0) {
      await tx.track.createMany({
        data: content.tracks.map((track, order) => ({ ...track, order })),
      })
    }

    if (content.photos.length > 0) {
      await tx.photo.createMany({
        data: content.photos.map((photo, order) => ({ ...photo, order })),
      })
    }

    if (content.videos.length > 0) {
      await tx.video.createMany({
        data: content.videos.map((video, order) => ({ ...video, order })),
      })
    }

    if (content.news.length > 0) {
      await tx.newsArticle.createMany({
        data: content.news.map((item, order) => ({ ...item, order })),
      })
    }

    if (content.wallpapers.length > 0) {
      await tx.wallpaper.createMany({
        data: content.wallpapers.map((wallpaper, order) => ({ ...wallpaper, order })),
      })
    }

    if (content.notes.length > 0) {
      await tx.noteDocument.createMany({
        data: content.notes.map((note, order) => ({
          id: note.id,
          title: note.title,
          content: note.content,
          order,
        })),
      })
    }
  })

  return getDesktopContent()
}

export async function resetDesktopContent(): Promise<DesktopContentSnapshot> {
  return replaceDesktopContent(cloneDesktopContent(DEFAULT_DESKTOP_CONTENT))
}