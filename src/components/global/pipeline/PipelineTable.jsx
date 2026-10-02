import DataTable from "../DataTable";
import { MapPin } from "lucide-react";
import Avatar from "../../shared/Avatar";
import ProgressBar from "../../shared/ProgressBar";
import { scoreColor, stageOf } from "../../../utils/pipelineStage";

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
          <p className="wrap-break-word font-medium text-tertiary">{applicantName(row)}</p>
          <p className="wrap-break-word text-xs text-muted">{row?.applicant?.email ?? "—"}</p>
        </div>
      </div>
    ),
  },
  {
    name: "Franchise",
    selector: (row) => row?.franchiseName ?? "",
    sortable: true,
    cell: (row) => <span className="min-w-0 wrap-break-word text-secondary">{row?.franchiseName ?? "—"}</span>,
  },
  {
    name: "Territory",
    selector: (row) => row?.proposedTerritory ?? "",
    sortable: true,
    cell: (row) => (
      <div className="flex items-center gap-1.5 text-secondary">
        <MapPin size={14} className="shrink-0 text-muted" />
        <span className="min-w-0 wrap-break-word">{row?.proposedTerritory ?? "—"}</span>
      </div>
    ),
  },
  {
    name: "Stage",
    selector: (row) => row?.stage,
    sortable: true,
    width: "200px",
    cell: (row) => {
      const { label, color, bg } = stageOf(row?.stage);
      return (
        <span
          className="inline-flex w-44 items-center justify-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium whitespace-nowrap"
          style={{ color, borderColor: color, backgroundColor: bg }}
        >
          <span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ backgroundColor: color }} />
          {label}
        </span>
      );
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

const PipelineTable = ({
  applications = [],
  isLoading = false,
  heading = "Applicant Scorecard",
  onRowClick,
  className = "",
}) => (
  <section className={`flex flex-col gap-4 ${className}`}>
    <h2 className="heading-lg text-tertiary">{heading}</h2>

    <section className="overflow-hidden rounded-2xl border color-border bg-white">
      <DataTable
        columns={buildColumns()}
        data={applications}
        isLoading={isLoading}
        variant="plain"
        pagination
        pointerOnHover
        onRowClicked={(row) => onRowClick?.(row)}
        noDataComponent={<p className="py-8 text-sm text-secondary">No applications yet</p>}
      />
    </section>
  </section>
);

export default PipelineTable;
