export { PdfFileList } from './pdf-file-list'
export { PdfViewer } from './pdf-viewer'
// export { DemoPdfDisplay } from './demo-pdf-display'
export { SelectDirectory } from './select-directory'
export { DocumentProcessingForm } from './document-processing-form'
export { InvoiceForm } from './invoice-form'
export { CreditMemoForm } from './credit-memo-form'
export { InterStoreTransferForm } from './inter-store-transfer-form'
export { NonInvoiceForm } from './non-invoice-form'
export { OtherForm } from './other-form'
export { EmailDrawer } from './drawers/email-drawer'
export * from './types'

// Shared PDF blob URL hook for coordinating between file list and viewer
import { useState, useEffect, useCallback } from 'react'
import { loadPdfForDisplay } from '@/lib/utils'

interface SharedPdfState {
  url: string | null
  fileName: string | null
  filePath: string | null
  isLoading: boolean
  error: string | null
  cleanup: (() => void) | null
}

export function useSharedPdfDisplay() {
  const [pdfState, setPdfState] = useState<SharedPdfState>({
    url: null,
    fileName: null,
    filePath: null,
    isLoading: false,
    error: null,
    cleanup: null
  })

  const loadPdf = useCallback(
    async (filePath: string) => {
      // Don't reload if it's the same file
      if (pdfState.filePath === filePath && pdfState.url && !pdfState.error) {
        console.log('PDF already loaded:', filePath)
        return pdfState
      }

      // Clean up previous PDF if exists
      if (pdfState.cleanup) {
        pdfState.cleanup()
      }

      setPdfState(prev => ({
        ...prev,
        isLoading: true,
        error: null,
        filePath
      }))

      try {
        const { url, fileName, cleanup } = await loadPdfForDisplay(filePath)

        const newState = {
          url,
          fileName,
          filePath,
          isLoading: false,
          error: null,
          cleanup
        }

        setPdfState(newState)
        console.log(`Shared PDF loaded: ${fileName}`)
        return newState
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Failed to load PDF'

        const errorState = {
          url: null,
          fileName: null,
          filePath,
          isLoading: false,
          error: errorMessage,
          cleanup: null
        }

        setPdfState(errorState)
        console.error('Shared PDF error:', error)
        throw error
      }
    },
    [pdfState.filePath, pdfState.url, pdfState.error, pdfState.cleanup]
  )

  const clearPdf = useCallback(() => {
    if (pdfState.cleanup) {
      pdfState.cleanup()
    }

    setPdfState({
      url: null,
      fileName: null,
      filePath: null,
      isLoading: false,
      error: null,
      cleanup: null
    })
  }, [pdfState.cleanup])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (pdfState.cleanup) {
        pdfState.cleanup()
      }
    }
  }, [pdfState.cleanup])

  return {
    pdfState,
    loadPdf,
    clearPdf,
    isLoading: pdfState.isLoading,
    error: pdfState.error,
    url: pdfState.url,
    fileName: pdfState.fileName
  }
}
