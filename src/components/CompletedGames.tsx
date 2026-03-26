"use client";

import { useState, useEffect, useCallback } from "react";
import GameCard from "@/components/GameCard";
import InfiniteScroll from "@/components/InfiniteScroll";
import type { Game } from "@/lib/mlb-api";

const PAGE_SIZE = 20;

export default function CompletedGames() {
  const [games, setGames] = useState<Game[]>([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [initialized, setInitialized] = useState(false);

  const loadGames = useCallback(
    async (pageNum: number) => {
      if (loading) return;
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(
          `/api/games/completed?page=${pageNum}&pageSize=${PAGE_SIZE}`
        );
        if (!res.ok) throw new Error(`Error: ${res.status}`);
        const data = await res.json();
        setGames((prev) =>
          pageNum === 0 ? data.games : [...prev, ...data.games]
        );
        setHasMore((pageNum + 1) * PAGE_SIZE < data.totalGames);
        setPage(pageNum + 1);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load games");
      } finally {
        setLoading(false);
      }
    },
    [loading]
  );

  useEffect(() => {
    if (!initialized) {
      setInitialized(true);
      loadGames(0);
    }
  }, [initialized, loadGames]);

  const handleLoadMore = useCallback(() => {
    loadGames(page);
  }, [loadGames, page]);

  return (
    <div>
      {error && <div className="error-message">{error}</div>}

      {games.length === 0 && !loading && !error && (
        <div className="empty-state">
          <p>No completed games found for this season.</p>
        </div>
      )}

      {games.length > 0 && (
        <div className="games-list">
          {games.map((game) => (
            <GameCard key={game.gamePk} game={game} showScore />
          ))}
        </div>
      )}

      <InfiniteScroll
        onLoadMore={handleLoadMore}
        hasMore={hasMore}
        loading={loading}
      />
    </div>
  );
}
