import React from 'react'
import MainNav from './main-nav'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <div className="flex flex-col min-h-screen">
        <div className="border-b bg-white">
          <div className="flex h-16 items-center px-4">
            <div className="ml-auto flex items-center space-x-4">
            </div>
          </div>
          <div className="px-4 pb-4">
            <MainNav className="mx-6" />
          </div>
        </div>

        <div className="flex-1 space-y-4 p-8 pt-6">{children}</div>
      </div>
    </>
  )
}
