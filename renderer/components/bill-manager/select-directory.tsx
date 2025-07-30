import React from 'react'
import { useStore } from '@/hooks/use-store'
import { Button } from '../ui/button'
import { TabType } from './types'
import { toast } from 'sonner'

export const SelectDirectory = ({
  directory,
  directoryExists,
  onRefresh
}: {
  directory: string
  directoryExists: boolean
  onRefresh: (type: TabType) => void
}) => {
  const { setDirectoryPaths, activeTab, directoryPaths } = useStore()

  const selectDirectory = async () => {
    try {
      // Try to use the Electron IPC if available
      if (typeof window !== 'undefined' && window.ipc) {
        const directoryPath = await window.ipc.selectDirectory()
        if (directoryPath) {
          setDirectoryPaths({
            ...directoryPaths,
            [activeTab!]: directoryPath
          })
          onRefresh(activeTab!)
        }
      } else {
        // Fallback to browser API for web version
        const input = document.createElement('input')
        input.type = 'file'
        input.webkitdirectory = true

        input.onchange = async e => {
          const files = (e.target as HTMLInputElement).files
          if (files && files.length > 0) {
            // Get the directory path from the first file's path
            const firstFile = files[0] as File & { path: string }
            const directoryPath = firstFile.path
              .split('\\')
              .slice(0, -1)
              .join('\\')

            setDirectoryPaths({
              ...directoryPaths,
              [activeTab!]: directoryPath
            })
            onRefresh(activeTab!)
          }
        }

        input.click()
      }
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : 'Failed to select directory'
      )
    }
  }

  console.log('directory', directory)
  console.log('directoryExists', directoryExists)
  console.log(directoryPaths)

  if (directoryExists) {
    return <p>Folder has no PDF files to display.</p>
  }

  return (
    <div className="flex w-full flex-col gap-4">
      <p>
        Directory: &quot;{directory}&quot; <br />
        was not found.
      </p>
      <Button onClick={selectDirectory}>Select Directory</Button>
    </div>
  )
}
