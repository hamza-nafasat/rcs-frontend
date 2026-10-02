import { useState } from "react";
import DataTable from "../DataTable";
import { Eye, FileText, MoreHorizontal, Paperclip, Pencil, Trash2 } from "lucide-react";
import Badge from "../../shared/Badge";
import Button from "../../shared/Button";
import Dropdown from "../../shared/Dropdown";
import DeleteModal from "../../modals/DeleteModal";
import { statusOf } from "../../../utils/requestStatus";

const buildColumns = ({ onView, onEdit, onAsk }) => {
  // one action needs no menu
  const hasMenu = Boolean(onEdit || onAsk);

  return [
    {
      name: "Title",
      selector: (row) => row.title,
      sortable: false,
      minWidth: "150px",
      maxWidth: "250px",
      wrap: true,
      cell: (row) => <p className="wrap-break-word font-semibold text-subject">{row.title}</p>,
    },
    {
      name: "Message",
      selector: (row) => row.message,
      minWidth: "220px",
      maxWidth: "250px",
      wrap: true,
      cell: (row) => <p className="wrap-break-word text-tablecell">{row.message}</p>,
    },
    {
      name: "Attachments",
      selector: (row) => row.attachments?.length ?? 0,
      sortable: true,
      minWidth: "150px",
      maxWidth: "230px",
      wrap: true,
      cell: (row) => {
        const attachments = row.attachments ?? [];
        if (attachments.length === 0) return <span className="text-muted">—</span>;

        return (
          <span className="flex min-w-0 items-center gap-1.5 text-tablecell">
            <Paperclip size={14} className="shrink-0 text-muted" />
            <span className="min-w-0 wrap-break-word">{attachments[0].name}</span>
            {attachments.length > 1 && <span className="shrink-0 text-muted">+{attachments.length - 1}</span>}
          </span>
        );
      },
    },
    {
      name: "Status",
      selector: (row) => row.status,
      sortable: true,
      minWidth: "130px",
      maxWidth: "140px",
      cell: (row) => {
        const { label, color } = statusOf(row.status);
        return <Badge text={label} dotColor={color} />;
      },
    },
    {
      name: "Sent On",
      selector: (row) => row.createdAt,
      sortable: true,
      minWidth: "120px",
      maxWidth: "140px",
      cell: (row) => <p className="text-tablecell">{new Date(row.createdAt).toLocaleDateString()}</p>,
    },
    {
      name: <div className="pr-5">Actions</div>,
      width: "90px",
      right: true,
      cell: (row) => (
        <div className="flex w-full items-center justify-center">
          {hasMenu ? (
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

              {onEdit && (
                <Button variant="menuItem" onClick={() => onEdit(row)}>
                  <Pencil size={16} className="mt-0.5" />
                  Edit
                </Button>
              )}

              {onAsk && (
                <Button variant="menuItemDanger" onClick={() => onAsk(row)}>
                  <Trash2 size={16} className="shrink-0" />
                  Delete
                </Button>
              )}
            </Dropdown>
          ) : (
            <button
              type="button"
              onClick={() => onView?.(row)}
              aria-label={`View ${row.title}`}
              className="rounded-lg p-2 text-muted transition hover:bg-active hover:text-primary"
            >
              <Eye size={18} />
            </button>
          )}
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ];
};

const PipelineRequestTable = ({
  requests = [],
  isLoading = false,
  heading = "Document Requests",
  subheading = "Requests you sent to this applicant",
  emptyText = "No requests sent yet",
  onView,
  onEdit,
  onDelete,
  className = "",
}) => {
  const [requestToDelete, setRequestToDelete] = useState(null);

  const handleConfirm = () => {
    onDelete?.(requestToDelete);
    setRequestToDelete(null);
  };

  return (
    <section className={`flex flex-col gap-4 rounded-2xl border color-border bg-white p-5 ${className}`}>
      <header className="flex items-center gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-info">
          <FileText size={18} className="text-info" />
        </span>

        <div className="min-w-0">
          <h2 className="heading-lg text-tertiary">{heading}</h2>
          <p className="text-xs text-secondary">{subheading}</p>
        </div>
      </header>

      <DataTable
        columns={buildColumns({ onView, onEdit, onAsk: onDelete ? setRequestToDelete : undefined })}
        data={requests}
        isLoading={isLoading}
        variant="boxed"
        pagination
        striped
        noDataComponent={<p className="py-8 text-sm text-secondary">{emptyText}</p>}
      />

      <DeleteModal
        isOpen={Boolean(requestToDelete)}
        onClose={() => setRequestToDelete(null)}
        onConfirm={handleConfirm}
        icon={<Trash2 size={26} />}
        heading="Delete Request"
        text={`Are you sure you want to delete "${requestToDelete?.title ?? "this request"}"? This action cannot be undone.`}
        confirmText="Delete"
      />
    </section>
  );
};

export default PipelineRequestTable;
