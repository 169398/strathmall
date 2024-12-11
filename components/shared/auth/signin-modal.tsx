'use client'

import { Button } from "@/components/ui/button"
import { SignInWithGoogle } from "@/lib/actions/user.actions"
import Image from "next/image"
import { APP_NAME } from "@/lib/constants"
import { X } from "lucide-react"

interface SignInModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function SignInModal({ isOpen, onClose }: SignInModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed top-24 right-4 z-50 w-[320px] bg-white/80 backdrop-blur-md rounded-xl shadow-2xl border border-gray-100 animate-in slide-in-from-right duration-300">
      <div className="p-6 relative">
        <Button 
          variant="ghost" 
          size="icon" 
          className="absolute right-2 top-2 hover:bg-gray-100/50 rounded-full"
          onClick={onClose}
        >
          <X className="h-4 w-4 text-gray-500" />
        </Button>
        
        <div className="flex flex-col items-center gap-4 mb-6">
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-pink-600 to-purple-600 rounded-full blur opacity-30"></div>
            <Image
              src="/assets/icons/logo.png"
              width={60}
              height={60}
              alt={APP_NAME}
              className="relative rounded-full"
            />
          </div>
          
          <div className="space-y-2 text-center">
            <h2 className="text-xl font-semibold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              Welcome to {APP_NAME}!
            </h2>
            <p className="text-sm text-gray-600">
              Sign in to unlock exclusive offers
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <form action={SignInWithGoogle}>
            <Button 
              type="submit"
              className="w-full flex items-center justify-center gap-3 h-12 bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 shadow-sm transition-all duration-200 hover:shadow-md" 
              variant="outline"
            >
              <Image
                src="/assets/icons/google.svg"
                alt="Google"
                width={20}
                height={20}
              />
              <span className="font-medium">Continue with Google</span>
            </Button>
          </form>

          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-center gap-2">
              <div className="w-2 h-2 rounded-full bg-pink-500"></div>
              <div className="text-sm font-medium text-gray-700">
                New users get special offers!
              </div>
            </div>
            <p className="text-xs text-center text-gray-500">
              By continuing, you agree to our Terms & Privacy Policy
            </p>
          </div>
        </div>
      </div>
    </div>
  )
} 