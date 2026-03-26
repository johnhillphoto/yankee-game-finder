import type { Metadata } from "next";
import NavLinks from "@/components/NavLinks";
import "./globals.css";

export const metadata: Metadata = {
  title: "NY Yankees Game Finder",
  description: "Find upcoming and past NY Yankees games, broadcast info, and scores",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <header className="site-header">
          <div className="header-inner">
            <div className="header-brand">
              <span className="header-logo" aria-label="Yankees logo">⚾</span>
              <h1 className="header-title">NY Yankees Game Finder</h1>
            </div>
            <NavLinks />
          </div>
        </header>
        <main className="site-main">{children}</main>
        <footer className="site-footer">
          <p>Game data provided by <a href="https://statsapi.mlb.com" target="_blank" rel="noopener noreferrer" className="footer-link">MLB Stats API</a></p>
        </footer>
      </body>
    </html>
  );
}
