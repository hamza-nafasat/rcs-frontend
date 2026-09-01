import { STAGES, STAGE_COLORS } from "./scorecardData";

const StageSelector = ({ value, onChange }) => {
  return (
    <section className="flex flex-col gap-2">
      <h3 className="text-sm font-semibold text-gray-900">Application Stage</h3>

      {STAGES.map((stage) => {
        const active = stage === value;

        return (
          <button
            key={stage}
            type="button"
            onClick={() => onChange(stage)}
            className={`flex w-full cursor-pointer items-center gap-3 rounded-lg border px-3 py-2 text-left text-sm transition ${
              active
                ? "border-green-500 bg-green-50 text-gray-900"
                : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
            }`}
          >
            <span
              className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2"
              style={{ borderColor: STAGE_COLORS[stage] }}
            >
              {active && (
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: STAGE_COLORS[stage] }}
                />
              )}
            </span>

            {stage}
          </button>
        );
      })}
    </section>
  );
};

export default StageSelector;
