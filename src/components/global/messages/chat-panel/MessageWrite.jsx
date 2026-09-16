import { useState } from "react";
import { Paperclip, Send, X } from "lucide-react";
import MessageAttachment from "./MessageAttachment";
import MessageEmoji from "./MessageEmoji";
import MessageVoiceNote from "./MessageVoiceNote";
import Button from "../../../shared/Button";
import { formatDuration } from "../../../../utils/formatDuration";
import { formatFileSize } from "../../../../utils/formatFileSize";

const MessageWrite = ({ onSend, isSending = false }) => {
  const [message, setMessage] = useState("");
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState("");
  const [voiceNote, setVoiceNote] = useState(null);

  const handleEmojiSelect = (emoji) => {
    setMessage(message + emoji);
  };

  const removeVoiceNote = () => {
    if (voiceNote?.url) URL.revokeObjectURL(voiceNote.url);
    setVoiceNote(null);
  };

  // swap file, free old preview
  const replaceFile = (nextFile) => {
    if (filePreview) URL.revokeObjectURL(filePreview);
    setFile(nextFile);
    setFilePreview(nextFile?.type?.startsWith("image/") ? URL.createObjectURL(nextFile) : "");
  };

  // a message carries one attachment
  const handleFileSelect = (selectedFile) => {
    removeVoiceNote();
    replaceFile(selectedFile);
  };

  const handleRecorded = (recording) => {
    replaceFile(null);
    setVoiceNote(recording);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const trimmedMessage = message.trim();
    if (!trimmedMessage && !file && !voiceNote) return;

    try {
      await onSend?.(trimmedMessage, file, voiceNote);
      setMessage("");
      replaceFile(null);
      setVoiceNote(null);
    } catch (error) {
      console.error("Send message error:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="border-t border-gray-200 px-4 py-3 sm:px-5 sm:py-4">
      {/* Attachment, emoji and voice note options */}
      <div className="mb-2 flex items-center gap-3">
        <MessageAttachment onFileSelect={handleFileSelect} />
        <MessageEmoji onEmojiSelect={handleEmojiSelect} />
        <MessageVoiceNote onRecorded={handleRecorded} />
      </div>

      {/* Selected file */}
      {file && (
        <div className="mb-2 flex items-center gap-3 rounded-xl border color-border bg-muted p-2">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-lg border color-border bg-white">
            {filePreview ? (
              <img src={filePreview} alt={file.name} className="h-full w-full object-cover" />
            ) : (
              <Paperclip className="h-5 w-5 text-secondary" />
            )}
          </div>

          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-medium text-tertiary">{file.name}</p>
            <p className="text-[10px] text-muted">{formatFileSize(file.size)}</p>
          </div>

          <button
            type="button"
            onClick={() => replaceFile(null)}
            className="shrink-0 rounded-full p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
            aria-label="Remove file"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Recorded voice note */}
      {voiceNote && (
        <div className="mb-2 flex items-center gap-2 rounded-xl border color-border bg-muted px-3 py-2 text-xs text-gray-700">
          <audio controls src={voiceNote.url} className="h-8 min-w-0 flex-1" />
          <span className="shrink-0 tabular-nums">{formatDuration(voiceNote.duration)}</span>

          <button
            type="button"
            onClick={removeVoiceNote}
            className="shrink-0 rounded-full p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
            aria-label="Remove voice note"
          >
            <X className="h-4 w-4" />
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
          isLoading={isSending}
          isDisabled={!message.trim() && !file && !voiceNote}
          className="h-10 w-10"
        >
          {!isSending && <Send size={14} />}
        </Button>
      </div>
    </form>
  );
};

export default MessageWrite;
