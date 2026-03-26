import type { Game } from "./mlb-api";

// Mock NY Yankees 2026 schedule data for fallback when MLB API is unavailable
// Based on typical Yankees schedule structure

const YANKEES: { id: number; name: string; abbreviation: string } = {
  id: 147,
  name: "New York Yankees",
  abbreviation: "NYY",
};

type MockGame = {
  gamePk: number;
  gameDate: string;
  status: { abstractGameState: string; detailedState: string; statusCode: string };
  teams: {
    away: { team: { id: number; name: string; abbreviation: string }; score?: number; isWinner?: boolean };
    home: { team: { id: number; name: string; abbreviation: string }; score?: number; isWinner?: boolean };
  };
  venue: { name: string };
  broadcasts?: { name: string; type: string; language: string; isNational: boolean }[];
  isHome: boolean;
  opponent: { id: number; name: string; abbreviation: string };
};

function makeGame(
  gamePk: number,
  dateStr: string,
  opponent: { id: number; name: string; abbreviation: string },
  isHome: boolean,
  venue: string,
  broadcasts: string[],
  state: "Final" | "Preview" | "Live",
  yankeeScore?: number,
  opponentScore?: number,
  yankeeWin?: boolean
): MockGame {
  const broadcastList = broadcasts.map((name) => ({
    name,
    type: "TV",
    language: "en",
    isNational: ["ESPN", "Fox", "FS1", "TBS", "Apple TV+"].includes(name),
  }));

  const home = isHome ? YANKEES : opponent;
  const away = isHome ? opponent : YANKEES;

  return {
    gamePk,
    gameDate: dateStr,
    status: {
      abstractGameState: state,
      detailedState: state === "Final" ? "Final" : state === "Live" ? "In Progress" : "Scheduled",
      statusCode: state === "Final" ? "F" : state === "Live" ? "I" : "S",
    },
    teams: {
      home: {
        team: home,
        score: state === "Final" || state === "Live" ? (isHome ? yankeeScore : opponentScore) : undefined,
        isWinner: state === "Final" ? (isHome ? yankeeWin : !yankeeWin) : undefined,
      },
      away: {
        team: away,
        score: state === "Final" || state === "Live" ? (isHome ? opponentScore : yankeeScore) : undefined,
        isWinner: state === "Final" ? (isHome ? !yankeeWin : yankeeWin) : undefined,
      },
    },
    venue: { name: venue },
    broadcasts: broadcastList,
    isHome,
    opponent,
  };
}

const YANKEE_STADIUM = "Yankee Stadium";

// Teams
const BLUE_JAYS = { id: 141, name: "Toronto Blue Jays", abbreviation: "TOR" };
const RED_SOX = { id: 111, name: "Boston Red Sox", abbreviation: "BOS" };
const ORIOLES = { id: 110, name: "Baltimore Orioles", abbreviation: "BAL" };
const RAYS = { id: 139, name: "Tampa Bay Rays", abbreviation: "TB" };
const TIGERS = { id: 116, name: "Detroit Tigers", abbreviation: "DET" };
const TWINS = { id: 142, name: "Minnesota Twins", abbreviation: "MIN" };
const ASTROS = { id: 117, name: "Houston Astros", abbreviation: "HOU" };
const RANGERS = { id: 140, name: "Texas Rangers", abbreviation: "TEX" };
const ANGELS = { id: 108, name: "Los Angeles Angels", abbreviation: "LAA" };
const ATHLETICS = { id: 133, name: "Oakland Athletics", abbreviation: "OAK" };
const CUBS = { id: 112, name: "Chicago Cubs", abbreviation: "CHC" };
const METS = { id: 121, name: "New York Mets", abbreviation: "NYM" };
const PHILLIES = { id: 143, name: "Philadelphia Phillies", abbreviation: "PHI" };
const BRAVES = { id: 144, name: "Atlanta Braves", abbreviation: "ATL" };
const DODGERS = { id: 119, name: "Los Angeles Dodgers", abbreviation: "LAD" };

