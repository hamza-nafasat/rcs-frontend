import { useState } from "react";
import { X, Send } from "lucide-react";
import Input from "../shared/Input";
import Button from "../shared/Button";
import FileUpload from "../shared/FileUpload";

const MakeRequestModal = ({ isOpen, onClose, onSubmit }) => {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [file, setFile] = useState(null);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) return;

    onSubmit?.({ title, message, file });
    setTitle("");
    setMessage("");
    setFile(null);
    onClose?.();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 animate-fade-in">
      <div className="w-full max-w-125 rounded-2xl bg-white p-6 shadow-xl border border-gray-100 flex flex-col gap-5 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-gray-100 pb-3">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Make a Request</h2>
            <p className="mt-0.5 text-xs text-gray-500">
              Submit a new request or inquiry regarding your application.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form with Title, Message, and Attachment fields */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Field 1: Title */}
          <Input
            label="Title *"
            name="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter request title"
            required
          />

          {/* Field 2: Message */}
          <section className="w-full">
            <label className="mb-1 block text-sm font-medium text-[#111111]">
              Message *
            </label>
            <textarea
              name="message"
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Enter your message details..."
              className="w-full rounded-xl border border-[#E5E7EB] bg-white p-3 text-sm outline-none focus:border-primary transition"
              required
            />
          </section>

          {/* Field 3: File Upload */}
          <FileUpload
            label="Attachment (Optional)"
            file={file}
            onFileChange={setFile}
            hint="Supports PDF, PNG, JPG, ZIP up to 10MB"
          />

          {/* Action Buttons */}
          <div className="mt-2 flex gap-3 pt-2">
            <Button
              type="button"
              onClick={onClose}
              className="w-1/2 bg-white! text-[#344054]! hover:bg-gray-50! border border-gray-300! px-3! py-2.5!"
            >
              Cancel
            </Button>

            <Button
              type="submit"
              icon={<Send size={15} />}
              className="w-1/2 px-3! py-2.5! text-white"
            >
              Send Request
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MakeRequestModal;
