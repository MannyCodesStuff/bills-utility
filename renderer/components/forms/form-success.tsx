import React from 'react'
import { CheckCircle2 } from 'lucide-react'

interface FormSuccessProps {
  message?: string
}

export const FormSuccess = ({ message }: FormSuccessProps) => {
  if (!message) return null

  return (
    <div className="flex items-center justify-center gap-x-2 rounded-md bg-emerald-500/20 p-3 text-sm text-emerald-500">
      <CheckCircle2 className="h-4 w-4 md:h-6 md:w-6" />
      <p>{message}</p>
    </div>
  )
}
