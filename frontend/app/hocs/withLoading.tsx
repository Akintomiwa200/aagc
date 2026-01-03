// app/hocs/withLoading.tsx
'use client';

import { useState, useEffect } from 'react';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

export function withLoading<T extends object>(
  WrappedComponent: React.ComponentType<T>
) {
  return function WithLoadingComponent(props: T) {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
      // Simulate loading delay
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 1000);

      return () => clearTimeout(timer);
    }, []);

    if (isLoading) {
      return <LoadingSpinner />;
    }

    return <WrappedComponent {...props} />;
  };
}

// Hook for manual loading control
export function useLoading() {
  const [isLoading, setIsLoading] = useState(false);

  const startLoading = () => setIsLoading(true);
  const stopLoading = () => setIsLoading(false);
  
  return {
    isLoading,
    startLoading,
    stopLoading,
    LoadingComponent: isLoading ? LoadingSpinner : null
  };
}