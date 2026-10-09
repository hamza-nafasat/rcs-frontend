import { CircleCheck, CircleX, Download, RotateCcw, X } from "lucide-react";
import Badge from "../../../../components/shared/Badge";
import Button from "../../../../components/shared/Button";
import PdfDocumentView from "../../../../components/global/fdd/PdfDocumentView";
import { signStatusOf } from "../../../../utils/fddFill";
import { formatDate } from "../../../../utils/formatTime";

const FranchiseeFddModal = ({ isOpen, onClose, franchisee, isSaving = false, onReview, onAskRefill, onDownload }) => {
  if (!isOpen || !franchisee) return null;

  const wait = franchisee?.fddWait;
  const { label, color } = signStatusOf(wait);

  const details = [
    ["Applicant", `${franchisee?.firstName ?? ""} ${franchisee?.lastName ?? ""}`.trim()],
    ["Document", wait?.fddName],
    ["State", wait?.state],
    ["Signed on", wait?.filledAt && formatDate(wait?.filledAt)],
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-4">
      <article className="flex max-h-[90vh] w-full max-w-4xl flex-col rounded-2xl bg-white shadow-xl">
        {/* Header */}
        <header className="flex items-start justify-between gap-4 border-b color-border p-6">
          <div className="min-w-0">
            <h2 className="flex flex-wrap items-center gap-3 text-xl font-semibold text-tertiary">
              Signed FDD
              <Badge text={label} dotColor={color} />
            </h2>

            <p className="mt-1 flex flex-wrap gap-x-3 text-sm text-muted">
              {details.map(([field, value]) => (
                <span key={field}>
                  {field}: {value || "—"}
                </span>
              ))}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="shrink-0 rounded-full p-1 text-gray-500 hover:bg-gray-100"
          >
            <X size={20} />
          </button>
        </header>

        {/* The signed copy itself */}
        <section className="min-h-0 flex-1 overflow-auto bg-muted p-6">
          <PdfDocumentView file={wait?.file?.url} />
        </section>

        <footer className="flex flex-col gap-3 border-t color-border p-4 sm:flex-row sm:items-center sm:justify-between">
          {/* the quiet tools */}
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button
              variant="bare"
              onClick={() => onDownload?.(wait)}
              icon={<Download size={16} />}
              className="w-full rounded-xl border color-border bg-white px-4! py-2! text-sm text-secondary transition hover:bg-muted sm:w-auto"
            >
              Download
            </Button>

            {/* a new copy restarts the 14 days */}
            <Button
              variant="bare"
              onClick={onAskRefill}
              isDisabled={isSaving}
              icon={<RotateCcw size={16} />}
              className="w-full rounded-xl border color-border bg-white px-4! py-2! text-sm text-secondary transition hover:bg-muted sm:w-auto"
            >
              Ask to Fill Again
            </Button>
          </div>

          {/* the decision */}
          <div className="flex flex-col-reverse gap-2 sm:flex-row">
            <Button
              variant="bare"
              onClick={() => onReview?.("rejected")}
              isDisabled={isSaving}
              icon={<CircleX size={16} />}
              className="w-full rounded-xl border border-(--color-text-remove) bg-white px-4! py-2! text-sm text-remove transition hover:bg-(--color-text-remove)/5 sm:w-auto"
            >
              Reject
            </Button>

            <Button
              onClick={() => onReview?.("approved")}
              isLoading={isSaving}
              icon={<CircleCheck size={16} />}
              className="w-full px-4! py-2! text-sm sm:w-auto"
            >
              Approve
            </Button>
          </div>
        </footer>
      </article>
    </div>
  );
};

export default FranchiseeFddModal;
