import UpcomingGames from "@/components/UpcomingGames";

export default function HomePage() {
  return (
    <div className="page-container">
      <div className="page-header">
        <h2 className="page-title">Upcoming Games</h2>
        <p className="page-subtitle">
          Stay up to date with the New York Yankees schedule
        </p>
      </div>
      <UpcomingGames />
    </div>
  );
}
