import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    name: 'alti.tune desktop api',
    version: '2.0.0',
    endpoints: [
      '/api/desktop-content',
      '/api/auth/unlock',
      '/api/vfs',
      '/api/windows',
      '/api/music',
      '/api/videos',
      '/api/photos',
      '/api/news',
      '/api/shows',
      '/api/wallpapers',
      '/api/chat/messages',
      '/api/chat/rooms',
      '/api/zai',
      '/api/wayback',
      '/api/media/[...key]',
    ],
  })
}