import { create } from 'zustand'

interface InputState {
  // Selection
  selectedIconId: string | null
  selectedWindowId: string | null
  
  // Marquee selection
  isMarqueeActive: boolean
  marqueeStart: { x: number; y: number } | null
  marqueeEnd: { x: number; y: number } | null
  selectedIcons: string[]
  
  // Keyboard state
  pressedKeys: Set<string>
  
  // Context menu
  contextMenuPosition: { x: number; y: number } | null
  contextMenuTarget: string | null
  
  // Dragging
  isDragging: boolean
  dragOffset: { x: number; y: number }
  
  // Actions
  selectIcon: (id: string | null, additive?: boolean) => void
  addToSelection: (id: string) => void
  removeFromSelection: (id: string) => void
  clearSelection: () => void
  
  startMarquee: (position: { x: number; y: number }) => void
  updateMarquee: (position: { x: number; y: number }) => void
  endMarquee: () => void
  
  setContextMenu: (position: { x: number; y: number } | null, target?: string | null) => void
  
  keyDown: (key: string) => void
  keyUp: (key: string) => void
  
  startDragging: (offset: { x: number; y: number }) => void
  stopDragging: () => void
}

export const useInputStore = create<InputState>((set) => ({
  selectedIconId: null,
  selectedWindowId: null,
  isMarqueeActive: false,
  marqueeStart: null,
  marqueeEnd: null,
  selectedIcons: [],
  pressedKeys: new Set(),
  contextMenuPosition: null,
  contextMenuTarget: null,
  isDragging: false,
  dragOffset: { x: 0, y: 0 },
  
  selectIcon: (id, additive = false) => {
    if (id === null) {
      set({ selectedIconId: null, selectedIcons: [] })
    } else if (additive) {
      set(state => {
        const newSelected = state.selectedIcons.includes(id)
          ? state.selectedIcons.filter(i => i !== id)
          : [...state.selectedIcons, id]
        return {
          selectedIconId: id,
          selectedIcons: newSelected,
        }
      })
    } else {
      set({ selectedIconId: id, selectedIcons: [id] })
    }
  },
  
  addToSelection: (id) => {
    set(state => ({
      selectedIcons: state.selectedIcons.includes(id)
        ? state.selectedIcons
        : [...state.selectedIcons, id],
    }))
  },
  
  removeFromSelection: (id) => {
    set(state => ({
      selectedIcons: state.selectedIcons.filter(i => i !== id),
      selectedIconId: state.selectedIconId === id ? null : state.selectedIconId,
    }))
  },
  
  clearSelection: () => {
    set({ selectedIconId: null, selectedIcons: [] })
  },
  
  startMarquee: (position) => {
    set({
      isMarqueeActive: true,
      marqueeStart: position,
      marqueeEnd: position,
    })
  },
  
  updateMarquee: (position) => {
    set({ marqueeEnd: position })
  },
  
  endMarquee: () => {
    set({
      isMarqueeActive: false,
      marqueeStart: null,
      marqueeEnd: null,
    })
  },
  
  setContextMenu: (position, target = null) => {
    set({
      contextMenuPosition: position,
      contextMenuTarget: target,
    })
  },
  
  keyDown: (key) => {
    set(state => {
      const newKeys = new Set(state.pressedKeys)
      newKeys.add(key.toLowerCase())
      return { pressedKeys: newKeys }
    })
  },
  
  keyUp: (key) => {
    set(state => {
      const newKeys = new Set(state.pressedKeys)
      newKeys.delete(key.toLowerCase())
      return { pressedKeys: newKeys }
    })
  },
  
  startDragging: (offset) => {
    set({ isDragging: true, dragOffset: offset })
  },
  
  stopDragging: () => {
    set({ isDragging: false, dragOffset: { x: 0, y: 0 } })
  },
}))
