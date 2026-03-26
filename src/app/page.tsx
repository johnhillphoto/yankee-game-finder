import UpcomingGames from "@/components/UpcomingGames";
import PageHeader from "@/components/PageHeader";

export default function HomePage() {
  return (
    <div className="page-container">
      <PageHeader title="Upcoming Games" subtitleType="upcoming" />
      <UpcomingGames />
    </div>
  );
}
