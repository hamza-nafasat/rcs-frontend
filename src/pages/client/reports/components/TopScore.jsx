import Card from "../../../../components/shared/Card";
import ProgressBar from "../../../../components/shared/ProgressBar";

const TopScore = ({ applicants = [] }) => {
  const top = applicants.reduce(
    (best, row) => (!best || row.score > best.score ? row : best),
    null,
  );

  const score = top?.score ?? 0;

  return (
    <Card className="h-full">
      <h3 className="text-sm font-semibold text-tertiary">Top Score</h3>
      <p className="mt-3 text-3xl font-bold text-tertiary">
        {score.toFixed(1)}
      </p>
      <p className="mt-1 text-sm text-secondary">{top?.name ?? "—"}</p>
      <div className="mt-4">
        <ProgressBar value={score} color="var(--color-primary)" />
      </div>
    </Card>
  );
};

export default TopScore;
