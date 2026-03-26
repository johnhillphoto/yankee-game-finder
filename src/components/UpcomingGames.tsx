"use client";

import { useState, useEffect, useCallback } from "react";
import GameCard from "@/components/GameCard";
import InfiniteScroll from "@/components/InfiniteScroll";
import { useTeam } from "@/lib/team-context";
import type { Game } from "@/lib/mlb-api";

// Initial load: today's next game + 5 more = 6 total
const INITIAL_SIZE = 6;
const PAGE_SIZE = 5;

export default function UpcomingGames() {
  const { team } = useTeam();
  const [games, setGames] = useState<Game[]>([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [usingMockData, setUsingMockData] = useState(false);
  const [totalGames, setTotalGames] = useState(0);
  const [loadedCount, setLoadedCount] = useState(0);

  const loadGames = useCallback(
    async (teamId: number, pageNum: number, pageSize: number) => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(
          `/api/games/upcoming?page=${pageNum}&pageSize=${pageSize}&teamId=${teamId}`
        );
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.error ?? `Error: ${res.status}`);
        }
        const data = await res.json();
        if (data.usingMockData) setUsingMockData(true);
        setTotalGames(data.totalGames);
        setGames((prev) => {
          const next = pageNum === 0 ? data.games : [...prev, ...data.games];
          setLoadedCount(next.length);
          setHasMore(next.length < data.totalGames);
          return next;
        });
        setPage(pageNum === 0 ? 1 : pageNum + 1);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load games");
        setHasMore(false);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Reset and reload whenever the selected team changes
  useEffect(() => {
    setGames([]);
    setPage(0);
    setHasMore(true);
    setUsingMockData(false);
    setTotalGames(0);
    setLoadedCount(0);
    setError(null);
    loadGames(team.id, 0, INITIAL_SIZE);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [team.id]);

  const handleLoadMore = useCallback(() => {
    loadGames(team.id, page, PAGE_SIZE);
  }, [loadGames, team.id, page]);

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
          Showing {loadedCount} of {totalGames} upcoming games
        </p>
      )}
    </div>
  );
}
