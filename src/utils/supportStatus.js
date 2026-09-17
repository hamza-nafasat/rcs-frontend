// how each status reads and looks
const SUPPORT_STATUS = {
  in_progress: { label: "In Progress", pill: "bg-amber-50 text-amber-700", dot: "bg-amber-500" },
  resolved: { label: "Resolved", pill: "bg-green-50 text-green-700", dot: "bg-green-500" },
  closed: { label: "Closed", pill: "bg-gray-100 text-gray-600", dot: "bg-gray-400" },
};

const SUPPORT_STATUSES = {
  IN_PROGRESS: "in_progress",
  RESOLVED: "resolved",
  CLOSED: "closed",
};

const SUPPORT_STATUS_OPTIONS = Object.entries(SUPPORT_STATUS).map(([value, { label }]) => ({ value, label }));

// how each priority reads and looks
const SUPPORT_PRIORITY = {
  Low: { pill: "bg-blue-50 text-blue-700", dot: "bg-blue-500" },
  Medium: { pill: "bg-amber-50 text-amber-700", dot: "bg-amber-500" },
  High: { pill: "bg-orange-50 text-orange-700", dot: "bg-orange-500" },
  Critical: { pill: "bg-red-50 text-red-700", dot: "bg-red-500" },
};

const SUPPORT_PRIORITY_OPTIONS = Object.keys(SUPPORT_PRIORITY);

const SUPPORT_CATEGORY_OPTIONS = ["Technical Support", "Billing", "Account", "Documents", "General"];

// only an open ticket can change
const isEditableTicket = (ticket) => ticket?.status === SUPPORT_STATUSES.IN_PROGRESS;

export {
  isEditableTicket,
  SUPPORT_CATEGORY_OPTIONS,
  SUPPORT_PRIORITY,
  SUPPORT_PRIORITY_OPTIONS,
  SUPPORT_STATUS,
  SUPPORT_STATUS_OPTIONS,
  SUPPORT_STATUSES,
};
