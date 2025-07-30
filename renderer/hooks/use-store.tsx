import { PdfFile, TabType } from '@/components/bill-manager'
import { addDays } from 'date-fns'
import { create } from 'zustand'

export type StoreId =
  | '4179'
  | '4180'
  | '4181'
  | '4182'
  | '4183'
  | '4184'
  | '4185'
  | '4186'
  | '4187'
  | '4188'
  | '4189'

interface StoreState {
  storeId?: StoreId
  date?: Date
  errorMessage?: string
  setErrorMessage: (errorMessage: string | undefined) => void
  activeTab?: TabType
  setActiveTab: (activeTab: TabType) => void
  selectedPdf?: PdfFile | null
  setSelectedPdf: (selectedPdf: PdfFile | null) => void
  isActionLoading?: boolean
  setIsActionLoading: (isActionLoading: boolean) => void
  directoryExists?: {
    scans: boolean
    bills: boolean
    'non-invoice': boolean
  }
  setDirectoryExists: (
    directoryExists:
      | {
          scans: boolean
          bills: boolean
          'non-invoice': boolean
        }
      | ((prev: { scans: boolean; bills: boolean; 'non-invoice': boolean }) => {
          scans: boolean
          bills: boolean
          'non-invoice': boolean
        })
  ) => void
  directoryPaths: {
    scans: string
    bills: string
    'non-invoice': string
  }
  setDirectoryPaths: (directoryPaths: {
    scans: string
    bills: string
    'non-invoice': string
  }) => void
  pdfFiles: PdfFile[]
  setPdfFiles: (pdfFiles: PdfFile[]) => void
  deletingPdf?: string
  setDeletingPdf: (deletingPdf: string | undefined) => void
}

interface StoreActions {
  setStoreId: (storeId: string) => void
  setDate: (date: Date) => void
}

export const useStore = create<StoreState & StoreActions>(set => ({
  storeId: undefined,
  date: addDays(new Date(), 0),
  activeTab: 'scans',
  selectedPdf: null,
  isActionLoading: false,
  directoryExists: {
    scans: false,
    bills: false,
    'non-invoice': false
  },
  directoryPaths: {
    scans: '',
    bills: '',
    'non-invoice': ''
  },
  setStoreId: (storeId: StoreId) => set({ storeId }),
  setDate: (date: Date) => set({ date }),
  setActiveTab: (activeTab: TabType) => set({ activeTab }),
  setSelectedPdf: (selectedPdf: PdfFile | null) => set({ selectedPdf }),
  setIsActionLoading: (isActionLoading: boolean) => set({ isActionLoading }),
  setDirectoryExists: directoryExists =>
    set(state => ({
      directoryExists:
        typeof directoryExists === 'function'
          ? directoryExists(state.directoryExists!)
          : directoryExists
    })),
  setDirectoryPaths: (directoryPaths: {
    scans: string
    bills: string
    'non-invoice': string
  }) => set({ directoryPaths }),
  pdfFiles: [],
  setPdfFiles: (pdfFiles: PdfFile[]) => set({ pdfFiles }),
  deletingPdf: undefined,
  setDeletingPdf: (deletingPdf: string | undefined) => set({ deletingPdf }),
  errorMessage: undefined,
  setErrorMessage: (errorMessage: string) => set({ errorMessage })
}))
