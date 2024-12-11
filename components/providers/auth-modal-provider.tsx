'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { usePathname } from 'next/navigation'
import SignInModal from '../shared/auth/signin-modal'

export default function AuthModalProvider() {
  const [showModal, setShowModal] = useState(false)
  const { data: session } = useSession()
  const pathname = usePathname()

  useEffect(() => {
    // Don't show on auth pages or when user is signed in
    const shouldShowModal = !session && 
      !pathname.includes('/sign-in') && 
      !pathname.includes('/sign-up') &&
      !pathname.includes('/verify-email') &&
      localStorage.getItem('modalShown') !== 'true'

    if (shouldShowModal) {
      // Delay modal appearance for better UX
      const timer = setTimeout(() => {
        setShowModal(true)
        localStorage.setItem('modalShown', 'true')
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [session, pathname])

  return (
    <SignInModal 
      isOpen={showModal} 
      onClose={() => setShowModal(false)} 
    />
  )
} 