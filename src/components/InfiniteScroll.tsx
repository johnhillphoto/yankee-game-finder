"use client";

import { useEffect, useRef, useCallback } from "react";

interface InfiniteScrollProps {
  onLoadMore: () => void;
  hasMore: boolean;
  loading: boolean;
}

export default function InfiniteScroll({
  onLoadMore,
  hasMore,
  loading,
}: InfiniteScrollProps) {
  const sentinelRef = useRef<HTMLDivElement>(null);

  const handleIntersect = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      if (entries[0].isIntersecting && hasMore && !loading) {
        onLoadMore();
      }
    },
    [hasMore, loading, onLoadMore]
  );

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    const observer = new IntersectionObserver(handleIntersect, {
      rootMargin: "200px",
    });
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [handleIntersect]);

  return (
    <div ref={sentinelRef} className="infinite-scroll-sentinel">
      {loading && (
        <div className="loading-spinner">
          <div className="spinner" />
          <span>Loading more games...</span>
        </div>
      )}
      {!hasMore && !loading && (
        <p className="no-more-games">No more games to show.</p>
      )}
    </div>
  );
}
