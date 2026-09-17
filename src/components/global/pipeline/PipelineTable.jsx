import DataTable from "react-data-table-component";
import { MapPin } from "lucide-react";
import Avatar from "../../shared/Avatar";
import Badge from "../../shared/Badge";
import ProgressBar from "../../shared/ProgressBar";
import { scoreColor, stageOf } from "../../../utils/pipelineStage";

const customStyles = {
  table: { style: { backgroundColor: "transparent" } },
  headRow: { style: { borderBottomWidth: "1px", borderBottomColor: "var(--color-border)", minHeight: "44px" } },
  headCells: {
    style: {
      paddingLeft: "20px",
      paddingRight: "20px",
      fontSize: "11px",
      fontWeight: 600,
      letterSpacing: "0.04em",
      textTransform: "uppercase",
      color: "var(--color-text-muted)",
    },
  },
  cells: { style: { paddingLeft: "20px", paddingRight: "20px", fontSize: "14px" } },
  rows: { style: { minHeight: "64px", borderBottomColor: "var(--color-border)" } },
};

const money = (value) => (value == null ? "—" : `$${Number(value).toLocaleString()}`);

const applicantName = (row) => row?.applicant?.fullName ?? "—";

const buildColumns = () => [
  {
    name: "Applicant",
    grow: 2,
    selector: (row) => applicantName(row),
    cell: (row) => (
      <div className="flex items-center gap-3 py-1">
        <Avatar name={applicantName(row)} size={36} rounded="rounded-lg" />
        <div className="min-w-0">
          <p className="truncate font-medium text-tertiary">{applicantName(row)}</p>
          <p className="truncate text-xs text-muted">{row?.applicant?.email ?? "—"}</p>
        </div>
      </div>
    ),
  },
  {
    name: "Franchise",
    selector: (row) => row?.franchiseName ?? "",
    sortable: true,
    cell: (row) => <span className="truncate text-secondary">{row?.franchiseName ?? "—"}</span>,
  },
  {
    name: "Territory",
    selector: (row) => row?.proposedTerritory ?? "",
    sortable: true,
    cell: (row) => (
      <div className="flex items-center gap-1.5 text-secondary">
        <MapPin size={14} className="shrink-0 text-muted" />
        <span className="truncate">{row?.proposedTerritory ?? "—"}</span>
      </div>
    ),
  },
  {
    name: "Stage",
    selector: (row) => row?.stage,
    sortable: true,
    width: "160px",
    cell: (row) => {
      const { label, color } = stageOf(row?.stage);
      return <Badge text={label} dotColor={color} />;
    },
  },
  {
    name: "Score",
    selector: (row) => row?.scores?.total ?? 0,
    sortable: true,
    width: "120px",
    cell: (row) => {
      const total = row?.scores?.total ?? 0;
      const color = scoreColor(total);

      return (
        <section className="flex w-full flex-col gap-1 py-1">
          <span className="text-sm font-semibold" style={{ color }}>
            {total.toFixed(1)}
          </span>
          <ProgressBar value={total} color={color} />
        </section>
      );
    },
  },
  {
    name: "Liquid Capital",
    selector: (row) => row?.liquidCapital ?? 0,
    sortable: true,
    cell: (row) => <span className="text-secondary">{money(row?.liquidCapital)}</span>,
  },
  {
    name: "Submitted",
    selector: (row) => row?.createdAt,
    sortable: true,
    cell: (row) => <span className="text-secondary">{new Date(row?.createdAt).toLocaleDateString()}</span>,
  },
];

const PipelineTable = ({ applications = [], isLoading = false, onRowClick, className = "" }) => (
  <section className={`flex flex-col gap-4 ${className}`}>
    <h2 className="heading-lg text-tertiary">Applicant Scorecard</h2>

    <section className="overflow-hidden rounded-2xl border color-border bg-white">
      <DataTable
        columns={buildColumns()}
        data={applications}
        keyField="_id"
        progressPending={isLoading}
        customStyles={customStyles}
        pagination
        highlightOnHover
        pointerOnHover
        onRowClicked={(row) => onRowClick?.(row)}
        noDataComponent={<p className="py-8 text-sm text-secondary">No applications yet</p>}
      />
    </section>
  </section>
);

export default PipelineTable;
