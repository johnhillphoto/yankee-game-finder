"use client";

import { useTeam } from "@/lib/team-context";
import { DIVISIONS } from "@/lib/mlb-teams";

export default function TeamSelector() {
  const { team, setTeamId } = useTeam();

  return (
    <select
      className="team-selector"
      value={team.id}
      onChange={(e) => setTeamId(parseInt(e.target.value, 10))}
      aria-label="Select MLB team"
    >
      {DIVISIONS.map((division) => (
        <optgroup key={division.name} label={division.name}>
          {division.teams.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </optgroup>
      ))}
    </select>
  );
}
