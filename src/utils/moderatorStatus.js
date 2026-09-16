// how each status reads and looks
const MODERATOR_STATUS = {
  active: { label: "Active", pill: "bg-green-50 text-green-700", dot: "bg-green-500" },
  inactive: { label: "Inactive", pill: "bg-gray-100 text-gray-600", dot: "bg-gray-400" },
};

const MODERATOR_STATUS_OPTIONS = Object.entries(MODERATOR_STATUS).map(([value, { label }]) => ({ value, label }));

export { MODERATOR_STATUS, MODERATOR_STATUS_OPTIONS };
