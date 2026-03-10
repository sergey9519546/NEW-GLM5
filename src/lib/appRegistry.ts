import { W98_ICONS, GAME_ICONS } from './icons'

export type AppCategory = 'media' | 'productivity' | 'internet' | 'games' | 'system'

export interface AppDefinition {
  id: string
  title: string
  icon: string
  /** Component key — resolved to a React component by the Desktop */
  component: string
  category: AppCategory
  defaultSize: { width: number; height: number }
  /** If set, shows a desktop shortcut icon at this position */
  desktopPosition?: { x: number; y: number }
  showInStartMenu: boolean
  startMenuOrder?: number
}

export const APP_REGISTRY: readonly AppDefinition[] = [
  // ── Media ──────────────────────────────────────────────
  {
    id: 'music',
    title: 'Music',
    icon: W98_ICONS.mediaPlayer,
    component: 'music',
    category: 'media',
    defaultSize: { width: 600, height: 400 },
    desktopPosition: { x: 20, y: 20 },
    showInStartMenu: true,
    startMenuOrder: 1,
  },
  {
    id: 'photos',
    title: 'Photos',
    icon: W98_ICONS.folder,
    component: 'photos',
    category: 'media',
    defaultSize: { width: 600, height: 400 },
    desktopPosition: { x: 20, y: 100 },
    showInStartMenu: true,
    startMenuOrder: 2,
  },
  {
    id: 'videos',
    title: 'Videos',
    icon: W98_ICONS.mediaPlayer,
    component: 'videos',
    category: 'media',
    defaultSize: { width: 600, height: 400 },
    desktopPosition: { x: 20, y: 180 },
    showInStartMenu: true,
    startMenuOrder: 3,
  },
  {
    id: 'mediaplayer',
    title: 'Media Player',
    icon: W98_ICONS.mediaPlayer,
    component: 'mediaplayer',
    category: 'media',
    defaultSize: { width: 600, height: 400 },
    showInStartMenu: false,
  },

  // ── Productivity ───────────────────────────────────────
  {
    id: 'notepad',
    title: 'Notepad',
    icon: W98_ICONS.notepad,
    component: 'notepad',
    category: 'productivity',
    defaultSize: { width: 500, height: 400 },
    desktopPosition: { x: 20, y: 340 },
    showInStartMenu: true,
    startMenuOrder: 5,
  },
  {
    id: 'calculator',
    title: 'Calculator',
    icon: W98_ICONS.calculator,
    component: 'calculator',
    category: 'productivity',
    defaultSize: { width: 240, height: 320 },
    desktopPosition: { x: 120, y: 20 },
    showInStartMenu: true,
    startMenuOrder: 6,
  },
  {
    id: 'paint',
    title: 'Paint',
    icon: W98_ICONS.paint,
    component: 'paint',
    category: 'productivity',
    defaultSize: { width: 600, height: 450 },
    desktopPosition: { x: 120, y: 100 },
    showInStartMenu: true,
    startMenuOrder: 7,
  },

  // ── Internet ───────────────────────────────────────────
  {
    id: 'news',
    title: 'News',
    icon: W98_ICONS.document,
    component: 'news',
    category: 'internet',
    defaultSize: { width: 600, height: 400 },
    desktopPosition: { x: 20, y: 260 },
    showInStartMenu: true,
    startMenuOrder: 4,
  },
  {
    id: 'fanchat',
    title: 'Fan Chat',
    icon: W98_ICONS.mail,
    component: 'fanchat',
    category: 'internet',
    defaultSize: { width: 500, height: 400 },
    showInStartMenu: true,
    startMenuOrder: 11,
  },
  {
    id: 'aichat',
    title: 'ZAI Chat',
    icon: W98_ICONS.computer,
    component: 'aichat',
    category: 'internet',
    defaultSize: { width: 500, height: 450 },
    showInStartMenu: true,
    startMenuOrder: 12,
  },
  {
    id: 'wayback',
    title: 'Wayback Machine',
    icon: W98_ICONS.ie,
    component: 'wayback',
    category: 'internet',
    defaultSize: { width: 700, height: 500 },
    showInStartMenu: true,
    startMenuOrder: 13,
  },
  {
    id: 'browser',
    title: 'Internet Explorer',
    icon: W98_ICONS.ie,
    component: 'browser',
    category: 'internet',
    defaultSize: { width: 800, height: 600 },
    desktopPosition: { x: 220, y: 100 },
    showInStartMenu: true,
    startMenuOrder: 14,
  },

  // ── System ─────────────────────────────────────────────
  {
    id: 'explorer',
    title: 'My Computer',
    icon: W98_ICONS.computer,
    component: 'explorer',
    category: 'system',
    defaultSize: { width: 600, height: 400 },
    desktopPosition: { x: 120, y: 180 },
    showInStartMenu: true,
    startMenuOrder: 8,
  },
  {
    id: 'admin',
    title: 'Admin BIOS',
    icon: W98_ICONS.computer,
    component: 'admin',
    category: 'system',
    defaultSize: { width: 500, height: 400 },
    desktopPosition: { x: 220, y: 20 },
    showInStartMenu: false,
  },

  // ── Games ──────────────────────────────────────────────
  {
    id: 'minesweeper',
    title: 'Minesweeper',
    icon: GAME_ICONS.minesweeper,
    component: 'minesweeper',
    category: 'games',
    defaultSize: { width: 220, height: 300 },
    desktopPosition: { x: 120, y: 260 },
    showInStartMenu: true,
    startMenuOrder: 9,
  },
  {
    id: 'snake',
    title: 'Snake',
    icon: GAME_ICONS.snake,
    component: 'snake',
    category: 'games',
    defaultSize: { width: 340, height: 400 },
    desktopPosition: { x: 120, y: 340 },
    showInStartMenu: true,
    startMenuOrder: 10,
  },
] as const satisfies readonly AppDefinition[]

// ── Lookup helpers ─────────────────────────────────────────

const registry = new Map(APP_REGISTRY.map((a) => [a.id, a]))

export function getApp(id: string): AppDefinition | undefined {
  return registry.get(id)
}

export function getDesktopApps(): AppDefinition[] {
  return APP_REGISTRY.filter((a) => a.desktopPosition != null)
}

export function getStartMenuApps(): AppDefinition[] {
  return APP_REGISTRY.filter((a) => a.showInStartMenu).sort(
    (a, b) => (a.startMenuOrder ?? 99) - (b.startMenuOrder ?? 99),
  )
}
