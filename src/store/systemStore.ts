import { create } from 'zustand'

export type BootPhase = 'bios' | 'splash' | 'desktop'

interface SystemState {
  bootPhase: BootPhase
  isAdmin: boolean
  adminUnlocked: boolean
  adminToken: string | null
  _hasHydrated: boolean
  
  // Actions
  setBootPhase: (phase: BootPhase) => void
  setAdmin: (isAdmin: boolean) => void
  setAdminUnlocked: (unlocked: boolean) => void
  setAdminSession: (token: string) => void
  clearAdminSession: () => void
  setHasHydrated: (hydrated: boolean) => void
  reset: () => void
}

const initialState = {
  bootPhase: 'bios' as BootPhase,
  isAdmin: false,
  adminUnlocked: false,
  adminToken: null,
  _hasHydrated: true,
}

export const useSystemStore = create<SystemState>()((set) => ({
  ...initialState,

  setBootPhase: (phase) => set({ bootPhase: phase }),
  setAdmin: (isAdmin) => set({ isAdmin }),
  setAdminUnlocked: (adminUnlocked) => set((state) => ({
    adminUnlocked,
    adminToken: adminUnlocked ? state.adminToken : null,
  })),
  setAdminSession: (adminToken) => set({ adminUnlocked: true, adminToken }),
  clearAdminSession: () => set({ adminUnlocked: false, adminToken: null }),
  setHasHydrated: (hasHydrated) => set({ _hasHydrated: hasHydrated }),
  reset: () => set(initialState),
}))
