import { CalendarDays, Download, FileText, Paperclip, Upload, X } from "lucide-react";
import Button from "../../shared/Button";
import { REQUEST_STATUSES, statusOf } from "../../../utils/requestStatus";

const longDate = (value) =>
  new Date(value).toLocaleDateString(undefined, { day: "numeric", month: "long", year: "numeric" });

// the same list serves both sides
const FileList = ({ files = [] }) => (
  <ul className="mt-2 flex flex-col gap-2">
    {files.map((file) => (
      <li key={file.public_id ?? file.name} className="flex items-center gap-3 rounded-xl border color-border p-3">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-active">
          <Paperclip size={16} className="text-muted" />
        </span>

        <p className="min-w-0 flex-1 truncate text-sm font-medium text-tertiary">{file.name}</p>

        <a
          href={file.url}
          download={file.name}
          target="_blank"
          rel="noreferrer"
          aria-label={`Download ${file.name}`}
          className="flex size-9 shrink-0 items-center justify-center rounded-lg text-muted transition hover:bg-active hover:text-primary"
        >
          <Download size={16} />
        </a>
      </li>
    ))}
  </ul>
);

const PipelineRequestModal = ({ isOpen, onClose, request, canFill = false, onFill }) => {
  if (!isOpen || !request) return null;

  const { label, color, bg } = statusOf(request.status);
  const attachments = request.attachments ?? [];
  const response = request.response;
  const isPending = request.status === REQUEST_STATUSES.PENDING;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="flex max-h-[90vh] w-full max-w-140 flex-col overflow-y-auto rounded-2xl bg-white shadow-xl">
        {/* Heading */}
        <header className="flex items-start justify-between gap-4 border-b color-border p-6 pb-4">
          <div className="flex min-w-0 items-start gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-info">
              <FileText size={18} className="text-info" />
            </span>

            <div className="min-w-0">
              <h2 className="heading-lg text-tertiary">{request.title}</h2>
              <p className="mt-0.5 flex items-center gap-1.5 text-xs text-secondary">
                <CalendarDays size={13} className="shrink-0 text-muted" />
                Sent on {longDate(request.createdAt)}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="rounded-full p-1 text-muted transition hover:bg-active"
          >
            <X size={20} />
          </button>
        </header>

        <article className="flex flex-col gap-5 p-6">
          {/* Status */}
          <section className="flex items-center justify-between gap-3 rounded-xl p-4" style={{ backgroundColor: bg }}>
            <p className="text-xs font-semibold tracking-wide text-secondary uppercase">Status</p>
            <p className="text-sm font-bold" style={{ color }}>
              {label}
            </p>
          </section>

          {/* Message */}
          <section>
            <h3 className="text-xs font-semibold tracking-wide text-secondary uppercase">Message</h3>
            <p className="mt-2 rounded-xl bg-active p-4 text-sm leading-relaxed whitespace-pre-line text-tertiary">
              {request.message}
            </p>
          </section>

          {/* Attachments */}
          <section>
            <h3 className="text-xs font-semibold tracking-wide text-secondary uppercase">
              Attachments {attachments.length > 0 && `(${attachments.length})`}
            </h3>

            {attachments.length === 0 ? (
              <p className="mt-2 rounded-xl bg-active p-4 text-sm text-muted">No attachments included</p>
            ) : (
              <FileList files={attachments} />
            )}
          </section>

          {/* What the applicant sent back */}
          {response && (
            <section className="rounded-xl border border-blue-200 bg-blue-50/60 p-4">
              <h3 className="text-xs font-semibold tracking-wide text-info uppercase">Applicant Response</h3>

              <p className="mt-0.5 flex items-center gap-1.5 text-xs text-secondary">
                <CalendarDays size={13} className="shrink-0 text-muted" />
                Submitted on {longDate(response.submittedAt)}
              </p>

              <p className="mt-2 rounded-xl bg-white p-4 text-sm leading-relaxed whitespace-pre-line text-tertiary">
                {response.message}
              </p>

              {response.attachments?.length > 0 && <FileList files={response.attachments} />}
            </section>
          )}

          {/* The applicant answers a pending request */}
          {canFill && isPending && (
            <Button type="button" icon={<Upload size={16} />} onClick={onFill} className="px-4! py-2.5! text-white">
              Fill the Requirements
            </Button>
          )}
        </article>
      </div>
    </div>
  );
};

export default PipelineRequestModal;
