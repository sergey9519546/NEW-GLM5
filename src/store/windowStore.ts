import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

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
}

interface WindowsState {
  windows: WindowState[]
  activeWindowId: string | null
  nextZIndex: number
  
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
}

export const useWindowStore = create<WindowsState>()(
  persist(
    (set, get) => ({
      windows: [],
      activeWindowId: null,
      nextZIndex: 1,
      
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
            w.id === id ? { ...w, isMaximized: true } : w
          ),
        }))
      },
      
      restoreWindow: (id) => {
        set(state => ({
          windows: state.windows.map(w =>
            w.id === id ? { ...w, isMaximized: false, isMinimized: false } : w
          ),
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
    }),
    {
      name: 'w98-windows',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        windows: state.windows,
        activeWindowId: state.activeWindowId,
        nextZIndex: state.nextZIndex,
      }),
    }
  )
)
