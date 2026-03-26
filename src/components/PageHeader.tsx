"use client";

import { useTeam } from "@/lib/team-context";

interface PageHeaderProps {
  title: string;
  subtitleType: "upcoming" | "completed";
}

export default function PageHeader({ title, subtitleType }: PageHeaderProps) {
  const { team } = useTeam();
  const subtitle =
    subtitleType === "upcoming"
      ? `Stay up to date with the ${team.name} schedule`
      : `Results and scores from recent ${team.name} games`;
  return (
    <div className="page-header">
      <h2 className="page-title">{title}</h2>
      <p className="page-subtitle">{subtitle}</p>
    </div>
  );
}
