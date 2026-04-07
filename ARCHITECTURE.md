# Architecture Overview — MLB Game Finder

## 1. Feature Inventory

### Global / Persistent
| Feature | Description |
|---|---|
| **Team Selector** | `<select>` dropdown in the sticky header listing all 30 MLB teams grouped by division. Changing the selection instantly reloads both pages with data for the new team. |
| **Team-Themed UI** | Four CSS custom properties (`--team-primary`, `--team-primary-light`, `--team-primary-dark`, `--team-secondary`) are set on `<html>` at SSR time from a cookie and updated client-side via `applyTeamColors()` whenever the user switches teams. Every color in the UI derives from these variables. |
| **Persistent Team Preference** | Selected team ID is stored in a `selected_team_id` cookie (1-year max-age, SameSite=Lax, Secure on HTTPS). On next visit the server reads the cookie and pre-renders the correct team colors with zero flash. |
| **Sticky Header** | Site header is `position: sticky; top: 0; z-index: 100` — always visible while scrolling. Contains the brand logo, dynamic team name, nav links, and team selector. |
| **Mock Data Fallback** | When the MLB Stats API is unreachable, the server routes fall back to a hard-coded 2026 Yankees schedule (completed and upcoming). A dismissible info banner is shown to the user when mock data is in use. |

### `/` — Upcoming Games Page
| Feature | Description |
|---|---|
| **Upcoming Game List** | Chronological list of games with `abstractGameState !== "Final"` for the selected team. |
| **"Next Game" Feature Card** | The first game in the list receives a visually distinct dark-themed card with a "⚾ Next Game" label. |
| **Live Game Badge** | If a game's `abstractGameState === "Live"`, a pulsing red `● LIVE` badge is shown on the card. |
| **Home/Away Badge** | Each card shows a styled `HOME` or `AWAY` badge. |
| **Broadcast Info** | All English-language broadcast channels (network names) are rendered as pill badges on each card. If no broadcasts are available, "TBD" is shown. |
| **Venue** | Stadium name with 📍 icon on each card. |
| **Infinite Scroll** | Initial load fetches 6 games; subsequent pages fetch 5 at a time as the user scrolls to the bottom (`IntersectionObserver` with 200 px root margin). |
| **Game Count Footer** | Shows "Showing X of Y upcoming games" once data is loaded. |
| **Error State** | Red error banner if the API call fails and no mock fallback is available (non-Yankees teams). |
| **Empty State** | Friendly message when no upcoming games are found. |

### `/completed` — Completed Games Page
| Feature | Description |
|---|---|
| **Completed Game List** | Games with `abstractGameState === "Final"` for the selected team, most-recent first. |
| **Scores** | `GameCard` renders `showScore={true}`, displaying the numeric score for both teams beside team names. |
| **Win/Loss Badge** | A green `W` or red `L` badge shows the result from the selected team's perspective. |
| **Home/Away Badge** | Same as Upcoming. |
| **Broadcast Info** | Same as Upcoming. |
| **Venue** | Same as Upcoming. |
| **Infinite Scroll** | Pages of 20 games. |
| **Game Count Footer** | Shows "Showing X of Y completed games". |
| **Error / Empty States** | Same patterns as Upcoming. |

---

## 2. Navigation Structure

```
/ (root layout — layout.tsx)
│
├── <Header>
│   ├── HeaderBrand          (⚾ + dynamic team name)
│   ├── NavLinks             (Upcoming Games | Completed Games)
│   └── TeamSelector         (30-team dropdown grouped by division)
│
├── /                        → Upcoming Games (page.tsx)
│   └── UpcomingGames        (client component, fetches /api/games/upcoming)
│
└── /completed               → Completed Games (completed/page.tsx)
    └── CompletedGames       (client component, fetches /api/games/completed)
```

Both pages share the same `RootLayout`. There is no nested routing or dynamic segment. All navigation is handled by Next.js `<Link>` with `usePathname`-based active-link highlighting.

---

## 3. Data Dependencies Per Page

