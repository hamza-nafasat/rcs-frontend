export const STAGES = [
  "Approved",
  "Committee Review",
  "New Application",
  "Under Review",
  "Conditionally Approved",
  "Document Collection",
];

export const STAGE_COLORS = {
  Approved: "var(--color-revenue)",
  "Committee Review": "var(--color-info)",
  "New Application": "var(--color-info)",
  "Under Review": "var(--color-primary)",
  "Conditionally Approved": "var(--color-text-moderator)",
  "Document Collection": "var(--color-text-muted)",
};

export const CATEGORY_ICON_COLORS = {
  financial: "var(--color-primary)",
  experience: "var(--color-text-info)",
  legal: "var(--color-legal)",
  market: "var(--color-market)",
};

export const SCORE_CATEGORIES = [
  {
    key: "financial",
    label: "Financial Strength",
    shortLabel: "Financial",
    weight: 35,
    color: "var(--color-primary)",
  },
  {
    key: "experience",
    label: "Business Experience",
    shortLabel: "Experience",
    weight: 20,
    color: "var(--color-info)",
  },
  {
    key: "legal",
    label: "Legal & Background",
    shortLabel: "Legal",
    weight: 20,
    color: "var(--color-success)",
  },
  {
    key: "market",
    label: "Market & Location Fit",
    shortLabel: "Market",
    weight: 25,
    color: "var(--color-revenue)",
  },
];

export const getRecommendation = (stage, score) => {
  if (stage === "Approved" || score >= 80) {
    return {
      code: "APPROVE",
      label: "Approve",
      pillLabel: "Approve",
      mark: "✓",
      note: "Strong profile across all scoring categories. Top candidate.",
      color: "var(--color-revenue)",
      bg: "bg-revenue",
      text: "text-revenue",
    };
  }

  if (stage === "Conditionally Approved" || score >= 60) {
    return {
      code: "CONDITIONAL",
      label: "Conditional Approve",
      pillLabel: "Conditional",
      mark: "",
      note: "Meets minimums but requires committee review before approval.",
      color: "var(--color-text-moderator)",
      bg: "bg-moderator",
      text: "text-moderator",
    };
  }

  return {
    code: "DENY",
    label: "Deny",
    pillLabel: "Deny",
    mark: "✘",
    note: "Score below threshold or disqualifying flag present.",
    color: "var(--color-text-remove)",
    bg: "bg-(--color-text-remove)/10",
    text: "text-remove",
  };
};

export const buildScorecard = (row) => {
  const score = row.score ?? 0;

  return {
    id: row.id ?? "FR-001",
    name: row.name,
    company: row.company ?? "—",
    stage: row.stage,
    score,
    weighted: row.weighted ?? {
      financial: 0,
      experience: 0,
      legal: 0,
      market: 0,
    },
    categories: row.categories ?? {
      financial: 0,
      experience: 0,
      legal: 0,
      market: 0,
    },
    financialProfile: row.financialProfile ?? [],
    experience: row.experience ?? [],
    legal: row.legal ?? [],
    market: row.market ?? [],
  };
};
