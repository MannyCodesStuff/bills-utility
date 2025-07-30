import { create } from 'zustand'

export type ModalType = 'delete-pdf'

interface ModalData {
  filePath: string
}

interface ActionInterface {
  onSubmit: () => Promise<void>
}

// TODO: add onSubmit function
interface ModalStore {
  type: ModalType | null
  data: ModalData | null
  isOpen: boolean
  action?: ActionInterface
  onOpen: (type: ModalType, data?: ModalData, action?: ActionInterface) => void
  onClose: () => void
}

export const useModal = create<ModalStore>(set => ({
  type: null,
  isOpen: false,
  data: null,
  onOpen: (type: ModalType, data?: ModalData, action?: ActionInterface) =>
    set({ type, isOpen: true, data, action }),
  onClose: () => set({ type: null, isOpen: false }),
  action: undefined
}))
