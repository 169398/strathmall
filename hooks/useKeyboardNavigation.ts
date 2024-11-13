import { useEffect } from 'react';

export function useKeyboardNavigation() {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        // Add visible focus indicators
        document.body.classList.add('keyboard-navigation');
      }
    };

    const handleMouseDown = () => {
      // Remove focus indicators when using mouse
      document.body.classList.remove('keyboard-navigation');
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('mousedown', handleMouseDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('mousedown', handleMouseDown);
    };
  }, []);
} 