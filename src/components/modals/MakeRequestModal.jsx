import { useState } from "react";
import { Paperclip, Send, X } from "lucide-react";
import Input from "../shared/Input";
import Select from "../shared/Select";
import Button from "../shared/Button";
import FileUpload from "../shared/FileUpload";
import { REQUEST_STATUS_OPTIONS, REQUEST_STATUSES } from "../../utils/requestStatus";

const MakeRequestModal = ({ isOpen, onClose, onSubmit, mode = "add", initialData }) => {
  const isEdit = mode === "edit";

  const [title, setTitle] = useState(initialData?.title ?? "");
  const [message, setMessage] = useState(initialData?.message ?? "");
  const [status, setStatus] = useState(initialData?.status ?? REQUEST_STATUSES.PENDING);
  const [files, setFiles] = useState([]);
  const [isSaving, setIsSaving] = useState(false);

  if (!isOpen) return null;

  const savedFiles = initialData?.attachments ?? [];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) return;

    setIsSaving(true);

    try {
      await onSubmit?.({ title, message, files, status });

      // a new request starts empty again
      if (!isEdit) {
        setTitle("");
        setMessage("");
        setFiles([]);
        setStatus(REQUEST_STATUSES.PENDING);
      }

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
            <h2 className="heading-lg text-tertiary">{isEdit ? "Edit Request" : "Make a Request"}</h2>
            <p className="mt-0.5 text-xs text-secondary">
              {isEdit
                ? "Update the request details or move its status."
                : "Submit a new request or inquiry regarding your application."}
            </p>
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
          <Input
            label="Title *"
            name="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter request title"
            required
          />

          {/* Message */}
          <section className="w-full">
            <label htmlFor="request-message" className="mb-1 block text-sm font-medium text-tertiary">
              Message *
            </label>
            <textarea
              id="request-message"
              name="message"
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Enter your message details..."
              className="w-full rounded-xl border color-border bg-white p-3 text-sm transition outline-none focus:border-primary"
              required
            />
          </section>

          {/* Status moves only on edit */}
          {isEdit && (
            <Select
              label="Status"
              name="status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              options={REQUEST_STATUS_OPTIONS}
              placeholder="Select status"
            />
          )}

          <FileUpload
            label="Attachments (Optional)"
            file={files}
            onFileChange={setFiles}
            multiple
            hint="Supports PDF, PNG, JPG, ZIP up to 10MB each"
          />

          {/* saved files stay unless replaced */}
          {isEdit && files.length === 0 && savedFiles.length > 0 && (
            <ul className="flex flex-col gap-1.5">
              {savedFiles.map((saved) => (
                <li
                  key={saved.public_id ?? saved.name}
                  className="flex items-center gap-2 rounded-xl bg-active p-3 text-xs text-secondary"
                >
                  <Paperclip size={14} className="shrink-0 text-muted" />
                  <span className="truncate">{saved.name}</span>
                </li>
              ))}
            </ul>
          )}

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
              {isSaving ? "Saving…" : isEdit ? "Save Changes" : "Send Request"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MakeRequestModal;
