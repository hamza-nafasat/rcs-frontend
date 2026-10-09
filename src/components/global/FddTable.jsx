import DataTable from "./DataTable";
import { ChevronDown, Download, Eye, FileSignature, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import Button from "../shared/Button";
import Dropdown from "../shared/Dropdown";
import { canFillAgain, fillStatusOf } from "../../utils/fddFill";
import { formatClockTime, formatDate } from "../../utils/formatTime";

const buildColumns = ({ canManage, canFill, onView, onEdit, onFill, onDownload, onDelete }) => [
  {
    name: "Document",
    selector: (row) => row.title,
    sortable: true,
    cell: (row) => (
      <div className="min-w-0">
        <p className="wrap-break-word text-sm text-gray-900">{row.title}</p>
        <p className="wrap-break-word text-xs text-gray-500">Version {row.version}</p>
      </div>
    ),
  },
  {
    name: "Restaurant Brand",
    // the api populates the linked client
    selector: (row) => row.restaurant?.restaurantName ?? "",
    sortable: true,
    cell: (row) => <p className="wrap-break-word text-sm text-gray-900">{row.restaurant?.restaurantName ?? "—"}</p>,
  },
  {
    name: "Country",
    selector: (row) => row.country,
    sortable: true,
    cell: (row) => (
      <div className="min-w-0">
        <p className="wrap-break-word text-sm text-gray-900">{row.country}</p>
        <p className="wrap-break-word text-xs text-gray-500">{row.state}</p>
      </div>
    ),
  },
  {
    name: "Your Copy",
    selector: (row) => (row.myFill ? "Filled" : "Not filled"),
    sortable: true,
    omit: !canFill,
    cell: (row) => {
      const { label, pill, dot } = fillStatusOf(row.myFill);

      return (
        <span
          className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1 text-xs font-medium ${pill}`}
        >
          <span className={`h-1.5 w-1.5 rounded-full ${dot}`} />
          {label}
        </span>
      );
    },
  },
  {
    name: "Created At",
    selector: (row) => row.createdAt,
    sortable: true,
    minWidth: "140px",
    cell: (row) => (
      <div className="min-w-0 py-1">
        <p className="whitespace-nowrap text-sm text-gray-900">{formatDate(row.createdAt)}</p>
        <p className="whitespace-nowrap text-xs text-gray-500">{formatClockTime(row.createdAt)}</p>
      </div>
    ),
  },
  {
    name: <div className="pr-5">Actions</div>,
    width: "90px",
    style: {
      paddingRight: "20px",
    },
    right: true,
    cell: (row) => (
      <div className="flex justify-end">
        <Dropdown
          align="right"
          portalClassName="max-w-12"
          trigger={
            <Button variant="menuTrigger">
              <MoreHorizontal size={18} />
            </Button>
          }
        >
          <Button variant="menuItem" onClick={() => onView?.(row)}>
            <Eye size={16} className="mt-0.5" />
            View
          </Button>

          {canManage && (
            <Button variant="menuItem" onClick={() => onEdit?.(row)}>
              <Pencil size={16} className="mt-0.5" />
              Edit
            </Button>
          )}

          {/* the window closes a day after the first fill */}
          {canFill && row.isFillRequired && canFillAgain(row.myFill) && (
            <Button variant="menuItem" onClick={() => onFill?.(row)}>
              <FileSignature size={16} className="mt-0.5" />
              {row.myFill ? "Edit Filled FDD" : "Fill FDD"}
            </Button>
          )}

          <Button variant="menuItem" onClick={() => onDownload?.(row)}>
            <Download size={16} className="mt-0.5" />
            Download
          </Button>

          {canManage && (
            <Button variant="menuItemDanger" onClick={() => onDelete?.(row)}>
              <Trash2 size={16} className="shrink-0" />
              Delete
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

// canManage adds edit and delete, canFill signs
const FddTable = ({
  documents = [],
  isLoading = false,
  canManage = false,
  canFill = false,
  onView,
  onEdit,
  onFill,
  onDownload,
  onDelete,
}) => {
  const columns = buildColumns({ canManage, canFill, onView, onEdit, onFill, onDownload, onDelete });
  return (
    <section className="flex h-full w-full min-h-0 flex-col">
      <DataTable
        columns={columns}
        data={documents}
        isLoading={isLoading}
        fillHeight
        pagination
        fixedHeader
        fixedHeaderScrollHeight="100%"
        sortIcon={<ChevronDown size={14} />}
        className="flex min-h-0 flex-1 flex-col"
        noDataComponent={<p className="py-8 text-sm text-gray-500">No documents found</p>}
      />
    </section>
  );
};

export default FddTable;
