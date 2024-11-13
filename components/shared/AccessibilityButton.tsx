"use client"

import { Button } from '@/components/ui/button'
import { Eye } from 'lucide-react'
import { useAccessibility } from '@/lib/context/AccessibilityContext'

export default function AccessibilityButton() {
  const { isAccessibilityMode, toggleAccessibilityMode } = useAccessibility()

  return (
    <div className="fixed top-4 right-4 z-50">
      <Button
        onClick={() => toggleAccessibilityMode()}
        aria-label="Toggle accessibility mode"
        className="flex items-center gap-2"
      >
        <Eye className="h-4 w-4" />
        {isAccessibilityMode ? "Disable" : "Enable"} Accessibility Mode
      </Button>
    </div>
  )
} 