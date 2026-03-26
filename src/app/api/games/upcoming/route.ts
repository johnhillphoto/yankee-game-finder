import { NextRequest, NextResponse } from "next/server";
import { fetchUpcomingGames } from "@/lib/mlb-api";
import { getMockUpcomingGames } from "@/lib/mock-data";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const page = parseInt(searchParams.get("page") ?? "0", 10);
  const pageSize = parseInt(searchParams.get("pageSize") ?? "5", 10);

  try {
    const data = await fetchUpcomingGames(page, pageSize);
    return NextResponse.json(data);
  } catch (error) {
    console.error("MLB API unavailable, using mock data:", error);
    const data = getMockUpcomingGames(page, pageSize);
    return NextResponse.json({ ...data, usingMockData: true });
  }
}
