import { Star } from "lucide-react";
import Card from "../../../../components/shared/Card";
import { APPROVE_SCORE, CONDITIONAL_SCORE } from "../../../../utils/pipelineScorecard";

const SCORE_CATEGORIES = [
  {
    label: "Financial Strength",
    weight: "35%",
    description: "Liquid capital, net worth, credit score",
    color: "var(--color-primary)",
  },
  {
    label: "Business Experience",
    weight: "20%",
    description: "Years operating, industry background, multi-unit exp",
    color: "var(--color-info)",
  },
  {
    label: "Legal & Background",
    weight: "20%",
    description: "Bankruptcy, litigation, criminal, non-compete",
    color: "var(--color-legal)",
  },
  {
    label: "Market & Location",
    weight: "25%",
    description: "Territory availability, competitive density",
    color: "var(--color-market)",
  },
];

// the same cutoffs the scorecard uses
const SCORE_LEGEND = [
  { label: "Approve", value: `≥ ${APPROVE_SCORE}`, pillClass: "bg-market text-market" },
  { label: "Conditional", value: `${CONDITIONAL_SCORE}–${APPROVE_SCORE - 1}`, pillClass: "bg-moderator text-moderator" },
  { label: "Deny", value: `< ${CONDITIONAL_SCORE}`, pillClass: "bg-(--color-text-remove)/10 text-remove" },
];

const ScoreCategory = ({ category }) => (
  <section className="rounded-xl bg-muted p-3">
    <div className="flex items-start justify-between gap-2">
      <h3 className="text-sm font-semibold text-tertiary">{category.label}</h3>
      <p className="shrink-0 text-sm font-bold" style={{ color: category.color }}>
        {category.weight}
      </p>
    </div>
    <p className="mt-1 text-xs text-card-subheading">{category.description}</p>
  </section>
);

const ScoreLegendItem = ({ item }) => (
  <p className="flex items-center gap-2">
    <span>{item.label}:</span>
    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${item.pillClass}`}>{item.value}</span>
  </p>
);

const DashboardApplicantsScored = () => (
  <Card>
    <header className="mb-4 flex items-center gap-2">
      <Star size={16} className="text-primary" />
      <h2 className="card-heading">How Your Applicants Are Scored</h2>
    </header>

    <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {SCORE_CATEGORIES.map((category) => (
        <ScoreCategory key={category.label} category={category} />
      ))}
    </section>

    <footer className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-secondary">
      {SCORE_LEGEND.map((item) => (
        <ScoreLegendItem key={item.label} item={item} />
      ))}
    </footer>
  </Card>
);

export default DashboardApplicantsScored;
