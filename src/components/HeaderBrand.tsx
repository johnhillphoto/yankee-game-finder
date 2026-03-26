"use client";

import { useTeam } from "@/lib/team-context";

export default function HeaderBrand() {
  const { team } = useTeam();
  return (
    <div className="header-brand">
      <span className="header-logo" aria-label="baseball">⚾</span>
      <h1 className="header-title">{team.shortName} Game Finder</h1>
    </div>
  );
}
