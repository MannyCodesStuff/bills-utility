'use client'

import { EmailDrawer } from '@/components/bill-manager/drawers/email-drawer'
import { useEffect, useState } from 'react'

export const DrawerProvider = () => {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) return null

  return (
    <>
      <EmailDrawer />
    </>
  )
}
