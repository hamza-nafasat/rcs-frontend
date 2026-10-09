// how an applicant's own copy reads
const MY_FILL_STATUS = {
  filled: { label: "Filled", pill: "bg-blue-50 text-blue-700", dot: "bg-blue-500" },
  pending: { label: "Not filled", pill: "bg-amber-50 text-amber-700", dot: "bg-amber-500" },
};

const fillStatusOf = (myFill) => (myFill ? MY_FILL_STATUS.filled : MY_FILL_STATUS.pending);

// a redo is allowed inside the first day
const canFillAgain = (myFill) => !myFill || Boolean(myFill?.isEditable);

const dayWord = (days) => `${days} day${days === 1 ? "" : "s"}`;

// what the waiting period reads as
const waitLabelOf = (wait) => {
  if (!wait) return "Not filled";
  return wait?.isWaitOver ? "Ready to proceed" : `${dayWord(wait?.daysRemaining)} left`;
};

export { canFillAgain, dayWord, fillStatusOf, MY_FILL_STATUS, waitLabelOf };
