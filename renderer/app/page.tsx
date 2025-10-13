import React from 'react'
import { BillManager2 } from '@/components/bill-manager2'

export default function IndexPage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Main Content */}
      <main className="flex-1 bg-gray-50 dark:bg-gray-900">
        <BillManager2 />
      </main>
    </div>
  )
}
