// how each stage reads and looks
const PIPELINE_STAGE = {
  new_application: { label: "New Application", color: "#2563eb", bg: "#eff6ff" },
  document_collection: { label: "Document Collection", color: "#06b6d4", bg: "#ecfeff" },
  under_review: { label: "Under Review", color: "#f97316", bg: "#fff7ed" },
  payment_processing: { label: "Payment Processing", color: "#a855f7", bg: "#faf5ff" },
  agreement: { label: "Agreement", color: "#22c55e", bg: "#f0fdf4" },
  approved: { label: "Approved", color: "#047857", bg: "#0478571C" },
  assign_location: { label: "Assign Location", color: "#ac24eb", bg: "#faf1ff" },
  denied: { label: "Denied", color: "#d92e2e", bg: "#ffeded" },
};

const PIPELINE_STAGES = {
  NEW_APPLICATION: "new_application",
  DOCUMENT_COLLECTION: "document_collection",
  UNDER_REVIEW: "under_review",
  PAYMENT_PROCESSING: "payment_processing",
  AGREEMENT: "agreement",
  APPROVED: "approved",
  ASSIGN_LOCATION: "assign_location",
  DENIED: "denied",
};

const PIPELINE_STAGE_OPTIONS = Object.entries(PIPELINE_STAGE).map(([value, { label }]) => ({ value, label }));

// an unknown stage still renders
const stageOf = (stage) => PIPELINE_STAGE[stage] ?? PIPELINE_STAGE.new_application;

// green, amber or red by score
const scoreColor = (score = 0) => {
  if (score >= 75) return "#22c55e";
  if (score >= 50) return "#f97316";
  return "#dc2626";
};

export { PIPELINE_STAGE, PIPELINE_STAGE_OPTIONS, PIPELINE_STAGES, scoreColor, stageOf };
