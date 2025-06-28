import React from 'react'
import { ShieldX } from 'lucide-react'

interface FormErrorProps {
  message?: string
}

export const FormError = ({ message }: FormErrorProps) => {
  if (!message) return null

  return (
    <div className="bg-destructive/20 text-destructive flex items-center justify-center gap-x-2 rounded-md p-3 text-sm dark:text-red-400">
      <ShieldX className="h-4 w-4 md:h-6 md:w-6" />
      <p>{message}</p>
    </div>
  )
}
