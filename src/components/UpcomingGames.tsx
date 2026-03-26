"use client";

import { useState, useEffect, useCallback } from "react";
import GameCard from "@/components/GameCard";
import InfiniteScroll from "@/components/InfiniteScroll";
import type { Game } from "@/lib/mlb-api";

// Initial load: today's next game + 5 more = 6 total
const INITIAL_SIZE = 6;
const PAGE_SIZE = 5;

export default function UpcomingGames() {
  const [games, setGames] = useState<Game[]>([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [initialized, setInitialized] = useState(false);
  const [usingMockData, setUsingMockData] = useState(false);
  const [totalGames, setTotalGames] = useState(0);

  const loadGames = useCallback(
    async (pageNum: number, pageSize: number) => {
      if (loading) return;
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(
          `/api/games/upcoming?page=${pageNum}&pageSize=${pageSize}`
        );
        if (!res.ok) throw new Error(`Error: ${res.status}`);
        const data = await res.json();
        if (data.usingMockData) setUsingMockData(true);
        setTotalGames(data.totalGames);
        setGames((prev) => (pageNum === 0 ? data.games : [...prev, ...data.games]));
        const loadedSoFar = pageNum === 0 ? data.games.length : games.length + data.games.length;
        setHasMore(loadedSoFar < data.totalGames);
        setPage(pageNum === 0 ? 1 : pageNum + 1);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load games");
      } finally {
        setLoading(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [loading]
  );

  useEffect(() => {
    if (!initialized) {
      setInitialized(true);
      loadGames(0, INITIAL_SIZE);
    }
  }, [initialized, loadGames]);

  const handleLoadMore = useCallback(() => {
    loadGames(page, PAGE_SIZE);
  }, [loadGames, page]);

  return (
    <div>
      {usingMockData && (
        <div className="mock-data-notice">
          ℹ️ Showing sample schedule data. In production, this uses live data from the{" "}
          <a href="https://statsapi.mlb.com" target="_blank" rel="noopener noreferrer">
            MLB Stats API
          </a>
          .
        </div>
      )}

      {error && <div className="error-message">{error}</div>}

      {games.length === 0 && !loading && !error && (
        <div className="empty-state">
          <p>No upcoming games found.</p>
        </div>
      )}

      {games.length > 0 && (
        <div className="games-list">
          {games.map((game, index) => (
            <div key={game.gamePk} className={index === 0 ? "featured-game" : ""}>
              {index === 0 && (
                <div className="next-game-label">⚾ Next Game</div>
              )}
              <GameCard game={game} />
            </div>
          ))}
        </div>
      )}

      <InfiniteScroll
        onLoadMore={handleLoadMore}
        hasMore={hasMore}
        loading={loading}
      />

      {!loading && totalGames > 0 && (
        <p className="games-count">
          Showing {games.length} of {totalGames} upcoming games
        </p>
      )}
    </div>
  );
}
