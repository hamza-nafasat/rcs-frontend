import { PIPELINE_STAGES } from "./pipelineStage";

const OUTCOME_COLORS = ["#047857", "#DC2626", "#EAB308"];

// up or down against last month
const formatChange = (change = 0) => `${change >= 0 ? "↑" : "↓"} ${Math.abs(change)}% vs last month`;

// stage counts as outcome doughnut
const buildOutcome = (stages = {}) => {
  const approved = stages[PIPELINE_STAGES.APPROVED] ?? 0;
  const denied = stages[PIPELINE_STAGES.DENIED] ?? 0;
  const total = Object.values(stages).reduce((sum, count) => sum + count, 0);

  return {
    labels: ["Approved", "Denied", "Pending"],
    data: [approved, denied, total - approved - denied],
    colors: OUTCOME_COLORS,
  };
};

const plural = (count, word) => `${count} ${word}${count === 1 ? "" : "s"}`;

// today plus yesterday's activity
const dashboardSubheading = (stats) => {
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  if (!stats) return today;

  const leads = plural(stats.leadsYesterday ?? 0, "lead");
  const messages = plural(stats.unreadMessages ?? 0, "message");
  return `${today} · You had ${leads} yesterday and ${messages} awaiting response.`;
};

export { buildOutcome, dashboardSubheading, formatChange };
