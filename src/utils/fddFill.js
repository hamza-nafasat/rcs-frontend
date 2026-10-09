// how an applicant's own copy reads
const MY_FILL_STATUS = {
  filled: { label: "Filled", pill: "bg-blue-50 text-blue-700", dot: "bg-blue-500" },
  pending: { label: "Not filled", pill: "bg-amber-50 text-amber-700", dot: "bg-amber-500" },
};

const fillStatusOf = (myFill) => (myFill ? MY_FILL_STATUS.filled : MY_FILL_STATUS.pending);

// a redo is allowed inside the first day
const canFillAgain = (myFill) => !myFill || Boolean(myFill?.isEditable);

const dayWord = (days) => `${days} day${days === 1 ? "" : "s"}`;

// where an applicant stands on his document
const FDD_SIGN_STATUS = {
  not_signed: { label: "Not signed", color: "#dc2626" },
  signed: { label: "Signed", color: "#f97316" },
  pending: { label: "Pending", color: "#3b82f6" },
  approved: { label: "Approved", color: "#22c55e" },
  rejected: { label: "Rejected", color: "#dc2626" },
};

const signStatusOf = (wait) => FDD_SIGN_STATUS[wait?.status] ?? FDD_SIGN_STATUS.not_signed;

// an admin judges it only once the wait is over
const canReviewFill = (wait) => Boolean(wait?.isWaitOver);

// shown only while the clock runs
const waitLabelOf = (wait) => (wait && !wait?.isWaitOver ? `${dayWord(wait?.daysRemaining)} left` : "");

export {
  canFillAgain,
  canReviewFill,
  dayWord,
  FDD_SIGN_STATUS,
  fillStatusOf,
  MY_FILL_STATUS,
  signStatusOf,
  waitLabelOf,
};
