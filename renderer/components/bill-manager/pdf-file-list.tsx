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

// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger
// } from '../ui/dropdown-menu'
import { SelectDirectory } from './select-directory'
import { useStore } from '@/hooks/use-store'
// import { deleteFile } from '@/actions/documentManager'

interface PdfFileListProps {
  // pdfFiles: PdfFile[]
  loading: boolean
  filterQuery: string
  setFilterQuery: (query: string) => void
  onRefresh: (type: TabType) => void
  onDelete: (filePath: string) => Promise<void>
}

export function PdfFileList({
  // pdfFiles,
  loading,
  filterQuery,
  setFilterQuery,
  onRefresh
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
              directoryExists={directoryExists[activeTab]}
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
                  onClick={() => {
                    console.log('CLICKED PDF: ', pdf)
                    setSelectedPdf(pdf)
                  }}>
                  <FileText className={`mr-2 size-4`} />
                  {deletingPdf === pdf.originalPath ? (
                    <span className="flex-1 truncate">
                      Deleting...{' '}
                      <Loader2 className="ml-2 size-4 animate-spin" />
                    </span>
                  ) : (
                    <span className="flex-1 truncate">{fileName}</span>
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
    <Card className="h-full overflow-hidden">
      <Tabs
        defaultValue="scans"
        className="flex w-full flex-col items-center justify-center"
        onValueChange={value => {
          setPdfFiles([])
          setActiveTab(value as TabType)
        }}>
        <TabsList className="mt-2 w-[95%]">
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
        <TabsContent
          value="scans"
          className="w-full">
          {renderTabHeader('Scans', directoryPaths.scans, 'scans')}
          {renderFileList(
            filteredPdfFiles,
            'No scans found in this directory',
            directoryPaths.scans
          )}
        </TabsContent>

        {/* Bills Tab Content */}
        <TabsContent
          value="bills"
          className="w-full">
          {renderTabHeader('Bills', directoryPaths.bills, 'bills')}
          {renderFileList(
            filteredPdfFiles,
            'No bills found in this directory',
            directoryPaths.bills
          )}
        </TabsContent>

        {/* Non-Invoice Tab Content */}
        <TabsContent
          value="non-invoice"
          className="w-full">
          {renderTabHeader(
            'Non-Invoice Documents',
            directoryPaths['non-invoice'],
            'non-invoice'
          )}
          {renderFileList(
            filteredPdfFiles,
            'No non-invoice documents found in this directory',
            directoryPaths['non-invoice']
          )}
        </TabsContent>
      </Tabs>
    </Card>
  )
}
