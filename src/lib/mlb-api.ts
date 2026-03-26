// MLB Stats API utilities
// API base: https://statsapi.mlb.com/api/v1

export const YANKEES_TEAM_ID = 147;
const MLB_API_BASE = "https://statsapi.mlb.com/api/v1";

export interface Team {
  id: number;
  name: string;
  abbreviation?: string;
}

export interface Broadcast {
  name: string;
  type: string;
  language: string;
  isNational: boolean;
}

export interface Game {
  gamePk: number;
  gameDate: string; // ISO datetime string
  status: {
    abstractGameState: string; // "Preview", "Live", "Final"
    detailedState: string;
    statusCode: string;
  };
  teams: {
    away: { team: Team; score?: number; isWinner?: boolean };
    home: { team: Team; score?: number; isWinner?: boolean };
  };
  venue: { name: string };
  broadcasts?: Broadcast[];
  isHome: boolean;
  opponent: Team;
}

export interface GamesResponse {
  games: Game[];
  totalGames: number;
}

function formatDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function parseGames(dates: ScheduleDate[], teamId: number): Game[] {
  const games: Game[] = [];
  for (const dateObj of dates) {
    for (const game of dateObj.games) {
      const isHome = game.teams.home.team.id === teamId;
      const opponent = isHome ? game.teams.away.team : game.teams.home.team;
      games.push({
        gamePk: game.gamePk,
        gameDate: game.gameDate,
        status: game.status,
        teams: game.teams,
        venue: game.venue,
        broadcasts: game.broadcasts,
        isHome,
        opponent,
      });
    }
  }
  return games;
}

interface ScheduleDate {
  date: string;
  games: RawGame[];
}

interface RawGame {
  gamePk: number;
  gameDate: string;
  status: {
    abstractGameState: string;
    detailedState: string;
    statusCode: string;
  };
  teams: {
    away: { team: Team; score?: number; isWinner?: boolean };
    home: { team: Team; score?: number; isWinner?: boolean };
  };
  venue: { name: string };
  broadcasts?: Broadcast[];
}

export async function fetchUpcomingGames(
  teamId: number = YANKEES_TEAM_ID,
  page: number = 0,
  pageSize: number = 5
): Promise<GamesResponse> {
  // Fetch upcoming games starting from today
  const today = new Date();
  const endDate = new Date(today);
  endDate.setMonth(endDate.getMonth() + 6); // look 6 months ahead

  const startDateStr = formatDate(today);
  const endDateStr = formatDate(endDate);

  const url = `${MLB_API_BASE}/schedule?sportId=1&teamId=${teamId}&startDate=${startDateStr}&endDate=${endDateStr}&gameType=R,F,D,L,W&hydrate=broadcasts(all),linescore,team`;

  const res = await fetch(url, { next: { revalidate: 300 } });
  if (!res.ok) throw new Error(`MLB API error: ${res.status}`);
  const data = await res.json();

  const allGames = parseGames(data.dates || [], teamId);

  // Filter upcoming (not yet Final)
  const upcoming = allGames.filter(
    (g) => g.status.abstractGameState !== "Final"
  );

  const start = page * pageSize;
  const end = start + pageSize;
  return {
    games: upcoming.slice(start, end),
    totalGames: upcoming.length,
  };
}

export async function fetchCompletedGames(
  teamId: number = YANKEES_TEAM_ID,
  page: number = 0,
  pageSize: number = 20
): Promise<GamesResponse> {
  // Fetch completed games from start of current season
  const today = new Date();
  const seasonStart = new Date(today.getFullYear(), 2, 1); // March 1st
  const startDateStr = formatDate(seasonStart);
  const endDateStr = formatDate(today);

  const url = `${MLB_API_BASE}/schedule?sportId=1&teamId=${teamId}&startDate=${startDateStr}&endDate=${endDateStr}&gameType=R,F,D,L,W&hydrate=broadcasts(all),linescore,team`;

  const res = await fetch(url, { next: { revalidate: 300 } });
  if (!res.ok) throw new Error(`MLB API error: ${res.status}`);
  const data = await res.json();

  const allGames = parseGames(data.dates || [], teamId);

  // Filter completed (Final)
  const completed = allGames
    .filter((g) => g.status.abstractGameState === "Final")
    .reverse(); // most recent first

  const start = page * pageSize;
  const end = start + pageSize;
  return {
    games: completed.slice(start, end),
    totalGames: completed.length,
  };
}
