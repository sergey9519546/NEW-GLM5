import { NextResponse } from 'next/server'
import { desktopContentSchema } from '@/lib/desktop-content'
import {
  getDesktopContent,
  replaceDesktopContent,
  resetDesktopContent,
} from '@/lib/server/desktop-content'
import { withAdmin } from '@/lib/server/route-helpers'

export async function GET() {
  const content = await getDesktopContent()
  return NextResponse.json(content)
}

export async function PUT(request: Request) {
  return withAdmin(request, async () => {
    try {
      const payload = await request.json()
      const content = desktopContentSchema.parse(payload)
      const updatedContent = await replaceDesktopContent(content)
      return NextResponse.json(updatedContent)
    } catch (error) {
      return NextResponse.json(
        {
          error: error instanceof Error ? error.message : 'Invalid desktop content payload',
        },
        { status: 400 },
      )
    }
  })
}

export async function POST(request: Request) {
  return withAdmin(request, async () => {
    const content = await resetDesktopContent()
    return NextResponse.json(content)
  })
}