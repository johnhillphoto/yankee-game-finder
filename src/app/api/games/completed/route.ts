import { NextRequest, NextResponse } from "next/server";
import { fetchCompletedGames } from "@/lib/mlb-api";
import { getMockCompletedGames } from "@/lib/mock-data";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const page = parseInt(searchParams.get("page") ?? "0", 10);
  const pageSize = parseInt(searchParams.get("pageSize") ?? "20", 10);

  try {
    const data = await fetchCompletedGames(page, pageSize);
    return NextResponse.json(data);
  } catch (error) {
    console.error("MLB API unavailable, using mock data:", error);
    const data = getMockCompletedGames(page, pageSize);
    return NextResponse.json({ ...data, usingMockData: true });
  }
}
