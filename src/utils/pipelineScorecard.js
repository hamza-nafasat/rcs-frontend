import { PIPELINE_STAGES, stageOf } from "./pipelineStage";

// what each section is worth
const SCORE_CATEGORIES = [
  { key: "financial", label: "Financial Strength", shortLabel: "Financial", weight: 35, color: "var(--color-primary)" },
  { key: "experience", label: "Business Experience", shortLabel: "Experience", weight: 20, color: "var(--color-info)" },
  { key: "legal", label: "Legal & Background", shortLabel: "Legal", weight: 20, color: "var(--color-success)" },
  { key: "market", label: "Market & Location Fit", shortLabel: "Market", weight: 25, color: "var(--color-revenue)" },
];

// mirrors the backend scoring ranges
const SCORE_MINIMUMS = { liquidCapital: 75000, netWorth: 250000, creditScore: 680 };

// agrees with the table score colors
const APPROVE_SCORE = 75;
const CONDITIONAL_SCORE = 50;

const RECOMMENDATIONS = {
  approve: {
    code: "APPROVE",
    label: "Approve",
    color: "var(--color-revenue)",
    bg: "bg-green-50",
    border: "border-green-200",
    text: "text-revenue",
  },
  conditional: {
    code: "CONDITIONAL",
    label: "Conditional Approve",
    color: "var(--color-text-moderator)",
    bg: "bg-moderator",
    border: "border-moderator",
    text: "text-moderator",
  },
  deny: {
    code: "DENY",
    label: "Deny",
    color: "var(--color-text-remove)",
    bg: "bg-(--color-text-remove)/10",
    border: "border-red-200",
    text: "text-remove",
  },
};

const money = (value) => (value == null ? "—" : `$${Number(value).toLocaleString()}`);

const plain = (value) => (value == null ? "—" : String(value).replace(/_/g, " "));

const isYes = (answer) => String(answer) === "yes";

// clean flags read as good
const flag = (label, answer, wantYes = false) => ({
  label,
  value: plain(answer),
  ok: wantYes ? isYes(answer) : !isYes(answer),
  hint: wantYes ? "required" : "no issues",
});

const meetsMinimum = (label, value, minimum, format = plain) => ({
  label,
  value: format(value),
  ok: Number(value) >= minimum,
  hint: `min ${format(minimum)}`,
});

// api shape to scorecard shape
const buildScorecard = (application) => ({
  id: application?._id ?? "—",
  name: application?.applicant?.fullName ?? "—",
  company: application?.franchiseName ?? "—",
  stage: application?.stage,
  score: application?.scores?.total ?? 0,
  categories: {
    financial: application?.scores?.financial ?? 0,
    experience: application?.scores?.experience ?? 0,
    legal: application?.scores?.legal ?? 0,
    market: application?.scores?.market ?? 0,
  },
  financialProfile: [
    meetsMinimum("Liquid Capital", application?.liquidCapital, SCORE_MINIMUMS.liquidCapital, money),
    meetsMinimum("Net Worth", application?.netWorth, SCORE_MINIMUMS.netWorth, money),
    meetsMinimum("Credit Score", application?.creditScore, SCORE_MINIMUMS.creditScore),
  ],
  experience: [
    { label: "Years Managing", value: plain(application?.yearsMgmt) },
    flag("Food Experience", application?.foodExp, true),
    flag("Multi Unit", application?.multiUnit, true),
  ],
  legal: [
    flag("Bankruptcy", application?.bankruptcy),
    flag("Litigation", application?.litigation),
    flag("Criminal", application?.criminal),
    flag("Non Compete", application?.nonCompete),
  ],
  market: [
    flag("Territory Open", application?.territoryAvailable, true),
    { label: "Density", value: plain(application?.density) },
  ],
});

// an admin decision outranks the score
const getRecommendation = (stage, score = 0) => {
  if (stage === PIPELINE_STAGES.DENIED) {
    return { ...RECOMMENDATIONS.deny, note: "Denied by an admin. The score no longer applies." };
  }

  if (stage === PIPELINE_STAGES.APPROVED) {
    return { ...RECOMMENDATIONS.approve, note: "Approved by an admin. Cleared for onboarding." };
  }

  if (score >= APPROVE_SCORE) {
    return { ...RECOMMENDATIONS.approve, note: `Strong across all categories at the ${stageOf(stage).label} stage.` };
  }

  if (score >= CONDITIONAL_SCORE) {
    return { ...RECOMMENDATIONS.conditional, note: "Meets the minimums but needs a review before approval." };
  }

  return { ...RECOMMENDATIONS.deny, note: "Scored below the threshold or carries a disqualifying flag." };
};

export { buildScorecard, getRecommendation, SCORE_CATEGORIES };
