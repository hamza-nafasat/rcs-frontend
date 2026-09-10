export const STAGES = [
  "New Application",
  "Document Collection",
  "Under Review",
  "Committee Review",
  "Agreement",
  "Approved",
  "Assign Location",
  "Denied",
];

export const STAGE_COLORS = {
  Approved: "#22c55e",
  "Committee Review": "#8b5cf6",
  "New Application": "#3b82f6",
  "Under Review": "#f97316",
  "Conditionally Approved": "#eab308",
  "Document Collection": "#6b7280",
};

export const SCORE_CATEGORIES = [
  { key: "financial", label: "Financial Strength", weight: 35, color: "#f97316" },
  { key: "experience", label: "Business Experience", weight: 20, color: "#22c55e" },
  { key: "legal", label: "Legal & Background", weight: 20, color: "#8b5cf6" },
  { key: "market", label: "Market & Location Fit", weight: 25, color: "#3b82f6" },
];

export const getRecommendation = (stage, score) => {
  if (stage === "Approved")
    return {
      code: "APPROVE",
      label: "Approve",
      note: "Approved by admin — applicant cleared for onboarding.",
      color: "#16a34a",
      bg: "bg-green-50",
      border: "border-green-200",
      text: "text-green-700",
    };

  if (stage === "Conditionally Approved")
    return {
      code: "CONDITIONAL",
      label: "Conditional Approve",
      note: "Approved with conditions — outstanding items must be cleared.",
      color: "#ca8a04",
      bg: "bg-yellow-50",
      border: "border-yellow-200",
      text: "text-yellow-700",
    };

  if (score >= 80)
    return {
      code: "APPROVE",
      label: "Approve",
      note: "Strong profile across all scoring categories. Top candidate.",
      color: "#16a34a",
      bg: "bg-green-50",
      border: "border-green-200",
      text: "text-green-700",
    };

  if (score >= 60)
    return {
      code: "CONDITIONAL",
      label: "Conditional Review",
      note: "Meets minimums but requires committee review before approval.",
      color: "#ca8a04",
      bg: "bg-yellow-50",
      border: "border-yellow-200",
      text: "text-yellow-700",
    };

  return {
    code: "DENY",
    label: "Deny",
    note: "Score below threshold or disqualifying flag present.",
    color: "#dc2626",
    bg: "bg-red-50",
    border: "border-red-200",
    text: "text-red-700",
  };
};

export const buildScorecard = (row) => {
  const score = row.score ?? 0;

  return {
    id: row.id ?? "FR-001",
    name: row.name,
    company: row.company ?? row.franchise ?? "—",
    stage: row.stage,
    score,
    categories: row.categories ?? {
      financial: Math.round(score / 20),
      experience: Math.round(score / 20),
      legal: Math.round(score / 20),
      market: Math.round(score / 20),
    },
    financialProfile: row.financialProfile ?? [
      { label: "Liquid Capital", value: row.financial ?? "$180K", hint: "Meets minimum", ok: true },
      { label: "Net Worth", value: "$620K", hint: "Meets minimum", ok: true },
      { label: "Credit Score", value: "760", hint: "Meets minimum", ok: true },
    ],
    experience: row.experience ?? [
      { label: "Years Mgmt", value: "12" },
      { label: "Food/Restaurant", value: "Yes" },
      { label: "Multi-Unit Op.", value: "Yes" },
    ],
    legal: row.legal ?? [
      { label: "Pending Litigation", value: "NO" },
      { label: "Criminal Background", value: "NO" },
      { label: "Non-Compete Conflict", value: "NO" },
    ],
    market: row.market ?? [
      { label: "Territory", value: "Available" },
      { label: "Competition", value: "Low" },
      { label: "Market Score", value: "5.0" },
    ],
  };
};