### `/` — Upcoming Games

| Dependency | Detail |
|---|---|
| **Internal API** | `GET /api/games/upcoming?page=&pageSize=&teamId=` |
| **MLB Stats API (server-side)** | `GET https://statsapi.mlb.com/api/v1/schedule?sportId=1&teamId=…&startDate=today&endDate=+6mo&gameType=R,F,D,L,W&hydrate=broadcasts(all),linescore,team` |
| **Fallback** | `getMockUpcomingGames()` from `src/lib/mock-data.ts` (Yankees-only) |
| **State** | `games[]`, `page`, `loading`, `hasMore`, `error`, `usingMockData`, `totalGames`, `loadedCount` |
| **Re-fetch trigger** | `team.id` change resets and reloads from page 0 |
| **Caching** | Next.js `fetch` cache with `revalidate: 300` (5 minutes) on the MLB API call |

### `/completed` — Completed Games

| Dependency | Detail |
|---|---|
| **Internal API** | `GET /api/games/completed?page=&pageSize=&teamId=` |
| **MLB Stats API (server-side)** | `GET https://statsapi.mlb.com/api/v1/schedule?sportId=1&teamId=…&startDate=March 1 (current year)&endDate=today&gameType=R,F,D,L,W&hydrate=broadcasts(all),linescore,team` |
| **Fallback** | `getMockCompletedGames()` from `src/lib/mock-data.ts` (Yankees-only) |
| **State** | `games[]`, `page`, `loading`, `hasMore`, `error`, `usingMockData`, `totalGames` |
| **Re-fetch trigger** | `team.id` change |
| **Caching** | Same `revalidate: 300` |

### Both Pages — Shared Context

| Dependency | Source |
|---|---|
| `team` object (id, name, colors) | `TeamContext` (React Context, client-side) |
| `initialTeamId` | `selected_team_id` cookie read at SSR in `layout.tsx` |
| Team list + divisions | Static data in `src/lib/mlb-teams.ts` (bundled, no network call) |

---

## 4. MLB Stats API Usage

The app **does not use an official MLB JS SDK**. It calls the publicly accessible MLB Stats REST API directly via `fetch`.

### Endpoint Called

```
GET https://statsapi.mlb.com/api/v1/schedule
```

### Query Parameters

| Parameter | Value | Notes |
|---|---|---|
| `sportId` | `1` | MLB (major leagues) |
| `teamId` | dynamic | Any of the 30 team IDs |
| `startDate` | ISO date | Today (upcoming) or March 1 of current year (completed) |
| `endDate` | ISO date | +6 months (upcoming) or today (completed) |
| `gameType` | `R,F,D,L,W` | Regular, Final series, Division, League, World Series |
| `hydrate` | `broadcasts(all),linescore,team` | Embeds broadcast and score data in the response |

### Fields Consumed from Response

```
data.dates[].games[]:
  gamePk          — unique game ID (used as React key)
  gameDate        — ISO datetime string
  status.abstractGameState  — "Preview" | "Live" | "Final"
  status.detailedState      — human-readable status
  status.statusCode         — single-letter code
  teams.home/away.team.id   — to derive isHome / opponent
  teams.home/away.team.name
  teams.home/away.team.abbreviation
  teams.home/away.score     — present only when Live or Final
  teams.home/away.isWinner  — present only when Final
  venue.name
  broadcasts[].name
  broadcasts[].type
  broadcasts[].language
  broadcasts[].isNational
```

### Pagination Model

The MLB API is called **without server-side pagination** — the full date range is fetched in one request, filtered in memory (`Final` vs non-`Final`), reversed if needed, then sliced by `page` / `pageSize` in the Next.js route handler. This means the MLB API receives one call per user request (or hits the 5-minute Next.js cache).

---

## 5. Implicit Assumptions & Notes

