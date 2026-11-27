import { useCallback, useEffect, useState } from 'react';
import type { ScrollDirection } from '@/features/editor/types';

export type UseSliderOptions = {
  totalItems: number;
  itemsPerView?: number;
  autoScroll?: boolean;
  autoScrollInterval?: number;
  scrollDirection?: ScrollDirection;
};

export function useSlider({
  totalItems,
  itemsPerView = 1,
  autoScroll = false,
  autoScrollInterval = 5000,
  scrollDirection = 'right',
}: UseSliderOptions) {
  const safePerView = Math.max(1, itemsPerView);
  const totalPages = Math.max(1, Math.ceil(totalItems / safePerView));
  const [rawIndex, setRawIndex] = useState(0);

  const currentIndex = rawIndex >= totalPages ? 0 : rawIndex;

  const next = useCallback(() => {
    setRawIndex((prev) => {
      const normalized = prev >= totalPages ? 0 : prev;
      return (normalized + 1) % totalPages;
    });
  }, [totalPages]);

  const prev = useCallback(() => {
    setRawIndex((prevIdx) => {
      const normalized = prevIdx >= totalPages ? 0 : prevIdx;
      return (normalized - 1 + totalPages) % totalPages;
    });
  }, [totalPages]);

  const goTo = useCallback(
    (index: number) => {
      if (index >= 0 && index < totalPages) {
        setRawIndex(index);
      }
    },
    [totalPages]
  );

  useEffect(() => {
    if (!autoScroll || totalPages <= 1) return;

    const intervalMs = Math.max(1000, autoScrollInterval || 5000);
    const timer = window.setInterval(() => {
      if (scrollDirection === 'left') {
        prev();
      } else {
        next();
      }
    }, intervalMs);

    return () => {
      window.clearInterval(timer);
    };
  }, [autoScroll, autoScrollInterval, scrollDirection, totalPages, next, prev]);

  return {
    currentIndex,
    totalPages,
    next,
    prev,
    goTo,
  };
}
