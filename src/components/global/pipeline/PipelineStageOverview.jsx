import { PIPELINE_STAGE } from "../../../utils/pipelineStage";

// count applications per stage
const countByStage = (applications = []) =>
  applications.reduce((counts, application) => {
    const stage = application?.stage;
    return { ...counts, [stage]: (counts[stage] ?? 0) + 1 };
  }, {});

const PipelineStageOverview = ({ applications = [], className = "" }) => {
  const counts = countByStage(applications);

  return (
    <section className={`flex flex-col gap-4 rounded-2xl bg-white p-5 shadow-sm ${className}`}>
      <h2 className="heading-lg text-tertiary">Pipeline Stage Overview</h2>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {Object.entries(PIPELINE_STAGE).map(([stage, { label, color, bg }]) => (
          <div
            key={stage}
            style={{ backgroundColor: bg }}
            className="flex flex-col items-center justify-center rounded-xl p-5 text-center"
          >
            <h3 className="text-2xl font-semibold" style={{ color }}>
              {counts[stage] ?? 0}
            </h3>
            <p className="mt-1 text-sm" style={{ color }}>
              {label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default PipelineStageOverview;
