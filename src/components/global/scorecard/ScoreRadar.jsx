import { SCORE_CATEGORIES } from "../../../utils/pipelineScorecard";

const SIZE = 230;
const CENTER = SIZE / 2;
const RADIUS = 62;
const MAX = 5;
const RINGS = [1, 2, 3, 4, 5];
const LABEL_GAP = 1.15;

const point = (index, value) => {
  const angle = (Math.PI * 2 * index) / SCORE_CATEGORIES.length - Math.PI / 2;
  const r = (Math.max(value, 0) / MAX) * RADIUS;

  return [CENTER + r * Math.cos(angle), CENTER + r * Math.sin(angle)];
};

const toPath = (values) => values.map((value, index) => point(index, value).join(",")).join(" ");

const ScoreRadar = ({ categories, className = "" }) => {
  const values = SCORE_CATEGORIES.map((category) => categories[category.key] ?? 0);

  return (
    <section className={`rounded-xl bg-active p-4 ${className}`}>
      <h3 className="text-xs font-semibold tracking-wide text-secondary uppercase">Score Breakdown</h3>

      <svg
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        className="mx-auto mt-2 h-55 w-55"
        role="img"
        aria-label="Category score breakdown"
      >
        {RINGS.map((ring) => (
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

        {/* the scored point on each axis */}
        {values.map((value, index) => {
          const [x, y] = point(index, value);

          return <circle key={SCORE_CATEGORIES[index].key} cx={x} cy={y} r="3" fill="var(--color-primary)" />;
        })}

        {SCORE_CATEGORIES.map((category, index) => {
          const [x, y] = point(index, MAX * LABEL_GAP);
          const value = values[index];

          return (
            <g key={category.key}>
              <text
                x={x}
                y={y - 4}
                textAnchor="middle"
                dominantBaseline="middle"
                fill="var(--color-text-secondary)"
                fontSize="9"
              >
                {category.shortLabel}
              </text>

              {/* the exact score on the axis */}
              <text
                x={x}
                y={y + 7}
                textAnchor="middle"
                dominantBaseline="middle"
                fill="var(--color-primary)"
                fontSize="10"
                fontWeight="700"
              >
                {value.toFixed(1)}
              </text>
            </g>
          );
        })}
      </svg>
    </section>
  );
};

export default ScoreRadar;
