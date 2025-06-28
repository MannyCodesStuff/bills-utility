import React from 'react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog'
import { useModal } from '@/hooks/use-modal'

export function DeleteFileModal() {
  const { isOpen, type, onClose, action, data } = useModal()
  const isModalOpen = isOpen && type === 'delete-pdf'

  const [isSubmitting, setIsSubmitting] = React.useState(false)

  if (!isModalOpen) return null

  return (
    <AlertDialog
      open={isModalOpen}
      onOpenChange={() => {
        // Prevent closing while submitting
        if (!isSubmitting) {
          onClose()
        }
      }}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the file{' '}
            <span className="font-bold">{data?.filePath}</span> from the server.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isSubmitting}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            disabled={isSubmitting}
            onClick={async () => {
              if (!action?.onSubmit) return

              setIsSubmitting(true)
              try {
                await action.onSubmit() // wait for async action
              } finally {
                setIsSubmitting(false)
                onClose() // close dialog after action completes (success or failure)
              }
            }}>
            {isSubmitting ? 'Deleting...' : 'Continue'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
