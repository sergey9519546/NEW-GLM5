import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export type BootPhase = 'bios' | 'splash' | 'desktop'

interface SystemState {
  bootPhase: BootPhase
  isAdmin: boolean
  adminUnlocked: boolean
  _hasHydrated: boolean
  
  // Actions
  setBootPhase: (phase: BootPhase) => void
  setAdmin: (isAdmin: boolean) => void
  setAdminUnlocked: (unlocked: boolean) => void
  setHasHydrated: (hydrated: boolean) => void
  reset: () => void
}

const initialState = {
  bootPhase: 'bios' as BootPhase,
  isAdmin: false,
  adminUnlocked: false,
  _hasHydrated: false,
}

export const useSystemStore = create<SystemState>()(
  persist(
    (set) => ({
      ...initialState,
      
      setBootPhase: (phase) => set({ bootPhase: phase }),
      setAdmin: (isAdmin) => set({ isAdmin }),
      setAdminUnlocked: (adminUnlocked) => set({ adminUnlocked }),
      setHasHydrated: (hasHydrated) => set({ _hasHydrated: hasHydrated }),
      reset: () => set(initialState),
    }),
    {
      name: 'w98-system',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        isAdmin: state.isAdmin,
        adminUnlocked: state.adminUnlocked,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true)
      },
    }
  )
)
