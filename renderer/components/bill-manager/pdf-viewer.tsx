import React, { useEffect, useState } from 'react'
import { FileText, Loader2, AlertCircle } from 'lucide-react'
import { Card } from '../ui/card'
import { useStore } from '@/hooks/use-store'
import { loadPdfForDisplay } from '@/lib/utils'

interface PdfDisplayState {
  url: string | null
  fileName: string | null
  isLoading: boolean
  error: string | null
  cleanup: (() => void) | null
}

export function PdfViewer() {
  const { selectedPdf, isActionLoading } = useStore()
  const [pdfDisplay, setPdfDisplay] = useState<PdfDisplayState>({
    url: null,
    fileName: null,
    isLoading: false,
    error: null,
    cleanup: null
  })

  // Load PDF when selectedPdf changes
  useEffect(() => {
    const loadPdf = async () => {
      // Clean up previous PDF if exists
      if (pdfDisplay.cleanup) {
        pdfDisplay.cleanup()
      }

      if (!selectedPdf) {
        setPdfDisplay({
          url: null,
          fileName: null,
          isLoading: false,
          error: null,
          cleanup: null
        })
        return
      }

      // Don't load PDF if an action is in progress (file being renamed/moved)
      // Keep the current PDF displayed during actions
      if (isActionLoading) {
        console.log(
          'PDF loading skipped - action in progress, keeping current PDF visible'
        )
        setPdfDisplay(prev => ({
          ...prev,
          isLoading: false,
          error: null
          // Keep existing url and fileName to maintain PDF visibility
        }))
        return
      }

      setPdfDisplay(prev => ({
        ...prev,
        isLoading: true,
        error: null
      }))

      try {
        const { url, fileName, cleanup } = await loadPdfForDisplay(
          selectedPdf.originalPath
        )

        setPdfDisplay({
          url,
          fileName,
          isLoading: false,
          error: null,
          cleanup
        })

        console.log(`PDF viewer loaded: ${fileName}`)
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Failed to load PDF'

        // Don't show error if action is in progress (expected during file operations)
        if (!isActionLoading) {
          setPdfDisplay(prev => ({
            ...prev,
            isLoading: false,
            error: errorMessage
          }))
          console.error('PDF viewer error:', error)
        } else {
          console.log('PDF load error during action (expected):', errorMessage)
          setPdfDisplay(prev => ({
            ...prev,
            isLoading: false,
            error: null
          }))
        }
      }
    }

    loadPdf()
  }, [selectedPdf, isActionLoading])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (pdfDisplay.cleanup) {
        pdfDisplay.cleanup()
      }
    }
  }, [pdfDisplay.cleanup])

  if (!selectedPdf) {
    return (
      <Card className="h-full overflow-hidden">
        <div className="flex h-[calc(100vh-12rem)] flex-col items-center justify-center p-6">
          <FileText className="text-muted-foreground/40 size-16" />
          <h3 className="mt-4 text-lg font-medium">No Document Selected</h3>
          <p className="text-muted-foreground mt-2 text-center text-sm">
            Select a document from the sidebar to preview it
          </p>
        </div>
      </Card>
    )
  }

  return (
    <Card className="flex h-[calc(100vh-64px-24px)] flex-col">
      <div className="flex h-[70px] items-center justify-between border-b p-3">
        <div className="overflow-hidden">
          <h2 className="truncate text-lg font-semibold">
            {pdfDisplay.fileName || selectedPdf.originalPath.split('\\').pop()}
          </h2>
          <p className="text-muted-foreground truncate text-xs">
            {selectedPdf.originalPath}
          </p>
        </div>

        {/* Loading/Processing indicator in header */}
        {isActionLoading ? (
          <div className="text-muted-foreground flex items-center gap-2 text-sm">
            <Loader2 className="size-4 animate-spin" />
            Processing...
          </div>
        ) : (
          pdfDisplay.isLoading && (
            <div className="text-muted-foreground flex items-center gap-2 text-sm">
              <Loader2 className="size-4 animate-spin" />
              Loading PDF...
            </div>
          )
        )}
      </div>

      <div className="h-[calc(100vh-64px-24px-70px)]">
        {pdfDisplay.isLoading ? (
          // Loading state
          <div className="flex h-[calc(100vh-12rem)] flex-col items-center justify-center p-6">
            <Loader2 className="text-primary size-8 animate-spin" />
            <p className="text-muted-foreground mt-4 text-sm">Loading PDF...</p>
          </div>
        ) : pdfDisplay.error && !isActionLoading ? (
          // Error state
          <div className="flex h-[calc(100vh-12rem)] flex-col items-center justify-center p-6">
            <AlertCircle className="size-16 text-red-500/40" />
            <h3 className="mt-4 text-lg font-medium text-red-600">
              Failed to Load PDF
            </h3>
            <p className="text-muted-foreground mt-2 text-center text-sm">
              {pdfDisplay.error}
            </p>
            <p className="text-muted-foreground mt-1 text-center text-xs">
              Please try selecting the document again
            </p>
          </div>
        ) : pdfDisplay.url ? (
          // PDF display with blob URL
          <div className="h-full p-3">
            <div className="h-full w-full">
              <object
                data={pdfDisplay.url}
                type="application/pdf"
                className="size-full rounded-lg border"
                aria-label={`PDF viewer for ${pdfDisplay.fileName}`}>
                <embed
                  src={pdfDisplay.url}
                  type="application/pdf"
                  className="size-full rounded-lg"
                />
                <div className="flex h-full flex-col items-center justify-center p-6">
                  <FileText className="text-muted-foreground/40 size-16" />
                  <p className="text-muted-foreground mt-4 text-sm">
                    Your browser doesn&apos;t support PDF viewing.
                  </p>
                  <a
                    href={pdfDisplay.url}
                    download={pdfDisplay.fileName}
                    className="text-primary mt-2 text-sm underline hover:no-underline">
                    Download PDF instead
                  </a>
                </div>
              </object>
            </div>
          </div>
        ) : (
          // Fallback state
          <div className="flex h-[calc(100vh-12rem)] flex-col items-center justify-center p-6">
            <FileText className="text-muted-foreground/40 size-16" />
            <h3 className="mt-4 text-lg font-medium">No PDF Content</h3>
            <p className="text-muted-foreground mt-2 text-center text-sm">
              Unable to load PDF content
            </p>
          </div>
        )}
      </div>
    </Card>
  )
}
