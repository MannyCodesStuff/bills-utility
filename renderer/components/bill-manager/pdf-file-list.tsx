import React from 'react'
import {
  Search,
  FileText,
  RefreshCw,
  // Trash2,
  // Ellipsis,
  Loader2
} from 'lucide-react'
import { Card } from '../ui/card'
import { Input } from '../ui/input'
import { Button, buttonVariants } from '../ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import type { PdfFile, TabType } from './types'
import { loadPdfForDisplay } from '@/lib/utils'
import { useState, useEffect } from 'react'
import { SelectDirectory } from './select-directory'
import { useStore } from '@/hooks/use-store'

interface PdfFileListProps {
  loading: boolean
  filterQuery: string
  setFilterQuery: (query: string) => void
  onRefresh: (type: TabType) => void
  onDelete: (filePath: string) => Promise<void>
  onPdfLoaded?: (pdfState: {
    isLoading: boolean
    url: string | null
    fileName: string | null
    error: string | null
    hasActivePdf: boolean
  }) => void
}
interface PdfDisplayState {
  url: string | null
  fileName: string | null
  isLoading: boolean
  error: string | null
  cleanup: (() => void) | null
}

// Hook for managing PDF blob URLs
function usePdfDisplay() {
  const [pdfDisplay, setPdfDisplay] = useState<PdfDisplayState>({
    url: null,
    fileName: null,
    isLoading: false,
    error: null,
    cleanup: null
  })

  const loadPdf = async (filePath: string) => {
    // Clean up previous PDF if exists
    if (pdfDisplay.cleanup) {
      pdfDisplay.cleanup()
    }

    setPdfDisplay(prev => ({
      ...prev,
      isLoading: true,
      error: null,
      url: null
    }))

    try {
      const { url, fileName, cleanup } = await loadPdfForDisplay(filePath)

      setPdfDisplay({
        url,
        fileName,
        isLoading: false,
        error: null,
        cleanup
      })

      console.log(`PDF loaded successfully: ${fileName}`)
      return { url, fileName }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to load PDF'

      setPdfDisplay(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage
      }))

      console.error('Failed to load PDF:', error)
      throw error
    }
  }

  const clearPdf = () => {
    if (pdfDisplay.cleanup) {
      pdfDisplay.cleanup()
    }

    setPdfDisplay({
      url: null,
      fileName: null,
      isLoading: false,
      error: null,
      cleanup: null
    })
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (pdfDisplay.cleanup) {
        pdfDisplay.cleanup()
      }
    }
  }, [pdfDisplay.cleanup])

  return {
    pdfDisplay,
    loadPdf,
    clearPdf
  }
}

