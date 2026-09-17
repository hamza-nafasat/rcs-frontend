import { useState } from "react";
import DataTable from "react-data-table-component";
import { CheckCircle2, Eye, MoreHorizontal, Pencil, RotateCcw, Trash2, XCircle } from "lucide-react";
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

// one confirm for every action
const CONFIRM_ACTIONS = {
  resolve: {
    heading: "Resolve Ticket",
    confirmText: "Resolve",
    icon: <CheckCircle2 size={26} />,
    text: (ticketId) => `Mark ${ticketId} as resolved? The client will see it as resolved.`,
  },
  close: {
    heading: "Close Ticket",
    confirmText: "Close",
    icon: <XCircle size={26} />,
    text: (ticketId) => `Close ${ticketId}? The client will no longer be able to edit it.`,
  },
  reopen: {
    heading: "Reopen Ticket",
    confirmText: "Reopen",
    icon: <RotateCcw size={26} />,
    text: (ticketId) => `Reopen ${ticketId}? It moves back to in progress and can be edited again.`,
  },
  delete: {
    heading: "Delete Ticket",
    confirmText: "Delete",
    icon: <Trash2 size={26} />,
    text: (ticketId) => `Are you sure you want to delete ${ticketId}? This action cannot be undone.`,
  },
};

const buildColumns = ({ onView, onEdit, onResolve, onClose, onReopen, onDelete, onAsk }) => [
  {
    name: "Ticket ID",
    selector: (row) => row.ticketId,
    sortable: true,
    minWidth: "120px",
    maxWidth: "150px",
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
    selector: (row) => row.createdAt,
    sortable: true,
    minWidth: "120px",
    maxWidth: "120px",
    wrap: true,
    cell: (row) => <p className="text-tablecell">{new Date(row.createdAt).toLocaleDateString()}</p>,
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
              onClick={() => onAsk(row, "resolve")}
            >
              <CheckCircle2 size={16} className="mt-0.5" />
              Resolve
            </Button>
          )}

          {onClose && (
            <Button
              variant="menuItem"
              isDisabled={row.status === SUPPORT_STATUSES.CLOSED}
              onClick={() => onAsk(row, "close")}
            >
              <XCircle size={16} className="mt-0.5" />
              Close
            </Button>
          )}

          {/* a settled ticket can come back */}
          {onReopen && !isEditableTicket(row) && (
            <Button variant="menuItem" onClick={() => onAsk(row, "reopen")}>
              <RotateCcw size={16} className="mt-0.5" />
              Reopen
            </Button>
          )}

          {onDelete && (
            <Button variant="menuItemDanger" onClick={() => onAsk(row, "delete")}>
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

const SupportTable = ({
  tickets = [],
  isLoading = false,
  onView,
  onEdit,
  onResolve,
  onClose,
  onReopen,
  onDelete,
}) => {
  const [pendingAction, setPendingAction] = useState(null);

  const confirm = CONFIRM_ACTIONS[pendingAction?.action] ?? CONFIRM_ACTIONS.delete;

  const handleConfirm = () => {
    const handlers = { resolve: onResolve, close: onClose, reopen: onReopen, delete: onDelete };
    handlers[pendingAction?.action]?.(pendingAction?.ticket);
    setPendingAction(null);
  };

  const columns = buildColumns({
    onView,
    onEdit,
    onResolve,
    onClose,
    onReopen,
    onDelete,
    onAsk: (ticket, action) => setPendingAction({ ticket, action }),
  });

  return (
    <section className="flex h-full min-h-0 w-full flex-col">
      <DataTable
        columns={columns}
        data={tickets}
        keyField="_id"
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
        isOpen={Boolean(pendingAction)}
        onClose={() => setPendingAction(null)}
        onConfirm={handleConfirm}
        icon={confirm.icon}
        heading={confirm.heading}
        text={confirm.text(pendingAction?.ticket?.ticketId ?? "this ticket")}
        confirmText={confirm.confirmText}
      />
    </section>
  );
};

export default SupportTable;
