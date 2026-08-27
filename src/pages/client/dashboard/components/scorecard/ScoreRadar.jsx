import { SCORE_CATEGORIES } from "../../data/scorecardData";

const SIZE = 180;
const CENTER = SIZE / 2;
const RADIUS = 62;
const MAX = 5;

const point = (index, value) => {
  const angle = (Math.PI * 2 * index) / SCORE_CATEGORIES.length - Math.PI / 2;
  const r = (Math.max(value, 0) / MAX) * RADIUS;

  return [CENTER + r * Math.cos(angle), CENTER + r * Math.sin(angle)];
};

const toPath = (values) =>
  values.map((v, i) => point(i, v).join(",")).join(" ");

const ScoreRadar = ({ categories }) => {
  const values = SCORE_CATEGORIES.map((c) => categories[c.key] ?? 0);

  return (
    <section className="rounded-xl border color-border bg-white p-4">
      <h3 className="text-xs font-semibold tracking-wide text-muted uppercase">
        Score Breakdown
      </h3>

      <svg
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        className="mx-auto mt-2 h-45 w-45"
        role="img"
        aria-label="Category score breakdown"
      >
        {[1, 2, 3, 4, 5].map((ring) => (
          <polygon
            key={ring}
            points={toPath(SCORE_CATEGORIES.map(() => ring))}
            fill="none"
            stroke="var(--color-border)"
            strokeWidth="1"
          />
        ))}

        {SCORE_CATEGORIES.map((category, index) => {
          const [x, y] = point(index, MAX);

          return (
            <line
              key={category.key}
              x1={CENTER}
              y1={CENTER}
              x2={x}
              y2={y}
              stroke="var(--color-border)"
              strokeWidth="1"
            />
          );
        })}

        <polygon
          points={toPath(values)}
          fill="var(--color-bg-primary)"
          stroke="var(--color-primary)"
          strokeWidth="2"
        />

        {values.map((value, index) => {
          const [x, y] = point(index, value);

          return (
            <circle
              key={SCORE_CATEGORIES[index].key}
              cx={x}
              cy={y}
              r="3"
              fill="var(--color-primary)"
            />
          );
        })}

        {SCORE_CATEGORIES.map((category, index) => {
          const [x, y] = point(index, MAX + 1.1);

          return (
            <text
              key={category.key}
              x={x}
              y={y}
              textAnchor="middle"
              dominantBaseline="middle"
              fill="var(--color-text-secondary)"
              fontSize="8"
            >
              {category.shortLabel}
            </text>
          );
        })}
      </svg>
    </section>
  );
};

export default ScoreRadar;
