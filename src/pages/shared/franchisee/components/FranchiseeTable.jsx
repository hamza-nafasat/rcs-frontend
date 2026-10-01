import DataTable from "../../../../components/global/DataTable";
import { Eye, MapPin } from "lucide-react";
import Avatar from "../../../../components/shared/Avatar";
import Badge from "../../../../components/shared/Badge";
import { franchiseStatusOf } from "../../../../utils/franchiseStatus";
import { formatPhone } from "../../../../utils/formatPhone";

const fullName = (row) => `${row?.firstName ?? ""} ${row?.lastName ?? ""}`.trim() || "—";

const CLIENT_COLUMN = {
  name: "Client",
  selector: (row) => row?.clientName ?? "",
  sortable: true,
  minWidth: "160px",
  cell: (row) => <span className="truncate text-tablecell">{row?.clientName ?? "—"}</span>,
};

const buildColumns = ({ onView, showClient }) => [
  {
    name: "Applicant",
    selector: (row) => fullName(row),
    sortable: true,
    grow: 2,
    minWidth: "220px",
    cell: (row) => (
      <div className="flex items-center gap-3 py-1">
        <Avatar name={fullName(row)} size={34} rounded="rounded-lg" />
        <div className="min-w-0">
          <p className="truncate font-medium text-tertiary">{fullName(row)}</p>
          <p className="truncate text-xs text-muted">{row?.email}</p>
        </div>
      </div>
    ),
  },
  ...(showClient ? [CLIENT_COLUMN] : []),
  {
    name: "Phone",
    selector: (row) => row?.phone ?? "",
    minWidth: "170px",
    cell: (row) => <span className="whitespace-nowrap text-tablecell">{formatPhone(row?.phone) || "—"}</span>,
  },
  {
    name: "Location",
    selector: (row) => row?.city ?? "",
    sortable: true,
    minWidth: "160px",
    cell: (row) => {
      const location = [row?.city, row?.state].filter(Boolean).join(", ");
      if (!location) return <span className="text-muted">—</span>;

      return (
        <span className="flex min-w-0 items-center gap-1.5 text-tablecell">
          <MapPin size={14} className="shrink-0 text-muted" />
          <span className="truncate">{location}</span>
        </span>
      );
    },
  },
  {
    name: "Franchise Status",
    selector: (row) => row?.franchiseStatus,
    sortable: true,
    minWidth: "150px",
    cell: (row) => {
      const { label, color } = franchiseStatusOf(row?.franchiseStatus);
      return <Badge text={label} dotColor={color} />;
    },
  },
  {
    name: "Applied On",
    selector: (row) => row?.createdAt,
    sortable: true,
    minWidth: "130px",
    cell: (row) => <span className="text-tablecell">{new Date(row?.createdAt).toLocaleDateString()}</span>,
  },
  {
    name: <div className="pr-5">Actions</div>,
    width: "90px",
    right: true,
    cell: (row) => (
      <div className="flex w-full items-center justify-center">
        <button
          type="button"
          onClick={() => onView?.(row)}
          aria-label={`View ${fullName(row)}`}
          className="rounded-lg p-2 text-muted transition hover:bg-active hover:text-primary"
        >
          <Eye size={18} />
        </button>
      </div>
    ),
    ignoreRowClick: true,
    allowOverflow: true,
    button: true,
  },
];

const FranchiseeTable = ({ franchisees = [], isLoading = false, showClient = false, onView, className = "" }) => (
  <section className={className}>
    <DataTable
      columns={buildColumns({ onView, showClient })}
      data={franchisees}
      isLoading={isLoading}
      variant="boxed"
      pagination
      striped
      noDataComponent={<p className="py-8 text-sm text-secondary">No applicants yet</p>}
    />
  </section>
);

export default FranchiseeTable;
