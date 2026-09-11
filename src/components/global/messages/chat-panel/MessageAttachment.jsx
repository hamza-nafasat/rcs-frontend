import { useRef } from "react";
import { Paperclip } from "lucide-react";

const ACCEPTED_FILE_TYPES = ".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif,.mp4";

const MessageAttachment = ({ onFileSelect }) => {
  const fileInputRef = useRef(null);

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    onFileSelect(file);

    event.target.value = "";
  };

  return (
    <>
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        className="shrink-0 text-gray-400 transition-colors hover:text-gray-600 mb-1"
        aria-label="Attach file"
      >
        <Paperclip className="h-5 w-5" />
      </button>

      <input
        ref={fileInputRef}
        type="file"
        accept={ACCEPTED_FILE_TYPES}
        onChange={handleFileChange}
        className="hidden"
      />
    </>
  );
};

export default MessageAttachment;
