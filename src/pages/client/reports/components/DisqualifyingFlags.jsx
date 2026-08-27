import Card from "../../../../components/shared/Card";

const FLAG_LABELS = ["Bankruptcy (7+ yrs)", "Pending Litigation"];

const DisqualifyingFlags = ({ count = 0 }) => {
  return (
    <Card className="h-full">
      <h3 className="text-sm font-semibold text-tertiary">
        Disqualifying Flags
      </h3>
      <p className="mt-3 text-3xl font-bold text-tertiary">{count}</p>
      <p className="mt-1 text-sm text-secondary">applicants with flags</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {FLAG_LABELS.map((label) => (
          <span
            key={label}
            className="rounded-full bg-(--color-text-remove)/10 px-2.5 py-0.5 text-[11px] font-medium text-remove"
          >
            {label}
          </span>
        ))}
      </div>
    </Card>
  );
};

export default DisqualifyingFlags;