export function PdfFileList({
  // pdfFiles,
  loading,
  filterQuery,
  setFilterQuery,
  onRefresh,
  onPdfLoaded
  // pdfFiles2
  // onDelete
}: PdfFileListProps) {
  const {
    activeTab,
    setActiveTab,
    directoryExists,
    directoryPaths,
    selectedPdf,
    setSelectedPdf,
    pdfFiles,
    setPdfFiles,
    deletingPdf
  } = useStore()
  // console.log('pdf-file-list.tsx: ', { pdfFiles2 })

  // PDF display management
  const { pdfDisplay, loadPdf, clearPdf } = usePdfDisplay()

  // Handle PDF file selection and loading
  const handlePdfClick = async (pdf: PdfFile) => {
    console.log('CLICKED PDF: ', pdf)

    // Set the selected PDF in the store
    setSelectedPdf(pdf)

    try {
      // Load the PDF and create blob URL
      await loadPdf(pdf.originalPath)
    } catch (error) {
      console.error('Failed to load PDF for display:', error)
      // You might want to show a toast notification here
    }
  }

  // Clear PDF when selection changes to null
  useEffect(() => {
    if (!selectedPdf && pdfDisplay.url) {
      clearPdf()
    }
  }, [selectedPdf, pdfDisplay.url, clearPdf])

  // Function to get current PDF display state (for use in parent components)
  const getCurrentPdfState = () => {
    return {
      isLoading: pdfDisplay.isLoading,
      url: pdfDisplay.url,
      fileName: pdfDisplay.fileName,
      error: pdfDisplay.error,
      hasActivePdf: !!pdfDisplay.url
    }
  }

  // Example: You can expose this function via a ref or callback to parent components
  // This allows other components to access the current PDF blob URL
  useEffect(() => {
    if (pdfDisplay.url) {
      console.log('PDF blob URL ready:', pdfDisplay.url)
      console.log('Current PDF state:', getCurrentPdfState())

      // Call the optional callback to notify parent components
      onPdfLoaded?.(getCurrentPdfState())
    }
  }, [pdfDisplay.url, onPdfLoaded])

  const filteredPdfFiles = pdfFiles.filter(pdf => {
    const fileName = pdf.originalPath.split('\\').pop() || ''
    return fileName.toLowerCase().includes(filterQuery.toLowerCase())
  })

  const renderFileList = (
    files: PdfFile[],
    emptyMessage: string,
    directory: string
  ) => (
    <div className={`p-2 px-3`}>
      {/* {loading && files.length > 0 ? ( */}
      {loading ? (
        <div className="flex justify-center py-8">
          <RefreshCw className="text-primary size-6 animate-spin" />
        </div>
      ) : files.length === 0 ? (
        <div className="text-muted-foreground px-3 py-8 text-center text-sm">
          {filterQuery.length > 0 ? (
            'No matching files found'
          ) : (
            <SelectDirectory
              directory={directory}
              directoryExists={directoryExists?.[activeTab as TabType] ?? false}
              onRefresh={onRefresh}
            />
          )}
        </div>
      ) : (
        <ul className="space-y-1.5">
          {files.map((pdf, index) => {
            const fileName = pdf.originalPath.split('\\').pop() || ''
            return (
              <li
                key={index}
                className="group relative cursor-pointer">
                <div
                  className={buttonVariants({
                    className: 'h-auto w-full justify-start px-2 py-1.5',
                    variant:
                      selectedPdf?.originalPath === pdf.originalPath
                        ? 'default'
                        : 'ghost'
                  })}
                  onClick={() => handlePdfClick(pdf)}>
                  <FileText className={`mr-2 size-4`} />
                  {deletingPdf === pdf.originalPath ? (
                    <span className="flex-1 truncate">
                      Deleting...{' '}
                      <Loader2 className="ml-2 size-4 animate-spin" />
                    </span>
                  ) : pdfDisplay.isLoading &&
                    selectedPdf?.originalPath === pdf.originalPath ? (
                    <span className="flex flex-1 items-center truncate">
                      Loading PDF...{' '}
                      <Loader2 className="ml-2 size-4 animate-spin" />
                    </span>
                  ) : (
                    <span className="flex-1 truncate">{fileName}</span>
                  )}
                  {/* Show error indicator if PDF failed to load */}
                  {pdfDisplay.error &&
                    selectedPdf?.originalPath === pdf.originalPath && (
                      <span className="ml-2 text-xs text-red-500">Failed</span>
                    )}
                  {/* <DropdownMenu>
                    <DropdownMenuTrigger
                      className="opacity-0 group-hover:opacity-100"
                      disabled={!!deletingPdf}>
                      <Ellipsis className="size-4" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="start"
                      side="bottom">
                      <DropdownMenuItem
                        variant="destructive"
                        onClick={() =>
                          onOpen(
                            'delete-pdf',
                            {
                              filePath: pdf.originalPath
                            },
                            {
                              onSubmit: async () => onDelete(pdf.originalPath)
                            }
                          )
                        }>
                        <Trash2 className="text-destructive mr-2 size-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu> */}
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )

  const renderTabHeader = (
    title: string,
    directory: string,
    refreshType: TabType
  ) => (
    <div className="border-b p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">{title}</h2>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onRefresh(refreshType)}
            disabled={loading}
            className="size-8">
            <RefreshCw className={`size-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      <div className="mt-2 text-xs text-gray-500">
        {directory || 'No directory selected'}
      </div>
      <div className="relative mt-3">
        <Search className="text-muted-foreground absolute left-2 top-2.5 size-4" />
        <Input
          placeholder={`Search ${title.toLowerCase()}...`}
          className="pl-8"
          value={filterQuery}
          onChange={e => setFilterQuery(e.target.value)}
        />
      </div>
    </div>
  )

  return (
    <Card className="flex h-[calc(100vh-64px-24px)] max-h-full flex-col">
      <Tabs
        defaultValue="scans"
        className="flex h-full flex-col"
        onValueChange={value => {
          setPdfFiles([])
          setActiveTab(value as TabType)
        }}>
        <TabsList className="mx-auto mt-2 w-[95%]">
          <TabsTrigger
            value="scans"
            className="w-full">
            Scans
          </TabsTrigger>
          <TabsTrigger
            value="bills"
            className="w-full">
            Bills
          </TabsTrigger>
          <TabsTrigger
            value="non-invoice"
            className="w-full">
            Non-Invoice
          </TabsTrigger>
        </TabsList>

        {/* Scans Tab Content */}
        {activeTab === 'scans' && (
          <TabsContent
            value="scans"
            className="flex flex-1 flex-col overflow-hidden">
            {renderTabHeader('Scans', directoryPaths.scans, 'scans')}
            <div className="flex-1 overflow-y-auto">
              {renderFileList(
                filteredPdfFiles,
                'No scans found in this directory',
                directoryPaths.scans
              )}
            </div>
          </TabsContent>
        )}

        {/* Bills Tab Content */}
        {activeTab === 'bills' && (
          <TabsContent
            value="bills"
            className="flex flex-1 flex-col overflow-hidden">
            {renderTabHeader('Bills', directoryPaths.bills, 'bills')}
            <div className="flex-1 overflow-y-auto">
              {renderFileList(
                filteredPdfFiles,
                'No bills found in this directory',
                directoryPaths.bills
              )}
            </div>
          </TabsContent>
        )}

        {/* Non-Invoice Tab Content */}
        {activeTab === 'non-invoice' && (
          <TabsContent
            value="non-invoice"
            className="flex flex-1 flex-col overflow-hidden">
            {renderTabHeader(
              'Non-Invoice Documents',
              directoryPaths['non-invoice'],
              'non-invoice'
            )}
            <div className="flex-1 overflow-y-auto">
              {renderFileList(
                filteredPdfFiles,
                'No non-invoice documents found in this directory',
                directoryPaths['non-invoice']
              )}
            </div>
          </TabsContent>
        )}
      </Tabs>
    </Card>
  )
}
