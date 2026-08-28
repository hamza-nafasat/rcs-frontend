const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

const toNumber = (raw) => {
  const value = Number(raw);
  return raw === "" || Number.isNaN(value) ? null : value;
};

const average = (scores) =>
  scores.reduce((sum, score) => sum + score, 0) / scores.length;

const scoreAgainstMinimum = (raw, minimum, fullAt) => {
  const value = toNumber(raw);
  if (value === null || value < minimum) return 0;
  return clamp(((value - minimum) / (fullAt - minimum)) * 5, 0, 5);
};

const formatScore = (score) => score.toFixed(1);

export const YES_NO_OPTIONS = [
  { value: "Y", label: "Y", activeClassName: "bg-(--color-revenue) text-white" },
  { value: "N", label: "N", activeClassName: "bg-(--color-text-remove) text-white" },
];

export const DENSITY_OPTIONS = [
  { value: "low", label: "Low", activeClassName: "bg-(--color-revenue) text-white" },
  { value: "medium", label: "Medium", activeClassName: "bg-(--color-primary) text-white" },
  { value: "high", label: "High", activeClassName: "bg-(--color-text-remove) text-white" },
];

export const DENSITY_SCORES = { low: 5, medium: 3, high: 1 };

export const EMPTY_APPLICATION = {
  applicantName: "",
  companyName: "",
  proposedTerritory: "",
  city: "",
  state: "",
  liquidCapital: "",
  netWorth: "",
  creditScore: "",
  yearsMgmt: "",
  foodExp: "N",
  multiUnit: "N",
  bankruptcy: "N",
  litigation: "Y",
  criminal: "N",
  nonCompete: "N",
  territoryAvailable: "Y",
  density: "medium",
};

export const scoreApplication = (form) => {
  const liquid = scoreAgainstMinimum(form.liquidCapital, 75000, 225000);
  const netWorth = scoreAgainstMinimum(form.netWorth, 250000, 750000);
  const credit = scoreAgainstMinimum(form.creditScore, 680, 800);

  const yearsValue = toNumber(form.yearsMgmt);
  const years = yearsValue === null ? 0 : clamp(yearsValue * 0.5, 0, 5);
  const food = form.foodExp === "Y" ? 5 : 0;
  const multiUnit = form.multiUnit === "Y" ? 5 : 2;

  const bankruptcy = form.bankruptcy === "Y" ? 0 : 5;
  const litigation = form.litigation === "Y" ? 0 : 5;
  const criminal = form.criminal === "Y" ? 0 : 5;
  const nonCompete = form.nonCompete === "Y" ? 0 : 5;

  const territory = form.territoryAvailable === "Y" ? 5 : 0;
  const density = DENSITY_SCORES[form.density] ?? 0;

  const financial = average([liquid, netWorth, credit]);
  const experience = average([years, food, multiUnit]);
  const legal = average([bankruptcy, litigation, criminal, nonCompete]);
  const market = average([territory, density]);

  const total =
    (financial / 5) * 35 +
    (experience / 5) * 20 +
    (legal / 5) * 20 +
    (market / 5) * 25;

  return {
    liquid,
    netWorth,
    credit,
    years,
    total,
    formatted: {
      liquid: formatScore(liquid),
      netWorth: formatScore(netWorth),
      credit: formatScore(credit),
      years: formatScore(years),
      total: formatScore(total),
    },
  };
};
