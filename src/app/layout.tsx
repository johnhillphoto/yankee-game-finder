import type { Metadata } from "next";
import { cookies } from "next/headers";
import { TeamProvider } from "@/lib/team-context";
import { getTeamById, DEFAULT_TEAM_ID } from "@/lib/mlb-teams";
import NavLinks from "@/components/NavLinks";
import HeaderBrand from "@/components/HeaderBrand";
import TeamSelector from "@/components/TeamSelector";
import "./globals.css";

export const metadata: Metadata = {
  title: "MLB Game Finder",
  description: "Find upcoming and past MLB games, broadcast info, and scores",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const teamIdCookie = cookieStore.get("selected_team_id");
  const initialTeamId = teamIdCookie
    ? parseInt(teamIdCookie.value, 10)
    : DEFAULT_TEAM_ID;
  const initialTeam = getTeamById(initialTeamId) ?? getTeamById(DEFAULT_TEAM_ID)!;

  const teamStyle = {
    "--team-primary": initialTeam.primaryColor,
    "--team-primary-light": initialTeam.primaryLight,
    "--team-primary-dark": initialTeam.primaryDark,
    "--team-secondary": initialTeam.secondaryColor,
  } as React.CSSProperties;

  return (
    <html lang="en" style={teamStyle}>
      <body>
        <TeamProvider initialTeamId={initialTeamId}>
          <header className="site-header">
            <div className="header-inner">
              <HeaderBrand />
              <div className="header-right">
                <NavLinks />
                <TeamSelector />
              </div>
            </div>
          </header>
          <main className="site-main">{children}</main>
          <footer className="site-footer">
            <p>
              Game data provided by{" "}
              <a
                href="https://statsapi.mlb.com"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-link"
              >
                MLB Stats API
              </a>
            </p>
          </footer>
        </TeamProvider>
      </body>
    </html>
  );
}
