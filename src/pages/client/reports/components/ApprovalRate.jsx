import Card from "../../../../components/shared/Card";
import ProgressBar from "../../../../components/shared/ProgressBar";

const ApprovalRate = ({ applicants = [] }) => {
  const approvedCount = applicants.filter(
    (row) => row.stage === "Approved",
  ).length;
  const rate = applicants.length
    ? Math.round((approvedCount / applicants.length) * 100)
    : 0;

  return (
    <Card className="h-full">
      <h3 className="text-sm font-semibold text-tertiary">Approval Rate</h3>
      <p className="mt-3 text-3xl font-bold text-tertiary">{rate}%</p>
      <p className="mt-1 text-sm text-secondary">of applicants approved</p>
      <div className="mt-4">
        <ProgressBar value={rate} color="var(--color-border)" />
      </div>
    </Card>
  );
};

export default ApprovalRate;
