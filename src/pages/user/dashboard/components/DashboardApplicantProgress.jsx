import { CheckCircle2, Circle } from "lucide-react";

export const PIPELINE_STAGES = [
  { label: "New Application", color: "#2563eb", bg: "#eff6ff" },
  { label: "Document Collection", color: "#06b6d4", bg: "#ecfeff" },
  { label: "Under Review", color: "#f97316", bg: "#fff7ed" },
  { label: "Committee Review", color: "#a855f7", bg: "#faf5ff" },
  { label: "Agreement", color: "#22c55e", bg: "#f0fdf4" },
  { label: "Approved", color: "#047857", bg: "#e6f4ea" },
  { label: "Assign Location", color: "#ac24eb", bg: "#faf1ff" },
];

const DashboardApplicantProgress = ({
  currentStage = "New Application",
}) => {
  const activeIndex = PIPELINE_STAGES.findIndex(
    (s) => s.label.toLowerCase() === currentStage?.toLowerCase(),
  );
  const currentIndex = activeIndex === -1 ? 0 : activeIndex;

  return (
    <section className="flex flex-col gap-4 rounded-2xl bg-white p-4 sm:p-5 shadow-sm border border-gray-100">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        <div>
          <h2 className="heading-lg text-tertiary">Application Progress</h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Track your franchise request journey across pipeline stages
          </p>
        </div>


      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-7 gap-3">
        {PIPELINE_STAGES.map((stage, idx) => {
          const isCurrent = idx === currentIndex;
          const isCompleted = idx < currentIndex;

          if (isCurrent) {
            return (
              <div
                key={stage.label}
                style={{ backgroundColor: stage.bg, borderColor: stage.color }}
                className="relative flex flex-col justify-between items-center rounded-xl p-3 min-h-[92px] h-full text-center border-2 shadow-sm transition-all w-full"
              >
                <div className="h-6 flex items-center justify-center w-full">
                  <span
                    className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white shadow-2xs"
                    style={{ color: stage.color }}
                  >
                    Active
                  </span>
                </div>
                <div className="flex-1 flex items-center justify-center w-full py-1">
                  <p
                    className="text-xs font-bold leading-tight"
                    style={{ color: stage.color }}
                  >
                    {stage.label}
                  </p>
                </div>
              </div>
            );
          }

          if (isCompleted) {
            return (
              <div
                key={stage.label}
                className="relative flex flex-col justify-between items-center rounded-xl p-3 min-h-[92px] h-full text-center border border-emerald-200 bg-emerald-50/70 text-emerald-800 transition-all w-full"
              >
                <div className="h-6 flex items-center justify-center w-full">
                  <CheckCircle2 size={18} className="text-emerald-600" />
                </div>
                <div className="flex-1 flex items-center justify-center w-full py-1">
                  <p className="text-xs font-semibold text-emerald-900 leading-tight">
                    {stage.label}
                  </p>
                </div>
              </div>
            );
          }

          return (
            <div
              key={stage.label}
              className="relative flex flex-col justify-between items-center rounded-xl p-3 min-h-[92px] h-full text-center border border-gray-200 bg-gray-50 text-gray-400 transition-all opacity-70 w-full"
            >
              <div className="h-6 flex items-center justify-center w-full">
                <Circle size={15} className="text-gray-300" />
              </div>
              <div className="flex-1 flex items-center justify-center w-full py-1">
                <p className="text-xs font-medium text-gray-400 leading-tight">
                  {stage.label}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default DashboardApplicantProgress;
