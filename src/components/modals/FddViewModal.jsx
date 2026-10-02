import { Download, X } from "lucide-react";
import Button from "../shared/Button";
import PdfDocumentView from "../global/fdd/PdfDocumentView";
import { FDD_STATUS } from "../../utils/fddStatus";

const FddViewModal = ({ isOpen, onClose, document, onDownload }) => {
  if (!isOpen || !document) return null;

  // signed copy, else the original
  const fileUrl = document.currentFile?.url ?? document.file?.url;

  const details = [
    ["Version", document.version],
    ["Restaurant", document.restaurant?.restaurantName],
    ["Location", [document.state, document.country].filter(Boolean).join(", ")],
    ["Status", FDD_STATUS[document.status]?.label ?? document.status],
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-4">
      <article className="flex max-h-[90vh] w-full max-w-4xl flex-col rounded-2xl bg-white shadow-xl">
        {/* Header */}
        <header className="flex items-start justify-between gap-4 border-b color-border p-6">
          <div className="min-w-0">
            <h2 className="wrap-break-word text-xl font-semibold text-tertiary">{document.title}</h2>
            <p className="mt-1 flex flex-wrap gap-x-3 text-sm text-muted">
              {details.map(([label, value]) => (
                <span key={label}>
                  {label}: {value || "—"}
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

        {/* The document itself */}
        <section className="min-h-0 flex-1 overflow-auto bg-muted p-6">
          <PdfDocumentView file={fileUrl} />
        </section>

        <footer className="flex flex-col-reverse gap-3 border-t sm:flex-row sm:justify-end color-border p-4">
          <Button
            variant="bare"
            onClick={onClose}
            className="rounded-xl border color-border bg-white px-4! py-2! text-sm text-cancel"
          >
            Close
          </Button>

          <Button onClick={() => onDownload?.(document)} icon={<Download size={16} />} className="px-4! py-2! text-sm">
            Download
          </Button>
        </footer>
      </article>
    </div>
  );
};

export default FddViewModal;
