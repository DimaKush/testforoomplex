import { useEffect, useRef, useCallback } from 'react';
import { PAGINATION } from '@/constants';

interface UseInfiniteScrollProps {
  hasMore: boolean;
  isLoading: boolean;
  onLoadMore: () => void;
}

export function useInfiniteScroll({ hasMore, isLoading, onLoadMore }: UseInfiniteScrollProps) {
  const loadingRef = useRef<HTMLDivElement>(null);

  const handleIntersection = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const entry = entries[0];
      if (entry && entry.isIntersecting && hasMore && !isLoading) {
        onLoadMore();
      }
    },
    [hasMore, isLoading, onLoadMore]
  );

  useEffect(() => {
    const observer = new IntersectionObserver(
      handleIntersection,
      { threshold: PAGINATION.INTERSECTION_THRESHOLD }
    );

    if (loadingRef.current) {
      observer.observe(loadingRef.current);
    }

    return () => observer.disconnect();
  }, [handleIntersection]);

  return { loadingRef };
} 