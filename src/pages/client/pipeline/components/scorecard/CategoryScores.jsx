import ProgressBar from "../../../../../components/shared/ProgressBar";
import { SCORE_CATEGORIES } from "../../data/scorecardData";

const MAX = 5;

const CategoryScores = ({ categories }) => {
  return (
    <section className="rounded-xl border border-gray-200 bg-white p-4">
      <h3 className="text-sm font-semibold text-gray-900">Category Scores</h3>

      <div className="mt-3 flex flex-col gap-3">
        {SCORE_CATEGORIES.map((category) => {
          const value = categories[category.key] ?? 0;

          return (
            <div key={category.key} className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-600">
                  {category.label} ({category.weight}%)
                </span>

                <span className="font-medium text-gray-900">
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
