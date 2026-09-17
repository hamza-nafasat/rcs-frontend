import { useState } from "react";
import { Send, X } from "lucide-react";
import Button from "../../shared/Button";
import FileUpload from "../../shared/FileUpload";

const PipelineRequestFillModal = ({ isOpen, onClose, onSubmit, request }) => {
  const [message, setMessage] = useState("");
  const [files, setFiles] = useState([]);
  const [isSaving, setIsSaving] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    setIsSaving(true);

    try {
      await onSubmit?.({ message, files });
      setMessage("");
      setFiles([]);
      onClose?.();
    } catch {
      // the toast already reported it
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="flex max-h-[90vh] w-full max-w-125 flex-col gap-5 overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
        {/* Heading */}
        <header className="flex items-start justify-between gap-4 border-b color-border pb-3">
          <div className="min-w-0">
            <h2 className="heading-lg text-tertiary">Fill the Requirements</h2>
            <p className="mt-0.5 text-xs text-secondary">Replying to “{request?.title}”</p>
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

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <section className="w-full">
            <label htmlFor="response-message" className="mb-1 block text-sm font-medium text-tertiary">
              Message *
            </label>
            <textarea
              id="response-message"
              name="message"
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Tell the admin what you are sending..."
              className="w-full rounded-xl border color-border bg-white p-3 text-sm transition outline-none focus:border-primary"
              required
            />
          </section>

          <FileUpload
            label="Attachments (Optional)"
            file={files}
            onFileChange={setFiles}
            multiple
            hint="Supports PDF, PNG, JPG, ZIP up to 10MB each"
          />

          <div className="mt-2 flex gap-3 pt-2">
            <Button
              type="button"
              variant="bare"
              isDisabled={isSaving}
              onClick={onClose}
              className="w-1/2 border border-cancel bg-white px-3! py-2.5! text-cancel transition hover:bg-muted"
            >
              Cancel
            </Button>

            <Button
              type="submit"
              icon={<Send size={15} />}
              isLoading={isSaving}
              isDisabled={isSaving}
              className="w-1/2 px-3! py-2.5! text-white"
            >
              {isSaving ? "Saving…" : "Save"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PipelineRequestFillModal;
