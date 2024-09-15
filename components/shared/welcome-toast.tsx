'use client';

import { useEffect } from 'react';
import { toast } from 'sonner';

export function WelcomeToast() {
  useEffect(() => {
    // ignore if screen height is too small
    if (window.innerHeight < 650) return;
    if (!document.cookie.includes('strathmall-welcome-toast=2')) {
      toast('🛍️ Welcome to StrathMall!', {
        id: 'strathmall-welcome-toast',
        duration: Infinity,
        onDismiss: () => {
          document.cookie = 'strathmall-welcome-toast=2; max-age=31536000; path=/';
        },
        description: (
          <>
            Welcome to StrathMall, your local marketplace for your business{' '}
            <a
              href="https://strathmall.com"
              className="text-blue-600 hover:underline"
              target="_blank"
            >
              Learn more
            </a>
            .
          </>
        )
      });
    }
  }, []);

  return null;
}
