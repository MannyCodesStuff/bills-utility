import React from 'react'
import { FileText } from 'lucide-react'
import { Card } from '../ui/card'
import { useStore } from '@/hooks/use-store'

export function PdfViewer() {
  const { selectedPdf } = useStore()
  if (!selectedPdf) {
    return (
      <Card className="h-full overflow-hidden">
        <div className="flex h-[calc(100vh-12rem)] flex-col items-center justify-center p-6">
          <FileText className="text-muted-foreground/40 size-16" />
          <h3 className="mt-4 text-lg font-medium">No Document Selected</h3>
          <p className="text-muted-foreground mt-2 text-center text-sm">
            Select a document from the sidebar to preview and rename it
          </p>
        </div>
      </Card>
    )
  }

  return (
    <Card className="h-full overflow-hidden">
      <div className="flex h-full flex-col">
        <div className="flex items-center justify-between border-b px-6 py-3">
          <div className="overflow-hidden">
            <h2 className="truncate text-lg font-semibold">
              {selectedPdf.originalPath.split('\\').pop()}
            </h2>
            <p className="text-muted-foreground truncate text-xs">
              {selectedPdf.originalPath}
            </p>
          </div>
        </div>

        <div className="flex-1 overflow-auto p-6">
          <div className="h-[calc(100vh-12rem)] w-full">
            <object
              data={selectedPdf.httpPath}
              type="application/pdf"
              className="size-full rounded-lg border">
              <embed
                src={selectedPdf.httpPath}
                type="application/pdf"
                className="size-full"
              />
            </object>
          </div>
        </div>
      </div>
    </Card>
  )
}
