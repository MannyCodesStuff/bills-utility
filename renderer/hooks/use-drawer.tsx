import { create } from 'zustand'

export type ModalType = 'email'

interface DrawerStore {
  type: ModalType | null
  isOpen: boolean
  onOpen: (type: ModalType) => void
  onClose: () => void
}

export const useDrawer = create<DrawerStore>(set => ({
  type: null,
  isOpen: false,
  onOpen: (type: ModalType) => set({ type, isOpen: true }),
  onClose: () => set({ type: null, isOpen: false })
}))
