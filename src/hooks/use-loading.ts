import { useState, useEffect } from 'react';
import { loadingTracker } from '@/lib/api/loading-tracker';

export function useLoading() {
  const [isLoading, setIsLoading] = useState(loadingTracker.isLoading);

  useEffect(() => {
    const unsubscribe = loadingTracker.subscribe(setIsLoading);
    return () => { unsubscribe(); };
  }, []);

  return isLoading;
}
