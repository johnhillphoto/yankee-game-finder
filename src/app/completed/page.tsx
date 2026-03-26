import CompletedGames from "@/components/CompletedGames";
import PageHeader from "@/components/PageHeader";

export default function CompletedPage() {
  return (
    <div className="page-container">
      <PageHeader title="Completed Games" subtitleType="completed" />
      <CompletedGames />
    </div>
  );
}
