import { SCORE_CATEGORIES } from "./scorecardData";

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
    <section className="rounded-xl border border-gray-200 bg-white p-4">
      <h3 className="text-xs font-semibold tracking-wide text-gray-500 uppercase">
        Score Radar
      </h3>

      <svg
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        className="mx-auto mt-2 h-45 w-45"
        role="img"
        aria-label="Category score radar"
      >
        {[1, 2, 3, 4, 5].map((ring) => (
          <polygon
            key={ring}
            points={toPath(SCORE_CATEGORIES.map(() => ring))}
            fill="none"
            stroke="#e5e7eb"
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
              stroke="#e5e7eb"
              strokeWidth="1"
            />
          );
        })}

        <polygon
          points={toPath(values)}
          fill="rgba(249, 115, 22, 0.25)"
          stroke="#f97316"
          strokeWidth="2"
        />

        {SCORE_CATEGORIES.map((category, index) => {
          const [x, y] = point(index, MAX + 1.1);

          return (
            <text
              key={category.key}
              x={x}
              y={y}
              textAnchor="middle"
              dominantBaseline="middle"
              className="fill-gray-500"
              fontSize="8"
            >
              {category.label.split(" ")[0]}
            </text>
          );
        })}
      </svg>
    </section>
  );
};

export default ScoreRadar;
