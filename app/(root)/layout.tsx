import Footer from '@/components/shared/footer'
import { ThemeProvider } from '@/components/shared/theme-provider';
import React from 'react'

export default function RootLayout({
  children,
  modal,
}: {
  children: React.ReactNode
  modal: React.ReactNode
}) {
  return (
    <div className="flex h-screen flex-col">
      <ThemeProvider
        attribute="class"
        defaultTheme="light"
        enableSystem
        disableTransitionOnChange
      >
        <main className="flex-1 wrapper">{children}</main>
        {modal}
        <Footer />
      </ThemeProvider>
    </div>
  );
}
