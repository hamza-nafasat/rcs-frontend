import DataTable from "../../../../components/global/DataTable";
import { Eye, FileText, MapPin, MoreHorizontal } from "lucide-react";
import Avatar from "../../../../components/shared/Avatar";
import Badge from "../../../../components/shared/Badge";
import Button from "../../../../components/shared/Button";
import Dropdown from "../../../../components/shared/Dropdown";
import { franchiseStatusOf } from "../../../../utils/franchiseStatus";
import { canReviewFill, signStatusOf } from "../../../../utils/fddFill";
import { titleCase } from "../../../../utils/titleCase";

const fullName = (row) => `${row?.firstName ?? ""} ${row?.lastName ?? ""}`.trim() || "—";

const CLIENT_COLUMN = {
  name: "Client",
  selector: (row) => row?.clientName ?? "",
  sortable: true,
  minWidth: "160px",
  cell: (row) => <span className="min-w-0 wrap-break-word text-tablecell">{row?.clientName ?? "—"}</span>,
};

const buildColumns = ({ onView, onViewFdd, showClient }) => [
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
          <p className="wrap-break-word font-medium text-tertiary">{fullName(row)}</p>
          <p className="wrap-break-word text-xs text-muted">{row?.email}</p>
        </div>
      </div>
    ),
  },
  ...(showClient ? [CLIENT_COLUMN] : []),
  {
    name: "Location",
    selector: (row) => row?.city ?? "",
    sortable: true,
    minWidth: "160px",
    cell: (row) => {
      const location = [row?.city, titleCase(row?.state)].filter(Boolean).join(", ");
      if (!location) return <span className="text-muted">—</span>;

      return (
        <span className="flex min-w-0 items-center gap-1.5 text-tablecell">
          <MapPin size={14} className="shrink-0 text-muted" />
          <span className="min-w-0 wrap-break-word">{location}</span>
        </span>
      );
    },
  },
  {
    name: "FDD Status",
    selector: (row) => row?.fddWait?.status ?? "not_signed",
    sortable: true,
    minWidth: "160px",
    cell: (row) => {
      const { label, color } = signStatusOf(row?.fddWait);
      return <Badge text={label} dotColor={color} />;
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
        <Dropdown
          align="right"
          portalClassName="max-w-12"
          trigger={
            <Button variant="menuTrigger" aria-label={`Actions for ${fullName(row)}`}>
              <MoreHorizontal size={18} />
            </Button>
          }
        >
          <Button variant="menuItem" onClick={() => onView?.(row)}>
            <Eye size={16} className="mt-0.5" />
            View Franchisee
          </Button>

          {/* the signed copy is judged after the wait */}
          {canReviewFill(row?.fddWait) && (
            <Button variant="menuItem" onClick={() => onViewFdd?.(row)}>
              <FileText size={16} className="mt-0.5" />
              View FDD
            </Button>
          )}
        </Dropdown>
      </div>
    ),
    ignoreRowClick: true,
    allowOverflow: true,
    button: true,
  },
];

const FranchiseeTable = ({
  franchisees = [],
  isLoading = false,
  showClient = false,
  onView,
  onViewFdd,
  className = "",
}) => (
  <section className={className}>
    <DataTable
      columns={buildColumns({ onView, onViewFdd, showClient })}
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