### No Real-Time / Polling
- There is **no WebSocket, SSE, or polling** in the app.
- The client makes a fetch call on mount and on each infinite-scroll trigger. Live game data is only updated if the user navigates away and back, or manually refreshes.
- The pulsing `● LIVE` badge is purely cosmetic — the data behind it is not refreshed automatically.
- The Next.js server caches MLB API responses for **5 minutes** (`revalidate: 300`), so even a manual refresh may serve stale data.

### Team Color Flash Prevention
- SSR reads the cookie and injects team CSS variables inline on `<html style="...">` before any JS executes. This eliminates a flash of the default Yankees palette on first paint for users with a saved preference.

### Season-Date Hardcoding
- The completed-games query assumes the season starts **March 1** of the current calendar year (`new Date(today.getFullYear(), 2, 1)`). This will silently miss games in February (opening series) or return an empty season range between November and February.

### Mock Data is Yankees-Only
- For any team other than the Yankees (ID 147), a failed MLB API call returns HTTP 503 with an error message rather than falling back to mock data. The mock dataset is a hard-coded 2026 Yankees schedule.

### Game Types
- `gameType=R,F,D,L,W` covers Regular Season, Final Series, Division Series, League Championship, and World Series. Spring Training (`S`) and All-Star (`A`) are excluded.

### Broadcast Deduplication & Language Filter
- Only broadcasts with `language === "en"` are shown. Duplicates are removed with an indexOf comparison. Non-English broadcasts (e.g., Spanish-language) are silently dropped.

### CSS-Only Responsive Design
- A single `@media (max-width: 600px)` breakpoint adjusts padding, font sizes, and layout. No JavaScript-based responsive logic exists.

---

## 6. Notes Relevant for a Mobile Port

### Positive Starting Points
- The layout is already responsive down to 600 px. The game card, header, and team selector all reflow to single-column.
- The team-color theming system (4 CSS variables) maps cleanly to a design token system in React Native / SwiftUI / Jetpack Compose.
- The data layer is thin: two internal REST endpoints (`/api/games/upcoming`, `/api/games/completed`) that return a typed `{ games: Game[], totalGames: number }` payload — trivial to consume from a mobile client.
- `GameCard` is a pure display component with no internal state; it translates 1-for-1 to a mobile list cell.
- The `IntersectionObserver` infinite-scroll pattern maps to `FlatList.onEndReached` (React Native) or `LazyColumn` (Compose).

### Things to Rethink for Mobile

| Issue | Recommendation |
|---|---|
| **No real-time updates** | Mobile users expect live scores to update. Add polling (e.g., every 30 s) or a WebSocket/SSE feed for in-progress games. Consider a push notification surface for game-start alerts. |
| **Server-side pagination gap** | The current backend fetches the entire season range from MLB and paginates in memory. At scale this is inefficient. Add cursor-based or offset pagination at the MLB API call level. |
| **Mock data is Yankees-only** | A mobile port targeting all 30 teams needs mock/offline data for all teams, or a more graceful degraded offline state (e.g., cached last-known schedule). |
| **Cookie-based team persistence** | Cookies don't exist in native mobile. Replace with `AsyncStorage` / `SharedPreferences` / `UserDefaults`. |
| **CSS custom-property theming** | Replace CSS variables with a JS/TS theme object (already partially available in `mlb-teams.ts` as `primaryColor`, `secondaryColor`, etc.) that is passed through a theme provider. |
| **Season-start date assumption** | Derive the actual season start from the MLB API's first returned game date rather than hardcoding March 1. |
| **Broadcast "TBD" fallback** | Consider surfacing a "No broadcast info yet" state more explicitly on mobile, where screen space is at a premium. |
| **No deep-linking / game detail** | There is no individual game detail page. A mobile port would benefit from a game detail screen (play-by-play, box score) using additional MLB Stats API endpoints (`/game/{gamePk}/feed/live`). |
| **No team logos** | The app uses only team names and abbreviations. MLB Stats API provides team logo URLs; adding them would significantly improve mobile visual identity. |
| **Accessibility** | The team selector has an `aria-label` but game cards have no semantic roles or screen-reader hints. A mobile port should add accessible labels from the start. |
