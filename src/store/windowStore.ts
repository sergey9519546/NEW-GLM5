import { create } from 'zustand'
import { fetchWindowStates, saveWindowStates } from '@services/windows'

export interface WindowState {
  id: string
  title: string
  icon: string
  component: string
  isMinimized: boolean
  isMaximized: boolean
  position: { x: number; y: number }
  size: { width: number; height: number }
  zIndex: number
  props?: Record<string, unknown>
  preMaxBounds?: { x: number; y: number; width: number; height: number } | null
}

interface WindowsState {
  windows: WindowState[]
  activeWindowId: string | null
  nextZIndex: number
  hasHydratedFromServer: boolean
  isHydrating: boolean
  isSyncing: boolean
  error: string | null
  
  // Actions
  openWindow: (window: Omit<WindowState, 'zIndex'>) => void
  closeWindow: (id: string) => void
  minimizeWindow: (id: string) => void
  maximizeWindow: (id: string) => void
  restoreWindow: (id: string) => void
  focusWindow: (id: string) => void
  updateWindowPosition: (id: string, position: { x: number; y: number }) => void
  updateWindowSize: (id: string, size: { width: number; height: number }) => void
  getWindowById: (id: string) => WindowState | undefined
  getVisibleWindows: () => WindowState[]
  getMinimizedWindows: () => WindowState[]
  hydrate: () => Promise<void>
  sync: () => Promise<void>
  clearError: () => void
}

function getNextWindowState(windows: WindowState[]) {
  const highestZIndex = windows.reduce((max, window) => Math.max(max, window.zIndex), 0)
  const activeWindow = [...windows]
    .filter((window) => !window.isMinimized)
    .sort((left, right) => right.zIndex - left.zIndex)[0]

  return {
    activeWindowId: activeWindow?.id ?? null,
    nextZIndex: highestZIndex + 1,
  }
}

export const useWindowStore = create<WindowsState>()((set, get) => ({
  windows: [],
  activeWindowId: null,
  nextZIndex: 1,
  hasHydratedFromServer: false,
  isHydrating: false,
  isSyncing: false,
  error: null,
      
  openWindow: (window) => {
    const { windows, nextZIndex } = get()
    const existingWindow = windows.find(w => w.id === window.id)
        
    if (existingWindow) {
      set({
        activeWindowId: window.id,
        windows: windows.map(w => 
          w.id === window.id 
            ? { ...w, zIndex: nextZIndex, isMinimized: false }
            : w
        ),
        nextZIndex: nextZIndex + 1,
      })
      return
    }
        
    set({
      windows: [...windows, { ...window, zIndex: nextZIndex }],
      activeWindowId: window.id,
      nextZIndex: nextZIndex + 1,
    })
  },
      
  closeWindow: (id) => {
    const { windows, activeWindowId } = get()
    const newWindows = windows.filter(w => w.id !== id)
    const newActiveId = activeWindowId === id 
      ? newWindows.length > 0 
        ? newWindows[newWindows.length - 1].id 
        : null
      : activeWindowId
        
    set({
      windows: newWindows,
      activeWindowId: newActiveId,
    })
  },
      
  minimizeWindow: (id) => {
    const { windows, activeWindowId } = get()
    const newWindows = windows.map(w =>
      w.id === id ? { ...w, isMinimized: true } : w
    )
        
    const visibleWindows = newWindows.filter(w => !w.isMinimized && w.id !== id)
    const newActiveId = activeWindowId === id
      ? visibleWindows.length > 0
        ? visibleWindows.sort((a, b) => b.zIndex - a.zIndex)[0].id
        : null
      : activeWindowId
        
    set({
      windows: newWindows,
      activeWindowId: newActiveId,
    })
  },
      
  maximizeWindow: (id) => {
    set(state => ({
      windows: state.windows.map(w =>
        w.id === id ? {
          ...w,
          isMaximized: true,
          preMaxBounds: { x: w.position.x, y: w.position.y, width: w.size.width, height: w.size.height },
        } : w
      ),
    }))
  },
      
  restoreWindow: (id) => {
    set(state => ({
      windows: state.windows.map(w => {
        if (w.id !== id) return w
        const bounds = w.preMaxBounds
        return {
          ...w,
          isMaximized: false,
          isMinimized: false,
          ...(bounds ? { position: { x: bounds.x, y: bounds.y }, size: { width: bounds.width, height: bounds.height } } : {}),
          preMaxBounds: null,
        }
      }),
      activeWindowId: id,
    }))
  },
      
  focusWindow: (id) => {
    const { windows, nextZIndex, activeWindowId } = get()
    const window = windows.find(w => w.id === id)
        
    if (!window) return
    if (activeWindowId === id && !window.isMinimized) return
        
    set({
      windows: windows.map(w =>
        w.id === id 
          ? { ...w, zIndex: nextZIndex, isMinimized: false }
          : w
      ),
      activeWindowId: id,
      nextZIndex: nextZIndex + 1,
    })
  },
      
  updateWindowPosition: (id, position) => {
    set(state => ({
      windows: state.windows.map(w =>
        w.id === id ? { ...w, position } : w
      ),
    }))
  },
      
  updateWindowSize: (id, size) => {
    set(state => ({
      windows: state.windows.map(w =>
        w.id === id ? { ...w, size } : w
      ),
    }))
  },
      
  getWindowById: (id) => {
    return get().windows.find(w => w.id === id)
  },
      
  getVisibleWindows: () => {
    return get().windows.filter(w => !w.isMinimized)
  },
      
  getMinimizedWindows: () => {
    return get().windows.filter(w => w.isMinimized)
  },

  hydrate: async () => {
    if (get().isHydrating || get().hasHydratedFromServer) return

    set({ isHydrating: true, error: null })

    try {
      const windows = await fetchWindowStates()
      const nextState = getNextWindowState(windows)

      set({
        windows,
        activeWindowId: nextState.activeWindowId,
        nextZIndex: nextState.nextZIndex,
        hasHydratedFromServer: true,
        isHydrating: false,
      })
    } catch (error) {
      set({
        hasHydratedFromServer: true,
        isHydrating: false,
        error: error instanceof Error ? error.message : 'Failed to load window state',
      })
    }
  },

  sync: async () => {
    if (get().isSyncing || get().isHydrating || !get().hasHydratedFromServer) return

    set({ isSyncing: true, error: null })

    try {
      const windows = await saveWindowStates(get().windows)
      const nextState = getNextWindowState(windows)

      set({
        windows,
        activeWindowId: nextState.activeWindowId,
        nextZIndex: nextState.nextZIndex,
        isSyncing: false,
      })
    } catch (error) {
      set({
        isSyncing: false,
        error: error instanceof Error ? error.message : 'Failed to save window state',
      })
    }
  },

  clearError: () => set({ error: null }),
}))
