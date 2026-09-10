import DataTable from "react-data-table-component";
import {
  ChevronDown,
  Download,
  Eye,
  MoreHorizontal,
  PenLine,
} from "lucide-react";
import Dropdown from "../shared/Dropdown";

const STATUS_STYLES = {
  Approved: { pill: "bg-green-50 text-green-700", dot: "bg-green-500" },
  Pending: { pill: "bg-amber-50 text-amber-700", dot: "bg-amber-500" },
  Draft: { pill: "bg-gray-100 text-gray-600", dot: "bg-gray-400" },
  Expired: { pill: "bg-red-50 text-red-700", dot: "bg-red-500" },
};

const tableStyles = {
  table: { style: { width: "100%" } },
  tableWrapper: { style: { width: "100%", height: "100%" } },
  responsiveWrapper: {
    style: { width: "100%", flex: "1 1 auto", minHeight: 0, overflowY: "auto" },
  },
  pagination: {
    style: {
      marginTop: "auto",
      flex: "0 0 auto",
      borderTop: "1px solid #E5E7EB",
    },
  },
};

const FddTable = ({ documents, onReview, onESign, onDownload }) => {
  const columns = [
    {
      name: "Document",
      selector: (row) => row.document,
      sortable: true,
      minWidth: "240px",
      grow: 2,
      cell: (row) => (
        <div className="flex items-center gap-2">
          <div className="min-w-0">
            <p className="truncate text-sm text-gray-900">{row.document}</p>
            <p className="truncate text-xs text-gray-500">
              Version {row.version}
            </p>
          </div>
        </div>
      ),
    },
    {
      name: "Restaurant Brand",
      selector: (row) =>
        Array.isArray(row.brand) ? row.brand.join(", ") : row.brand,
      sortable: true,
      minWidth: "160px",
      grow: 1,
    },
    {
      name: "Country",
      selector: (row) => row.country,
      sortable: true,
      minWidth: "160px",
      grow: 1,
      cell: (row) => (
        <div className="min-w-0">
          <p className="truncate text-sm text-gray-900">{row.country}</p>
          <p className="truncate text-xs text-gray-500">{row.state}</p>
        </div>
      ),
    },
    {
      name: "Status",
      selector: (row) => row.status,
      sortable: true,
      grow: 1,
      cell: (row) => {
        const { pill, dot } = STATUS_STYLES[row.status] ?? STATUS_STYLES.Draft;

        return (
          <span
            className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1 text-xs font-medium ${pill}`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${dot}`} />
            {row.status}
          </span>
        );
      },
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
            trigger={
              <button
                type="button"
                className="rounded-md p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-700"
                aria-label="Open actions menu"
              >
                <MoreHorizontal size={18} />
              </button>
            }
          >
            <button
              type="button"
              className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-gray-700 transition hover:bg-gray-100"
              onClick={() => onReview?.(row)}
            >
              <Eye size={16} className="shrink-0" />
              Review
            </button>

            <button
              type="button"
              className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-gray-700 transition hover:bg-gray-100"
              onClick={() => onESign?.(row)}
            >
              <PenLine size={16} className="shrink-0" />
              E-sign
            </button>

            <button
              type="button"
              className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-gray-700 transition hover:bg-gray-100"
              onClick={() => onDownload?.(row)}
            >
              <Download size={16} className="shrink-0" />
              Download
            </button>
          </Dropdown>
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ];

  return (
    <div className="flex h-full w-full min-h-0 flex-col">
      <DataTable
        columns={columns}
        data={documents}
        pagination
        highlightOnHover
        responsive
        fixedHeader
        fixedHeaderScrollHeight="100%"
        sortIcon={<ChevronDown size={14} />}
        customStyles={tableStyles}
        className="flex min-h-0 flex-1 flex-col"
        noDataComponent={
          <p className="py-8 text-sm text-gray-500">No documents found</p>
        }
      />
    </div>
  );
};

export default FddTable;
