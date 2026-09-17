import { useState } from "react";
import DataTable from "react-data-table-component";
import { CheckCircle2, Eye, MoreHorizontal, Pencil, Trash2, XCircle } from "lucide-react";
import Button from "../../shared/Button";
import Dropdown from "../../shared/Dropdown";
import DeleteModal from "../../modals/DeleteModal";
import SupportPill from "./SupportPill";
import { isEditableTicket, SUPPORT_PRIORITY, SUPPORT_STATUS, SUPPORT_STATUSES } from "../../../utils/supportStatus";

const tableStyles = {
  table: { style: { width: "100%" } },
  tableWrapper: { style: { width: "100%", height: "100%" } },
  responsiveWrapper: {
    style: {
      width: "100%",
      flex: "1 1 auto",
      minHeight: 0,
      overflowY: "auto",
      border: "1px solid #E5E7EB",
      borderRadius: "8px",
    },
  },
  headRow: { style: { backgroundColor: "#FAFAFA" } },
  headCells: { style: { color: "#4B5563", fontSize: "12px", fontWeight: "600" } },
  pagination: { style: { marginTop: "auto", flex: "0 0 auto" } },
};

const buildColumns = ({ onView, onEdit, onResolve, onClose, setTicketToDelete }) => [
  {
    name: "Ticket ID",
    selector: (row) => row.ticketId,
    sortable: true,
    minWidth: "120px",
    maxWidth: "120px",
    wrap: true,
    cell: (row) => <span className="text-sm font-semibold text-primary">{row.ticketId}</span>,
  },
  {
    name: "Subject",
    selector: (row) => row.subject,
    sortable: true,
    grow: 1,
    minWidth: "210px",
    maxWidth: "3000px",
    wrap: true,
    cell: (row) => <p className="truncate text-subject">{row.subject}</p>,
  },
  {
    name: "Category",
    selector: (row) => row.category,
    sortable: true,
    minWidth: "120px",
    maxWidth: "150px",
    wrap: true,
    cell: (row) => <p className="text-tablecell">{row.category}</p>,
  },
  {
    name: "Priority",
    selector: (row) => row.priority,
    sortable: true,
    minWidth: "120px",
    maxWidth: "120px",
    wrap: true,
    cell: (row) => <SupportPill label={row.priority} {...(SUPPORT_PRIORITY[row.priority] ?? SUPPORT_PRIORITY.Low)} />,
  },
  {
    name: "Status",
    selector: (row) => row.status,
    sortable: true,
    minWidth: "120px",
    maxWidth: "120px",
    wrap: true,
    cell: (row) => <SupportPill {...(SUPPORT_STATUS[row.status] ?? SUPPORT_STATUS.in_progress)} />,
  },
  {
    name: "Received On",
    selector: (row) => row.receivedOn,
    sortable: true,
    minWidth: "120px",
    maxWidth: "120px",
    wrap: true,
    cell: (row) => <p className="text-tablecell">{row.receivedOn}</p>,
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
            <Button variant="menuTrigger">
              <MoreHorizontal size={18} />
            </Button>
          }
        >
          {onView && (
            <Button variant="menuItem" onClick={() => onView(row)}>
              <Eye size={16} className="mt-0.5" />
              View
            </Button>
          )}

          {/* only an open ticket can change */}
          {onEdit && isEditableTicket(row) && (
            <Button variant="menuItem" onClick={() => onEdit(row)}>
              <Pencil size={16} className="mt-0.5" />
              Edit
            </Button>
          )}

          {onResolve && (
            <Button
              variant="menuItem"
              isDisabled={row.status === SUPPORT_STATUSES.RESOLVED}
              onClick={() => onResolve(row)}
            >
              <CheckCircle2 size={16} className="mt-0.5" />
              Resolve
            </Button>
          )}

          {onClose && (
            <Button variant="menuItem" isDisabled={row.status === SUPPORT_STATUSES.CLOSED} onClick={() => onClose(row)}>
              <XCircle size={16} className="mt-0.5" />
              Close
            </Button>
          )}

          {setTicketToDelete && (
            <Button variant="menuItemDanger" onClick={() => setTicketToDelete(row)}>
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

const SupportTable = ({ tickets = [], isLoading = false, onView, onEdit, onResolve, onClose, onDelete }) => {
  const [ticketToDelete, setTicketToDelete] = useState(null);

  const handleConfirmDelete = () => {
    onDelete?.(ticketToDelete);
    setTicketToDelete(null);
  };

  const columns = buildColumns({
    onView,
    onEdit,
    onResolve,
    onClose,
    setTicketToDelete: onDelete ? setTicketToDelete : null,
  });

  return (
    <section className="flex h-full min-h-0 w-full flex-col">
      <DataTable
        columns={columns}
        data={tickets}
        progressPending={isLoading}
        pagination
        highlightOnHover
        responsive
        fixedHeader
        fixedHeaderScrollHeight="100%"
        customStyles={tableStyles}
        conditionalRowStyles={[
          { when: (row) => tickets.indexOf(row) % 2 === 1, style: { backgroundColor: "#FAFAFA" } },
        ]}
        className="flex min-h-0 flex-1 flex-col"
        noDataComponent={<p className="py-8 text-sm text-secondary">No tickets found</p>}
      />

      <DeleteModal
        isOpen={Boolean(ticketToDelete)}
        onClose={() => setTicketToDelete(null)}
        onConfirm={handleConfirmDelete}
        heading="Delete Ticket"
        text={`Are you sure you want to delete ${ticketToDelete?.ticketId ?? "this ticket"}? This action cannot be undone.`}
        confirmText="Delete"
      />
    </section>
  );
};

export default SupportTable;
