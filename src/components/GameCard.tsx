import type { Game } from "@/lib/mlb-api";

interface GameCardProps {
  game: Game;
  showScore?: boolean;
}

function formatGameTime(gameDate: string): string {
  const date = new Date(gameDate);
  return date.toLocaleString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
  });
}

function getBroadcastNames(game: Game): string[] {
  if (!game.broadcasts || game.broadcasts.length === 0) {
    return ["TBD"];
  }
  return game.broadcasts
    .filter((b) => b.language === "en")
    .map((b) => b.name)
    .filter((v, i, a) => a.indexOf(v) === i); // deduplicate
}

function getScore(game: Game): { yankeesScore: number; opponentScore: number } {
  const yankeesTeam = game.isHome ? game.teams.home : game.teams.away;
  const opponentTeam = game.isHome ? game.teams.away : game.teams.home;
  return {
    yankeesScore: yankeesTeam.score ?? 0,
    opponentScore: opponentTeam.score ?? 0,
  };
}

function getGameResult(game: Game): "W" | "L" | null {
  if (game.status.abstractGameState !== "Final") return null;
  const yankeesTeam = game.isHome ? game.teams.home : game.teams.away;
  return yankeesTeam.isWinner ? "W" : "L";
}

export default function GameCard({ game, showScore = false }: GameCardProps) {
  const broadcasts = getBroadcastNames(game);
  const isLive = game.status.abstractGameState === "Live";
  const isFinal = game.status.abstractGameState === "Final";
  const result = isFinal ? getGameResult(game) : null;
  const score = showScore ? getScore(game) : null;

  return (
    <div className="game-card">
      {/* Header: Date + Location badge */}
      <div className="game-card-header">
        <span className="game-date">{formatGameTime(game.gameDate)}</span>
        <div className="game-badges">
          <span className={`badge badge-location ${game.isHome ? "badge-home" : "badge-away"}`}>
            {game.isHome ? "HOME" : "AWAY"}
          </span>
          {isLive && <span className="badge badge-live">● LIVE</span>}
          {isFinal && result && (
            <span className={`badge badge-result ${result === "W" ? "badge-win" : "badge-loss"}`}>
              {result}
            </span>
          )}
        </div>
      </div>

      {/* Matchup */}
      <div className="game-matchup">
        <div className="team">
          <span className="team-label">NY YANKEES</span>
          {showScore && score !== null && (
            <span className="team-score">{score.yankeesScore}</span>
          )}
        </div>
        <span className="vs">VS</span>
        <div className="team">
          <span className="team-label">{game.opponent.name}</span>
          {showScore && score !== null && (
            <span className="team-score">{score.opponentScore}</span>
          )}
        </div>
      </div>

      {/* Footer: Venue + Broadcasts */}
      <div className="game-footer">
        <span className="venue">📍 {game.venue.name}</span>
        <div className="broadcasts">
          {broadcasts.map((b) => (
            <span key={b} className="broadcast-badge">
              {b}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
