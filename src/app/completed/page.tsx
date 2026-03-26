import CompletedGames from "@/components/CompletedGames";

export default function CompletedPage() {
  return (
    <div className="page-container">
      <div className="page-header">
        <h2 className="page-title">Completed Games</h2>
        <p className="page-subtitle">
          Results and scores from recent New York Yankees games
        </p>
      </div>
      <CompletedGames />
    </div>
  );
}
