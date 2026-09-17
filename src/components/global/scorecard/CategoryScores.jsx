import ProgressBar from "../../shared/ProgressBar";

const MAX = 5;

// definitions come from the calling module
const CategoryScores = ({ categories, definitions = [], className = "" }) => {
  return (
    <section className={`rounded-xl border color-border bg-white p-4 ${className}`}>
      <h3 className="text-sm font-semibold text-tertiary">Category Scores</h3>

      <div className="mt-3 flex flex-col gap-3">
        {definitions.map((category) => {
          const value = categories[category.key] ?? 0;

          return (
            <div key={category.key} className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-secondary">
                  {category.label} ({category.weight}%)
                </span>

                <span className="font-medium text-tertiary">
                  {value.toFixed(1)}
                </span>
              </div>

              <ProgressBar
                value={(value / MAX) * 100}
                color={category.color}
              />
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default CategoryScores;
