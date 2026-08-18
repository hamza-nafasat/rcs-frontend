import { useState } from "react";
import { Send, X } from "lucide-react";
import MessageAttachment from "./MessageAttachment";
import MessageEmoji from "./MessageEmoji";
import Button from "../../../../components/shared/Button";

const MessageWrite = ({ onSend }) => {
  const [message, setMessage] = useState("");
  const [file, setFile] = useState(null);

  const handleEmojiSelect = (emoji) => {
    setMessage(message + emoji);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const trimmedMessage = message.trim();

    if (!trimmedMessage && !file) return;

    onSend(trimmedMessage, file);
    setMessage("");
    setFile(null);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="border-t border-gray-200 px-5 py-4"
    >
      {/* Attachment and emoji options */}
      <div className="mb-2 flex items-center gap-3">
        <MessageAttachment onFileSelect={setFile} />
        <MessageEmoji onEmojiSelect={handleEmojiSelect} />
      </div>

      {/* Selected file */}
      {file && (
        <div className="mb-2 flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-1.5 text-xs text-gray-700">
          <span className="truncate">{file.name}</span>

          <button
            type="button"
            onClick={() => setFile(null)}
            className="text-gray-400 transition-colors hover:text-gray-600"
            aria-label="Remove file"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      <div className="flex items-center gap-3 rounded-xl border border-gray-200 px-3 py-2">
        <input
          type="text"
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          placeholder="Type a message... (Enter to send)"
          className="min-w-0 flex-1 bg-transparent text-sm text-gray-900 outline-none placeholder:text-gray-400"
        />

        <Button
          type="submit"
          disabled={!message.trim() && !file}
          className="h-10 w-10"
        >
          <Send size={14} />
        </Button>
      </div>
    </form>
  );
};

export default MessageWrite;
