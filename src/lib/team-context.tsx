"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import {
  getTeamById,
  DEFAULT_TEAM_ID,
  type MlbTeam,
} from "@/lib/mlb-teams";

const COOKIE_NAME = "selected_team_id";
const COOKIE_MAX_AGE = 365 * 24 * 60 * 60; // 1 year

interface TeamContextValue {
  team: MlbTeam;
  setTeamId: (id: number) => void;
}

const fallbackTeam = getTeamById(DEFAULT_TEAM_ID)!;

const TeamContext = createContext<TeamContextValue>({
  team: fallbackTeam,
  setTeamId: () => {},
});

function applyTeamColors(team: MlbTeam) {
  const root = document.documentElement;
  root.style.setProperty("--team-primary", team.primaryColor);
  root.style.setProperty("--team-primary-light", team.primaryLight);
  root.style.setProperty("--team-primary-dark", team.primaryDark);
  root.style.setProperty("--team-secondary", team.secondaryColor);
}

export function TeamProvider({
  children,
  initialTeamId,
}: {
  children: ReactNode;
  initialTeamId: number;
}) {
  const [teamId, setTeamIdState] = useState<number>(initialTeamId);

  const team = getTeamById(teamId) ?? fallbackTeam;

  useEffect(() => {
    applyTeamColors(team);
  }, [team]);

  const setTeamId = useCallback((id: number) => {
    setTeamIdState(id);
    document.cookie = `${COOKIE_NAME}=${id}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax`;
  }, []);

  return (
    <TeamContext.Provider value={{ team, setTeamId }}>
      {children}
    </TeamContext.Provider>
  );
}

export function useTeam() {
  return useContext(TeamContext);
}
