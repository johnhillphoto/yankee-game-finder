import { NextRequest, NextResponse } from "next/server";
import { fetchUpcomingGames, YANKEES_TEAM_ID } from "@/lib/mlb-api";
import { getMockUpcomingGames } from "@/lib/mock-data";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const page = parseInt(searchParams.get("page") ?? "0", 10);
  const pageSize = parseInt(searchParams.get("pageSize") ?? "5", 10);
  const teamId = parseInt(
    searchParams.get("teamId") ?? String(YANKEES_TEAM_ID),
    10
  );

  try {
    const data = await fetchUpcomingGames(teamId, page, pageSize);
    return NextResponse.json(data);
  } catch (error) {
    console.error("MLB API unavailable:", error);
    // Only use mock data for the Yankees
    if (teamId === YANKEES_TEAM_ID) {
      const data = getMockUpcomingGames(page, pageSize);
      return NextResponse.json({ ...data, usingMockData: true });
    }
    return NextResponse.json(
      { error: "Failed to load games. Please try again later." },
      { status: 503 }
    );
  }
}
