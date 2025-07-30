'use client'

import { useEffect, useState } from 'react'
import { DeleteFileModal } from '@/components/modals/delete-file'

export const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) return null

  return (
    <>
      <DeleteFileModal />
    </>
  )
}
