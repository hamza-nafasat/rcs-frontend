import { useState } from "react";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { Trash2, X } from "lucide-react";
import Button from "../shared/Button";
import PdfDocumentView from "../global/fdd/PdfDocumentView";
import FddFillTools from "../global/fdd/FddFillTools";

const PAGE_WIDTH = 620;

// each one is a share of the page, so a placement survives any zoom
const SIGNATURE_WIDTH_RATIO = 0.26;
const TEXT_SIZE_RATIO = 0.022;

// where the click or drop landed on the page
const dropRatios = (event, element) => {
  const rect = element.getBoundingClientRect();
  return {
    xRatio: (event.clientX - rect.left) / rect.width,
    yRatio: (event.clientY - rect.top) / rect.height,
  };
};

const stampPlacements = async (fileUrl, placements) => {
  const original = await fetch(fileUrl).then((response) => response.arrayBuffer());
  const pdf = await PDFDocument.load(original);
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const images = new Map();

  for (const { page, xRatio, yRatio, type, value } of placements) {
    const pdfPage = pdf.getPage(page - 1);
    const { width, height } = pdfPage.getSize();

    if (type === "text") {
      const size = width * TEXT_SIZE_RATIO;
      pdfPage.drawText(value, {
        x: xRatio * width - font.widthOfTextAtSize(value, size) / 2,
        y: height - yRatio * height - size * 0.35,
        size,
        font,
        color: rgb(0.07, 0.09, 0.15),
      });
      continue;
    }

    // the same signature is embedded once and reused on every page
    if (!images.has(value)) images.set(value, await pdf.embedPng(value));
    const image = images.get(value);
    const drawWidth = width * SIGNATURE_WIDTH_RATIO;
    const drawHeight = (image.height / image.width) * drawWidth;
    pdfPage.drawImage(image, {
      x: xRatio * width - drawWidth / 2,
      y: height - yRatio * height - drawHeight / 2,
      width: drawWidth,
      height: drawHeight,
    });
  }

  return new Blob([await pdf.save()], { type: "application/pdf" });
};

const FddFillModal = ({ isOpen, onClose, document, onSave }) => {
  const [activeTool, setActiveTool] = useState("signature");
  const [signature, setSignature] = useState("");
  const [text, setText] = useState("");
  const [placements, setPlacements] = useState([]);
  const [draggingId, setDraggingId] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  if (!isOpen || !document) return null;

  // the signed copy once it exists, otherwise the original
  const fileUrl = document.currentFile?.url ?? document.file?.url;

  const activeValue = activeTool === "signature" ? signature : text.trim();

  // a click drops the active tool, dragging a placed one moves it
  const handlePageClick = (event, page) => {
    if (!activeValue || draggingId) return;
    // react clears currentTarget once the handler returns, so measure before updating state
    const ratios = dropRatios(event, event.currentTarget);
    setPlacements((prev) => [...prev, { id: Date.now(), page, type: activeTool, value: activeValue, ...ratios }]);
  };

  const handleDrop = (event, page) => {
    if (!draggingId) return;
    const ratios = dropRatios(event, event.currentTarget);
    setPlacements((prev) => prev.map((item) => (item.id === draggingId ? { ...item, page, ...ratios } : item)));
    setDraggingId(null);
  };

  const removePlacement = (id) => setPlacements((prev) => prev.filter((item) => item.id !== id));

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const filledFile = await stampPlacements(fileUrl, placements);
      await onSave?.(filledFile);
    } catch (error) {
      console.error("Fill document error:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-4">
      <article className="flex max-h-[90vh] w-full max-w-5xl flex-col rounded-2xl bg-white shadow-xl">
        {/* Header */}
        <header className="flex items-start justify-between gap-4 border-b color-border p-6">
          <div className="min-w-0">
            <h2 className="truncate text-xl font-semibold text-tertiary">Fill {document.title}</h2>
            <p className="mt-1 text-sm text-muted">
              {activeValue
                ? "Click a page to place it, drag it to move it, and use as many pages as you need."
                : "Create a signature, or type the text you want to add."}
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

        <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-hidden p-4 lg:flex-row">
          {/* What to place */}
          <aside className="shrink-0 overflow-y-auto lg:w-72">
            <FddFillTools
              activeTool={activeTool}
              onToolChange={setActiveTool}
              signature={signature}
              onCreateSignature={setSignature}
              onResetSignature={() => setSignature("")}
              text={text}
              onTextChange={setText}
              placementCount={placements.length}
            />
          </aside>

          {/* Pages */}
          <section className="min-h-0 flex-1 overflow-auto rounded-xl bg-muted p-4">
            <PdfDocumentView file={fileUrl} width={PAGE_WIDTH}>
              {(page) => (
                <div
                  onClick={(event) => handlePageClick(event, page)}
                  onDragOver={(event) => event.preventDefault()}
                  onDrop={(event) => handleDrop(event, page)}
                  className={`absolute inset-0 ${activeValue ? "cursor-crosshair" : ""}`}
                >
                  {placements
                    .filter((item) => item.page === page)
                    .map((item) => (
                      <span
                        key={item.id}
                        draggable
                        onDragStart={() => setDraggingId(item.id)}
                        style={{
                          left: `${item.xRatio * 100}%`,
                          top: `${item.yRatio * 100}%`,
                          width: item.type === "signature" ? `${SIGNATURE_WIDTH_RATIO * 100}%` : undefined,
                          fontSize: item.type === "text" ? `${TEXT_SIZE_RATIO * PAGE_WIDTH}px` : undefined,
                        }}
                        className="group absolute -translate-x-1/2 -translate-y-1/2 cursor-move whitespace-nowrap rounded border border-dashed border-transparent text-tertiary hover:border-(--color-primary)"
                      >
                        {item.type === "signature" ? (
                          <img src={item.value} alt="Placed signature" draggable={false} className="w-full" />
                        ) : (
                          item.value
                        )}

                        <button
                          type="button"
                          aria-label="Remove this"
                          onClick={(event) => {
                            event.stopPropagation();
                            removePlacement(item.id);
                          }}
                          className="absolute -right-2 -top-2 hidden rounded-full bg-white p-1 text-remove shadow group-hover:block"
                        >
                          <Trash2 size={12} />
                        </button>
                      </span>
                    ))}
                </div>
              )}
            </PdfDocumentView>
          </section>
        </div>

        <footer className="flex justify-end gap-3 border-t color-border p-4">
          <Button
            variant="bare"
            onClick={onClose}
            className="rounded-xl border color-border bg-white px-4! py-2! text-sm text-cancel"
          >
            Cancel
          </Button>

          <Button
            onClick={handleSave}
            isLoading={isSaving}
            isDisabled={placements.length === 0}
            className="px-4! py-2! text-sm"
          >
            Save filled document
          </Button>
        </footer>
      </article>
    </div>
  );
};

export default FddFillModal;
