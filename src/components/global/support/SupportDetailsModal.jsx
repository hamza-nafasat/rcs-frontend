import { Paperclip, X } from "lucide-react";
import Button from "../../shared/Button";
import SupportPill from "./SupportPill";
import { SUPPORT_PRIORITY, SUPPORT_STATUS } from "../../../utils/supportStatus";

const SupportDetailsModal = ({ isOpen, onClose, ticket }) => {
  if (!isOpen || !ticket) return null;

  const asDate = (value) => (value ? new Date(value).toLocaleDateString() : "—");

  const facts = [
    { label: "Category", value: ticket?.category ?? "—" },
    { label: "Received On", value: asDate(ticket?.createdAt) },
    { label: "Last Updated", value: asDate(ticket?.updatedAt) },
    { label: "Raised By", value: ticket?.restaurant?.restaurantName ?? ticket?.raisedBy?.fullName ?? "—" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
        {/* Header */}
        <header className="mb-5 flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-sm font-semibold text-primary">{ticket?.ticketId}</p>
            <h2 className="mt-0.5 break-words text-lg font-semibold text-tertiary">{ticket?.subject}</h2>

            <div className="mt-2 flex flex-wrap items-center gap-2">
              <SupportPill {...(SUPPORT_STATUS[ticket?.status] ?? SUPPORT_STATUS.in_progress)} />
              <SupportPill
                label={ticket?.priority}
                {...(SUPPORT_PRIORITY[ticket?.priority] ?? SUPPORT_PRIORITY.Low)}
              />
            </div>
          </div>

          <Button
            variant="bare"
            onClick={onClose}
            aria-label="Close"
            className="p-1! m-1! rounded-full! text-secondary transition hover:bg-gray-100"
          >
            <X size={20} />
          </Button>
        </header>

        {/* Facts */}
        <dl className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {facts.map(({ label, value }) => (
            <div
              key={label}
              className="flex items-center justify-between gap-3 rounded-lg border color-border bg-white px-3 py-2"
            >
              <dt className="shrink-0 text-xs text-secondary">{label}</dt>
              <dd className="min-w-0 break-words text-right text-sm font-medium text-tertiary">{value}</dd>
            </div>
          ))}
        </dl>

        {/* Description */}
        <section className="mt-4">
          <h3 className="mb-2 text-sm font-semibold text-tertiary">Description</h3>
          <p className="whitespace-pre-line break-words rounded-xl border color-border bg-gray-50 p-4 text-sm text-secondary">
            {ticket?.description || "No description was provided."}
          </p>
        </section>

        {ticket?.attachment && (
          <section className="mt-4">
            <h3 className="mb-2 text-sm font-semibold text-tertiary">Attachment</h3>
            <a
              href={ticket?.attachment?.url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border color-border px-3 py-2 text-sm text-tertiary transition hover:bg-gray-50"
            >
              <Paperclip size={14} className="shrink-0 text-secondary" />
              <span className="min-w-0 break-all">{ticket?.attachment?.name ?? "Attachment"}</span>
            </a>
          </section>
        )}
      </div>
    </div>
  );
};

export default SupportDetailsModal;
