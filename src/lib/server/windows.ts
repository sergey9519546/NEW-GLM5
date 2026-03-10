import { getDb } from '@/lib/db'
import type { StoredWindowState } from '@/lib/personal-state'

function parseProps(value: string | null) {
  if (!value) {
    return undefined
  }

  try {
    return JSON.parse(value) as Record<string, unknown>
  } catch {
    return undefined
  }
}

function serializeProps(value?: Record<string, unknown>) {
  if (!value) {
    return null
  }

  return JSON.stringify(value)
}

function toStoredWindowState(entry: {
  windowId: string
  title: string
  icon: string
  component: string
  propsJson: string | null
  x: number
  y: number
  width: number
  height: number
  zIndex: number
  isMinimized: boolean
  isMaximized: boolean
  preMaxX: number | null
  preMaxY: number | null
  preMaxW: number | null
  preMaxH: number | null
}): StoredWindowState {
  return {
    id: entry.windowId,
    title: entry.title,
    icon: entry.icon,
    component: entry.component,
    props: parseProps(entry.propsJson),
    isMinimized: entry.isMinimized,
    isMaximized: entry.isMaximized,
    position: {
      x: entry.x,
      y: entry.y,
    },
    size: {
      width: entry.width,
      height: entry.height,
    },
    zIndex: entry.zIndex,
    preMaxBounds:
      entry.preMaxX !== null &&
      entry.preMaxY !== null &&
      entry.preMaxW !== null &&
      entry.preMaxH !== null
        ? {
            x: entry.preMaxX,
            y: entry.preMaxY,
            width: entry.preMaxW,
            height: entry.preMaxH,
          }
        : null,
  }
}

export async function getWindowStates(sessionId: string) {
  const db = await getDb()
  const windows = await db.windowState.findMany({
    where: { sessionId },
    orderBy: { zIndex: 'asc' },
  })

  return windows.map(toStoredWindowState)
}

export async function replaceWindowStates(sessionId: string, windows: StoredWindowState[]) {
  const db = await getDb()

  await db.$transaction(async (tx) => {
    await tx.windowState.deleteMany({
      where: { sessionId },
    })

    if (windows.length === 0) {
      return
    }

    await tx.windowState.createMany({
      data: windows.map((window) => ({
        id: `${sessionId}:${window.id}`,
        sessionId,
        windowId: window.id,
        title: window.title,
        icon: window.icon,
        component: window.component,
        propsJson: serializeProps(window.props),
        x: window.position.x,
        y: window.position.y,
        width: window.size.width,
        height: window.size.height,
        zIndex: window.zIndex,
        isMinimized: window.isMinimized,
        isMaximized: window.isMaximized,
        preMaxX: window.preMaxBounds?.x ?? null,
        preMaxY: window.preMaxBounds?.y ?? null,
        preMaxW: window.preMaxBounds?.width ?? null,
        preMaxH: window.preMaxBounds?.height ?? null,
      })),
    })
  })

  return getWindowStates(sessionId)
}