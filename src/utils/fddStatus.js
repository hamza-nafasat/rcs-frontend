// how each FDD status reads and looks, the values the api stores
// pending until the client fills it, approved once an admin accepts it
const FDD_STATUS = {
  pending: { label: "Pending", pill: "bg-amber-50 text-amber-700", dot: "bg-amber-500" },
  filled: { label: "Filled", pill: "bg-blue-50 text-blue-700", dot: "bg-blue-500" },
  approved: { label: "Approved", pill: "bg-green-50 text-green-700", dot: "bg-green-500" },
};

const FDD_STATUS_OPTIONS = Object.entries(FDD_STATUS).map(([value, { label }]) => ({ value, label }));

export { FDD_STATUS, FDD_STATUS_OPTIONS };
