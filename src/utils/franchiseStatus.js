const FRANCHISE_STATUSES = { PENDING: "pending", APPROVED: "approved", REJECTED: "rejected" };

// how each status reads and looks
const FRANCHISE_STATUS = {
  pending: { label: "Pending", color: "#f97316", bg: "#fff7ed" },
  approved: { label: "Approved", color: "#22c55e", bg: "#f0fdf4" },
  rejected: { label: "Rejected", color: "#dc2626", bg: "#fef2f2" },
};

const FRANCHISE_STATUS_OPTIONS = Object.entries(FRANCHISE_STATUS).map(([value, { label }]) => ({ value, label }));

// an unknown status still renders
const franchiseStatusOf = (status) => FRANCHISE_STATUS[status] ?? FRANCHISE_STATUS.pending;

export { franchiseStatusOf, FRANCHISE_STATUS, FRANCHISE_STATUS_OPTIONS, FRANCHISE_STATUSES };
