const stages = [
  { value: "128", label: "New Application", color: "#2563eb", bg: "#eff6ff" },
  {
    value: "86",
    label: "Document Collection",
    color: "#06b6d4",
    bg: "#ecfeff",
  },
  { value: "54", label: "Under Review", color: "#f97316", bg: "#fff7ed" },
  { value: "31", label: "Committee Review", color: "#a855f7", bg: "#faf5ff" },
  { value: "18", label: "Approved", color: "#22c55e", bg: "#f0fdf4" },
  { value: "2", label: "Approved", color: "#047857", bg: "#0478571C" },
  { value: "3", label: "Assign Location", color: "#AC24EB", bg: "#FAF1FF" },
  { value: "4", label: "Denied", color: "#D92E2E", bg: "#FFEDED" },
];

const ClientPipelineStageOverview = () => {
  return (
    <section className="flex flex-col gap-4 rounded-2xl bg-white p-5 shadow-sm">
      <h2 className="heading-lg text-tertiary">Pipeline Stage Overview</h2>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {stages.map((stage) => (
          <div
            key={stage.label}
            style={{ backgroundColor: stage.bg }}
            className="flex flex-col items-center justify-center rounded-xl p-5 text-center"
          >
            <h3
              className="text-2xl font-semibold"
              style={{ color: stage.color }}
            >
              {stage.value}
            </h3>
            <p className="mt-1 text-sm" style={{ color: stage.color }}>
              {stage.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ClientPipelineStageOverview;
