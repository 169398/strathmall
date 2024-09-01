import Navbar from '@/components/shared/Navbar';
import { WelcomeToast } from '@/components/shared/welcome-toast';
import React from 'react'

export default function RootLayout({
  children,
  modal,
}: {
  children: React.ReactNode
  modal: React.ReactNode
}) {
  return (
    <>
      <Navbar />

      <div className="flex h-screen flex-col">
        <WelcomeToast />

        <main className="flex-1 wrapper">{children}</main>
        {modal}
      </div>
    </>
  );
}
