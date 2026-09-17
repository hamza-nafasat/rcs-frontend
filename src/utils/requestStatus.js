const REQUEST_STATUSES = { PENDING: "pending", FILLED: "filled", APPROVED: "approved" };

// how each status reads and looks
const REQUEST_STATUS = {
  pending: { label: "Pending", color: "#f97316", bg: "#fff7ed" },
  filled: { label: "Filled", color: "#2563eb", bg: "#eff6ff" },
  approved: { label: "Approved", color: "#22c55e", bg: "#f0fdf4" },
};

const REQUEST_STATUS_OPTIONS = Object.entries(REQUEST_STATUS).map(([value, { label }]) => ({ value, label }));

// an unknown status still renders
const statusOf = (status) => REQUEST_STATUS[status] ?? REQUEST_STATUS.pending;

export { REQUEST_STATUS, REQUEST_STATUS_OPTIONS, REQUEST_STATUSES, statusOf };
