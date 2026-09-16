import { useState } from "react";
import { Send, X } from "lucide-react";
import MessageAttachment from "./MessageAttachment";
import MessageEmoji from "./MessageEmoji";
import MessageVoiceNote from "./MessageVoiceNote";
import Button from "../../../shared/Button";
import { formatDuration } from "../../../../utils/formatDuration";

const MessageWrite = ({ onSend }) => {
  const [message, setMessage] = useState("");
  const [file, setFile] = useState(null);
  const [voiceNote, setVoiceNote] = useState(null);

  const handleEmojiSelect = (emoji) => {
    setMessage(message + emoji);
  };

  const removeVoiceNote = () => {
    if (voiceNote?.url) URL.revokeObjectURL(voiceNote.url);
    setVoiceNote(null);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const trimmedMessage = message.trim();

    if (!trimmedMessage && !file && !voiceNote) return;

    onSend(trimmedMessage, file, voiceNote);
    setMessage("");
    setFile(null);
    // the message keeps the recording, so its url is not released here
    setVoiceNote(null);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="border-t border-gray-200 px-4 py-3 sm:px-5 sm:py-4"
    >
      {/* Attachment, emoji and voice note options */}
      <div className="mb-2 flex items-center gap-3">
        <MessageAttachment onFileSelect={setFile} />
        <MessageEmoji onEmojiSelect={handleEmojiSelect} />
        <MessageVoiceNote onRecorded={setVoiceNote} />
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

      {/* Recorded voice note */}
      {voiceNote && (
        <div className="mb-2 flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-1.5 text-xs text-gray-700">
          <audio controls src={voiceNote.url} className="h-8 min-w-0 flex-1" />
          <span className="shrink-0 tabular-nums">{formatDuration(voiceNote.duration)}</span>

          <button
            type="button"
            onClick={removeVoiceNote}
            className="shrink-0 text-gray-400 transition-colors hover:text-gray-600"
            aria-label="Remove voice note"
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
          isDisabled={!message.trim() && !file && !voiceNote}
          className="h-10 w-10"
        >
          <Send size={14} />
        </Button>
      </div>
    </form>
  );
};

export default MessageWrite;