// 2026 season — completed games (with scores), upcoming games (no scores)
// Today is 2026-03-26. Season started March 19.
export const MOCK_GAMES: Game[] = [
  // --- COMPLETED GAMES ---
  makeGame(747001, "2026-03-19T18:10:00Z", BLUE_JAYS, false, "Rogers Centre", ["YES Network", "Sportsnet"], "Final", 6, 3, true),
  makeGame(747002, "2026-03-20T18:10:00Z", BLUE_JAYS, false, "Rogers Centre", ["YES Network", "Sportsnet"], "Final", 2, 5, false),
  makeGame(747003, "2026-03-21T18:07:00Z", BLUE_JAYS, false, "Rogers Centre", ["YES Network", "Sportsnet"], "Final", 8, 4, true),
  makeGame(747004, "2026-03-22T17:05:00Z", RED_SOX, true, YANKEE_STADIUM, ["YES Network"], "Final", 7, 1, true),
  makeGame(747005, "2026-03-23T17:05:00Z", RED_SOX, true, YANKEE_STADIUM, ["YES Network", "ESPN"], "Final", 3, 4, false),
  makeGame(747006, "2026-03-24T19:35:00Z", RED_SOX, true, YANKEE_STADIUM, ["YES Network"], "Final", 5, 2, true),
  makeGame(747007, "2026-03-25T18:10:00Z", ORIOLES, false, "Camden Yards", ["YES Network", "MASN"], "Final", 4, 6, false),

  // --- UPCOMING GAMES ---
  makeGame(747008, "2026-03-26T23:05:00Z", ORIOLES, false, "Camden Yards", ["YES Network", "MASN"], "Preview"),
  makeGame(747009, "2026-03-27T23:05:00Z", ORIOLES, false, "Camden Yards", ["YES Network"], "Preview"),
  makeGame(747010, "2026-03-28T17:05:00Z", RAYS, true, YANKEE_STADIUM, ["YES Network"], "Preview"),
  makeGame(747011, "2026-03-29T17:05:00Z", RAYS, true, YANKEE_STADIUM, ["YES Network", "ESPN"], "Preview"),
  makeGame(747012, "2026-03-30T17:05:00Z", RAYS, true, YANKEE_STADIUM, ["YES Network"], "Preview"),
  makeGame(747013, "2026-04-01T23:10:00Z", TIGERS, false, "Comerica Park", ["YES Network"], "Preview"),
  makeGame(747014, "2026-04-02T23:10:00Z", TIGERS, false, "Comerica Park", ["YES Network", "FS1"], "Preview"),
  makeGame(747015, "2026-04-03T23:10:00Z", TIGERS, false, "Comerica Park", ["YES Network"], "Preview"),
  makeGame(747016, "2026-04-04T17:05:00Z", TWINS, true, YANKEE_STADIUM, ["YES Network"], "Preview"),
  makeGame(747017, "2026-04-05T17:05:00Z", TWINS, true, YANKEE_STADIUM, ["YES Network", "ESPN"], "Preview"),
  makeGame(747018, "2026-04-06T17:05:00Z", TWINS, true, YANKEE_STADIUM, ["YES Network"], "Preview"),
  makeGame(747019, "2026-04-07T23:10:00Z", ASTROS, false, "Minute Maid Park", ["YES Network", "Apple TV+"], "Preview"),
  makeGame(747020, "2026-04-08T23:10:00Z", ASTROS, false, "Minute Maid Park", ["YES Network", "Apple TV+"], "Preview"),
  makeGame(747021, "2026-04-09T23:10:00Z", ASTROS, false, "Minute Maid Park", ["YES Network", "FS1"], "Preview"),
  makeGame(747022, "2026-04-11T17:05:00Z", RANGERS, true, YANKEE_STADIUM, ["YES Network"], "Preview"),
  makeGame(747023, "2026-04-12T17:05:00Z", RANGERS, true, YANKEE_STADIUM, ["YES Network"], "Preview"),
  makeGame(747024, "2026-04-13T17:05:00Z", RANGERS, true, YANKEE_STADIUM, ["YES Network", "ESPN"], "Preview"),
  makeGame(747025, "2026-04-14T23:10:00Z", ANGELS, false, "Angel Stadium", ["YES Network"], "Preview"),
  makeGame(747026, "2026-04-15T23:10:00Z", ANGELS, false, "Angel Stadium", ["YES Network"], "Preview"),
  makeGame(747027, "2026-04-16T23:10:00Z", ANGELS, false, "Angel Stadium", ["YES Network", "Apple TV+"], "Preview"),
  makeGame(747028, "2026-04-18T17:05:00Z", ATHLETICS, true, YANKEE_STADIUM, ["YES Network"], "Preview"),
  makeGame(747029, "2026-04-19T17:05:00Z", ATHLETICS, true, YANKEE_STADIUM, ["YES Network"], "Preview"),
  makeGame(747030, "2026-04-20T17:05:00Z", ATHLETICS, true, YANKEE_STADIUM, ["YES Network", "ESPN"], "Preview"),
  makeGame(747031, "2026-04-22T23:10:00Z", CUBS, false, "Wrigley Field", ["YES Network", "Peacock"], "Preview"),
  makeGame(747032, "2026-04-23T23:10:00Z", CUBS, false, "Wrigley Field", ["YES Network"], "Preview"),
  makeGame(747033, "2026-04-25T17:05:00Z", METS, true, YANKEE_STADIUM, ["YES Network", "SNY", "ESPN"], "Preview"),
  makeGame(747034, "2026-04-26T17:05:00Z", METS, true, YANKEE_STADIUM, ["YES Network", "SNY"], "Preview"),
  makeGame(747035, "2026-04-28T23:10:00Z", PHILLIES, false, "Citizens Bank Park", ["YES Network", "NBC Sports Philadelphia"], "Preview"),
  makeGame(747036, "2026-04-29T23:10:00Z", PHILLIES, false, "Citizens Bank Park", ["YES Network"], "Preview"),
  makeGame(747037, "2026-04-30T23:10:00Z", PHILLIES, false, "Citizens Bank Park", ["YES Network", "FS1"], "Preview"),
  makeGame(747038, "2026-05-01T23:10:00Z", BRAVES, false, "Truist Park", ["YES Network"], "Preview"),
  makeGame(747039, "2026-05-02T23:10:00Z", BRAVES, false, "Truist Park", ["YES Network", "TBS"], "Preview"),
  makeGame(747040, "2026-05-03T23:10:00Z", BRAVES, false, "Truist Park", ["YES Network"], "Preview"),
  makeGame(747041, "2026-05-05T23:10:00Z", DODGERS, false, "Dodger Stadium", ["YES Network", "Fox"], "Preview"),
  makeGame(747042, "2026-05-06T23:10:00Z", DODGERS, false, "Dodger Stadium", ["YES Network", "Apple TV+"], "Preview"),
];

export function getMockUpcomingGames(page: number, pageSize: number): { games: Game[]; totalGames: number } {
  const upcoming = MOCK_GAMES.filter(g => g.status.abstractGameState !== "Final");
  const start = page * pageSize;
  return {
    games: upcoming.slice(start, start + pageSize),
    totalGames: upcoming.length,
  };
}

export function getMockCompletedGames(page: number, pageSize: number): { games: Game[]; totalGames: number } {
  const completed = MOCK_GAMES.filter(g => g.status.abstractGameState === "Final").reverse();
  const start = page * pageSize;
  return {
    games: completed.slice(start, start + pageSize),
    totalGames: completed.length,
  };
}
