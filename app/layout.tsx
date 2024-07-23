import type { Metadata } from 'next'
import './globals.css'

import { Poppins as FontSans } from 'next/font/google'
import { cn } from '@/lib/utils'
import { Toaster } from '@/components/ui/toaster'
import React from 'react'
import Navbar from '@/components/shared/Navbar'
import { constructMetadata } from '@/lib/paypal'
import { Analytics } from "@vercel/analytics/react";
const fontSans = FontSans({
  subsets: ['latin'],
  weight: ['400', '600'],
  variable: '--font-sans',
})

export const metadata: Metadata = constructMetadata()

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body
        className={cn(
          'min-h-screen bg-background font-sans antialiased',
          fontSans.variable
        )}
      >
        {/* <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        > */}
          <Navbar/>
          {children}
          <Analytics/>
          <Toaster />
        {/* </ThemeProvider> */}
      </body>
    </html>
  )
}
