'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

export default function PageTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const trackVisit = async () => {
      try {
        const response = await fetch('/api/track-visit', {
          method: 'POST',
          body: JSON.stringify({ path: pathname }),
          headers: {
            'Content-Type': 'application/json',
          },
          signal: AbortSignal.timeout(3000),
        });
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
          console.warn('Visit tracking timed out');
        } else {
          console.warn('Failed to track visit (continuing anyway)');
        }
      }
    };

    trackVisit();
  }, [pathname, searchParams]);

  return null;
}
