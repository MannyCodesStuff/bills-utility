import React from 'react'
import '@/styles/globals.css'
import { Inter as FontSans } from 'next/font/google'

import { cn } from '@/lib/utils'
import { Metadata } from 'next'
import ThemeProvider from '@/components/providers/theme-provider'
import { Header } from '@/components/header'
import { DrawerProvider } from '@/providers/drawer-provider'
import { ModalProvider } from '@/providers/modal-provider'
// import { UpdateNotification } from '@/components/update-notification'
import { Toaster } from '@/components/ui/sonner'

const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans'
})

export const metadata: Metadata = {
  title: 'Document Manager',
  description: 'Document Manager'
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning>
      <body
        className={cn(
          'bg-background h-screen w-screen overflow-hidden font-sans antialiased',
          fontSans.variable
        )}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          disableTransitionOnChange>
          <div className="flex h-full w-full flex-col">
            <div className="h-[64px] w-full">
              <Header />
            </div>
            <div className="flex max-h-[calc(100vh-64px)] w-full flex-1">
              {children}
            </div>
          </div>
          {/* <Header />
          {children} */}
          <DrawerProvider />
          <ModalProvider />
          <Toaster
            richColors
            position="top-center"
            closeButton
            duration={5000}
          />
          {/* <UpdateNotification /> */}
        </ThemeProvider>
      </body>
    </html>
  )
}
