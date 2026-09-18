import DataTable from "react-data-table-component";
import Card from "../../../../components/shared/Card";
import Badge from "../../../../components/shared/Badge";
import { getRecommendation } from "../../../../utils/pipelineScorecard";
import { scoreColor, stageOf } from "../../../../utils/pipelineStage";

const categoryValue = (row, key) => (row?.scores?.[key] ?? 0).toFixed(1);

const submittedOn = (row) =>
  row?.createdAt ? new Date(row.createdAt).toLocaleDateString() : "—";

const customStyles = {
  table: {
    style: {
      backgroundColor: "transparent",
    },
  },
  headRow: {
    style: {
      backgroundColor: "transparent",
      borderBottomWidth: "1px",
      borderBottomColor: "var(--color-border)",
      minHeight: "44px",
    },
  },
  headCells: {
    style: {
      paddingLeft: "16px",
      paddingRight: "16px",
      fontSize: "11px",
      fontWeight: 600,
      letterSpacing: "0.04em",
      textTransform: "uppercase",
      color: "var(--color-text-muted)",
    },
  },
  cells: {
    style: {
      paddingLeft: "16px",
      paddingRight: "16px",
      fontSize: "14px",
    },
  },
  rows: {
    style: {
      minHeight: "64px",
      borderBottomColor: "var(--color-border)",
    },
  },
};

// one column per score category
const categoryColumn = (name, key) => ({
  name,
  selector: (row) => row?.scores?.[key] ?? 0,
  sortable: true,
  cell: (row) => (
    <span className="text-tertiary">{categoryValue(row, key)}</span>
  ),
});

const COLUMNS = [
  {
    name: "Applicant",
    grow: 2,
    minWidth: "200px",
    selector: (row) => row?.applicant?.fullName ?? "",
    sortable: true,
    cell: (row) => (
      <div className="min-w-0 py-1">
        <p className="truncate font-semibold text-tertiary">
          {row?.applicant?.fullName ?? "—"}
        </p>
        <p className="truncate text-xs text-muted">{submittedOn(row)}</p>
      </div>
    ),
  },
  {
    name: "Territory",
    minWidth: "140px",
    selector: (row) => row?.proposedTerritory ?? "",
    cell: (row) => (
      <span className="truncate text-secondary">
        {row?.proposedTerritory || "—"}
      </span>
    ),
  },
  {
    name: "Stage",
    width: "170px",
    selector: (row) => row?.stage,
    sortable: true,
    cell: (row) => {
      const { label, color } = stageOf(row?.stage);
      return <Badge text={label} dotColor={color} />;
    },
  },
  categoryColumn("Financial", "financial"),
  categoryColumn("Experience", "experience"),
  categoryColumn("Legal", "legal"),
  categoryColumn("Market", "market"),
  {
    name: "Total Score",
    selector: (row) => row?.scores?.total ?? 0,
    sortable: true,
    cell: (row) => {
      const total = row?.scores?.total ?? 0;
      return (
        <span className="font-semibold" style={{ color: scoreColor(total) }}>
          {total.toFixed(1)}
        </span>
      );
    },
  },
  {
    name: "Outcome",
    minWidth: "170px",
    selector: (row) => getRecommendation(row?.stage, row?.scores?.total).label,
    cell: (row) => {
      const { label, bg, text } = getRecommendation(
        row?.stage,
        row?.scores?.total,
      );
      return (
        <span
          className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${bg} ${text}`}
        >
          {label}
        </span>
      );
    },
  },
];

const DetailedReport = ({ applicants = [], isLoading = false }) => {
  return (
    <Card className="overflow-hidden rounded-2xl border color-border bg-white">
      <header className="flex items-center justify-between ">
        <h2 className="card-heading">Applicants Detailed Report</h2>
      </header>

      <section className="mt-6 overflow-hidden border-t color-border">
        <DataTable
          columns={COLUMNS}
          data={applicants}
          customStyles={customStyles}
          progressPending={isLoading}
          noDataComponent={
            <p className="py-8 text-sm text-muted">
              No applicants in this range
            </p>
          }
          highlightOnHover
          responsive
        />
      </section>
    </Card>
  );
};

export default DetailedReport;
