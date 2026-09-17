import { PIPELINE_STAGE } from "../../../utils/pipelineStage";

const StageSelector = ({ value, onChange, disabled = false, className = "" }) => {
  return (
    <section className={`flex flex-col gap-2 ${className}`}>
      <h3 className="text-sm font-semibold text-tertiary">Application Stage</h3>

      {Object.entries(PIPELINE_STAGE).map(([stage, { label, color }]) => {
        const active = stage === value;

        return (
          <button
            key={stage}
            type="button"
            disabled={disabled}
            onClick={() => onChange?.(stage)}
            className={`flex w-full cursor-pointer items-center gap-3 rounded-xl border px-3 py-2 text-left text-sm transition disabled:cursor-not-allowed disabled:opacity-60 ${
              active ? "border-green-500 bg-green-50 text-tertiary" : "color-border bg-white text-secondary hover:bg-muted"
            }`}
          >
            <span
              className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2"
              style={{ borderColor: color }}
            >
              {active && <span className="h-2 w-2 rounded-full" style={{ backgroundColor: color }} />}
            </span>

            {label}
          </button>
        );
      })}
    </section>
  );
};

export default StageSelector;
